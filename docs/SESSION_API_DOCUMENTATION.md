# Event Session Management API Documentation

## Base URL
```
/events/admin/session
```

## Overview
The Session Management API provides comprehensive functionality for managing event sessions within the Event Management System (EMS). Sessions represent scheduled time blocks within an event, with support for single or multiple sessions per event.

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Session Data Structure](#session-data-structure)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Business Rules](#business-rules)
6. [Frontend Integration Guide](#frontend-integration-guide)
7. [AI Agent Instructions](#ai-agent-instructions)

---
  
## Authentication & Authorization

All endpoints require organization authentication with specific role permissions:

| Role | Add | View | Update | Delete | Toggle Multiple |
|------|-----|------|--------|--------|----------------|
| Owner | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manager | ❌ | ✅ | ❌ | ❌ | ❌ |
| Volunteer | ❌ | ✅ | ❌ | ❌ | ❌ |

### Headers Required
```javascript
{
  "Authorization": "Bearer <organization_token>",
  "Content-Type": "application/json"
}
```

---

## Session Data Structure

### Session Object
```typescript
interface Session {
  _id?: string;                    // Auto-generated MongoDB ObjectId
  title: string;                   // Required: Session name/title
  description?: string;            // Optional: Session description
  startTime: Date;                 // Required: ISO 8601 datetime
  endTime: Date;                   // Required: ISO 8601 datetime
  venue?: {                        // Required for offline/hybrid events
    name: string;                  // Venue name
    address: string;               // Street address
    city: string;                  // City name
    state: string;                 // State/Province
    country: string;               // Country name
    zipCode: string;               // Postal/ZIP code
  };
}
```

### Event Context Properties
```typescript
interface EventContext {
  allowMultipleSessions: boolean;  // Default: true
  maxSessions: number;            // Default: 7
  mode: "online" | "offline" | "hybrid";
  isPublished: boolean;
  isRegistrationOpen: boolean;
  isBlocked: boolean;
  sessions: Session[];
}
```

---

## API Endpoints

### 1. Add Session
Creates a new session for an event.

```http
POST /events/admin/session/:eventId
```

#### Request Body
```json
{
  "title": "Opening Ceremony",
  "description": "Welcome session for all participants",
  "startTime": "2025-09-15T09:00:00.000Z",
  "endTime": "2025-09-15T10:30:00.000Z",
  "venue": {
    "name": "Main Auditorium",
    "address": "123 Conference Center Dr",
    "city": "San Francisco",
    "state": "California",
    "country": "USA",
    "zipCode": "94102"
  }
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Session added successfully.",
  "session": {
    "_id": "64a5b2c8f1234567890abcde",
    "title": "Opening Ceremony",
    "description": "Welcome session for all participants",
    "startTime": "2025-09-15T09:00:00.000Z",
    "endTime": "2025-09-15T10:30:00.000Z",
    "venue": {
      "name": "Main Auditorium",
      "address": "123 Conference Center Dr",
      "city": "San Francisco",
      "state": "California",
      "country": "USA",
      "zipCode": "94102"
    }
  }
}
```

#### Error Responses
- **400**: Invalid session data, overlapping times, past dates
- **403**: Event blocked, registration open, multiple sessions not allowed
- **404**: Event not found

---

### 2. Get All Sessions
Retrieves all sessions for an event.

```http
GET /events/admin/session/:eventId
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Sessions retrieved successfully.",
  "sessions": [
    {
      "_id": "64a5b2c8f1234567890abcde",
      "title": "Opening Ceremony",
      "description": "Welcome session",
      "startTime": "2025-09-15T09:00:00.000Z",
      "endTime": "2025-09-15T10:30:00.000Z",
      "venue": {
        "name": "Main Auditorium",
        "address": "123 Conference Center Dr",
        "city": "San Francisco",
        "state": "California",
        "country": "USA",
        "zipCode": "94102"
      }
    }
  ]
}
```

---

### 3. Get Single Session
Retrieves a specific session by ID or title.

```http
GET /events/admin/session/:eventId/:sessionId
```

#### Parameters
- `sessionId`: Can be MongoDB ObjectId or session title

#### Success Response (200)
```json
{
  "success": true,
  "message": "Session retrieved successfully.",
  "session": {
    "_id": "64a5b2c8f1234567890abcde",
    "title": "Opening Ceremony",
    "description": "Welcome session",
    "startTime": "2025-09-15T09:00:00.000Z",
    "endTime": "2025-09-15T10:30:00.000Z",
    "venue": {
      "name": "Main Auditorium",
      "address": "123 Conference Center Dr",
      "city": "San Francisco",
      "state": "California",
      "country": "USA",
      "zipCode": "94102"
    }
  }
}
```

---

### 4. Update Session
Updates an existing session.

```http
PUT /events/admin/session/:eventId/:sessionId
```

#### Request Body
```json
{
  "title": "Updated Opening Ceremony",
  "description": "Updated welcome session",
  "startTime": "2025-09-15T09:30:00.000Z",
  "endTime": "2025-09-15T11:00:00.000Z"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Session updated successfully.",
  "session": {
    "_id": "64a5b2c8f1234567890abcde",
    "title": "Updated Opening Ceremony",
    "description": "Updated welcome session",
    "startTime": "2025-09-15T09:30:00.000Z",
    "endTime": "2025-09-15T11:00:00.000Z",
    "venue": {
      "name": "Main Auditorium",
      "address": "123 Conference Center Dr",
      "city": "San Francisco",
      "state": "California",
      "country": "USA",
      "zipCode": "94102"
    }
  }
}
```

#### Special Messages
- If tickets sold: "Session updated successfully, please notify participants about the changes."
- If event published: "Session updated successfully, please notify participants."

---

### 5. Delete Session
Removes a session from an event.

```http
DELETE /events/admin/session/:eventId/:sessionId
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Session deleted successfully!",
  "session": {
    "_id": "64a5b2c8f1234567890abcde",
    "title": "Opening Ceremony",
    "description": "Welcome session",
    "startTime": "2025-09-15T09:00:00.000Z",
    "endTime": "2025-09-15T10:30:00.000Z"
  }
}
```

#### Special Messages
- If tickets sold: "Session deleted successfully! Please notify participants about the cancellation."

---

### 6. Toggle Multiple Sessions
Enables or disables multiple sessions for an event.

```http
PUT /events/admin/session/:eventId/toggle-multiple-sessions
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Multiple sessions enabled successfully.",
  "allowMultipleSessions": true
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error description"
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `EVENT_ID_REQUIRED` | Missing event ID | 400 |
| `SESSION_TITLE_REQUIRED` | Missing session title | 400 |
| `SESSION_TIMES_REQUIRED` | Missing start/end times | 400 |
| `INVALID_SESSION_DATES` | Invalid date formats | 400 |
| `INVALID_SESSION_DURATION` | End time before start time | 400 |
| `SESSION_IN_PAST` | Session scheduled in past | 400 |
| `OVERLAPPING_SESSIONS` | Time conflicts with existing sessions | 400 |
| `VENUE_REQUIRED` | Missing venue for offline/hybrid events | 400 |
| `VENUE_FIELD_REQUIRED` | Missing required venue field | 400 |
| `EVENT_BLOCKED` | Event is blocked | 403 |
| `REGISTRATION_OPEN` | Cannot modify during open registration | 403 |
| `MULTIPLE_SESSIONS_NOT_ALLOWED` | Event doesn't allow multiple sessions | 403 |
| `MAX_SESSIONS_REACHED` | Exceeded maximum session limit | 403 |
| `SESSION_PAST_OR_ONGOING` | Cannot modify past/ongoing sessions | 403 |
| `ONLY_SESSION` | Cannot delete last session when multiple sessions disabled | 400 |
| `MULTIPLE_SESSIONS_EXIST` | Cannot disable multiple sessions when >1 exists | 403 |
| `SESSION_NOT_FOUND` | Session doesn't exist | 404 |

---

## Business Rules

### Session Validation Rules
1. **Title**: Required, non-empty string
2. **Time Validation**:
   - Start time must be before end time
   - Sessions cannot be scheduled in the past
   - No overlapping sessions allowed
3. **Venue Requirements** (offline/hybrid events):
   - All venue fields required: name, address, city, state, country, zipCode
4. **Session Limits**:
   - Maximum sessions per event: 7 (configurable)
   - Single session mode: only 1 session allowed
5. **Modification Restrictions**:
   - Cannot modify past or ongoing sessions
   - Cannot modify sessions when registration is open
   - Cannot modify sessions in blocked events

### Multiple Sessions Rules
1. **Enabling Multiple Sessions**:
   - Can only enable if current session is not past/ongoing
2. **Disabling Multiple Sessions**:
   - Can only disable if event has ≤1 session
   - Must remove extra sessions first
3. **Adding Sessions**:
   - Blocked if `allowMultipleSessions` is false and event has ≥1 session
   - Blocked if event has reached `maxSessions` limit

### Event State Restrictions
- **Blocked Events**: No session operations allowed
- **Open Registration**: No session modifications allowed
- **Published Events**: Operations allowed with participant notification warnings

---

## Frontend Integration Guide

### React Hook Example
```typescript
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface UseSessionsProps {
  eventId: string;
}

export const useSessions = ({ eventId }: UseSessionsProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/events/admin/session/${eventId}`);
      setSessions(response.data.sessions);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (sessionData: Omit<Session, '_id'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(`/events/admin/session/${eventId}`, sessionData);
      setSessions(prev => [...prev, response.data.session]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<Session>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/events/admin/session/${eventId}/${sessionId}`, updates);
      setSessions(prev => prev.map(s => 
        s._id === sessionId ? response.data.session : s
      ));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/events/admin/session/${eventId}/${sessionId}`);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleMultipleSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/events/admin/session/${eventId}/toggle-multiple-sessions`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle multiple sessions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchSessions();
    }
  }, [eventId]);

  return {
    sessions,
    loading,
    error,
    addSession,
    updateSession,
    deleteSession,
    toggleMultipleSessions,
    refetch: fetchSessions,
  };
};
```

### Form Validation Helper
```typescript
export const validateSession = (session: Session, eventMode: string): string[] => {
  const errors: string[] = [];

  if (!session.title?.trim()) {
    errors.push('Session title is required');
  }

  if (!session.startTime) {
    errors.push('Start time is required');
  }

  if (!session.endTime) {
    errors.push('End time is required');
  }

  if (session.startTime && session.endTime) {
    if (new Date(session.startTime) >= new Date(session.endTime)) {
      errors.push('End time must be after start time');
    }
    
    if (new Date(session.startTime) < new Date()) {
      errors.push('Session cannot be scheduled in the past');
    }
  }

  if ((eventMode === 'offline' || eventMode === 'hybrid') && session.venue) {
    const requiredVenueFields = ['name', 'address', 'city', 'state', 'country', 'zipCode'];
    for (const field of requiredVenueFields) {
      if (!session.venue[field]?.trim()) {
        errors.push(`Venue ${field} is required for ${eventMode} events`);
      }
    }
  }

  return errors;
};
```

### Component Example
```typescript
import React, { useState } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { validateSession } from '@/utils/validation';

