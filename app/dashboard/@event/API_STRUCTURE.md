# Event Dashboard API Documentation

## Endpoint
```
GET /api/dashboard/events
```

## Query Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| limit | number | No | Number of events to fetch (default: 10) | 5 |
| status | string | No | Filter by status | published, ongoing, draft |

## Request Example
```javascript
// Fetch events for dashboard
GET /api/dashboard/events?organizationId=org_123456&limit=5

// Fetch only published events
GET /api/dashboard/events?organizationId=org_123456&status=published
```

## Response Structure

### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "evt_001",
      "title": "Tech Innovation Summit 2025",
      "slug": "tech-innovation-summit-2025",
      "description": "Join industry leaders for groundbreaking discussions",
      "bannerImage": "https://example.com/banner.jpg",
      "status": "published",
      "mode": "hybrid",
      "type": "conference",
      "category": "Technology",
      "sessions": [
        {
          "title": "Keynote Session",
          "startTime": "2025-01-15T09:00:00Z",
          "endTime": "2025-01-15T17:00:00Z",
          "venue": {
            "name": "Convention Center",
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India"
          }
        }
      ],
      "tickets": [
        {
          "type": "Early Bird",
          "price": 2500,
          "capacity": 100,
          "sold": 85,
          "isActive": true
        },
        {
          "type": "Regular",
          "price": 3500,
          "capacity": 150,
          "sold": 120,
          "isActive": true
        }
      ],
      "totalRegistrations": 205,
      "viewCount": 1250,
      "registrationStart": "2024-12-01T00:00:00Z",
      "registrationEnd": "2025-01-14T23:59:59Z",
      "isPublished": true,
      "isRegistrationOpen": true,
      "organization": "org_001",
      "createdAt": "2024-11-15T10:30:00Z",
      "updatedAt": "2024-12-20T15:45:00Z"
    }
  ],
  "meta": {
    "total": 3,
    "limit": 10,
    "hasMore": false
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Organization ID is required"
  }
}
```

## Data Schema

### Event Object
```typescript
interface Event {
  _id: string;                          // Unique event ID
  title: string;                        // Event title
  slug: string;                         // URL-friendly slug
  description: string;                  // Event description
  bannerImage: string | null;           // Banner image URL
  status: EventStatus;                  // Current status
  mode: EventMode;                      // Event mode
  type: string;                         // Event type/category
  category: string;                     // Event category
  sessions: Session[];                  // Event sessions
  tickets: TicketType[];                // Ticket types
  totalRegistrations: number;           // Total registered participants
  viewCount: number;                    // Page view count
  registrationStart: string;            // ISO timestamp
  registrationEnd: string;              // ISO timestamp
  isPublished: boolean;                 // Publication status
  isRegistrationOpen: boolean;          // Registration status
  organization: string;                 // Organization ID
  createdAt: string;                    // ISO timestamp
  updatedAt: string;                    // ISO timestamp
}

type EventStatus = 
  | 'draft'
  | 'published'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

type EventMode = 
  | 'online'
  | 'offline'
  | 'hybrid';

interface Session {
  title: string;
  startTime: string;                    // ISO timestamp
  endTime: string;                      // ISO timestamp
  venue: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface TicketType {
  type: string;                         // Ticket type name
  price: number;                        // Price in smallest currency unit
  capacity: number;                     // Total available tickets
  sold: number;                         // Tickets sold
  isActive: boolean;                    // Availability status
}
```

## Frontend Implementation

### Fetch Events for Dashboard
```javascript
import { formatEventData } from './utils/eventHelpers'

const fetchDashboardEvents = async (organizationId) => {
  try {
    const response = await fetch(
      `/api/dashboard/events?organizationId=${organizationId}&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    
    const result = await response.json()
    
    if (result.success) {
      return formatEventData(result.data)
    }
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}
```

### Using with SWR (Recommended)
```javascript
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

function EventDashboard({ orgId }) {
  const { data, error, mutate } = useSWR(
    `/api/dashboard/events?organizationId=${orgId}`,
    fetcher,
    {
      refreshInterval: 180000, // Refresh every 3 minutes
      revalidateOnFocus: true
    }
  )

  const events = data?.data || []
  const loading = !data && !error

  return (
    // Your component JSX
  )
}
```

## Calculated Metrics (Frontend)

The frontend calculates these metrics from the event data:

```javascript
// Total revenue from all tickets
const totalRevenue = tickets.reduce((sum, ticket) => 
  sum + (ticket.price * ticket.sold), 0
)

// Total tickets sold
const totalTicketsSold = tickets.reduce((sum, ticket) => 
  sum + ticket.sold, 0
)

// Total ticket capacity
const totalCapacity = tickets.reduce((sum, ticket) => 
  sum + ticket.capacity, 0
)

// Sales percentage
const salesPercentage = totalCapacity > 0 
  ? ((totalTicketsSold / totalCapacity) * 100).toFixed(0)
  : 0

// Is paid event
const isPaidEvent = tickets.some(ticket => ticket.price > 0)
```

## Backend Implementation Notes

### Database Query
```javascript
router.get('/api/dashboard/events', authenticate, async (req, res) => {
  try {
    const { organizationId, limit = 10, status } = req.query
    
    // Verify access
    if (!hasAccess(req.user, organizationId)) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Access denied' }
      })
    }
    
    // Build query
    let query = { organization: organizationId }
    if (status) query.status = status
    
    // Fetch events
    const events = await Event.find(query)
      .select('title slug description bannerImage status mode type category sessions tickets totalRegistrations viewCount registrationStart registrationEnd isPublished isRegistrationOpen')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .lean()
    
    res.json({
      success: true,
      data: events,
      meta: {
        total: events.length,
        limit: parseInt(limit),
        hasMore: false
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    })
  }
})
```

### Important Notes for Backend

1. **Permissions**: Always verify the user has access to the organization
2. **Performance**: Use `.lean()` for better performance since we're just reading
3. **Projections**: Only select fields needed for dashboard display
4. **Sorting**: Sort by `updatedAt` to show most recently updated events first
5. **Limit**: Default to reasonable limits (5-10 events for dashboard)
6. **Status Filter**: Allow filtering by event status
7. **Caching**: Consider caching dashboard data for 3-5 minutes

## Real-time Updates (Optional)

If you want real-time updates when events change:

```javascript
// WebSocket connection
const ws = new WebSocket(`wss://api.example.com/events?orgId=${orgId}`)

ws.onmessage = (event) => {
  const update = JSON.parse(event.data)
  // Trigger SWR revalidation
  mutate()
}
```

## Sample Test Data

For testing, use the `generateDummyEvents()` function from `utils/eventHelpers.js`:

```javascript
import { generateDummyEvents } from './utils/eventHelpers'

const dummyEvents = generateDummyEvents()
```
