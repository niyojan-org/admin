# Announcement API Documentation

## Overview
The Announcement API allows you to create, manage, and track announcements sent to event participants via WhatsApp and email. This system includes anti-spam protection, scheduling capabilities, templates, analytics, and delivery tracking.

## Base URL
```
/events/admin/announcement
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authorization Roles
- **owner**: Full access to all operations
- **admin**: Full access to all operations  
- **manager**: Read-only access (GET operations only) + retry functionality

---

## Core Announcement Endpoints

### 1. Create Announcement
**POST** `/events/admin/announcement/{eventId}`

Creates a new announcement and queues it for delivery.

#### Required Roles
- `owner`, `admin`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |

#### Request Body
```json
{
  "title": "string",                    // Required: Announcement title
  "description": "string",              // Optional: Detailed description
  "message": "string",                  // Required: Message content (supports placeholders)
  "participantIds": ["string"],         // Required: Array of participant IDs
  "messageType": "string",              // Required: "whatsapp", "email", or "both"
  "priority": "string",                 // Optional: "low", "normal", "high" (default: "normal")
  "isScheduled": boolean,               // Optional: Whether to schedule the announcement (default: false)
  "scheduleDateTime": "ISO string"      // Required if isScheduled is true
}
```

#### Message Placeholders
Available placeholders for personalization:
- `{participantName}` - Participant's name
- `{eventTitle}` - Event title
- `{venue}` - Event venue
- `{eventDate}` - Event date
- `{eventTime}` - Event time

#### Response
```json
{
  "success": true,
  "message": "Announcement created and queued successfully", // or "scheduled successfully"
  "announcement": {
    "_id": "string",
    "title": "string",
    "message": "string",
    "description": "string",
    "status": "pending|scheduled",
    "messageType": "whatsapp|email|both",
    "priority": "low|normal|high",
    "isScheduled": boolean,
    "scheduleDateTime": "ISO string",
    "participantCount": number,
    "jobId": "string",
    "jobType": "single|bulk",
    "estimatedDeliveryTime": "ISO string",
    "createdAt": "ISO string",
    "createdBy": "string"
  }
}
```

#### Error Responses
- `400` - Invalid request data, anti-spam limits exceeded
- `401` - Authentication required
- `403` - Insufficient permissions
- `404` - Event not found

---

### 2. Get All Announcements
**GET** `/events/admin/announcement/{eventId}`

Retrieves all announcements for an event with pagination and filtering.

#### Required Roles
- `owner`, `admin`, `manager`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Number of announcements per page |
| status | string | all | Filter by status: "pending", "sent", "failed", "cancelled", "partial" |
| priority | string | all | Filter by priority: "low", "normal", "high" |
| messageType | string | all | Filter by type: "whatsapp", "email", "both" |
| sortBy | string | createdAt | Sort field: "createdAt", "title", "status", "priority" |
| sortOrder | string | desc | Sort order: "asc", "desc" |
| search | string | - | Search in title and message |

#### Response
```json
{
  "success": true,
  "message": "Announcements fetched successfully",
  "announcements": [
    {
      "_id": "string",
      "title": "string",
      "message": "string",
      "description": "string",
      "status": "pending|sent|failed|cancelled|partial|scheduled",
      "messageType": "whatsapp|email|both",
      "priority": "low|normal|high",
      "isScheduled": boolean,
      "scheduleDateTime": "ISO string",
      "sentAt": "ISO string",
      "participantCount": number,
      "deliveryStats": {
        "total": number,
        "sent": number,
        "delivered": number,
        "failed": number,
        "read": number
      },
      "jobId": "string",
      "jobType": "single|bulk",
      "createdAt": "ISO string",
      "updatedAt": "ISO string",
      "createdBy": "string"
    }
  ],
  "pagination": {
    "currentPage": number,
    "totalPages": number,
    "totalItems": number,
    "itemsPerPage": number,
    "hasNextPage": boolean,
    "hasPrevPage": boolean
  }
}
```

---

### 3. Get Announcement by ID
**GET** `/events/admin/announcement/{eventId}/{announcementId}`

Retrieves a specific announcement with detailed information.

#### Required Roles
- `owner`, `admin`, `manager`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |
| announcementId | string | The unique identifier of the announcement |

#### Response
```json
{
  "success": true,
  "message": "Announcement fetched successfully",
  "announcement": {
    "_id": "string",
    "title": "string",
    "message": "string",
    "description": "string",
    "status": "string",
    "messageType": "string",
    "priority": "string",
    "isScheduled": boolean,
    "scheduleDateTime": "ISO string",
    "sentAt": "ISO string",
    "participantIds": ["string"],
    "participantCount": number,
    "deliveryStats": {
      "total": number,
      "sent": number,
      "delivered": number,
      "failed": number,
      "read": number
    },
    "metadata": {
      "messageLength": number,
      "placeholdersUsed": ["string"],
      "estimatedDeliveryTime": "ISO string",
      "processingDuration": number
    },
    "retryConfig": {
      "maxRetries": number,
      "currentRetry": number,
      "lastRetryAt": "ISO string"
    },
    "jobId": "string",
    "jobType": "string",
    "error": "string",
    "errorDetails": "object",
    "createdAt": "ISO string",
    "updatedAt": "ISO string",
    "createdBy": "string"
  }
}
```

---

### 4. Update Announcement
**PUT** `/events/admin/announcement/{eventId}/{announcementId}`

Updates an existing announcement. Only pending or cancelled announcements can be updated.

#### Required Roles
- `owner`, `admin`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |
| announcementId | string | The unique identifier of the announcement |

#### Request Body
All fields are optional. Only provided fields will be updated.
```json
{
  "title": "string",
  "message": "string", 
  "description": "string",
  "participantIds": ["string"],
  "messageType": "whatsapp|email|both",
  "priority": "low|normal|high",
  "isScheduled": boolean,
  "scheduleDateTime": "ISO string"
}
```

#### Response
```json
{
  "success": true,
  "message": "Announcement updated successfully",
  "announcement": {
    "_id": "string",
    "title": "string",
    "message": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "messageType": "string",
    "isScheduled": boolean,
    "scheduleDateTime": "ISO string",
    "participantCount": number,
    "jobId": "string",
    "jobType": "string",
    "updatedAt": "ISO string"
  },
  "updatedFields": ["string"]
}
```

#### Validation Rules
- Only `pending` or `cancelled` announcements can be updated
- Participant IDs must belong to the event
- Schedule validation applies if scheduling fields are updated
- Anti-spam limits are checked if participants or content changes

---

### 5. Cancel Scheduled Announcement
**DELETE** `/events/admin/announcement/{eventId}/{announcementId}`

Cancels a scheduled announcement and removes it from the delivery queue.

#### Required Roles
- `owner`, `admin`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |
| announcementId | string | The unique identifier of the announcement |

#### Response
```json
{
  "success": true,
  "message": "Scheduled announcement cancelled successfully",
  "data": {
    "announcementId": "string",
    "status": "cancelled",
    "cancelledAt": "ISO string"
  }
}
```

---

## Extended Features Endpoints

### 6. Get Announcement Status
**GET** `/events/admin/announcement/{eventId}/{announcementId}/status`

Gets detailed status information including job progress and delivery statistics.

#### Required Roles
- `owner`, `admin`, `manager`

#### Response
```json
{
  "success": true,
  "message": "Announcement fetched successfully",
  "announcement": {
    "id": "string",
    "title": "string",
    "message": "string",
    "status": "string",
    "isScheduled": boolean,
    "scheduleDateTime": "ISO string",
    "sentAt": "ISO string",
    "createdAt": "ISO string",
    "createdBy": "string",
    "participantCount": number,
    "errorDetails": "object"
  },
  "jobStatus": {
    "id": "string",
    "status": "string",
    "progress": number,
    "processedCount": number,
    "failedCount": number,
    "remainingCount": number
  },
  "deliveryStats": {
    "total": number,
    "sent": number,
    "delivered": number,
    "failed": number,
    "read": number,
    "deliveryRate": number,
    "readRate": number
  }
}
```

---

### 7. Retry Failed Announcement
**POST** `/events/admin/announcement/{eventId}/{announcementId}/retry`

Retries a failed or partially failed announcement.

#### Required Roles
- `owner`, `admin`, `manager`

#### Request Body
```json
{
  "priority": "low|normal|high"  // Optional: Priority for retry (default: "normal")
}
```

#### Response
```json
{
  "success": true,
  "message": "Announcement retry initiated successfully",
  "announcement": {
    "announcementId": "string",
    "retryCount": number,
    "jobResult": {
      "jobId": "string",
      "type": "string",
      "priority": "string"
    },
    "status": "pending",
    "priority": "string"
  }
}
```

#### Validation
- Only `failed` or `partial` announcements can be retried
- Maximum retry limit must not be exceeded

---

### 8. Get Delivery Analytics
**GET** `/events/admin/announcement/{eventId}/delivery-analytics`

Retrieves comprehensive analytics and statistics for announcements.

#### Required Roles
- `owner`, `admin`, `manager`

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | 7d | Analytics period: "24h", "7d", "30d" |

#### Response
```json
{
  "success": true,
  "message": "Delivery analytics retrieved successfully",
  "analytics": {
    "period": "7d",
    "eventId": "string",
    "eventTitle": "string",
    "dateRange": {
      "from": "ISO string",
      "to": "ISO string"
    },
    "summary": {
      "totalAnnouncements": number,
      "totalParticipants": number,
      "totalSent": number,
      "totalFailed": number,
      "totalDelivered": number,
      "totalRead": number,
      "successRate": number,
      "deliveryRate": number,
      "readRate": number,
      "failureRate": number,
      "avgProcessingTime": number,
      "avgMessageLength": number,
      "scheduledCount": number,
      "highPriorityCount": number
    },
    "trends": [
      {
        "_id": {
          "year": number,
          "month": number,
          "day": number
        },
        "count": number,
        "sent": number,
        "failed": number,
        "participants": number
      }
    ],
    "eventStats": {
      "totalAnnouncements": number,
      "totalParticipantsReached": number,
      "avgSuccessRate": number
    }
  }
}
```

---

### 9. Get Announcement Templates
**GET** `/events/admin/announcement/{eventId}/templates`

Retrieves pre-defined announcement templates categorized by use case.

#### Required Roles
- `owner`, `admin`, `manager`

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| category | string | all | Template category: "general", "updates", "reminders", "followup", "all" |

#### Response
```json
{
  "success": true,
  "message": "Announcement templates retrieved successfully",
  "template": {
    "eventId": "string",
    "eventTitle": "string",
    "category": "string",
    "templates": [
      {
        "id": "string",
        "title": "string",
        "message": "string",
        "category": "string",
        "priority": "string",
        "variables": ["string"],
        "previewMessage": "string",
        "eventContext": {
          "eventTitle": "string",
          "venue": "string",
          "eventDate": "string",
          "totalParticipants": number
        }
      }
    ],
    "availableCategories": ["string"],
    "totalTemplates": number
  }
}
```

#### Available Template Categories
- **general**: Welcome messages, basic announcements
- **updates**: Schedule changes, venue updates, cancellations
- **reminders**: Event reminders (1 hour, 24 hours, 1 week)
- **followup**: Thank you messages, survey requests

---

### 10. Preview Announcement
**POST** `/events/admin/announcement/{eventId}/preview`

Generates a preview of how the announcement will look for sample participants.

#### Required Roles
- `owner`, `admin`, `manager`

#### Request Body
```json
{
  "title": "string",                    // Required: Announcement title
  "message": "string",                  // Required: Message content with placeholders
  "participantIds": ["string"],         // Optional: Specific participants to preview
  "sampleSize": number                  // Optional: Number of preview samples (default: 3)
}
```

#### Response
```json
{
  "success": true,
  "message": "Announcement preview generated successfully",
  "data": {
    "eventId": "string",
    "eventTitle": "string",
    "originalMessage": {
      "title": "string",
      "message": "string",
      "characterCount": number
    },
    "previews": [
      {
        "participantId": "string",
        "participantName": "string",
        "personalizedTitle": "string",
        "personalizedMessage": "string",
        "characterCount": number
      }
    ],
    "statistics": {
      "totalParticipants": number,
      "sampleSize": number,
      "estimatedDeliveryTime": "string",
      "estimatedCost": "string",
      "estimatedDuration": "string"
    },
    "placeholders": {
      "detected": ["string"],
      "available": ["string"]
    }
  }
}
```

---

### 11. Get Anti-Spam Status
**GET** `/events/admin/announcement/{eventId}/anti-spam/status`

Retrieves current anti-spam limits and usage statistics.

#### Required Roles
- `owner`, `admin`, `manager`

#### Response
```json
{
  "success": true,
  "message": "Anti-spam status fetched successfully",
  "status": {
    "eventId": "string",
    "dailyLimit": number,
    "dailyUsed": number,
    "dailyRemaining": number,
    "hourlyLimit": number,
    "hourlyUsed": number,
    "hourlyRemaining": number,
    "participantLimit": number,
    "lastResetTime": "ISO string",
    "nextResetTime": "ISO string",
    "isBlocked": boolean,
    "blockReason": "string",
    "blockExpiresAt": "ISO string"
  }
}
```

---

## Status Codes and States

### Announcement Status
- **pending**: Queued for delivery but not yet sent
- **scheduled**: Scheduled for future delivery
- **sent**: Successfully sent to all recipients
- **failed**: Failed to send to all recipients
- **partial**: Sent to some but failed for others
- **cancelled**: Cancelled before delivery

### Message Types
- **whatsapp**: Send via WhatsApp only
- **email**: Send via email only
- **both**: Send via both WhatsApp and email

### Priority Levels
- **low**: Lowest priority, processed when resources are available
- **normal**: Standard priority (default)
- **high**: High priority, processed before normal/low priority messages

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error description"
  }
}
```

