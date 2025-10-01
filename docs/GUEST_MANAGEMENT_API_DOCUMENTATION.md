# Event Guest Speaker Management API Documentation

## Base URL
```
/event/admin/guest
```

## Overview
The Guest Speaker Management API provides comprehensive functionality for managing guest speakers within events in the Event Management System (EMS). Guest speakers are notable individuals who participate in events, with support for biographical information, photos, and social media links.

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Guest Speaker Data Structure](#guest-speaker-data-structure)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Business Rules](#business-rules)
6. [Frontend Integration Guide](#frontend-integration-guide)
7. [AI Agent Instructions](#ai-agent-instructions)

---

## Authentication & Authorization

All endpoints require organization authentication with specific role permissions:

| Role | Add | View | Update | Delete |
|------|-----|------|--------|--------|
| Owner | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ |
| Manager | ❌ | ✅ | ❌ | ❌ |
| Volunteer | ❌ | ✅ | ❌ | ❌ |

### Headers Required
```javascript
{
  "Authorization": "Bearer <organization_token>",
  "Content-Type": "application/json"
}
```

---

## Guest Speaker Data Structure

### Guest Speaker Object
```typescript
interface GuestSpeaker {
  _id?: string;                    // Auto-generated MongoDB ObjectId
  name: string;                    // Required: Speaker's full name
  bio?: string;                    // Optional: Speaker biography/description
  photoUrl?: string;               // Optional: Speaker's photo URL
  socialLinks?: {                  // Optional: Social media links
    [platform: string]: string;   // Key-value pairs: platform -> URL
  };
  createdAt?: Date;               // Auto-generated timestamp
  updatedAt?: Date;               // Auto-generated timestamp
}
```

### Supported Social Platforms
```typescript
type SocialPlatform = 
  | 'instagram'
  | 'youtube' 
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'website';
```

### Event Context Properties
```typescript
interface EventContext {
  guestSpeakers: GuestSpeaker[];  // Array of guest speakers
  isBlocked: boolean;
  isPublished: boolean;
  isRegistrationOpen: boolean;
  tickets: Array<{
    sold: number;
    // ... other ticket properties
  }>;
}
```

---

## API Endpoints

### 1. Add Guest Speaker
Creates a new guest speaker for an event.

```http
POST /event/admin/guest/:eventId
```

#### Request Body
```json
{
  "name": "Dr. Jane Smith",
  "bio": "Renowned expert in artificial intelligence with over 15 years of experience in machine learning and data science.",
  "photoUrl": "https://example.com/photos/jane-smith.jpg",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/janesmith",
    "twitter": "https://twitter.com/janesmith",
    "website": "https://janesmith.com"
  }
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Guest speaker added successfully.",
  "guest": {
    "_id": "64a5b2c8f1234567890abcde",
    "name": "Dr. Jane Smith",
    "bio": "Renowned expert in artificial intelligence with over 15 years of experience in machine learning and data science.",
    "photoUrl": "https://example.com/photos/jane-smith.jpg",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/janesmith",
      "twitter": "https://twitter.com/janesmith",
      "website": "https://janesmith.com"
    },
    "createdAt": "2025-08-23T10:30:00.000Z",
    "updatedAt": "2025-08-23T10:30:00.000Z"
  }
}
```

#### Error Responses
- **400**: Missing required fields, duplicate speaker name, invalid social links
- **403**: Event blocked, registration open, maximum speakers reached (10)
- **404**: Event not found

---

### 2. Get All Guest Speakers
Retrieves all guest speakers for an event.

```http
GET /event/admin/guest/:eventId
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Guest speakers retrieved successfully.",
  "guests": [
    {
      "_id": "64a5b2c8f1234567890abcde",
      "name": "Dr. Jane Smith",
      "bio": "Renowned expert in artificial intelligence",
      "photoUrl": "https://example.com/photos/jane-smith.jpg",
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/janesmith",
        "twitter": "https://twitter.com/janesmith",
        "website": "https://janesmith.com"
      },
      "createdAt": "2025-08-23T10:30:00.000Z",
      "updatedAt": "2025-08-23T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Guest Speaker
Retrieves a specific guest speaker by ID or name.

```http
GET /event/admin/guest/:eventId/:speakerId
```

#### Parameters
- `speakerId`: Can be MongoDB ObjectId or speaker name

#### Success Response (200)
```json
{
  "success": true,
  "message": "Guest speaker retrieved successfully.",
  "guest": {
    "_id": "64a5b2c8f1234567890abcde",
    "name": "Dr. Jane Smith",
    "bio": "Renowned expert in artificial intelligence",
    "photoUrl": "https://example.com/photos/jane-smith.jpg",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/janesmith",
      "twitter": "https://twitter.com/janesmith",
      "website": "https://janesmith.com"
    },
    "createdAt": "2025-08-23T10:30:00.000Z",
    "updatedAt": "2025-08-23T10:30:00.000Z"
  }
}
```

---

### 4. Update Guest Speaker
Updates an existing guest speaker.

```http
PUT /event/admin/guest/:eventId/:speakerId
```

#### Request Body
```json
{
  "name": "Dr. Jane Smith PhD",
  "bio": "Updated biography with more recent achievements...",
  "photoUrl": "https://example.com/photos/jane-smith-new.jpg",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/janesmithphd",
    "twitter": "https://twitter.com/janesmithphd",
    "website": "https://janesmithphd.com",
    "instagram": "https://instagram.com/drjanesmith"
  }
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Guest speaker updated successfully.",
  "guest": {
    "_id": "64a5b2c8f1234567890abcde",
    "name": "Dr. Jane Smith PhD",
    "bio": "Updated biography with more recent achievements...",
    "photoUrl": "https://example.com/photos/jane-smith-new.jpg",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/janesmithphd",
      "twitter": "https://twitter.com/janesmithphd",
      "website": "https://janesmithphd.com",
      "instagram": "https://instagram.com/drjanesmith"
    },
    "updatedAt": "2025-08-23T11:00:00.000Z"
  }
}
```

#### Special Messages
- If tickets sold: "Guest speaker updated successfully, You can notify participants about the changes."

---

### 5. Delete Guest Speaker
Removes a guest speaker from an event.

```http
DELETE /event/admin/guest/:eventId/:speakerId
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Guest speaker deleted successfully!",
  "guest": {
    "_id": "64a5b2c8f1234567890abcde",
    "name": "Dr. Jane Smith",
    "bio": "Renowned expert in artificial intelligence",
    "photoUrl": "https://example.com/photos/jane-smith.jpg",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/janesmith",
      "twitter": "https://twitter.com/janesmith"
    }
  }
}
```

#### Special Messages
- If tickets sold: "Guest speaker deleted successfully! You can notify participants about this change."

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
| `SPEAKER_NAME_REQUIRED` | Missing speaker name | 400 |
| `EVENT_SPEAKER_ID_REQUIRED` | Missing event or speaker ID | 400 |
| `SPEAKER_ALREADY_EXISTS` | Duplicate speaker name | 400 |
| `SPEAKER_NAME_EXISTS` | Speaker name already taken during update | 400 |
| `INVALID_SOCIAL_LINK` | Invalid social media URL format | 400 |
| `EVENT_BLOCKED` | Event is blocked | 403 |
| `REGISTRATION_OPEN` | Cannot modify during open registration | 403 |
| `MAX_GUEST_SPEAKERS` | Maximum 10 guest speakers limit reached | 403 |
| `EVENT_NOT_FOUND` | Event doesn't exist | 404 |
| `SPEAKER_NOT_FOUND` | Speaker doesn't exist | 404 |

---

## Business Rules

### Guest Speaker Validation Rules
1. **Name**: Required, must be unique within the event
2. **Bio**: Optional but recommended for better participant engagement
3. **Photo URL**: Optional, should be a valid image URL
4. **Social Links**: 
   - Must start with "http" or "https"
   - Platform names are case-insensitive
   - Duplicate platforms not allowed per speaker
5. **Limits**:
   - Maximum 10 guest speakers per event
   - Name uniqueness enforced per event

### Social Links Validation
```javascript
// Valid social link examples
{
  "instagram": "https://instagram.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "twitter": "https://twitter.com/username",
  "facebook": "https://facebook.com/username",
  "youtube": "https://youtube.com/c/channelname",
  "tiktok": "https://tiktok.com/@username",
  "website": "https://example.com"
}

