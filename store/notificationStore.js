import { create } from 'zustand';
import { toast } from 'sonner';
import api from '@/lib/api';

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  preferences: null,
  socket: null,
  isConnected: false,

  // Fetch notifications
  fetchNotifications: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const queryParams = new URLSearchParams({
        limit: params.limit || '50',
        ...(params.type && { type: params.type }),
        ...(params.priority && { priority: params.priority }),
        ...(params.isRead !== undefined && { isRead: params.isRead.toString() }),
      });

      const response = await api.get(`/notifications?${queryParams}`);
      const notifications = response.data.data.notifications || [];
      const unreadCount = notifications.filter((n) => !n.isRead).length;

      set({
        notifications,
        unreadCount,
        loading: false,
      });

      return notifications;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to fetch notifications';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
      return false;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      await api.post('/notifications/read-all');

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        })),
        unreadCount: 0,
      }));

      toast.success('All notifications marked as read');
      return true;
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
      return false;
    }
  },

  // Archive notification
  archiveNotification: async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/archive`);

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
      }));

      toast.success('Notification archived');
      return true;
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast.error('Failed to archive notification');
      return false;
    }
  },

  // Delete notification (local only)
  deleteNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    }));
  },

  // Get notification preferences
  getPreferences: async () => {
    try {
      const response = await api.get('/notifications/preferences');
      const preferences = response.data.data.preferences;

      set({ preferences });
      return preferences;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to fetch notification preferences');
      return null;
    }
  },

  // Update notification preferences
  updatePreferences: async (updates) => {
    try {
      const response = await api.put('/notifications/preferences', updates);
      const preferences = response.data.data.preferences;

      set({ preferences });
      toast.success('Preferences updated successfully');
      return preferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      return null;
    }
  },

  // Subscribe to push notifications
  subscribeToPush: async (subscription) => {
    try {
      await api.post('/notifications/push-tokens', {
        subscription: JSON.stringify(subscription),
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        },
      });

      toast.success('Push notifications enabled');
      return true;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast.error('Failed to enable push notifications');
      return false;
    }
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          await subscription.unsubscribe();
          // Optionally notify backend to remove token
        }
      }

      toast.success('Push notifications disabled');
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      toast.error('Failed to disable push notifications');
      return false;
    }
  },

  // Add new notification (from WebSocket)
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Set WebSocket instance
  setSocket: (socket) => {
    set({ socket, isConnected: socket?.connected || false });
  },

  // Set connection status
  setConnectionStatus: (isConnected) => {
    set({ isConnected });
  },

  // Delete all read notifications
  deleteReadNotifications: async () => {
    try {
      const response = await api.delete('/notifications/read');
      const deletedCount = response.data.data.deletedCount;

      // Remove read notifications from local state
      set((state) => ({
        notifications: state.notifications.filter((n) => !n.isRead),
      }));

      toast.success(`${deletedCount} read notifications deleted`);
      return true;
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      toast.error('Failed to delete read notifications');
      return false;
    }
  },

  // Clear all notifications
  clearAll: async () => {
    try {
      const response = await api.delete('/notifications/clear-all');
      const deletedCount = response.data.data.deletedCount;

      set({ notifications: [], unreadCount: 0 });
      toast.success(`${deletedCount} notifications deleted`);
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
      return false;
    }
  },
}));
