import api from '@/lib/api';

/**
 * Event Registration Management API Service
 * Based on the Event Registration API Documentation
 */

export const registrationApi = {
  /**
   * Toggle registration status (open/close)
   * @param {string} eventId - Event ID
   * @returns {Promise} API Response
   */
  toggleStatus: async (eventId) => {
    const response = await api.post(`/event/admin/registration/${eventId}/toggle`);
    return response.data;
  },

  /**
   * Set registration timeline
   * @param {string} eventId - Event ID
   * @param {Object} timeline - Timeline data
   * @param {string} timeline.registrationStart - Start date (ISO string)
   * @param {string} timeline.registrationEnd - End date (ISO string)
   * @returns {Promise} API Response
   */
  setTimeline: async (eventId, timeline) => {
    const response = await api.put(`/event/admin/registration/${eventId}/timeline`, timeline);
    return response.data;
  },

  /**
   * Get registration status and statistics
   * @param {string} eventId - Event ID
   * @returns {Promise} API Response
   */
  getStatus: async (eventId) => {
    const response = await api.get(`/event/admin/registration/${eventId}/status`);
    return response.data;
  },

  /**
   * Update registration settings
   * @param {string} eventId - Event ID
   * @param {Object} settings - Registration settings
   * @returns {Promise} API Response
   */
  updateSettings: async (eventId, settings) => {
    const response = await api.put(`/event/admin/registration/${eventId}/settings`, settings);
    return response.data;
  },

  /**
   * Extend registration deadline
   * @param {string} eventId - Event ID
   * @param {Object} extension - Extension data
   * @param {string} extension.newEndDate - New end date (ISO string)
   * @param {string} extension.reason - Reason for extension
   * @returns {Promise} API Response
   */
  extendDeadline: async (eventId, extension) => {
    const response = await api.post(`/event/admin/registration/${eventId}/extend`, extension);
    return response.data;
  },

  /**
   * Get registration history
   * @param {string} eventId - Event ID
   * @returns {Promise} API Response
   */
  getHistory: async (eventId) => {
    const response = await api.get(`/event/admin/registration/${eventId}/history`);
    return response.data;
  },

  /**
   * Validate registration requirements
   * @param {string} eventId - Event ID
   * @returns {Promise} API Response
   */
  validateRequirements: async (eventId) => {
    const response = await api.get(`/event/admin/registration/${eventId}/validate`);
    return response.data;
  }
};

export default registrationApi;