### Common Error Codes
- `ANTI_SPAM_LIMIT_EXCEEDED` - Daily or hourly sending limits exceeded
- `INVALID_PARTICIPANTS` - Some participants don't belong to the event
- `INVALID_SCHEDULE_TIME` - Schedule time is in the past or invalid
- `ANNOUNCEMENT_NOT_FOUND` - Announcement doesn't exist
- `INVALID_STATUS` - Operation not allowed for current announcement status
- `MAX_RETRIES_EXCEEDED` - Announcement has reached maximum retry limit

---

## UI Implementation Guide

### 1. Announcement Creation Form
```html
<!-- Basic announcement form -->
<form id="announcementForm">
  <input type="text" name="title" placeholder="Announcement Title" required />
  <textarea name="description" placeholder="Description (optional)"></textarea>
  <textarea name="message" placeholder="Message content" required></textarea>
  
  <select name="messageType" required>
    <option value="whatsapp">WhatsApp</option>
    <option value="email">Email</option>
    <option value="both">Both</option>
  </select>
  
  <select name="priority">
    <option value="normal">Normal</option>
    <option value="low">Low</option>
    <option value="high">High</option>
  </select>
  
  <div class="scheduling">
    <input type="checkbox" name="isScheduled" id="schedule" />
    <label for="schedule">Schedule for later</label>
    <input type="datetime-local" name="scheduleDateTime" id="scheduleTime" disabled />
  </div>
  
  <div class="participants">
    <!-- Multi-select for participants -->
    <select name="participantIds" multiple required>
      <!-- Options populated via API -->
    </select>
  </div>
  
  <button type="button" onclick="previewAnnouncement()">Preview</button>
  <button type="submit">Send Announcement</button>
</form>
```

