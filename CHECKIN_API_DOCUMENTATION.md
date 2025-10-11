# Check-In API Documentation

## Overview
This document describes the Check-In API endpoints for managing participant check-ins at event sessions.

---

## Check-In Participant

### Endpoint
```
POST /api/event/admin/checkin/:eventId/:sessionId/:code
```

### Description
Checks in a participant for a specific event session using a check-in code. The participant can be identified either by their MongoDB ID or their ticket code.

### Authentication
- **Required**: Yes
- **Type**: Organization/User Authentication
- **Header**: `Authorization: Bearer <token>`

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | String (ObjectId) | Yes | The MongoDB ID of the event |
| `code` | String | Yes | The session check-in code |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `participantId` | String (ObjectId) | Conditional* | The MongoDB ID of the participant |
| `ticketCode` | String | Conditional* | The unique ticket code of the participant |

**Note**: Either `participantId` OR `ticketCode` must be provided (not both required, but at least one).

### Request Example

**Using Participant ID:**
```json
{
  "participantId": "507f1f77bcf86cd799439011"
}
```

**Using Ticket Code:**
```json
{
  "ticketCode": "TKT-ABC123-XYZ"
}
```

---

## Success Responses

### 1. Check-In Success (New Check-In)

**Status Code**: `200 OK`

**Response Body:**
```json
{
  "success": true,
  "code": "CHECKIN_SUCCESS",
  "message": "Participant checked in successfully",
  "data": {
    "participant": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "ticketType": "VIP",
      "ticketCode": "TKT-ABC123-XYZ",
      "groupInfo": {
        "groupName": "Team Alpha",
        "totalMembers": 5,
        "memberIndex": 1
      },
      "isGroupLeader": true,
      "dynamicFields": {
        "company": "Tech Corp",
        "dietaryRestrictions": "Vegetarian"
      }
    },
    "session": {
      "_id": "507f1f77bcf86cd799439022",
      "title": "Opening Ceremony",
      "startTime": "2025-10-15T09:00:00.000Z",
      "endTime": "2025-10-15T11:00:00.000Z",
      "venue": {
        "name": "Main Hall",
        "address": "123 Event Street",
        "city": "San Francisco",
        "state": "CA",
        "country": "USA",
        "zipCode": "94102"
      }
    },
    "checkIn": {
      "checkedIn": true,
      "checkedInAt": "2025-10-15T08:45:30.000Z",
      "checkedInBy": "507f1f77bcf86cd799439033",
      "alreadyCheckedIn": false
    },
    "event": {
      "_id": "507f1f77bcf86cd799439044",
      "title": "Tech Conference 2025",
      "slug": "tech-conference-2025"
    }
  }
}
```

### 2. Already Checked In

**Status Code**: `200 OK`

**Response Body:**
```json
{
  "success": true,
  "code": "PARTICIPANT_ALREADY_CHECKED_IN",
  "message": "Participant already checked in",
  "data": {
    "participant": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "ticketType": "VIP",
      "ticketCode": "TKT-ABC123-XYZ",
      "groupInfo": {
        "groupName": "Team Alpha",
        "totalMembers": 5,
        "memberIndex": 1
      },
      "isGroupLeader": true
    },
    "session": {
      "_id": "507f1f77bcf86cd799439022",
      "title": "Opening Ceremony",
      "startTime": "2025-10-15T09:00:00.000Z",
      "endTime": "2025-10-15T11:00:00.000Z",
      "venue": {
        "name": "Main Hall",
        "address": "123 Event Street",
        "city": "San Francisco",
        "state": "CA",
        "country": "USA",
        "zipCode": "94102"
      }
    },
    "checkIn": {
      "checkedIn": true,
      "checkedInAt": "2025-10-15T08:30:15.000Z",
      "checkedInBy": "507f1f77bcf86cd799439033",
      "alreadyCheckedIn": true
    },
    "event": {
      "_id": "507f1f77bcf86cd799439044",
      "title": "Tech Conference 2025",
      "slug": "tech-conference-2025"
    }
  }
}
```

---

## Error Responses

### 1. Identifier Required

**Status Code**: `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Participant identifier required",
    "code": "IDENTIFIER_REQUIRED",
    "details": "Please provide either participantId or ticketCode."
  }
}
```

### 2. Participant Not Found

