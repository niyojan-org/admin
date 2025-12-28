import { useState, useEffect } from 'react';
import { announcementApi } from '../utils/api';

/**
 * Hook to fetch announcement history
 * @param {string} eventId - The event ID
 * @param {number} days - Number of days to look back
 * @returns {object} History data and loading state
 */
export const useAnnouncementHistory = (eventId, days = 7) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await announcementApi.getHistory(eventId, days);
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [eventId, days]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
};