interface SessionFormProps {
  eventId: string;
  eventMode: string;
  onSuccess?: () => void;
}

export const SessionForm: React.FC<SessionFormProps> = ({ 
  eventId, 
  eventMode, 
  onSuccess 
}) => {
  const { addSession, loading, error } = useSessions({ eventId });
  const [formData, setFormData] = useState<Omit<Session, '_id'>>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    venue: {
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateSession(formData, eventMode);
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      await addSession(formData);
      onSuccess?.();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <div>
        <label htmlFor="title">Session Title *</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime">Start Time *</label>
          <input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label htmlFor="endTime">End Time *</label>
          <input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            required
          />
        </div>
      </div>

      {(eventMode === 'offline' || eventMode === 'hybrid') && (
        <div className="space-y-4">
          <h3>Venue Information</h3>
          
          <div>
            <label htmlFor="venueName">Venue Name *</label>
            <input
              id="venueName"
              type="text"
              value={formData.venue.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                venue: { ...prev.venue, name: e.target.value }
              }))}
              required
            />
          </div>

          <div>
            <label htmlFor="venueAddress">Address *</label>
            <input
              id="venueAddress"
              type="text"
              value={formData.venue.address}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                venue: { ...prev.venue, address: e.target.value }
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="venueCity">City *</label>
              <input
                id="venueCity"
                type="text"
                value={formData.venue.city}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  venue: { ...prev.venue, city: e.target.value }
                }))}
                required
              />
            </div>
            
            <div>
              <label htmlFor="venueState">State *</label>
              <input
                id="venueState"
                type="text"
                value={formData.venue.state}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  venue: { ...prev.venue, state: e.target.value }
                }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="venueCountry">Country *</label>
              <input
                id="venueCountry"
                type="text"
                value={formData.venue.country}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  venue: { ...prev.venue, country: e.target.value }
                }))}
                required
              />
            </div>
            
            <div>
              <label htmlFor="venueZipCode">ZIP Code *</label>
              <input
                id="venueZipCode"
                type="text"
                value={formData.venue.zipCode}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  venue: { ...prev.venue, zipCode: e.target.value }
                }))}
                required
              />
            </div>
          </div>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Adding Session...' : 'Add Session'}
      </button>
    </form>
  );
};
```

---

## AI Agent Instructions

### For Building Session Management Systems

#### Core Requirements Understanding
1. **Event Context**: Always understand the event's `mode` (online/offline/hybrid), `allowMultipleSessions`, and `maxSessions` settings
2. **Time Management**: Implement proper datetime handling with timezone awareness
3. **Validation Layer**: Implement comprehensive client-side validation before API calls
4. **State Management**: Maintain session list state with proper updates after operations

#### Implementation Guidelines

##### 1. Data Fetching Strategy
```typescript
// Always fetch sessions when component mounts or event changes
useEffect(() => {
  if (eventId) {
    fetchSessions();
  }
}, [eventId]);

