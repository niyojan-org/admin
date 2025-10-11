# Announcement System - Complete API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting & Spam Prevention](#rate-limiting--spam-prevention)
4. [Core CRUD Operations](#core-crud-operations)
5. [Dashboard & Analytics](#dashboard--analytics)
6. [Error Handling](#error-handling)
7. [Examples](#examples)

---

## Overview

The Announcement System allows event organizers to send messages to participants via WhatsApp, Email, or both channels. The system includes spam prevention, scheduling, analytics, and comprehensive monitoring.

**Base URL:** `/event/admin/announcement`

**Features:**
- ✅ Multi-channel delivery (WhatsApp, Email, Both)
- ✅ Scheduled and immediate sending
- ✅ Spam prevention (30-min gap, 5/day limit)
- ✅ Personalized messages with placeholders
- ✅ Comprehensive analytics and dashboards
- ✅ Real-time delivery tracking
- ✅ Retry logic with skip support

---

## Authentication

All endpoints require organization authentication with `owner` or `admin` role.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Rate Limiting & Spam Prevention

### 1. Check Spam Limits

Check if an event can send announcements and view rate limit status.

**Endpoint:** `GET /event/admin/announcement/:eventId/limits`

**URL Parameters:**
- `eventId` (string, required) - Event ID

**Response Example:**
```json
{
  "success": true,
  "canSend": true,
  "limits": {
    "rateLimit": {
      "enabled": true,
      "minimumGapMinutes": 30,
      "lastAnnouncementAt": "2025-10-11T10:30:00.000Z",
      "lastAnnouncementTitle": "Welcome Message",
      "waitTimeMinutes": 0,
      "nextAvailableTime": null
    },
    "dailyLimit": {
      "enabled": true,
      "maxPerDay": 5,
      "usedToday": 2,
      "remainingToday": 3,
      "resetAt": "2025-10-12T00:00:00.000Z"
    }
  },
  "eventId": "670f1234567890abcdef1234",
  "eventName": "Tech Conference 2025"
}
```

**Response Fields:**
- `canSend` (boolean) - Whether announcement can be sent now
- `waitTimeMinutes` (number) - Minutes to wait before next send
- `remainingToday` (number) - Announcements remaining today
- `nextAvailableTime` (date) - When next announcement can be sent

**Use Cases:**
- Display before "Create Announcement" button
- Show countdown timer
- Prevent form submission if limited

---

### 2. Get Announcement History

View announcement history with daily breakdown for analysis.

**Endpoint:** `GET /event/admin/announcement/:eventId/history`

**URL Parameters:**
- `eventId` (string, required) - Event ID

**Query Parameters:**
- `days` (number, optional, default: 7) - Number of days to look back

**Response Example:**
```json
{
  "success": true,
  "period": {
    "days": 7,
    "from": "2025-10-04T12:00:00.000Z",
    "to": "2025-10-11T12:00:00.000Z"
  },
  "totalAnnouncements": 15,
  "dailyBreakdown": [
    {
      "date": "2025-10-11",
      "count": 3,
      "announcements": [
        {
          "id": "670f1234567890abcdef5678",
          "title": "Event Update",
          "status": "sent",
          "createdAt": "2025-10-11T10:30:00.000Z",
          "participantsTotal": 150,
          "participantsSent": 148
        }
      ]
    },
    {
      "date": "2025-10-10",
      "count": 5,
      "announcements": [...]
    }
  ]
}
```

**Use Cases:**
- Analyze sending patterns
- Identify spam behavior
- Track usage over time

---

## Core CRUD Operations

### 3. Create Announcement

Create and queue a new announcement for delivery.

**Endpoint:** `POST /event/admin/announcement/:eventId`

**URL Parameters:**
- `eventId` (string, required) - Event ID

**Request Body:**
```json
{
  "title": "Important Update",
  "message": "Hello {name}, we have an update about the event. Please check your email at {email}.",
  "messageType": "both",
  "priority": "normal",
  "participantIds": [
    "670f1234567890abcdef9001",
    "670f1234567890abcdef9002"
  ],
  "isScheduled": false,
  "scheduleDateTime": null
}
```

**Request Fields:**
- `title` (string, required, max: 200) - Announcement title
- `message` (string, required, max: 1000) - Message content
  - Supports placeholders: `{name}`, `{email}`
- `messageType` (string, required) - Delivery channel
  - Values: `"whatsapp"`, `"email"`, `"both"`
- `priority` (string, optional, default: "normal") - Announcement priority
  - Values: `"low"`, `"normal"`, `"high"`
- `participantIds` (array, required) - Participant IDs (max: 1000)
- `isScheduled` (boolean, optional, default: false) - Schedule for later
- `scheduleDateTime` (string, required if isScheduled=true) - ISO date string

**Validation Rules:**
- ✅ Event must exist and be accessible
- ✅ Title and message are required
- ✅ 1-1000 participants
- ✅ All participant IDs must be valid ObjectIds
- ✅ Participants must belong to the event
- ✅ Schedule time must be in future
- ✅ Minimum 30-minute gap since last announcement
- ✅ Maximum 5 announcements per day

**Response Example (Success):**
```json
{
  "message": "Announcement created successfully",
  "announcement": {
    "_id": "670f1234567890abcdef7890",
    "title": "Important Update",
    "eventId": "670f1234567890abcdef1234",
    "message": "Hello {name}, we have an update...",
    "messageType": "both",
    "priority": "normal",
    "status": "pending",
    "isScheduled": false,
    "participants": [...],
    "deliveryStats": {
      "total": 2,
      "pending": 2,
      "sent": 0,
      "failed": 0,
      "delivered": 0
    },
    "jobId": "670f1234567890abcdef7890",
    "createdAt": "2025-10-11T12:00:00.000Z",
    "createdBy": "670f1234567890abcdef0001"
  },
  "jobId": "670f1234567890abcdef7890"
}
```

**Error Responses:**

*Rate Limited (429):*
```json
{
  "success": false,
  "error": {
    "message": "Announcement rate limit exceeded",
    "code": "RATE_LIMIT_ERROR",
    "details": "Please wait 15 more minute(s) before sending another announcement.",
    "statusCode": 429
  }
}
```

*Daily Limit (429):*
```json
{
  "success": false,
  "error": {
    "message": "Daily announcement limit exceeded",
    "code": "DAILY_LIMIT_ERROR",
    "details": "You have reached the maximum limit of 5 announcements per day.",
    "statusCode": 429
  }
}
```

---

### 4. Get All Announcements

Retrieve all announcements for an event with pagination and filters.

**Endpoint:** `GET /event/admin/announcement/:eventId`

**URL Parameters:**
- `eventId` (string, required) - Event ID

**Query Parameters:**
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Items per page
- `status` (string, optional) - Filter by status
  - Values: `pending`, `processing`, `sent`, `partial`, `failed`, `cancelled`
- `priority` (string, optional) - Filter by priority
  - Values: `low`, `normal`, `high`

**Response Example:**
```json
{
  "success": true,
  "announcements": [
    {
      "_id": "670f1234567890abcdef7890",
      "title": "Event Reminder",
      "status": "sent",
      "messageType": "both",
      "priority": "normal",
      "isScheduled": false,
      "createdAt": "2025-10-11T10:00:00.000Z",
      "createdBy": {
        "_id": "670f1234567890abcdef0001",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "deliveryStats": {
        "total": 150,
        "sent": 148,
        "failed": 2,
        "pending": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Use Cases:**
- List all announcements in admin panel
- Filter by status to see failures
- Paginate through large lists

---

### 5. Get Single Announcement

Get detailed information about a specific announcement.

**Endpoint:** `GET /event/admin/announcement/:eventId/:announcementId`

**URL Parameters:**
- `eventId` (string, required) - Event ID
- `announcementId` (string, required) - Announcement ID

**Response Example:**
```json
{
  "success": true,
  "announcement": {
    "_id": "670f1234567890abcdef7890",
    "title": "Event Reminder",
    "eventId": "670f1234567890abcdef1234",
    "message": "Hello {name}, reminder about our event!",
    "messageType": "both",
    "priority": "normal",
    "status": "sent",
    "isScheduled": false,
    "jobId": "670f1234567890abcdef7890",
    "createdAt": "2025-10-11T10:00:00.000Z",
    "completedAt": "2025-10-11T10:05:30.000Z",
    "createdBy": {
      "_id": "670f1234567890abcdef0001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "participants": [
      {
        "participantId": {
          "_id": "670f1234567890abcdef9001",
          "name": "Alice Smith",
          "email": "alice@example.com",
          "phone": "+1234567890"
        },
        "status": "sent",
        "sentAt": "2025-10-11T10:02:15.000Z",
        "retryCount": 0
      },
      {
        "participantId": {
          "_id": "670f1234567890abcdef9002",
          "name": "Bob Johnson",
          "email": "bob@example.com",
          "phone": "+1234567891"
        },
        "status": "failed",
        "error": "WhatsApp: Invalid phone number",
        "retryCount": 3
      }
    ],
    "deliveryStats": {
      "total": 150,
      "pending": 0,
      "sent": 148,
      "failed": 2,
      "delivered": 145
    }
  }
}
```

**Use Cases:**
- View announcement details
- Check individual participant delivery status
- Debug delivery failures

---

### 6. Cancel Announcement

Cancel a pending or scheduled announcement.

**Endpoint:** `DELETE /event/admin/announcement/:eventId/:announcementId/cancel`

**URL Parameters:**
- `eventId` (string, required) - Event ID
- `announcementId` (string, required) - Announcement ID

**Response Example:**
```json
{
  "success": true,
  "message": "Announcement cancelled successfully",
  "announcement": {
    "_id": "670f1234567890abcdef7890",
    "title": "Scheduled Update",
    "status": "cancelled",
    "cancelledAt": "2025-10-11T12:30:00.000Z",
    "error": "Cancelled by user"
  }
}
```

**Error Responses:**

*Cannot Cancel Sent Announcement (400):*
```json
{
  "success": false,
  "error": {
    "message": "Cannot cancel sent announcement",
    "code": "INVALID_OPERATION",
    "details": "This announcement has already been sent.",
    "statusCode": 400
  }
}
```

*Cannot Cancel Processing (400):*
```json
{
  "success": false,
  "error": {
    "message": "Cannot cancel processing announcement",
    "code": "INVALID_OPERATION",
    "details": "This announcement is currently being processed.",
    "statusCode": 400
  }
}
```

---

### 7. Get Announcement Statistics

Get aggregated statistics for all announcements in an event.

**Endpoint:** `GET /event/admin/announcement/:eventId/stats`

**URL Parameters:**
- `eventId` (string, required) - Event ID

**Response Example:**
```json
{
  "success": true,
  "stats": {
    "total": 25,
    "pending": 2,
    "processing": 1,
    "sent": 18,
    "partial": 2,
    "failed": 1,
    "cancelled": 1,
    "totalParticipantsReached": 3450,
    "totalParticipantsFailed": 50
  }
}
```

**Use Cases:**
- Quick overview statistics
- Status distribution chart
- Success rate calculation

---

## Dashboard & Analytics

### 8. Get Announcement Dashboard

Get comprehensive dashboard with statistics, trends, and AI-generated insights.

**Endpoint:** `GET /event/admin/announcement/:eventId/dashboard`

**URL Parameters:**
- `eventId` (string, required) - Event ID

**Query Parameters:**
- `timeRange` (number, optional, default: 7) - Days for trend analysis

**Response Example:**
```json
{
  "success": true,
  "eventId": "670f1234567890abcdef1234",
  "eventName": "Tech Conference 2025",
  "timeRange": {
    "days": 7,
    "from": "2025-10-04T00:00:00.000Z",
    "to": "2025-10-11T12:00:00.000Z"
  },
  "summary": {
    "totalAnnouncements": 25,
    "totalParticipantsReached": 3450,
    "totalParticipantsFailed": 50,
    "totalParticipantsTargeted": 3500,
    "overallSuccessRate": 98.57,
    "averageDeliveryRate": 97.5
  },
  "statusBreakdown": {
    "pending": 1,
    "processing": 0,
    "sent": 20,
    "partial": 2,
    "failed": 1,
    "cancelled": 1
  },
  "rateLimits": {
    "canSendNow": true,
    "waitTimeMinutes": 0,
    "announcementsToday": 2,
    "remainingToday": 3,
    "maxPerDay": 5,
    "minimumGapMinutes": 30
  },
  "recentActivity": [
    {
      "id": "670f1234567890abcdef7890",
      "title": "Event Update",
      "status": "sent",
      "messageType": "both",
      "priority": "normal",
      "isScheduled": false,
      "createdAt": "2025-10-11T10:30:00.000Z",
      "createdBy": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "stats": {
        "total": 150,
        "sent": 148,
        "failed": 2,
        "pending": 0,
        "deliveryRate": "98.7"
      }
    }
  ],
  "deliveryTrends": [
    {
      "date": "2025-10-11",
      "announcements": 3,
      "participantsReached": 450,
      "participantsFailed": 5,
      "successRate": "98.9"
    },
    {
      "date": "2025-10-10",
      "announcements": 5,
      "participantsReached": 720,
      "participantsFailed": 8,
      "successRate": "98.9"
    }
  ],
  "topFailures": [
    {
      "id": "670f1234567890abcdef7891",
      "title": "Reminder Message",
      "status": "partial",
      "createdAt": "2025-10-10T15:00:00.000Z",
      "failed": 10,
      "total": 100,
      "failureRate": "10.0",
      "error": "WhatsApp API timeout"
    }
  ],
  "insights": [
    {
      "type": "success",
      "message": "Excellent! Your delivery success rate is 98.6%",
      "action": null
    },
    {
      "type": "warning",
      "message": "1 announcement(s) have delivery failures",
      "action": "Review failed announcements and check participant details"
    },
    {
      "type": "info",
      "message": "1 announcement(s) are currently being processed",
      "action": null
    }
  ]
}
```

**Dashboard Components:**

1. **Summary**: Overall statistics and success rates
2. **Status Breakdown**: Distribution by status
3. **Rate Limits**: Current sending capability
4. **Recent Activity**: Last 10 announcements
5. **Delivery Trends**: Daily performance over time range
6. **Top Failures**: Problematic announcements
7. **AI Insights**: Smart recommendations

**Insight Types:**
- `success` - Positive performance indicators
- `warning` - Issues requiring attention
- `alert` - Critical problems
- `info` - General information

**Use Cases:**
- Main admin dashboard
- Performance monitoring
- Trend analysis
- Problem identification

---

### 9. Get Performance Metrics

Get detailed performance metrics broken down by various dimensions.

**Endpoint:** `GET /event/admin/announcement/:eventId/metrics`

**URL Parameters:**
- `eventId` (string, required) - Event ID

**Response Example:**
```json
{
  "success": true,
  "eventId": "670f1234567890abcdef1234",
  "metrics": {
    "byMessageType": [
      {
        "messageType": "whatsapp",
        "announcements": 10,
        "sent": 980,
        "failed": 20,
        "targeted": 1000,
        "successRate": "98.0"
      },
      {
        "messageType": "email",
        "announcements": 8,
        "sent": 790,
        "failed": 10,
        "targeted": 800,
        "successRate": "98.8"
      },
      {
        "messageType": "both",
        "announcements": 7,
        "sent": 1380,
        "failed": 20,
        "targeted": 1400,
        "successRate": "98.6"
      }
    ],
    "byPriority": [
      {
        "priority": "high",
        "announcements": 5,
        "sent": 500,
        "failed": 5,
        "successRate": "99.0"
      },
      {
        "priority": "normal",
        "announcements": 18,
        "sent": 2450,
        "failed": 40,
        "successRate": "98.4"
      },
      {
        "priority": "low",
        "announcements": 2,
        "sent": 200,
        "failed": 5,
        "successRate": "97.6"
      }
    ],
    "byScheduling": [
      {
        "type": "immediate",
        "announcements": 20,
        "sent": 2800,
        "failed": 45
      },
      {
        "type": "scheduled",
        "announcements": 5,
        "sent": 350,
        "failed": 5
      }
    ],
    "deliveryTime": {
      "average": 245,
      "minimum": 45,
      "maximum": 890
    }
  }
}
```

**Metrics Breakdown:**

1. **By Message Type**: Performance comparison between WhatsApp, Email, and Both
2. **By Priority**: Success rates by priority level
3. **By Scheduling**: Immediate vs scheduled performance
4. **Delivery Time**: Average processing time in seconds

**Use Cases:**
- Optimize message type selection
- Analyze priority effectiveness
- Performance benchmarking
- Capacity planning

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": "Detailed explanation",
    "statusCode": 400
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `NOT_FOUND` | 404 | Event or announcement not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `RATE_LIMIT_ERROR` | 429 | 30-minute gap not met |
| `DAILY_LIMIT_ERROR` | 429 | 5 announcements/day exceeded |
| `PARTICIPANTS_NOT_FOUND` | 404 | Some participants don't exist |
| `INVALID_OPERATION` | 400 | Cannot perform requested action |
| `QUEUE_ERROR` | 500 | Failed to queue announcement |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Examples

### Example 1: Complete Workflow

```javascript
// 1. Check if can send
const limitsResponse = await fetch('/event/admin/announcement/event123/limits');
const limits = await limitsResponse.json();

if (!limits.canSend) {
  alert(`Please wait ${limits.limits.rateLimit.waitTimeMinutes} minutes`);
  return;
}

// 2. Create announcement
const announcement = await fetch('/event/admin/announcement/event123', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Event Reminder',
    message: 'Hi {name}, reminder about the event!',
    messageType: 'both',
    priority: 'normal',
    participantIds: ['id1', 'id2', 'id3']
  })
});

// 3. Monitor status
const statusResponse = await fetch(`/event/admin/announcement/event123/${announcement._id}`);
const status = await statusResponse.json();

console.log(`Status: ${status.announcement.status}`);
console.log(`Sent: ${status.announcement.deliveryStats.sent}`);
```

### Example 2: Dashboard Integration

```javascript
// Fetch dashboard data
const dashboard = await fetch('/event/admin/announcement/event123/dashboard?timeRange=30');
const data = await dashboard.json();

// Display summary
console.log(`Total Announcements: ${data.summary.totalAnnouncements}`);
console.log(`Success Rate: ${data.summary.overallSuccessRate}%`);
console.log(`Can Send Now: ${data.rateLimits.canSendNow}`);

// Show insights
data.insights.forEach(insight => {
  console.log(`[${insight.type.toUpperCase()}] ${insight.message}`);
});
```

### Example 3: Schedule Announcement

```javascript
// Schedule for tomorrow at 9 AM
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(9, 0, 0, 0);

const scheduled = await fetch('/event/admin/announcement/event123', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Event Tomorrow!',
    message: 'Hi {name}, see you tomorrow!',
    messageType: 'whatsapp',
    priority: 'high',
    participantIds: participantList,
    isScheduled: true,
    scheduleDateTime: tomorrow.toISOString()
  })
});
```

### Example 4: Cancel Scheduled Announcement

```javascript
// Cancel a scheduled announcement
const result = await fetch(
  '/event/admin/announcement/event123/announcement456/cancel',
  { method: 'DELETE' }
);

