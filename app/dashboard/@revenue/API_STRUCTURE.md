# Revenue API Documentation

## Endpoint
```
GET /api/dashboard/revenue
```

## Query Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| days | number | No | Number of days to fetch (default: 30) | 7, 15, 30 |
| startDate | string | No | Start date in ISO format | 2025-12-01 |
| endDate | string | No | End date in ISO format | 2025-12-25 |

## Request Example
```javascript
// Fetch last 30 days revenue
GET /api/dashboard/revenue?days=30&organizationId=org_123456

// Fetch specific date range
GET /api/dashboard/revenue?startDate=2025-12-01&endDate=2025-12-25&organizationId=org_123456
```

## Response Structure

### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-12-01",
      "revenue": 2450
    },
    {
      "date": "2025-12-02",
      "revenue": 3120
    },
    {
      "date": "2025-12-03",
      "revenue": 2890
    }
  ],
  "meta": {
    "totalDays": 30,
    "totalRevenue": 75000,
    "averageRevenue": 2500,
    "currency": "INR"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Invalid date range provided"
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

## Data Schema

### Revenue Data Object
```typescript
interface RevenueData {
  date: string;        // ISO date format (YYYY-MM-DD)
  revenue: number;     // Revenue amount in smallest currency unit (paise for INR)
}
```

### Response Meta Object
```typescript
interface ResponseMeta {
  totalDays: number;        // Number of days in the response
  totalRevenue: number;     // Sum of all revenue
  averageRevenue: number;   // Average revenue per day
  currency: string;         // Currency code (e.g., "INR", "USD")
}
```

## Frontend Implementation

### Usage in Component
```javascript
import { formatRevenueData } from './utils/revenueHelpers'

// Fetch revenue data
const fetchRevenueData = async (days = 30) => {
  try {
    const response = await fetch(
      `/api/dashboard/revenue?days=${days}&organizationId=${orgId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    
    const result = await response.json()
    
    if (result.success) {
      // Format data for chart
      const formattedData = formatRevenueData(result.data)
      return formattedData
    }
  } catch (error) {
    console.error('Failed to fetch revenue data:', error)
  }
}
```

## Notes for Backend Engineer

1. **Date Range**: Always return data sorted by date in ascending order
2. **Missing Dates**: If a date has no revenue, include it with `revenue: 0`
3. **Currency**: Revenue should be in smallest unit (paise for INR)
4. **Time Zone**: Use UTC for all dates
5. **Performance**: Consider caching this data for frequently accessed date ranges
6. **Permissions**: Verify user has access to the requested organization
7. **Validation**: 
   - Maximum date range: 90 days
   - Start date must be before end date
   - Dates cannot be in the future

## Example Backend Implementation (Node.js/Express)

```javascript
router.get('/api/dashboard/revenue', authenticate, async (req, res) => {
  try {
    const { days = 30, organizationId } = req.query
    
    // Validate permissions
    if (!hasAccess(req.user, organizationId)) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Access denied' }
      })
    }
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Fetch revenue data from database
    const revenueData = await db.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(amount) as revenue
      FROM transactions
      WHERE 
        organization_id = $1 
        AND created_at >= $2 
        AND created_at <= $3
        AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [organizationId, startDate, endDate])
    
    // Calculate meta data
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
    const averageRevenue = totalRevenue / days
    
    res.json({
      success: true,
      data: revenueData,
      meta: {
        totalDays: days,
        totalRevenue,
        averageRevenue,
        currency: 'INR'
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

## Testing

### Sample cURL Request
```bash
curl -X GET "http://localhost:3000/api/dashboard/revenue?days=30&organizationId=org_123" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
