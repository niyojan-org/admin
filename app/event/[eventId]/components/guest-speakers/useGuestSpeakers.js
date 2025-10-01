'use client'
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useGuestSpeakers(eventId) {
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingLoading, setAddingLoading] = useState(false);
    const [updatingLoading, setUpdatingLoading] = useState(false);
    const [deletingLoading, setDeletingLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all guest speakers
    const fetchSpeakers = useCallback(async () => {
        if (!eventId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/event/admin/guest/${eventId}`);
            setSpeakers(response.data.data.speakers || []);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch guest speakers';
            setError(errorMessage);
            console.error('Error fetching guest speakers:', error);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    // Add guest speaker
    const addSpeaker = async (speakerData) => {
        try {
            setAddingLoading(true);
            setError(null);

            // Client-side validation for duplicate names
            const existingSpeaker = speakers.find(s =>
                s.name.toLowerCase().trim() === speakerData.name.toLowerCase().trim()
            );
            if (existingSpeaker) {
                throw new Error('Speaker name already exists');
            }

            const response = await api.post(`/event/admin/guest/${eventId}`, speakerData);
            setSpeakers(prev => [...prev, response.data.data.speaker]);
            toast.success(response.data.message || 'Guest speaker added successfully');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add guest speaker';
            setError(errorMessage);
            toast.error(errorMessage, {
                description: error.response?.data?.error?.details
            });
            throw error;
        } finally {
            setAddingLoading(false);
        }
    };

    // Update guest speaker
    const updateSpeaker = async (speakerId, updates) => {
        try {
            setUpdatingLoading(true);
            setError(null);

            // Client-side validation for duplicate names when updating
            if (updates.name) {
                const existingSpeaker = speakers.find(s =>
                    s._id !== speakerId &&
                    s.name.toLowerCase().trim() === updates.name.toLowerCase().trim()
                );
                if (existingSpeaker) {
                    throw new Error('Speaker name already exists');
                }
            }

            const response = await api.put(`/event/admin/guest/${eventId}/${speakerId}`, updates);
            setSpeakers(prev =>
                prev.map(speaker =>
                    speaker._id === speakerId ? response.data.data.speaker : speaker
                )
            );
            toast.success(response.data.message || 'Guest speaker updated successfully');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update guest speaker';
            setError(errorMessage);
            toast.error(errorMessage, {
                description: error.response?.data?.error?.details
            });
            throw error;
        } finally {
            setUpdatingLoading(false);
        }
    };

    // Delete guest speaker
    const deleteSpeaker = async (speakerId) => {
        try {
            setDeletingLoading(true);
            setError(null);
            const response = await api.delete(`/event/admin/guest/${eventId}/${speakerId}`);
            setSpeakers(prev => prev.filter(speaker => speaker._id !== speakerId));
            toast.success(response.data.message || 'Guest speaker deleted successfully');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete guest speaker';
            setError(errorMessage);
            toast.error(errorMessage, {
                description: error.response?.data?.error?.details
            });
            throw error;
        } finally {
            setDeletingLoading(false);
        }
    };

    // Get single speaker by ID
    const getSpeaker = useCallback((speakerId) => {
        return speakers.find(speaker => speaker._id === speakerId);
    }, [speakers]);

    // Initialize speakers on mount
    useEffect(() => {
        fetchSpeakers();
    }, [fetchSpeakers]);

    return {
        speakers,
        loading,
        addingLoading,
        updatingLoading,
        deletingLoading,
        error,
        addSpeaker,
        updateSpeaker,
        deleteSpeaker,
        getSpeaker,
        refetch: fetchSpeakers
    };
}