if (result.ok) {
  console.log('Announcement cancelled successfully');
}
```

---

## Best Practices

### 1. Always Check Limits First
```javascript
// Before showing create form
const canSend = await checkLimits(eventId);
if (canSend) {
  showCreateForm();
} else {
  showLimitWarning();
}
```

### 2. Use Personalization
```javascript
// Good: Personalized message
"Hi {name}, welcome to our event! Confirmation sent to {email}."

// Bad: Generic message
"Hi, welcome to our event!"
```

### 3. Handle Errors Gracefully
```javascript
try {
  await createAnnouncement(data);
} catch (error) {
  if (error.code === 'RATE_LIMIT_ERROR') {
    showWaitTimer(error.details);
  } else if (error.code === 'DAILY_LIMIT_ERROR') {
    showDailyLimitMessage();
  } else {
    showGenericError();
  }
}
```

### 4. Monitor Delivery Status
```javascript
// Poll for status updates
const pollStatus = async (announcementId) => {
  const interval = setInterval(async () => {
    const status = await getAnnouncementStatus(announcementId);
    
    if (['sent', 'partial', 'failed'].includes(status.status)) {
      clearInterval(interval);
      showFinalStatus(status);
    } else {
      updateProgress(status.deliveryStats);
    }
  }, 5000); // Check every 5 seconds
};
```

### 5. Use Dashboard for Insights
```javascript
// Fetch and act on insights
const dashboard = await getDashboard(eventId);

