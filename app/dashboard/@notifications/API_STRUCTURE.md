# Notifications API Documentation

## Endpoint
```
GET /api/notifications
```

## Query Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| organizationId | string | Yes | Organization ID | org_123456 |
| limit | number | No | Number of notifications to fetch (default: 50) | 20 |
| offset | number | No | Pagination offset (default: 0) | 20 |
| filter | string | No | Filter by read status: 'all', 'unread', 'read' | unread |
| type | string | No | Filter by type: 'event', 'registration', 'alert', etc. | registration |

## Request Example
```javascript
// Fetch all unread notifications
GET /api/notifications?organizationId=org_123456&filter=unread

// Fetch specific type with pagination
GET /api/notifications?organizationId=org_123456&type=registration&limit=20&offset=0
```

## Response Structure

### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "type": "registration",
      "title": "New Registration",
      "message": "John Doe registered for Tech Conference 2025. Payment completed successfully.",
      "createdAt": "2025-12-25T10:30:00Z",
      "isRead": false,
      "priority": "normal",
      "metadata": {
        "eventId": "evt_789",
        "eventName": "Tech Conference 2025",
        "userId": "user_456"
      }
    },
    {
      "id": "notif_124",
      "type": "event",
      "title": "Event Starting Soon",
      "message": "Your event 'Annual Tech Summit' starts in 2 hours.",
      "createdAt": "2025-12-25T09:00:00Z",
      "isRead": false,
      "priority": "high",
      "metadata": {
        "eventId": "evt_790",
        "eventName": "Annual Tech Summit",
        "startTime": "2025-12-25T12:00:00Z"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "unreadCount": 12
}
```

## Mark as Read Endpoint
```
PATCH /api/notifications/read
```

### Request Body
```json
{
  "notificationIds": ["notif_123", "notif_124"]
}
```

### Mark All as Read
```json
{
  "organizationId": "org_123456",
  "markAll": true
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Notifications marked as read",
  "updatedCount": 2
}
```

## Data Schema

### Notification Object
```typescript
interface Notification {
  id: string;                    // Unique notification ID
  type: NotificationType;        // Type of notification
  title: string;                 // Notification title
  message: string;               // Notification message/description
  createdAt: string;             // ISO timestamp
  isRead: boolean;               // Read status
  priority: 'normal' | 'high';   // Priority level
  metadata?: {                   // Additional context data
    eventId?: string;
    eventName?: string;
    userId?: string;
    amount?: number;
    [key: string]: any;
  }
}

type NotificationType = 
  | 'event'          // Event-related notifications
  | 'registration'   // New registrations
  | 'alert'          // Important alerts
  | 'success'        // Success messages
  | 'info'           // Informational updates
  | 'revenue'        // Revenue milestones
  | 'general';       // General notifications
```

### Pagination Object
```typescript
interface Pagination {
  total: number;        // Total number of notifications
  limit: number;        // Items per page
  offset: number;       // Current offset
  hasMore: boolean;     // Whether more items exist
}
```

## Frontend Implementation

### Fetch Notifications
```javascript
const fetchNotifications = async (organizationId, filter = 'all') => {
  try {
    const params = new URLSearchParams({
      organizationId,
      filter,
      limit: '50'
    })
    
    const response = await fetch(`/api/notifications?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      return {
        notifications: formatNotifications(result.data),
        unreadCount: result.unreadCount,
        hasMore: result.pagination.hasMore
      }
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}
```

### Mark Notifications as Read
```javascript
const markAsRead = async (notificationIds) => {
  try {
    const response = await fetch('/api/notifications/read', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notificationIds })
    })
    
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Failed to mark as read:', error)
  }
}

const markAllAsRead = async (organizationId) => {
  try {
    const response = await fetch('/api/notifications/read', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ organizationId, markAll: true })
    })
    
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}
```

## WebSocket for Real-time Updates (Optional)

```javascript
// Connect to WebSocket for real-time notifications
const ws = new WebSocket(`wss://api.example.com/notifications?orgId=${orgId}`)

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data)
  // Add notification to state
  setNotifications(prev => [notification, ...prev])
}
```

## Notification Types & Use Cases

| Type | When to Trigger | Priority |
|------|----------------|----------|
| registration | New participant registers | normal |
| event | Event status changes, reminders | normal/high |
| alert | Low tickets, payment issues | high |
| success | Event published, action completed | normal |
| info | Platform updates, tips | normal |
| revenue | Milestone reached | normal |
| general | Other notifications | normal |

## Example Backend Implementation (Node.js/Express)

```javascript
// Get notifications
router.get('/api/notifications', authenticate, async (req, res) => {
  try {
    const { organizationId, limit = 50, offset = 0, filter, type } = req.query
    
    // Verify access
    if (!hasAccess(req.user, organizationId)) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Access denied' }
      })
    }
    
    // Build query
    let query = { organizationId }
    if (filter === 'unread') query.isRead = false
    if (filter === 'read') query.isRead = true
    if (type) query.type = type
    
    // Fetch notifications
    const [notifications, total, unreadCount] = await Promise.all([
      db.notifications.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset)),
      db.notifications.countDocuments(query),
      db.notifications.countDocuments({ organizationId, isRead: false })
    ])
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > (parseInt(offset) + parseInt(limit))
      },
      unreadCount
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    })
  }
})

// Mark as read
router.patch('/api/notifications/read', authenticate, async (req, res) => {
  try {
    const { notificationIds, organizationId, markAll } = req.body
    
    let updateQuery
    if (markAll) {
      updateQuery = { organizationId, isRead: false }
    } else {
      updateQuery = { _id: { $in: notificationIds } }
    }
    
    const result = await db.notifications.updateMany(
      updateQuery,
      { $set: { isRead: true, readAt: new Date() } }
    )
    
    res.json({
      success: true,
      message: 'Notifications marked as read',
      updatedCount: result.modifiedCount
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    })
  }
})

// Create notification (internal use)
async function createNotification(data) {
  const notification = await db.notifications.create({
    organizationId: data.organizationId,
    type: data.type,
    title: data.title,
    message: data.message,
    priority: data.priority || 'normal',
    isRead: false,
    metadata: data.metadata || {},
    createdAt: new Date()
  })
  
  // Optionally send via WebSocket
  if (wsConnections[data.organizationId]) {
    wsConnections[data.organizationId].send(JSON.stringify(notification))
  }
  
  return notification
}
```

## Testing

### Sample cURL Requests
```bash
# Get all notifications
curl -X GET "http://localhost:3000/api/notifications?organizationId=org_123" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark as read
curl -X PATCH "http://localhost:3000/api/notifications/read" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notificationIds": ["notif_123", "notif_124"]}'

# Mark all as read
curl -X PATCH "http://localhost:3000/api/notifications/read" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"organizationId": "org_123", "markAll": true}'
```