**Status Code**: `404 Not Found`

```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "message": "Participant not found",
    "code": "PARTICIPANT_NOT_FOUND",
    "details": "No participant found with the provided identifier for this event."
  }
}
```

### 3. Registration Cancelled

**Status Code**: `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Registration cancelled",
    "code": "REGISTRATION_CANCELLED",
    "details": "This participant's registration has been cancelled."
  }
}
```

### 4. Registration Pending

**Status Code**: `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Registration pending",
    "code": "REGISTRATION_PENDING",
    "details": "This participant's registration is still pending approval or payment."
  }
}
```

### 5. Payment Pending

**Status Code**: `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Payment pending",
    "code": "PAYMENT_PENDING",
    "details": "Payment is pending for this participant."
  }
}
```

### 6. Payment Failed

**Status Code**: `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Payment failed",
    "code": "PAYMENT_FAILED",
    "details": "Payment has failed for this participant."
  }
}
```

### 7. Invalid Check-In Code

**Status Code**: `404 Not Found`

```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "message": "Invalid check-in code",
    "code": "INVALID_CODE",
    "details": "The provided check-in code does not match any session."
  }
}
```

### 8. Session Inactive

**Status Code**: `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Session inactive",
    "code": "SESSION_INACTIVE",
    "details": "This session is currently inactive."
  }
}
```

### 9. Check-In Disabled

**Status Code**: `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Check-in disabled",
    "code": "CHECKIN_DISABLED",
    "details": "Check-in has been disabled for this session."
  }
}
```

### 10. Check-In Not Started

**Status Code**: `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Check-in not started",
    "code": "CHECKIN_NOT_STARTED",
    "details": {
      "message": "Check-in has not started yet for this session.",
      "checkInStartTime": "2025-10-15T07:00:00.000Z",
      "sessionTitle": "Opening Ceremony"
    }
  }
}
```

### 11. Check-In Ended

**Status Code**: `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Check-in ended",
    "code": "CHECKIN_ENDED",
    "details": {
      "message": "Check-in window has ended for this session.",
      "checkInEndTime": "2025-10-15T11:00:00.000Z",
      "sessionTitle": "Opening Ceremony"
    }
  }
}
```

### 12. Event Blocked

**Status Code**: `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Event is blocked",
    "code": "EVENT_BLOCKED",
    "details": "This event has been blocked and check-in is not allowed."
  }
}
```

### 13. Event Not Published

**Status Code**: `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Event not published",
    "code": "EVENT_NOT_PUBLISHED",
    "details": "Check-in is only available for published events."
  }
}
```

---

## Response Code Reference

| Code | Description | Status |
|------|-------------|--------|
| `CHECKIN_SUCCESS` | Participant successfully checked in | Success |
| `PARTICIPANT_ALREADY_CHECKED_IN` | Participant was already checked in | Success (Idempotent) |
| `IDENTIFIER_REQUIRED` | Missing participantId or ticketCode | Error |
| `PARTICIPANT_NOT_FOUND` | Participant doesn't exist | Error |
| `REGISTRATION_CANCELLED` | Registration is cancelled | Error |
| `REGISTRATION_PENDING` | Registration is pending | Error |
| `PAYMENT_PENDING` | Payment not completed | Error |
| `PAYMENT_FAILED` | Payment has failed | Error |
| `INVALID_CODE` | Check-in code is invalid | Error |
| `SESSION_INACTIVE` | Session is not active | Error |
| `CHECKIN_DISABLED` | Check-in is disabled | Error |
| `CHECKIN_NOT_STARTED` | Check-in window hasn't started | Error |
| `CHECKIN_ENDED` | Check-in window has ended | Error |
| `EVENT_BLOCKED` | Event is blocked by admin | Error |
| `EVENT_NOT_PUBLISHED` | Event is not published | Error |

---

## Frontend Implementation Guide

### Basic Example (JavaScript/TypeScript)

```javascript
async function checkInParticipant(eventId, checkInCode, participantId) {
  try {
    const response = await fetch(
      `https://api.example.com/api/events/${eventId}/checkin/${checkInCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          participantId: participantId
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      // Check the response code
      if (data.code === 'CHECKIN_SUCCESS') {
        console.log('✅ Successfully checked in!');
        showSuccessMessage(data.data.participant.name);
      } else if (data.code === 'PARTICIPANT_ALREADY_CHECKED_IN') {
        console.log('ℹ️ Already checked in');
        showInfoMessage('Participant was already checked in');
      }
    } else {
      // Handle errors based on error code
      handleCheckInError(data.error.code, data.error.details);
    }

    return data;
  } catch (error) {
    console.error('Network error:', error);
    showErrorMessage('Unable to connect to server');
  }
}

