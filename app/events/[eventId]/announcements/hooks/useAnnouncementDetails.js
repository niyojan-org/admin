import { useState, useEffect } from 'react';
import { announcementApi } from '../utils/api';

/**
 * Hook to fetch single announcement details with polling
 * @param {string} eventId - The event ID
 * @param {string} announcementId - The announcement ID
 * @param {boolean} enablePolling - Whether to poll for updates
 * @returns {object} Announcement details and loading state
 */
export const useAnnouncementDetails = (eventId, announcementId, enablePolling = false) => {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    if (!eventId || !announcementId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await announcementApi.getOne(eventId, announcementId);
      setAnnouncement(data.announcement);
    } catch (err) {
      setError(err.message || 'Failed to fetch announcement details');
      console.error('Error fetching announcement details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have both eventId and announcementId
    if (eventId && announcementId) {
      fetchDetails();
    } else {
      setLoading(false);
      setAnnouncement(null);
    }
  }, [eventId, announcementId]);

  // Poll for updates if announcement is processing
  useEffect(() => {
    if (!enablePolling || !announcement) return;
    
    const isProcessing = ['pending', 'processing'].includes(announcement.status);
    if (!isProcessing) return;

    const interval = setInterval(() => {
      fetchDetails();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [announcement?.status, enablePolling]);

  return {
    announcement,
    loading,
    error,
    refetch: fetchDetails,
  };
};
