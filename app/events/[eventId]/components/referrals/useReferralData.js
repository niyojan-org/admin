'use client'
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function useReferralData(eventId) {
    // State management
    const [referrals, setReferrals] = useState([]);
    const [systemEnabled, setSystemEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleLoading, setToggleLoading] = useState(new Set());
    const [systemToggleLoading, setSystemToggleLoading] = useState(false);

    // Get user from store
    const { user } = useUserStore();
    const userRole = user?.organization.role || 'volunteer';

    // Debounced toggle function
    const debouncedToggle = useCallback(
        debounce(async (referralId, newStatus) => {
            try {
                await api.patch(`/events/admin/referral/${eventId}/${referralId}/toggle`);
                setReferrals(prev => prev.map(r =>
                    r._id === referralId ? { ...r, isActive: newStatus } : r
                ));
                toast.success(`Referral ${newStatus ? 'activated' : 'deactivated'} successfully`);
            } catch (error) {
                console.error('Error toggling referral:', error);
                toast.error('Failed to update referral status');
                // Revert the toggle
                setReferrals(prev => prev.map(r =>
                    r._id === referralId ? { ...r, isActive: !newStatus } : r
                ));
            } finally {
                setToggleLoading(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(referralId);
                    return newSet;
                });
            }
        }, 300),
        [eventId, setReferrals, setToggleLoading]
    );

    // Fetch referrals
    const fetchReferrals = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/events/admin/referral/${eventId}`);

            const referralsData = response.data?.referrals || [];
            const processedReferrals = referralsData.map(referral => ({
                ...referral,
                isOwnReferral: userRole === 'volunteer' &&
                    (referral.whose?._id === user?._id || referral.whose === user?._id)
            }));

            setReferrals(Array.isArray(processedReferrals) ? processedReferrals : []);
        } catch (error) {
            console.error('Error fetching referrals:', error);
            
            // Handle "no referrals found" as a normal case, not an error
            if (error.response?.data?.error?.code === 'REFERRALS_NOT_FOUND') {
                setReferrals([]);
                setError(null);
            } else if (error.response?.data?.error?.code === 'ACCESS_DENIED') {
                // For access denied, still set empty referrals but don't show error toast
                setReferrals([]);
                setError(null);
            } else {
                setError(error.response?.data?.message || 'Failed to fetch referrals');

                // Don't show toast for access denied or referrals not found
                if (!['ACCESS_DENIED', 'REFERRALS_NOT_FOUND'].includes(error.response?.data?.error?.code)) {
                    toast.error('Failed to fetch referrals');
                }
            }
        } finally {
            setLoading(false);
        }
    }, [eventId, userRole, user]);

    // Fetch system status
    const fetchSystemStatus = useCallback(async () => {
        try {
            const response = await api.get(`/events/admin/referral/${eventId}/status`);
            setSystemEnabled(response.data.allowReferrals || false);
        } catch (error) {
            console.error('Error fetching system status:', error);
            
            // Handle specific error cases
            if (error.response?.data?.error?.code === 'EVENT_NOT_FOUND') {
                setError('Event not found');
                toast.error('Event not found');
            } else {
                // For other errors, just set system as disabled but don't show error
                setSystemEnabled(false);
            }
        }
    }, [eventId]);

    // Toggle referral status
    const handleToggleReferral = async (referral) => {
        const newStatus = !referral.isActive;

        // Optimistic update
        setReferrals(prev => prev.map(r =>
            r._id === referral._id ? { ...r, isActive: newStatus } : r
        ));

        // Add to loading set
        setToggleLoading(prev => new Set(prev).add(referral._id));

        // Call debounced function
        debouncedToggle(referral._id, newStatus);
    };

    // Toggle system status
    const handleToggleSystem = async () => {
        try {
            setSystemToggleLoading(true);
            const response = await api.patch(`/events/admin/referral/${eventId}/status`);
            setSystemEnabled(response.data.allowReferrals);
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error toggling system:', error);
            toast.error(error.response?.data?.message || 'Failed to toggle referral system');
        } finally {
            setSystemToggleLoading(false);
        }
    };

    // Create referral
    const handleCreateReferral = async (formData) => {
        const response = await api.post(`/events/admin/referral/${eventId}`, formData);
        setReferrals(prev => [response.data.referral, ...prev]);
        toast.success('Referral created successfully');
        return response.data.referral;
    };

    // Update referral
    const handleUpdateReferral = async (referralId, formData) => {
        const response = await api.put(`/events/admin/referral/${eventId}/${referralId}`, formData);
        setReferrals(prev => prev.map(r =>
            r._id === referralId ? response.data.referral : r
        ));
        toast.success('Referral updated successfully');
        return response.data.referral;
    };

    // Delete referral
    const handleDeleteReferral = async (referral) => {
        const response = await api.delete(`/events/admin/referral/${eventId}/${referral._id}`);

        if (response.data.action === 'deleted') {
            setReferrals(prev => prev.filter(r => r._id !== referral._id));
        } else if (response.data.action === 'disabled') {
            setReferrals(prev => prev.map(r =>
                r._id === referral._id ? { ...r, isActive: false } : r
            ));
        }
        toast.success(response.data.message);
        return response.data;
    };

    // Filter referrals for volunteers
    const getFilteredReferrals = () => {
        return userRole === 'volunteer'
            ? referrals.filter(r => r.isOwnReferral)
            : referrals;
    };

    // Calculate stats
    const getStats = () => {
        const filteredReferrals = getFilteredReferrals();
        return {
            total: filteredReferrals.length,
            active: filteredReferrals.filter(r => r.isActive).length,
            totalUsage: filteredReferrals.reduce((sum, r) => sum + (r.usageCount || 0), 0),
            expired: filteredReferrals.filter(r =>
                r.expiresAt && new Date(r.expiresAt) < new Date()
            ).length
        };
    };

    // Initialize data
    useEffect(() => {
        if (eventId) {
            Promise.all([
                fetchReferrals(),
                fetchSystemStatus()
            ]);
        }
    }, [eventId, fetchReferrals, fetchSystemStatus]);

    return {
        referrals: getFilteredReferrals(),
        systemEnabled,
        loading,
        error,
        toggleLoading,
        systemToggleLoading,
        userRole,
        stats: getStats(),
        handleToggleReferral,
        handleToggleSystem,
        handleCreateReferral,
        handleUpdateReferral,
        handleDeleteReferral,
        fetchReferrals,
        refetch: () => Promise.all([fetchReferrals(), fetchSystemStatus()])
    };
}