dashboard.insights.forEach(insight => {
  if (insight.type === 'alert') {
    sendNotification(insight.message);
  }
});
```

---

## Rate Limits Summary

| Limit Type | Value | Reset |
|------------|-------|-------|
| Time Gap | 30 minutes | After each announcement |
| Daily Limit | 5 announcements | 00:00 UTC daily |
| Participant Limit | 1000 per announcement | Per request |
| Title Length | 200 characters | Per request |
| Message Length | 1000 characters | Per request |

---

## Message Personalization

### Available Placeholders

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{name}` | Participant's name | "John Doe" |
| `{email}` | Participant's email | "john@example.com" |

### Example Messages

```
Hi {name}, thank you for registering!

Hello {name}, your confirmation has been sent to {email}.

Reminder for {name}: Event starts tomorrow!

Important update, {name}. Check your email at {email}.
```

---

## Changelog

### Version 1.0.0 (October 11, 2025)
- Initial release
- Core CRUD operations
- Spam prevention
- Dashboard and analytics
- Performance metrics
- Comprehensive error handling

---

## Support

For issues or questions:
- Check logs: `/logs/`
- Review error codes in this documentation
- Contact: dev-team@orgatick.com

---

**API Version:** 1.0.0  
**Last Updated:** October 11, 2025  
**Status:** Production Ready ✅
