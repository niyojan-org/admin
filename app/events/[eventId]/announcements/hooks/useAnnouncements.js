import { useState, useEffect, useCallback } from 'react';
import { announcementApi } from '../utils/api';

/**
 * Hook to manage announcements list with pagination and filters
 * @param {string} eventId - The event ID
 * @returns {object} Announcements data and CRUD functions
 */
export const useAnnouncements = (eventId) => {
  const [announcements, setAnnouncements] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await announcementApi.getAll(eventId, {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setAnnouncements(data.announcements);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch announcements');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const createAnnouncement = async (data) => {
    try {
      const result = await announcementApi.create(eventId, data);
      await fetchAnnouncements(); // Refresh list
      return result;
    } catch (err) {
      throw err;
    }
  };

  const cancelAnnouncement = async (announcementId) => {
    try {
      const result = await announcementApi.cancel(eventId, announcementId);
      await fetchAnnouncements(); // Refresh list
      return result;
    } catch (err) {
      throw err;
    }
  };

  const changePage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const changeFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  return {
    announcements,
    pagination,
    filters,
    loading,
    error,
    refetch: fetchAnnouncements,
    createAnnouncement,
    cancelAnnouncement,
    changePage,
    changeFilters,
  };
};