// Implement loading states and error handling
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

##### 2. Form Validation Pattern
```typescript
// Validate before submission
const validateAndSubmit = async (sessionData: Session) => {
  // 1. Client-side validation
  const errors = validateSession(sessionData, eventMode);
  if (errors.length > 0) {
    setError(errors.join('. '));
    return;
  }

  // 2. API call with error handling
  try {
    await addSession(sessionData);
    onSuccess?.();
  } catch (err) {
    // Handle API errors
    setError(err.response?.data?.message || 'Operation failed');
  }
};
```

##### 3. State Update Pattern
```typescript
// Optimistic updates with rollback on error
const updateSessionOptimistically = async (sessionId: string, updates: Partial<Session>) => {
  // Optimistic update
  setSessions(prev => prev.map(s => 
    s._id === sessionId ? { ...s, ...updates } : s
  ));

  try {
    const response = await api.put(`/events/admin/session/${eventId}/${sessionId}`, updates);
    // Confirm with server response
    setSessions(prev => prev.map(s => 
      s._id === sessionId ? response.data.session : s
    ));
  } catch (err) {
    // Rollback on error
    fetchSessions();
    throw err;
  }
};
```

##### 4. UI/UX Considerations
- **Loading States**: Show loading indicators during operations
- **Error Display**: Clear, actionable error messages
- **Confirmation Dialogs**: For destructive operations (delete)
- **Auto-sorting**: Sessions should be displayed chronologically
- **Real-time Updates**: Reflect changes immediately in UI

