import api from '@/lib/api';

const BASE_PATH = '/events/admin/announcement';

/**
 * Announcement API utility functions
 */
export const announcementApi = {
    /**
     * Check spam limits and rate limiting status
     */
    async getLimits(eventId) {
        try {
            const response = await api.get(`${BASE_PATH}/${eventId}/limits`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch limits');
        }
    },

    /**
     * Get announcement history
     */
    async getHistory(eventId, days = 7) {
        try {
            const response = await api.get(`${BASE_PATH}/${eventId}/history`, {
                params: { days },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch history');
        }
    },

    /**
     * Create new announcement
     */
    async create(eventId, data) {
        try {
            const response = await api.post(`${BASE_PATH}/${eventId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to create announcement');
        }
    },

    /**
     * Get all announcements with pagination and filters
     */
    async getAll(eventId, params = {}) {
        try {
            const response = await api.get(`${BASE_PATH}/${eventId}`, { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch announcements');
        }
    },

    /**
     * Get single announcement details
     */
    async getOne(eventId, announcementId) {
        try {
            const response = await api.get(`${BASE_PATH}/${eventId}/${announcementId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch announcement');
        }
    },

    /**
     * Cancel announcement
     */
    async cancel(eventId, announcementId) {
        try {
            const response = await api.delete(`${BASE_PATH}/${eventId}/${announcementId}/cancel`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to cancel announcement');
        }
    },

    /**
     * Get announcement statistics
     */
    async getStats(eventId) {
        try {
            const response = await api.get(`${BASE_PATH}/${eventId}/stats`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch stats');
        }
    },

    /**
     * Get announcement dashboard
     */
    async getDashboard(eventId, timeRange = 7) {
        try {
            const response = await api.get(`${BASE_PATH}/${eventId}/dashboard`, {
                params: { timeRange },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch dashboard');
        }
    },

    /**
     * Get performance metrics
     */
    async getMetrics(eventId) {
        try {
            const response = await api.get(`${BASE_PATH}/${eventId}/metrics`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch metrics');
        }
    },
};
