# Announcement Management System

A comprehensive, responsive announcement management system built with Next.js, Shadcn/UI components, and modern React patterns.

## Features

### 📢 Core Functionality
- **Create Announcements**: Rich form with title, description, message, and participant selection
- **Message Types**: Support for WhatsApp, Email, or Both delivery methods
- **Priority Levels**: Low, Normal, High priority scheduling
- **Scheduling**: Send immediately or schedule for future delivery
- **Personalization**: Dynamic placeholders for participant name, event details, etc.

### 📊 Analytics & Monitoring
- **Real-time Status Tracking**: Monitor delivery progress and status
- **Comprehensive Analytics**: Success rates, delivery statistics, trends
- **Performance Metrics**: Message type distribution, status breakdowns
- **Delivery Insights**: Read rates, delivery rates, and engagement metrics

### 🛡️ Anti-Spam Protection
- **Rate Limiting**: Daily and hourly sending limits
- **Smart Queuing**: Automatic queue management for large batches
- **Status Monitoring**: Real-time limit tracking and warnings
- **Block Prevention**: Intelligent sending patterns to avoid blocks

### 📋 Template System
- **Pre-built Templates**: Category-based template library
- **Template Categories**: General, Updates, Reminders, Follow-up
- **Easy Application**: One-click template application to forms
- **Custom Placeholders**: Event-specific placeholder support

### 🔄 Advanced Features
- **Retry Mechanism**: Automatic and manual retry for failed announcements
- **Bulk Operations**: Handle large participant lists efficiently
- **Preview System**: Test message rendering before sending
- **Status Management**: Cancel, retry, or modify scheduled announcements

## Component Architecture

### Main Components

#### 1. **Announcement.jsx** (Main Container)
- Central hub component with tabbed interface
- Quick stats display
- Manages state between child components
- Responsive design with mobile-first approach

#### 2. **AnnouncementForm.jsx** (Create/Edit)
- Multi-step form with validation
- Participant selection with search/filter
- Real-time preview integration
- Anti-spam limit checking
- Scheduling options

#### 3. **AnnouncementList.jsx** (List View)
- Paginated announcement listing
- Advanced filtering and search
- Bulk operations support
- Status indicators and actions
- Real-time status updates

#### 4. **AnnouncementDetails.jsx** (Detail View)
- Comprehensive announcement information
- Job progress tracking
- Delivery statistics
- Retry and cancel operations
- Error details and troubleshooting

#### 5. **AnnouncementAnalytics.jsx** (Analytics Dashboard)
- Performance metrics and trends
- Visual charts and graphs
- Time-based filtering
- Export capabilities
- Success rate tracking

#### 6. **AnnouncementTemplates.jsx** (Template Library)
- Category-based template organization
- Search and filter functionality
- Template preview and application
- Usage guidelines and tips

#### 7. **AnnouncementPreview.jsx** (Preview System)
- Message rendering with placeholders
- Sample participant previews
- Character count and validation
- Personalization verification

#### 8. **AntiSpamStatus.jsx** (Compliance Monitoring)
- Real-time limit tracking
- Usage visualization
- Block status monitoring
- Best practices guidance

## API Integration

### Endpoints Used
- `GET /event/admin/announcement/{eventId}` - Fetch announcements
- `POST /event/admin/announcement/{eventId}` - Create announcement
- `GET /event/admin/announcement/{eventId}/{announcementId}` - Get details
- `PUT /event/admin/announcement/{eventId}/{announcementId}` - Update announcement
- `DELETE /event/admin/announcement/{eventId}/{announcementId}` - Cancel announcement
- `POST /event/admin/announcement/{eventId}/{announcementId}/retry` - Retry failed
- `GET /event/admin/announcement/{eventId}/delivery-analytics` - Analytics
- `GET /event/admin/announcement/{eventId}/templates` - Templates
- `POST /event/admin/announcement/{eventId}/preview` - Preview
- `GET /event/admin/announcement/{eventId}/anti-spam/status` - Anti-spam status

## Responsive Design

### Breakpoints
- **Mobile**: < 640px - Stacked layout, simplified navigation
- **Tablet**: 640px - 1024px - Adaptive grid layout
- **Desktop**: > 1024px - Full feature layout with sidebars

### Mobile Optimizations
- Touch-friendly buttons and controls
- Swipe gestures for navigation
- Collapsible sections for better space usage
- Optimized typography and spacing

## State Management

### Local State
- Form data and validation
- UI state (loading, errors, modals)
- Filter and search parameters
- Component-specific data

### API State
- Announcement data caching
- Real-time status updates
- Error handling and retries
- Optimistic updates

## Styling

### Shadcn/UI Components Used
- **Layout**: Card, Tabs, Dialog, Sheet
- **Forms**: Input, Textarea, Select, Checkbox, Button
- **Feedback**: Badge, Alert, Progress, Toast
- **Navigation**: Pagination, Breadcrumb
- **Data**: Table, List, Skeleton

### Color Scheme
- **Primary**: Blue variants for main actions
- **Success**: Green for completed/successful states
- **Warning**: Yellow/Orange for pending/caution states
- **Error**: Red for failed/error states
- **Info**: Purple for informational elements

## Usage Examples

### Basic Implementation
```jsx
import Announcement from './components/Announcement';

function EventPage({ eventId }) {
  return (
    <div className="container mx-auto p-6">
      <Announcement eventId={eventId} />
    </div>
  );
}
```

### With Custom Styling
```jsx
<Announcement 
  eventId={eventId}
  className="custom-announcement-container"
  theme="dark"
/>
```

## Performance Optimizations

### Code Splitting
- Each component is lazy-loaded
- Dynamic imports for large dependencies
- Route-based code splitting

### Data Optimization
- Efficient API calls with caching
- Pagination for large datasets
- Debounced search and filters
- Optimistic UI updates

### Rendering Optimization
- React.memo for expensive components
- Virtualization for large lists
- Skeleton loading states
- Progressive enhancement

## Accessibility Features

### ARIA Support
- Proper labeling for screen readers
- Role definitions for interactive elements
- Keyboard navigation support
- Focus management

### Visual Accessibility
- High contrast color schemes
- Scalable typography
- Clear visual hierarchy
- Loading states and feedback

## Security Considerations

### Data Protection
- Input sanitization and validation
- XSS prevention
- CSRF protection
- Rate limiting compliance

### User Permissions
- Role-based access control
- Permission validation
- Secure API calls
- Error message sanitization

## Browser Support

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Graceful Degradation
- Progressive enhancement
- Fallback for unsupported features
- Polyfills for older browsers

## Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Analytics**: Custom date ranges, export options
- **Template Editor**: Visual template creation and editing
- **Automation**: Trigger-based automatic announcements
- **Integration**: Third-party messaging service support

### Performance Improvements
- **Caching**: Redis integration for better performance
- **CDN**: Asset optimization and delivery
- **Background Jobs**: Worker-based processing
- **Real-time**: Socket.io for live updates

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API**
   - Update API base URL in `lib/api.js`
   - Ensure authentication tokens are properly configured

3. **Import Components**
   ```jsx
   import Announcement from './components/Announcement';
   ```

4. **Use in Your App**
   ```jsx
   <Announcement eventId="your-event-id" />
   ```

## Support & Documentation

- **API Documentation**: See `docs/ANNOUNCEMENT_API_DOCUMENTATION.md`
- **Component Documentation**: Each component includes JSDoc comments
- **Examples**: Check the `/examples` directory for usage patterns
- **Troubleshooting**: Common issues and solutions in `/docs/troubleshooting.md`
