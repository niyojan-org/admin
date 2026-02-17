import api from '../api';

/**
 * Notification API functions
 */

export const notificationApi = {
  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of notifications to fetch
   * @param {number} params.offset - Offset for pagination
   * @param {string} params.type - Filter by notification type
   * @param {string} params.priority - Filter by priority
   * @param {boolean} params.isRead - Filter by read status
   */
  getNotifications: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.type) queryParams.append('type', params.type);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.isRead !== undefined) queryParams.append('isRead', params.isRead);

    const response = await api.get(`/notifications?${queryParams}`);
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} notificationId
   */
  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },

  /**
   * Archive notification
   * @param {string} notificationId
   */
  archiveNotification: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/archive`);
    return response.data;
  },

  /**
   * Get notification preferences
   */
  getPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  /**
   * Update notification preferences
   * @param {Object} preferences - Updated preferences
   */
  updatePreferences: async (preferences) => {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  },

  /**
   * Register push notification token
   * @param {Object} data - Push subscription data
   */
  registerPushToken: async (data) => {
    const response = await api.post('/notifications/push-tokens', data);
    return response.data;
  },

  /**
   * Deactivate push notification token
   * @param {string} tokenId
   */
  deactivatePushToken: async (tokenId) => {
    const response = await api.delete(`/notifications/push-tokens/${tokenId}`);
    return response.data;
  },

  /**
   * Delete all read notifications
   */
  deleteReadNotifications: async () => {
    const response = await api.delete('/notifications/read');
    return response.data;
  },

  /**
   * Clear all notifications (delete all)
   */
  clearAllNotifications: async () => {
    const response = await api.delete('/notifications/clear-all');
    return response.data;
  },
};

export default notificationApi;
