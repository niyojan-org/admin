import { useState, useEffect } from 'react';
import { announcementApi } from '../utils/api';

/**
 * Hook to fetch comprehensive announcement dashboard data
 * @param {string} eventId - The event ID
 * @param {number} timeRange - Days for trend analysis
 * @returns {object} Dashboard data and loading state
 */
export const useAnnouncementDashboard = (eventId, timeRange = 7) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await announcementApi.getDashboard(eventId, timeRange);
      setDashboard(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [eventId, timeRange]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
};
