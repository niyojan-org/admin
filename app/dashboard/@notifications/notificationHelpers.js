/**
 * Generate dummy notification data for demonstration
 * Replace this with actual API call
 */
export const generateDummyNotifications = () => {
    const notifications = [
        {
            id: 1,
            type: 'registration',
            title: 'New Registration',
            message: 'John Doe registered for Tech Conference 2025. Payment completed successfully.',
            time: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
            isRead: false,
            priority: 'normal'
        },
        {
            id: 2,
            type: 'event',
            title: 'Event Starting Soon',
            message: 'Your event "Annual Tech Summit" starts in 2 hours. Make sure all preparations are complete.',
            time: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
            isRead: false,
            priority: 'high'
        },
        {
            id: 3,
            type: 'revenue',
            title: 'Revenue Milestone',
            message: 'Congratulations! You have reached ₹50,000 in revenue this month.',
            time: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
            isRead: false,
            priority: 'normal'
        },
        {
            id: 4,
            type: 'success',
            title: 'Event Published',
            message: 'Your event "Workshop on AI" has been successfully published and is now live.',
            time: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
            isRead: true,
            priority: 'normal'
        },
        {
            id: 5,
            type: 'alert',
            title: 'Low Ticket Availability',
            message: 'Only 5 tickets remaining for "Music Festival 2025". Consider adding more tickets.',
            time: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
            isRead: true,
            priority: 'high'
        },
        {
            id: 6,
            type: 'info',
            title: 'Platform Update',
            message: 'New features added: Custom registration forms and QR code check-in.',
            time: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
            isRead: true,
            priority: 'normal'
        },
        {
            id: 7,
            type: 'registration',
            title: 'Bulk Registration',
            message: '15 participants registered for Corporate Training program.',
            time: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), // 2 days ago
            isRead: true,
            priority: 'normal'
        }
    ]
    
    return notifications
}

/**
 * Format notification data from API response
 * @param {Array} apiData - Raw notification data from backend
 * @returns {Array} Formatted notifications
 */
export const formatNotifications = (apiData) => {
    return apiData.map(item => ({
        id: item.id,
        type: item.type || 'general',
        title: item.title,
        message: item.message,
        time: item.createdAt || item.timestamp,
        isRead: item.isRead || false,
        priority: item.priority || 'normal'
    }))
}

/**
 * Filter notifications based on read status
 * @param {Array} notifications - All notifications
 * @param {string} filter - Filter type: 'all', 'unread', 'read'
 * @returns {Array} Filtered notifications
 */
export const filterNotifications = (notifications, filter) => {
    if (filter === 'unread') {
        return notifications.filter(n => !n.isRead)
    }
    if (filter === 'read') {
        return notifications.filter(n => n.isRead)
    }
    return notifications
}
