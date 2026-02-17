// Dummy notification data and types

export const NotificationType = {
    SYSTEM: 'system',
    EVENT: 'event',
    TICKET: 'ticket',
    ORGANIZATION: 'organization',
    PAYMENT: 'payment',
    SECURITY: 'security',
    SOCIAL: 'social',
};

export const NotificationPriority = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
};

export const NotificationCategory = {
    SYSTEM: 'system',
    EVENTS: 'events',
    PAYMENTS: 'payments',
    ALERTS: 'alerts',
    SOCIAL: 'social',
};

// Dummy notifications data
export const dummyNotifications = [
    {
        id: '1',
        type: NotificationType.EVENT,
        category: NotificationCategory.EVENTS,
        priority: NotificationPriority.HIGH,
        title: 'New Event Registration',
        message: 'You have successfully registered for "Tech Conference 2026"',
        actionText: 'View Event',
        actionUrl: '/events/tech-conference-2026',
        isRead: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        imageUrl: '/images/event-placeholder.jpg',
        metadata: {
            eventId: 'evt_123',
            eventName: 'Tech Conference 2026',
        },
    },
    {
        id: '2',
        type: NotificationType.PAYMENT,
        category: NotificationCategory.PAYMENTS,
        priority: NotificationPriority.URGENT,
        title: 'Payment Successful',
        message: 'Your payment of ₹2,500 has been processed successfully',
        actionText: 'View Receipt',
        actionUrl: '/profile/tickets',
        isRead: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        metadata: {
            amount: 2500,
            currency: 'INR',
            transactionId: 'txn_abc123',
        },
    },
    {
        id: '3',
        type: NotificationType.ORGANIZATION,
        category: NotificationCategory.ALERTS,
        priority: NotificationPriority.NORMAL,
        title: 'Organization Verified',
        message: 'Your organization "TechCorp" has been successfully verified',
        actionText: 'View Organization',
        actionUrl: '/organization/techcorp',
        isRead: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        imageUrl: '/images/verified-badge.png',
        metadata: {
            organizationId: 'org_456',
            organizationName: 'TechCorp',
        },
    },
    {
        id: '4',
        type: NotificationType.SECURITY,
        category: NotificationCategory.ALERTS,
        priority: NotificationPriority.HIGH,
        title: 'New Login Detected',
        message: 'A new login was detected from Chrome on Windows',
        actionText: 'Review Activity',
        actionUrl: '/profile/security',
        isRead: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        metadata: {
            device: 'Chrome on Windows',
            location: 'Mumbai, India',
            ipAddress: '192.168.1.1',
        },
    },
    {
        id: '5',
        type: NotificationType.TICKET,
        category: NotificationCategory.EVENTS,
        priority: NotificationPriority.NORMAL,
        title: 'Ticket QR Code Ready',
        message: 'Your QR code ticket is ready for download',
        actionText: 'Download Ticket',
        actionUrl: '/profile/tickets',
        isRead: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        metadata: {
            ticketId: 'tkt_789',
            eventName: 'Tech Conference 2026',
        },
    },
    {
        id: '6',
        type: NotificationType.SOCIAL,
        category: NotificationCategory.SOCIAL,
        priority: NotificationPriority.LOW,
        title: 'New Follower',
        message: 'John Doe started following your organization',
        actionText: 'View Profile',
        actionUrl: '/profile/john-doe',
        isRead: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        imageUrl: '/images/avatar-placeholder.jpg',
        metadata: {
            userId: 'usr_101',
            userName: 'John Doe',
        },
    },
    {
        id: '7',
        type: NotificationType.SYSTEM,
        category: NotificationCategory.SYSTEM,
        priority: NotificationPriority.NORMAL,
        title: 'System Maintenance Scheduled',
        message: 'Scheduled maintenance on Feb 20, 2026 from 2:00 AM to 4:00 AM IST',
        actionText: 'Learn More',
        actionUrl: '/announcements/maintenance',
        isRead: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        metadata: {
            maintenanceDate: '2026-02-20T02:00:00Z',
            duration: '2 hours',
        },
    },
    {
        id: '8',
        type: NotificationType.EVENT,
        category: NotificationCategory.EVENTS,
        priority: NotificationPriority.HIGH,
        title: 'Event Starting Soon',
        message: 'Your event "Tech Conference 2026" starts in 24 hours',
        actionText: 'View Details',
        actionUrl: '/events/tech-conference-2026',
        isRead: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
        metadata: {
            eventId: 'evt_123',
            eventName: 'Tech Conference 2026',
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        },
    },
];

// Default user preferences
export const defaultPreferences = {
    email: {
        enabled: true,
        categories: {
            [NotificationCategory.SYSTEM]: true,
            [NotificationCategory.EVENTS]: true,
            [NotificationCategory.PAYMENTS]: true,
            [NotificationCategory.ALERTS]: true,
            [NotificationCategory.SOCIAL]: false,
        },
    },
    push: {
        enabled: true,
        categories: {
            [NotificationCategory.SYSTEM]: true,
            [NotificationCategory.EVENTS]: true,
            [NotificationCategory.PAYMENTS]: true,
            [NotificationCategory.ALERTS]: true,
            [NotificationCategory.SOCIAL]: true,
        },
    },
    inApp: {
        enabled: true,
        categories: {
            [NotificationCategory.SYSTEM]: true,
            [NotificationCategory.EVENTS]: true,
            [NotificationCategory.PAYMENTS]: true,
            [NotificationCategory.ALERTS]: true,
            [NotificationCategory.SOCIAL]: true,
        },
    },
    quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
    },
    soundEnabled: true,
    desktopNotifications: true,
};

// Helper function to format time ago
export function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return date.toLocaleDateString();
}

// Get priority color
export function getPriorityColor(priority) {
    const colors = {
        [NotificationPriority.LOW]: 'muted',
        [NotificationPriority.NORMAL]: 'default',
        [NotificationPriority.HIGH]: 'secondary',
        [NotificationPriority.URGENT]: 'destructive',
    };
    return colors[priority] || 'default';
}