### 2. Announcement List Component
```javascript
// Fetch announcements with pagination and filtering
async function loadAnnouncements(eventId, page = 1, filters = {}) {
  const queryParams = new URLSearchParams({
    page,
    limit: 10,
    ...filters
  });
  
  const response = await fetch(`/events/admin/announcement/${eventId}?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  renderAnnouncementList(data.announcements, data.pagination);
}

// Status badge component
function getStatusBadge(status) {
  const badges = {
    'pending': '<span class="badge badge-warning">Pending</span>',
    'sent': '<span class="badge badge-success">Sent</span>',
    'failed': '<span class="badge badge-danger">Failed</span>',
    'partial': '<span class="badge badge-warning">Partial</span>',
    'cancelled': '<span class="badge badge-secondary">Cancelled</span>',
    'scheduled': '<span class="badge badge-info">Scheduled</span>'
  };
  return badges[status] || '<span class="badge badge-light">Unknown</span>';
}
```

### 3. Real-time Status Updates
```javascript
// Poll for announcement status updates
function startStatusPolling(eventId, announcementId) {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(
        `/events/admin/announcement/${eventId}/${announcementId}/status`,
        {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        }
      );
      
      const data = await response.json();
      updateAnnouncementStatus(data.announcement, data.jobStatus, data.deliveryStats);
      
      // Stop polling if announcement is completed
      if (['sent', 'failed', 'cancelled'].includes(data.announcement.status)) {
        clearInterval(interval);
      }
    } catch (error) {
      console.error('Status polling error:', error);
    }
  }, 5000); // Poll every 5 seconds
  
  return interval;
}
```

### 4. Template Integration
```javascript
// Load and apply templates
async function loadTemplates(eventId, category = 'all') {
  const response = await fetch(
    `/events/admin/announcement/${eventId}/templates?category=${category}`,
    {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    }
  );
  
  const data = await response.json();
  populateTemplateSelector(data.template.templates);
}

