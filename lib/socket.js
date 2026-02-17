import { io } from 'socket.io-client';
import { toast } from 'sonner';

let socket = null;

/**
 * Initialize WebSocket connection for real-time notifications
 * @param {string} token - JWT access token
 * @param {Function} onNotification - Callback when notification is received
 * @returns {Socket} Socket.IO instance
 */
export const initializeNotificationSocket = (token, onNotification) => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ WebSocket connected for notifications');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
    if (error.message.includes('Authentication')) {
      toast.error('Notification connection failed. Please login again.');
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('WebSocket disconnected:', reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('WebSocket reconnected after', attemptNumber, 'attempts');
  });

  // Notification events
  socket.on('notification', (notification) => {
    console.log('📬 New notification received:', notification);
    
    if (onNotification) {
      onNotification(notification);
    }

    // Show toast notification
    if (notification && !notification.isRead) {
      toast.info(notification.title, {
        description: notification.message,
        action: notification.actionUrl
          ? {
              label: notification.actionText || 'View',
              onClick: () => {
                if (typeof window !== 'undefined' && notification.actionUrl) {
                  window.location.href = notification.actionUrl;
                }
              },
            }
          : undefined,
      });
    }
  });

  socket.on('notification:read', ({ notificationId }) => {
    console.log('Notification marked as read:', notificationId);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

/**
 * Disconnect WebSocket
 */
export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('WebSocket disconnected');
  }
};

/**
 * Get current socket instance
 */
export const getNotificationSocket = () => socket;

/**
 * Check if socket is connected
 */
export const isSocketConnected = () => socket?.connected || false;

/**
 * Emit an event to mark notification as read
 * @param {string} notificationId
 */
export const emitMarkAsRead = (notificationId) => {
  if (socket?.connected) {
    socket.emit('notification:mark-read', { notificationId });
  }
};