// Invalid examples (will be rejected)
{
  "instagram": "instagram.com/username",      // Missing protocol
  "linkedin": "www.linkedin.com/in/username", // Missing protocol
  "twitter": ""                               // Empty string
}
```

### Event State Restrictions
- **Blocked Events**: No guest speaker operations allowed
- **Open Registration**: No guest speaker modifications allowed (add/update/delete)
- **Published Events**: Operations allowed with participant notification warnings

### Modification Rules
1. **Adding Speakers**:
   - Not allowed if event is blocked
   - Not allowed during open registration
   - Not allowed if maximum limit (10) reached
   - Speaker name must be unique
2. **Updating Speakers**:
   - Not allowed if event is blocked
   - Not allowed during open registration for published events
   - New name must be unique (if changing name)
3. **Deleting Speakers**:
   - Same restrictions as updating
   - No minimum speaker requirement

---

## Frontend Integration Guide

### React Hook Example
```typescript
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface UseGuestSpeakersProps {
  eventId: string;
}

export const useGuestSpeakers = ({ eventId }: UseGuestSpeakersProps) => {
  const [speakers, setSpeakers] = useState<GuestSpeaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/event/admin/guest/${eventId}`);
      setSpeakers(response.data.guests);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch guest speakers');
    } finally {
      setLoading(false);
    }
  };

  const addSpeaker = async (speakerData: Omit<GuestSpeaker, '_id'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(`/event/admin/guest/${eventId}`, speakerData);
      setSpeakers(prev => [...prev, response.data.guest]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add guest speaker');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSpeaker = async (speakerId: string, updates: Partial<GuestSpeaker>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/event/admin/guest/${eventId}/${speakerId}`, updates);
      setSpeakers(prev => prev.map(s => 
        s._id === speakerId ? response.data.guest : s
      ));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update guest speaker');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSpeaker = async (speakerId: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/event/admin/guest/${eventId}/${speakerId}`);
      setSpeakers(prev => prev.filter(s => s._id !== speakerId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete guest speaker');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchSpeakers();
    }
  }, [eventId]);

  return {
    speakers,
    loading,
    error,
    addSpeaker,
    updateSpeaker,
    deleteSpeaker,
    refetch: fetchSpeakers,
  };
};
```

### Form Validation Helper
```typescript
export const validateGuestSpeaker = (speaker: GuestSpeaker): string[] => {
  const errors: string[] = [];

  if (!speaker.name?.trim()) {
    errors.push('Speaker name is required');
  }

  if (speaker.socialLinks) {
    for (const [platform, url] of Object.entries(speaker.socialLinks)) {
      if (url && (!url.startsWith('http://') && !url.startsWith('https://'))) {
        errors.push(`${platform} link must start with http:// or https://`);
      }
    }
  }

  if (speaker.photoUrl && speaker.photoUrl.trim() && !isValidUrl(speaker.photoUrl)) {
    errors.push('Photo URL must be a valid URL');
  }

  return errors;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Social Links Manager Component
```typescript
interface SocialLinksManagerProps {
  socialLinks: { [platform: string]: string };
  onChange: (links: { [platform: string]: string }) => void;
  disabled?: boolean;
}

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  socialLinks,
  onChange,
  disabled = false
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [url, setUrl] = useState('');

  const socialPlatforms = [
    'instagram', 'youtube', 'twitter', 'facebook', 
    'linkedin', 'tiktok', 'website'
  ];

  const addSocialLink = () => {
    if (!url.trim() || !selectedPlatform) return;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('URL must start with http:// or https://');
      return;
    }

    onChange({
      ...socialLinks,
      [selectedPlatform]: url
    });
    
    setUrl('');
  };

  const removeSocialLink = (platform: string) => {
    const newLinks = { ...socialLinks };
    delete newLinks[platform];
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select 
          value={selectedPlatform} 
          onChange={(e) => setSelectedPlatform(e.target.value)}
          disabled={disabled}
          className="border rounded px-3 py-2"
        >
          {socialPlatforms.map(platform => (
            <option key={platform} value={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </option>
          ))}
        </select>
        
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`Enter ${selectedPlatform} URL`}
          disabled={disabled}
          className="flex-1 border rounded px-3 py-2"
        />
        
        <button
          type="button"
          onClick={addSocialLink}
          disabled={disabled || !url.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(socialLinks).map(([platform, url]) => (
          <div 
            key={platform}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
          >
            <span className="text-sm font-medium">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}:
            </span>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline max-w-[200px] truncate"
            >
              {url}
            </a>
            <button
              type="button"
              onClick={() => removeSocialLink(platform)}
              disabled={disabled}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Complete Guest Speaker Form Component
```typescript
import React, { useState } from 'react';
import { useGuestSpeakers } from '@/hooks/useGuestSpeakers';
import { validateGuestSpeaker } from '@/utils/validation';
import { SocialLinksManager } from './SocialLinksManager';

interface GuestSpeakerFormProps {
  eventId: string;
  editingSpeaker?: GuestSpeaker | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GuestSpeakerForm: React.FC<GuestSpeakerFormProps> = ({
  eventId,
  editingSpeaker,
  onSuccess,
  onCancel
}) => {
  const { addSpeaker, updateSpeaker, loading, error } = useGuestSpeakers({ eventId });
  const [formData, setFormData] = useState<Omit<GuestSpeaker, '_id'>>({
    name: editingSpeaker?.name || '',
    bio: editingSpeaker?.bio || '',
    photoUrl: editingSpeaker?.photoUrl || '',
    socialLinks: editingSpeaker?.socialLinks || {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateGuestSpeaker(formData);
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      if (editingSpeaker?._id) {
        await updateSpeaker(editingSpeaker._id, formData);
      } else {
        await addSpeaker(formData);
      }
      onSuccess?.();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handlePhotoUpload = async (file: File) => {
    // Implementation for photo upload
    const formData = new FormData();
    formData.append('folder', 'guest_photo');
    formData.append('type', 'img');
    formData.append('file', file);
    
    try {
      const response = await api.post('/util/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (response.data?.file?.url) {
        setFormData(prev => ({ ...prev, photoUrl: response.data.file.url }));
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded">{error}</div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          disabled={loading}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter speaker's full name"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Biography
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          disabled={loading}
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter speaker's biography, achievements, etc."
        />
      </div>

      <div>
        <label htmlFor="photoUrl" className="block text-sm font-medium mb-1">
          Photo
        </label>
        <div className="space-y-2">
          <input
            id="photoUrl"
            type="url"
            value={formData.photoUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
            disabled={loading}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter photo URL or upload below"
          />
          
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoUpload(file);
            }}
            disabled={loading}
            className="block"
          />
          
          {formData.photoUrl && (
            <img 
              src={formData.photoUrl} 
              alt="Speaker preview" 
              className="w-20 h-20 object-cover rounded-full border"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Social Media Links
        </label>
        <SocialLinksManager
          socialLinks={formData.socialLinks || {}}
          onChange={(links) => setFormData(prev => ({ ...prev, socialLinks: links }))}
          disabled={loading}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading 
            ? (editingSpeaker ? 'Updating...' : 'Adding...') 
            : (editingSpeaker ? 'Update Speaker' : 'Add Speaker')
          }
        </button>
      </div>
    </form>
  );
};
```

---

## AI Agent Instructions

### For Building Guest Speaker Management Systems

#### Core Requirements Understanding
1. **Event Context**: Always understand the event's state (`isBlocked`, `isRegistrationOpen`, `isPublished`)
2. **Speaker Limits**: Maximum 10 guest speakers per event
3. **Unique Names**: Speaker names must be unique within each event
4. **Social Links Validation**: All social links must start with http:// or https://
5. **State Management**: Maintain speaker list state with proper updates after operations

#### Implementation Guidelines

##### 1. Data Fetching Strategy
```typescript
// Always fetch speakers when component mounts or event changes
useEffect(() => {
  if (eventId) {
    fetchSpeakers();
  }
}, [eventId]);

// Implement loading states and error handling
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

##### 2. Form Validation Pattern
```typescript
// Validate before submission
const validateAndSubmit = async (speakerData: GuestSpeaker) => {
  // 1. Client-side validation
  const errors = validateGuestSpeaker(speakerData);
  if (errors.length > 0) {
    setError(errors.join('. '));
    return;
  }

  // 2. Check for duplicate names
  const existingSpeaker = speakers.find(s => 
    s.name.toLowerCase() === speakerData.name.toLowerCase() && 
    s._id !== editingSpeaker?._id
  );
  if (existingSpeaker) {
    setError('Speaker name already exists');
    return;
  }

  // 3. API call with error handling
  try {
    await addSpeaker(speakerData);
    onSuccess?.();
  } catch (err) {
    // Handle API errors
    setError(err.response?.data?.message || 'Operation failed');
  }
};
```

##### 3. Social Links Management
```typescript
// Handle social links as key-value pairs
const addSocialLink = (platform: string, url: string) => {
  // Validate URL format
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    setError('Social links must start with http:// or https://');
    return;
  }

  setSpeakerData(prev => ({
    ...prev,
    socialLinks: {
      ...prev.socialLinks,
      [platform]: url
    }
  }));
};

const removeSocialLink = (platform: string) => {
  setSpeakerData(prev => {
    const newLinks = { ...prev.socialLinks };
    delete newLinks[platform];
    return { ...prev, socialLinks: newLinks };
  });
};
```

##### 4. Photo Upload Integration
```typescript
// Handle photo upload with proper error handling
const handlePhotoUpload = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    setError('Please select a valid image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    setError('Image size must be less than 5MB');
    return;
  }

  setUploadingPhoto(true);
  try {
    const formData = new FormData();
    formData.append('folder', 'guest_photo');
    formData.append('type', 'img');
    formData.append('file', file);

    const response = await api.post('/util/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data?.file?.url) {
      setSpeakerData(prev => ({ ...prev, photoUrl: response.data.file.url }));
    }
  } catch (err) {
    setError('Photo upload failed');
  } finally {
    setUploadingPhoto(false);
  }
};
```

##### 5. State Update Pattern
```typescript
// Optimistic updates with rollback on error
const updateSpeakerOptimistically = async (speakerId: string, updates: Partial<GuestSpeaker>) => {
  // Optimistic update
  setSpeakers(prev => prev.map(s => 
    s._id === speakerId ? { ...s, ...updates } : s
  ));

  try {
    const response = await api.put(`/event/admin/guest/${eventId}/${speakerId}`, updates);
    // Confirm with server response
    setSpeakers(prev => prev.map(s => 
      s._id === speakerId ? response.data.guest : s
    ));
  } catch (err) {
    // Rollback on error
    fetchSpeakers();
    throw err;
  }
};
```

##### 6. UI/UX Considerations
- **Loading States**: Show loading indicators during operations
- **Error Display**: Clear, actionable error messages
- **Confirmation Dialogs**: For destructive operations (delete)
- **Photo Preview**: Show uploaded/selected photos immediately
- **Social Links Display**: Make links clickable with proper external link handling
- **Character Limits**: Consider bio length limits in UI

#### Common Pitfalls to Avoid
1. **Not validating social link URLs** - Always check for proper protocol
2. **Missing duplicate name validation** - Check existing speakers before adding/updating
3. **Not handling photo upload errors** - Implement proper error handling and file type validation
4. **Ignoring speaker limits** - Check maximum 10 speakers limit before adding
5. **Not handling edge cases** - Empty social links, malformed URLs, large files
6. **Missing loading states** during async operations
7. **Not implementing proper error boundaries**

#### Testing Checklist
- [ ] Add speaker with valid data
- [ ] Add speaker with invalid data (validation errors)
- [ ] Add speaker with duplicate name (should fail)
- [ ] Add speaker when limit reached (should fail)
- [ ] Update speaker with valid changes
- [ ] Update speaker with duplicate name (should fail)
- [ ] Delete speaker
- [ ] Handle blocked events
- [ ] Handle open registration restrictions
- [ ] Test social links validation (missing protocol, invalid URLs)
- [ ] Test photo upload (valid images, invalid files, size limits)
- [ ] Test error handling and recovery

#### API Integration Pattern
```typescript
// Centralized API service
class GuestSpeakerAPI {
  constructor(private baseURL: string) {}

  async addSpeaker(eventId: string, speakerData: Omit<GuestSpeaker, '_id'>) {
    return this.request('POST', `/event/admin/guest/${eventId}`, speakerData);
  }

  async getSpeakers(eventId: string) {
    return this.request('GET', `/event/admin/guest/${eventId}`);
  }

  async updateSpeaker(eventId: string, speakerId: string, updates: Partial<GuestSpeaker>) {
    return this.request('PUT', `/event/admin/guest/${eventId}/${speakerId}`, updates);
  }

  async deleteSpeaker(eventId: string, speakerId: string) {
    return this.request('DELETE', `/event/admin/guest/${eventId}/${speakerId}`);
  }

  private async request(method: string, url: string, data?: any) {
    // Implementation with error handling, retries, etc.
  }
}
```

#### Social Platform Specific Validations
```typescript
const validateSocialPlatform = (platform: string, url: string): boolean => {
  const validators = {
    instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/,
    facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
    youtube: /^https?:\/\/(www\.)?youtube\.com\/.+/,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
    website: /^https?:\/\/.+\..+/,
  };

  return validators[platform]?.test(url) || /^https?:\/\/.+/.test(url);
};
```

This documentation provides complete guidance for implementing guest speaker management functionality. Follow the patterns and examples for consistent, robust implementation that handles all edge cases and provides excellent user experience.
