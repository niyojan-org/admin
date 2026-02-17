'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';
import { initializeNotificationSocket, disconnectNotificationSocket } from '@/lib/socket';
import { getAccessToken } from '@/lib/api';

/**
 * Hook to initialize and manage WebSocket connection for notifications
 */
export const useNotificationSocket = () => {
  const { addNotification, setSocket, setConnectionStatus, fetchNotifications } = useNotificationStore();
  const { isAuthenticated, user } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Get token from in-memory storage (used for access token security)
    const token = getAccessToken();

    if (!token) {
      console.warn('No token found for WebSocket connection');
      return;
    }

    // Initialize socket connection
    const socket = initializeNotificationSocket(token, (notification) => {
      // Add notification to store
      addNotification(notification);
    });

    // Set socket in store
    setSocket(socket);
    setConnectionStatus(socket.connected);

    // Listen for connection status changes
    socket.on('connect', () => {
      setConnectionStatus(true);
      // Fetch latest notifications on reconnect
      fetchNotifications();
    });

    socket.on('disconnect', () => {
      setConnectionStatus(false);
    });

    // Cleanup on unmount or when user logs out
    return () => {
      disconnectNotificationSocket();
      setSocket(null);
      setConnectionStatus(false);
    };
  }, [isAuthenticated, user, addNotification, setSocket, setConnectionStatus, fetchNotifications]);
};

export default useNotificationSocket;
