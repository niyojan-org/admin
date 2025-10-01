'use client'
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useBenefitsData = (eventId) => {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all benefits
    const fetchBenefits = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/event/admin/benefits/${eventId}`);
            
            if (response.data.success) {
                setBenefits(response.data.benefits || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch benefits');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch benefits';
            const errorDetails = error.response?.data?.error?.details;
            
            setError(errorMessage);
            console.error('Error fetching benefits:', error);
            
            if (errorDetails) {
                toast.error(errorDetails);
            }
        } finally {
            setLoading(false);
        }
    };

    // Add new benefit
    const addBenefit = async (benefitData) => {
        try {
            const response = await api.post(`/event/admin/benefits/${eventId}`, benefitData);
            
            if (response.data.success) {
                setBenefits(prev => [...prev, response.data.addedBenefit]);
                toast.success('Benefit added successfully!');
                return response.data.addedBenefit;
            } else {
                throw new Error(response.data.message || 'Failed to add benefit');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add benefit';
            const errorDetails = error.response?.data?.error?.details;
            
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            throw error;
        }
    };

    // Update benefit
    const updateBenefit = async (benefitId, updateData) => {
        try {
            const response = await api.put(`/event/admin/benefits/${eventId}/${benefitId}`, updateData);
            
            if (response.data.success) {
                setBenefits(prev => prev.map(benefit => 
                    benefit._id === benefitId ? response.data.updatedBenefit : benefit
                ));
                toast.success('Benefit updated successfully!');
                return response.data.updatedBenefit;
            } else {
                throw new Error(response.data.message || 'Failed to update benefit');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update benefit';
            const errorDetails = error.response?.data?.error?.details;
            
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            throw error;
        }
    };

    // Delete benefit
    const deleteBenefit = async (benefitId) => {
        try {
            const response = await api.delete(`/event/admin/benefits/${eventId}/${benefitId}`);
            
            if (response.data.success) {
                setBenefits(prev => prev.filter(benefit => benefit._id !== benefitId));
                toast.success('Benefit deleted successfully!');
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete benefit');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete benefit';
            const errorDetails = error.response?.data?.error?.details;
            
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            throw error;
        }
    };

    // Reorder benefits
    const reorderBenefits = async (benefitIds) => {
        try {
            const response = await api.put(`/event/admin/benefits/${eventId}/reorder`, {
                benefitIds
            });
            
            if (response.data.success) {
                setBenefits(response.data.benefits);
                toast.success('Benefits reordered successfully!');
                return response.data.benefits;
            } else {
                throw new Error(response.data.message || 'Failed to reorder benefits');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reorder benefits';
            const errorDetails = error.response?.data?.error?.details;
            
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            throw error;
        }
    };

    // Load benefits on mount
    useEffect(() => {
        if (eventId) {
            fetchBenefits();
        }
    }, [eventId]);

    return {
        benefits,
        loading,
        error,
        addBenefit,
        updateBenefit,
        deleteBenefit,
        reorderBenefits,
        refetch: fetchBenefits
    };
};