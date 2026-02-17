/**
 * Example: How to trigger notifications from your app
 * 
 * This file shows common patterns for creating notifications
 * when various events happen in your application.
 */

// Example 1: After successful event registration
export function handleEventRegistration(eventData, userData) {
  const notification = {
    id: generateId(),
    type: 'event',
    category: 'events',
    priority: 'high',
    title: 'Registration Successful!',
    message: `You're registered for "${eventData.name}"`,
    actionText: 'View Event',
    actionUrl: `/events/${eventData.slug}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    metadata: {
      eventId: eventData.id,
      eventName: eventData.name,
      userId: userData.id,
    },
  };

  // When backend is ready:
  // await createNotification(notification);
  
  // For now, you can emit an event or update local state
  console.log('New notification:', notification);
}

// Example 2: Payment confirmation
export function handlePaymentSuccess(paymentData) {
  const notification = {
    id: generateId(),
    type: 'payment',
    category: 'payments',
    priority: 'urgent',
    title: 'Payment Successful',
    message: `Your payment of ₹${paymentData.amount} has been processed`,
    actionText: 'View Receipt',
    actionUrl: '/profile/tickets',
    isRead: false,
    createdAt: new Date().toISOString(),
    metadata: {
      amount: paymentData.amount,
      currency: 'INR',
      transactionId: paymentData.transactionId,
    },
  };

  // Trigger notification
  console.log('Payment notification:', notification);
}

// Example 3: Organization verification
export function handleOrganizationVerified(orgData) {
  const notification = {
    id: generateId(),
    type: 'organization',
    category: 'alerts',
    priority: 'high',
    title: 'Organization Verified! 🎉',
    message: `Your organization "${orgData.name}" has been verified`,
    actionText: 'View Organization',
    actionUrl: `/organization/${orgData.slug}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    imageUrl: orgData.logo,
    metadata: {
      organizationId: orgData.id,
      organizationName: orgData.name,
    },
  };

  console.log('Organization verified notification:', notification);
}

// Example 4: Security alert
export function handleNewLogin(loginData) {
  const notification = {
    id: generateId(),
    type: 'security',
    category: 'alerts',
    priority: 'high',
    title: 'New Login Detected',
    message: `Login from ${loginData.device} in ${loginData.location}`,
    actionText: 'Review Activity',
    actionUrl: '/profile/security',
    isRead: false,
    createdAt: new Date().toISOString(),
    metadata: {
      device: loginData.device,
      location: loginData.location,
      ipAddress: loginData.ip,
    },
  };

  console.log('Security notification:', notification);
}

// Example 5: Event reminder (24 hours before)
export function handleEventReminder(eventData) {
  const notification = {
    id: generateId(),
    type: 'event',
    category: 'events',
    priority: 'high',
    title: 'Event Starting Soon!',
    message: `"${eventData.name}" starts in 24 hours`,
    actionText: 'View Details',
    actionUrl: `/events/${eventData.slug}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    imageUrl: eventData.banner,
    metadata: {
      eventId: eventData.id,
      eventName: eventData.name,
      startTime: eventData.startTime,
    },
  };

  console.log('Event reminder:', notification);
}

// Example 6: Ticket QR code ready
export function handleTicketReady(ticketData) {
  const notification = {
    id: generateId(),
    type: 'ticket',
    category: 'events',
    priority: 'normal',
    title: 'Your Ticket is Ready!',
    message: 'Download your QR code ticket now',
    actionText: 'Download Ticket',
    actionUrl: `/profile/tickets/${ticketData.id}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    metadata: {
      ticketId: ticketData.id,
      eventName: ticketData.eventName,
    },
  };

  console.log('Ticket ready notification:', notification);
}

