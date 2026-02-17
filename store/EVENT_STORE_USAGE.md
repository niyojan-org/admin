# Event Creation Store - Usage Guide

## Overview
The `eventCreationStore` is a Zustand store with localStorage persistence that manages event creation drafts. It automatically saves drafts to browser storage and provides comprehensive methods for managing events, sessions, tickets, custom fields, and coupons.

## Import

```javascript
import { useEventCreationStore } from "@/store/eventCreationStore";
// or use the custom hook
import { useEventForm } from "@/app/events/create/hooks/useEventForm";
```

## Features

- ✅ Browser storage persistence (localStorage)
- ✅ Auto-save every 30 seconds
- ✅ Draft validation
- ✅ Session, ticket, custom field, and coupon management
- ✅ Unsaved changes tracking
- ✅ Complete CRUD operations for all nested entities

## Basic Usage

### Using the Custom Hook (Recommended)

```javascript
import { useEventForm } from "@/app/events/create/hooks/useEventForm";

function EventCreationForm() {
  const {
    eventDraft,
    isDraftSaved,
    lastSavedAt,
    updateField,
    updateFields,
    sessions,
    tickets,
    customFields,
    coupons,
    saveDraft,
    clearDraft,
    hasUnsavedChanges,
    handleSubmit,
  } = useEventForm();

  // Update basic field
  const handleTitleChange = (e) => {
    updateField("title", e.target.value);
  };

  // Update multiple fields
  const handleBulkUpdate = () => {
    updateFields({
      mode: "hybrid",
      visibility: "public",
      allowCoupons: true,
    });
  };

  // Add a session
  const handleAddSession = () => {
    sessions.add({
      title: "New Session",
      description: "Session description",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      venue: {
        name: "Main Hall",
        city: "San Francisco",
        state: "California",
        country: "USA",
      },
    });
  };

  // Update a session
  const handleUpdateSession = (index) => {
    sessions.update(index, {
      title: "Updated Session Title",
    });
  };

  // Add a ticket
  const handleAddTicket = () => {
    tickets.add({
      type: "Early Bird",
      price: 99.99,
      capacity: 100,
      salesStartTime: new Date().toISOString(),
      isActive: true,
    });
  };

  // Submit the form
  const handleFormSubmit = async () => {
    const result = await handleSubmit();
    
    if (result.success) {
      // Submit to API
      console.log("Event data:", result.data);
      // await api.post("/events", result.data);
    } else {
      console.error("Validation errors:", result.errors);
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      
      <input
        type="text"
        value={eventDraft.title}
        onChange={handleTitleChange}
        placeholder="Event Title"
      />

      <textarea
        value={eventDraft.description}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="Event Description"
      />

      {/* Draft status */}
      <div>
        {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
        {lastSavedAt && ` - Last saved: ${new Date(lastSavedAt).toLocaleString()}`}
      </div>

      {/* Sessions */}
      <button onClick={handleAddSession}>Add Session</button>
      {eventDraft.sessions.map((session, index) => (
        <div key={index}>
          <input
            value={session.title}
            onChange={(e) => sessions.update(index, { title: e.target.value })}
          />
          <button onClick={() => sessions.remove(index)}>Remove</button>
        </div>
      ))}

      {/* Tickets */}
      <button onClick={handleAddTicket}>Add Ticket</button>
      {eventDraft.tickets.map((ticket, index) => (
        <div key={index}>
          <input
            value={ticket.type}
            onChange={(e) => tickets.update(index, { type: e.target.value })}
          />
          <input
            type="number"
            value={ticket.price}
            onChange={(e) => tickets.update(index, { price: parseFloat(e.target.value) })}
          />
          <button onClick={() => tickets.remove(index)}>Remove</button>
        </div>
      ))}

      {/* Actions */}
      <button onClick={saveDraft}>Save Draft</button>
      <button onClick={clearDraft}>Clear Draft</button>
      <button onClick={handleFormSubmit}>Submit Event</button>
    </div>
  );
}
```

### Direct Store Usage

```javascript
import { useEventCreationStore } from "@/store/eventCreationStore";

function MyComponent() {
  const {
    eventDraft,
    updateEventField,
    addSession,
    saveDraft,
  } = useEventCreationStore();

  return (
    <div>
      <input
        value={eventDraft.title}
        onChange={(e) => updateEventField("title", e.target.value)}
      />
      <button onClick={saveDraft}>Save</button>
    </div>
  );
}
```

## API Reference

### State Properties

- `eventDraft`: Object - Current event draft data
- `isDraftSaved`: Boolean - Whether draft has been saved
- `lastSavedAt`: String - ISO timestamp of last save
- `draftId`: String - Unique identifier for the draft

### Methods

#### Basic Field Updates

- `updateEventField(field, value)` - Update a single field
- `updateEventFields(fields)` - Update multiple fields at once
- `setEventDraft(eventData)` - Replace entire draft

#### Session Management

- `addSession(session?)` - Add new session (optional data)
- `updateSession(index, sessionData)` - Update session at index
- `removeSession(index)` - Remove session at index

#### Ticket Management

- `addTicket(ticket?)` - Add new ticket
- `updateTicket(index, ticketData)` - Update ticket at index
- `removeTicket(index)` - Remove ticket at index

#### Custom Field Management

- `addCustomField(field?)` - Add new custom field
- `updateCustomField(index, fieldData)` - Update custom field at index
- `removeCustomField(index)` - Remove custom field at index

#### Coupon Management

- `addCoupon(coupon?)` - Add new coupon
- `updateCoupon(index, couponData)` - Update coupon at index
- `removeCoupon(index)` - Remove coupon at index

#### Draft Operations

- `saveDraft()` - Mark draft as saved with timestamp
- `loadDraft(draftData)` - Load existing draft
- `clearDraft()` - Clear draft and reset to initial state
- `resetStore()` - Reset entire store
- `getDraft()` - Get current draft object
- `hasUnsavedChanges()` - Check if there are unsaved changes
- `validateDraft()` - Validate draft and return errors

## Example: Complete Event Form

```javascript
import { useEventForm } from "@/app/events/create/hooks/useEventForm";
import { useEffect } from "react";

export default function CreateEventPage() {
  const {
    eventDraft,
    updateField,
    sessions,
    tickets,
    customFields,
    coupons,
    saveDraft,
    handleSubmit,
    hasUnsavedChanges,
  } = useEventForm();

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCreateEvent = async () => {
    const result = await handleSubmit();
    
    if (result.success) {
      try {
        // Submit to your API
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
        
        if (response.ok) {
          toast.success("Event created successfully!");
          clearDraft();
          router.push("/events");
        }
      } catch (error) {
        toast.error("Failed to create event");
      }
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleCreateEvent(); }}>
      {/* Your form fields here */}
      <button type="submit">Create Event</button>
      <button type="button" onClick={saveDraft}>Save Draft</button>
    </form>
  );
}
```

## LocalStorage Structure

The store saves data to localStorage with key: `event-creation-storage`

```json
{
  "state": {
    "eventDraft": { /* event data */ },
    "isDraftSaved": true,
    "lastSavedAt": "2026-01-18T10:30:00.000Z",
    "draftId": "draft_1737195000000"
  },
  "version": 0
}
```

## Tips

1. **Auto-save**: The custom hook automatically saves every 30 seconds
2. **Validation**: Always call `validateDraft()` or `handleSubmit()` before submitting
3. **Persistence**: Data persists across browser sessions via localStorage
4. **Clear storage**: Call `clearDraft()` after successful submission
5. **Unsaved changes**: Monitor `hasUnsavedChanges` to warn users before navigation