function applyTemplate(template) {
  document.getElementById('title').value = template.title;
  document.getElementById('message').value = template.message;
  document.getElementById('priority').value = template.priority;
}
```

### 5. Preview Functionality
```javascript
async function previewAnnouncement() {
  const formData = new FormData(document.getElementById('announcementForm'));
  const data = {
    title: formData.get('title'),
    message: formData.get('message'),
    participantIds: Array.from(formData.getAll('participantIds'))
  };
  
  const response = await fetch(`/events/admin/announcement/${eventId}/preview`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  const preview = await response.json();
  showPreviewModal(preview.data);
}
```

### 6. Analytics Dashboard
```javascript
async function loadAnalytics(eventId, period = '7d') {
  const response = await fetch(
    `/events/admin/announcement/${eventId}/delivery-analytics?period=${period}`,
    {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    }
  );
  
  const data = await response.json();
  renderAnalyticsDashboard(data.analytics);
}

function renderAnalyticsDashboard(analytics) {
  // Render charts for:
  // - Success/failure rates
  // - Delivery trends over time
  // - Message type distribution
  // - Priority distribution
}
```

---

## Best Practices

### 1. **Error Handling**
- Always check response status codes
- Display user-friendly error messages
- Implement retry mechanisms for failed requests

### 2. **Real-time Updates**
- Use polling for status updates during announcement delivery
- Show progress indicators for long-running operations
- Implement WebSocket connections for real-time notifications (if available)

### 3. **User Experience**
- Validate forms client-side before submission
- Show preview before sending announcements
- Provide clear feedback on announcement status
- Implement confirmation dialogs for destructive actions

### 4. **Performance**
- Implement pagination for large announcement lists
- Use lazy loading for analytics data
- Cache template data locally
- Debounce search inputs

### 5. **Security**
- Always include authentication headers
- Validate user permissions on the frontend
- Sanitize user inputs
- Use HTTPS for all API calls

This comprehensive documentation should provide your frontend team with everything they need to build a complete announcement management interface! 🚀
