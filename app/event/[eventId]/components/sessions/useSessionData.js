'use client'
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useSessionData(eventId) {
    const [sessions, setSessions] = useState([]);
    const [allowMultipleSessions, setAllowMultipleSessions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch multiple sessions status
    const fetchMultipleSessionsStatus = useCallback(async () => {
        if (!eventId) return;

        try {
            setError(null);
            const response = await api.get(`/event/admin/session/${eventId}/multiple-sessions-status`);
            setAllowMultipleSessions(response.data.allowMultipleSessions || false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch multiple sessions status';
            setError(errorMessage);
            console.error('Error fetching multiple sessions status:', error);
        }
    }, [eventId]);

    // Fetch all sessions
    const fetchSessions = useCallback(async () => {
        if (!eventId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/event/admin/session/${eventId}`);
            setSessions(response.data.sessions || []);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch sessions';
            setError(errorMessage);
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    // Add session
    const addSession = async (sessionData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post(`/event/admin/session/${eventId}`, sessionData);
            console.log(response.data.sessions);
            setSessions(response.data.sessions || []);
            toast.success(response.data.message || 'Session added successfully');
            return response.data.session;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add session';
            setError(errorMessage);
            toast.error(errorMessage, {
                description: error.response?.data?.error?.details
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update session
    const updateSession = async (sessionId, updates) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put(`/event/admin/session/${eventId}/${sessionId}`, updates);
            setSessions(prev =>
                prev.map(session =>
                    session._id === sessionId ? response.data.session : session
                )
            );
            toast.success(response.data.message || 'Session updated successfully');
            return response.data.session;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update session';
            setError(errorMessage);
            toast.error(errorMessage, {
                description: error.response?.data?.error?.details
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Delete session
    const deleteSession = async (sessionId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.delete(`/event/admin/session/${eventId}/${sessionId}`);
            setSessions(prev => prev.filter(session => session._id !== sessionId));
            toast.success(response.data.message || 'Session deleted successfully');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete session';
            setError(errorMessage);
            toast.error(errorMessage, {
                description: error.response?.data?.error?.details
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Toggle multiple sessions
    const toggleMultipleSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put(`/event/admin/session/${eventId}/toggle-multiple-sessions`);
            const newStatus = response.data.allowMultipleSessions;
            setAllowMultipleSessions(newStatus);
            toast.success(response.data.message);
            return newStatus;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to toggle multiple sessions';
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Initialize sessions and status on mount
    useEffect(() => {
        fetchSessions();
        fetchMultipleSessionsStatus();
    }, [fetchSessions, fetchMultipleSessionsStatus]);

    return {
        sessions,
        allowMultipleSessions,
        loading,
        error,
        addSession,
        updateSession,
        deleteSession,
        toggleMultipleSessions,
        refetch: fetchSessions
    };
}
