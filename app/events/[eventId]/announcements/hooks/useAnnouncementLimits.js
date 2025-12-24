import { useState, useEffect, useCallback } from 'react';
import { announcementApi } from '../utils/api';

/**
 * Hook to fetch and manage announcement rate limits
 * @param {string} eventId - The event ID
 * @param {boolean} autoRefresh - Whether to auto-refresh limits
 * @returns {object} Limits data and loading state
 */
export const useAnnouncementLimits = (eventId, autoRefresh = false) => {
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLimits = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await announcementApi.getLimits(eventId);
      setLimits(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch limits');
      console.error('Error fetching limits:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchLimits();
  }, [fetchLimits]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLimits();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchLimits]);

  return {
    limits,
    loading,
    error,
    refetch: fetchLimits,
    canSend: limits?.canSend || false,
  };
};