// Example 7: System maintenance announcement
export function handleSystemMaintenance(maintenanceData) {
  const notification = {
    id: generateId(),
    type: 'system',
    category: 'system',
    priority: 'normal',
    title: 'Scheduled Maintenance',
    message: `System maintenance on ${maintenanceData.date}`,
    actionText: 'Learn More',
    actionUrl: '/announcements/maintenance',
    isRead: false,
    createdAt: new Date().toISOString(),
    metadata: {
      maintenanceDate: maintenanceData.date,
      duration: maintenanceData.duration,
    },
  };

  console.log('Maintenance notification:', notification);
}

// Example 8: Social interaction (new follower)
export function handleNewFollower(followerData) {
  const notification = {
    id: generateId(),
    type: 'social',
    category: 'social',
    priority: 'low',
    title: 'New Follower',
    message: `${followerData.name} started following you`,
    actionText: 'View Profile',
    actionUrl: `/profile/${followerData.username}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    imageUrl: followerData.avatar,
    metadata: {
      userId: followerData.id,
      userName: followerData.name,
    },
  };

  console.log('New follower notification:', notification);
}

// Helper function to generate unique IDs
function generateId() {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Example: Show desktop notification (if enabled)
export function showDesktopNotification(notification, preferences) {
  // Check if desktop notifications are enabled
  if (!preferences.desktopNotifications) return;

  // Check browser permission
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: notification.id,
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icons/icon-192x192.png',
          });
        }
      });
    }
  }
}

// Example: Play notification sound (if enabled)
export function playNotificationSound(preferences) {
  if (!preferences.soundEnabled) return;

  const audio = new Audio('/sounds/notification.mp3');
  audio.volume = 0.5;
  audio.play().catch((err) => {
    console.log('Could not play notification sound:', err);
  });
}

// Example: Check quiet hours
export function isQuietHours(preferences) {
  if (!preferences.quietHours.enabled) return false;

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const start = preferences.quietHours.startTime;
  const end = preferences.quietHours.endTime;

  // Handle overnight quiet hours (e.g., 22:00 to 08:00)
  if (start > end) {
    return currentTime >= start || currentTime <= end;
  }

  return currentTime >= start && currentTime <= end;
}

// Example: Complete notification creation with all checks
export async function createNotificationSafely(
  notificationData,
  userPreferences
) {
  // Check quiet hours
  if (isQuietHours(userPreferences)) {
    console.log('Quiet hours active, notification queued');
    // Queue for later or save without sound/desktop alert
  }

  // Check if category is enabled for in-app
  if (
    userPreferences.inApp.enabled &&
    userPreferences.inApp.categories[notificationData.category]
  ) {
    // Show in-app notification
    console.log('Showing in-app notification');
  }

  // Check if desktop notification should be shown
  if (
    userPreferences.desktopNotifications &&
    !isQuietHours(userPreferences)
  ) {
    showDesktopNotification(notificationData, userPreferences);
  }

  // Check if sound should play
  if (!isQuietHours(userPreferences)) {
    playNotificationSound(userPreferences);
  }

  // Save to backend
  // await saveNotificationToBackend(notificationData);

  return notificationData;
}

// Example: Batch create notifications (e.g., for bulk operations)
export async function createBulkNotifications(notifications) {
  // When backend is ready:
  // await fetch('/api/notifications/bulk', {
  //   method: 'POST',
  //   body: JSON.stringify({ notifications }),
  // });

  console.log('Creating bulk notifications:', notifications.length);
  return notifications;
}

// Example: How to use in your components
/*

// In your event registration component:
import { handleEventRegistration } from '@/components/notifications/notificationExamples';

async function registerForEvent() {
  // ... your registration logic
  
  // Trigger notification
  handleEventRegistration(eventData, userData);
  
  // Show toast
  toast.success('Successfully registered!');
}

// In your payment success handler:
import { handlePaymentSuccess } from '@/components/notifications/notificationExamples';

async function onPaymentComplete(paymentData) {
  // ... your payment logic
  
  handlePaymentSuccess(paymentData);
  
  toast.success('Payment successful!');
}

*/