##### 5. Venue Handling for Offline/Hybrid Events
```typescript
// Conditionally render venue fields
{(eventMode === 'offline' || eventMode === 'hybrid') && (
  <VenueForm 
    venue={sessionData.venue}
    onChange={(venueData) => setSessionData(prev => ({ 
      ...prev, 
      venue: venueData 
    }))}
  />
)}
```

##### 6. DateTime Best Practices
```typescript
// Use proper datetime input formatting
const formatDateTimeLocal = (date: string | Date) => {
  return new Date(date).toISOString().slice(0, 16);
};

// Validate datetime constraints
const isValidSessionTime = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  
  return start > now && end > start;
};
```

#### Common Pitfalls to Avoid
1. **Not handling timezone differences** - Always use ISO 8601 format
2. **Missing venue validation** for offline/hybrid events
3. **Not implementing proper error boundaries**
4. **Forgetting to sort sessions chronologically**
5. **Not handling edge cases** (single session deletion, multiple session toggle)
6. **Missing loading states** during async operations

#### Testing Checklist
- [ ] Add session with valid data
- [ ] Add session with invalid data (validation errors)
- [ ] Add overlapping sessions (should fail)
- [ ] Update session (past vs future sessions)
- [ ] Delete session (single vs multiple session events)
- [ ] Toggle multiple sessions (with existing sessions)
- [ ] Handle blocked events
- [ ] Handle open registration restrictions
- [ ] Test venue requirements for offline/hybrid events
- [ ] Test datetime validation (past dates, end before start)

#### API Integration Pattern
```typescript
// Centralized API service
class SessionAPI {
  constructor(private baseURL: string) {}

  async addSession(eventId: string, sessionData: Omit<Session, '_id'>) {
    return this.request('POST', `/events/admin/session/${eventId}`, sessionData);
  }

  async getSessions(eventId: string) {
    return this.request('GET', `/events/admin/session/${eventId}`);
  }

  async updateSession(eventId: string, sessionId: string, updates: Partial<Session>) {
    return this.request('PUT', `/events/admin/session/${eventId}/${sessionId}`, updates);
  }

  async deleteSession(eventId: string, sessionId: string) {
    return this.request('DELETE', `/events/admin/session/${eventId}/${sessionId}`);
  }

  async toggleMultipleSessions(eventId: string) {
    return this.request('PUT', `/events/admin/session/${eventId}/toggle-multiple-sessions`);
  }

  private async request(method: string, url: string, data?: any) {
    // Implementation with error handling, retries, etc.
  }
}
```

This documentation provides complete guidance for implementing session management functionality. Follow the patterns and examples for consistent, robust implementation.