function handleCheckInError(errorCode, details) {
  switch (errorCode) {
    case 'PAYMENT_PENDING':
      showErrorMessage('Payment is required before check-in');
      break;
    case 'CHECKIN_NOT_STARTED':
      showErrorMessage(`Check-in starts at ${details.checkInStartTime}`);
      break;
    case 'CHECKIN_ENDED':
      showErrorMessage('Check-in window has closed');
      break;
    case 'PARTICIPANT_NOT_FOUND':
      showErrorMessage('Invalid ticket or participant ID');
      break;
    default:
      showErrorMessage(details);
  }
}
```

### React Example

```jsx
import { useState } from 'react';

function CheckInForm({ eventId, checkInCode }) {
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/events/${eventId}/checkin/${checkInCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ ticketCode })
        }
      );

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Success handling
        if (data.code === 'CHECKIN_SUCCESS') {
          alert(`✅ ${data.data.participant.name} checked in successfully!`);
        } else if (data.code === 'PARTICIPANT_ALREADY_CHECKED_IN') {
          alert(`ℹ️ ${data.data.participant.name} was already checked in`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckIn}>
      <input
        type="text"
        value={ticketCode}
        onChange={(e) => setTicketCode(e.target.value)}
        placeholder="Enter ticket code"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Checking in...' : 'Check In'}
      </button>

      {result && !result.success && (
        <div className="error">
          {result.error.code}: {result.error.details}
        </div>
      )}
    </form>
  );
}
```

---

## Validation Rules

### Participant Eligibility
- ✅ Participant must exist in the database
- ✅ Participant status must be `confirmed`
- ✅ If payment exists, status must be `completed`
- ✅ Registration must not be cancelled

### Session Validation (Handled by Middleware)
- ✅ Event must exist and be published
- ✅ Event must not be blocked
- ✅ Session must match the check-in code
- ✅ Session must be active
- ✅ Check-in must be enabled for the session
- ✅ Current time must be within check-in window

### Time Window
- Check-in is only allowed between `checkInStartTime` and `checkInEndTime`
- These times are configured per session
- Times are validated by middleware before reaching the controller

---

## Notes for Frontend Developers

1. **Idempotency**: The API is idempotent - calling it multiple times with the same data won't cause errors. If a participant is already checked in, you'll receive a `200` response with code `PARTICIPANT_ALREADY_CHECKED_IN`.

2. **Payment Optional**: Some events may not require payment. The API handles this gracefully - payment validation only occurs if the payment object exists.

3. **Group Participants**: The response includes `groupInfo` and `isGroupLeader` fields for group registrations. Use these to display group-related information.

4. **Dynamic Fields**: Custom registration fields are returned in `dynamicFields` as a key-value map.

5. **Time Zones**: All timestamps are in UTC (ISO 8601 format). Convert to local time in your frontend.

6. **Error Handling**: Always check the `code` field in responses to determine the exact status and show appropriate UI messages.

7. **QR Code Scanning**: When implementing QR code scanning, extract the ticket code from the QR data and pass it as `ticketCode` in the request body.

---

## Testing

### Test Cases

1. **Successful Check-In**
   - Use a valid participant ID or ticket code
   - Ensure check-in window is open
   - Expected: `CHECKIN_SUCCESS`

2. **Duplicate Check-In**
   - Check in the same participant twice
   - Expected: `PARTICIPANT_ALREADY_CHECKED_IN` on second attempt

3. **Invalid Ticket Code**
   - Use a non-existent ticket code
   - Expected: `PARTICIPANT_NOT_FOUND`

4. **Pending Payment**
   - Use a participant with pending payment
   - Expected: `PAYMENT_PENDING`

5. **Outside Check-In Window**
   - Try to check in before/after the window
   - Expected: `CHECKIN_NOT_STARTED` or `CHECKIN_ENDED`

---

## Support

For questions or issues, please contact the backend team or create an issue in the repository.
