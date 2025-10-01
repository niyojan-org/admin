# Organization Member Management System

A comprehensive member management system built with Next.js, React, and modern UI components. This system provides full CRUD operations for managing organization members with role-based access control, bulk operations, and advanced filtering capabilities.

## 📁 File Structure

```
app/organization/members/
├── page.jsx                     # Main members page component
├── components/                  # Reusable UI components
│   ├── index.js                # Component exports
│   ├── MemberTable.jsx         # Data table with sorting & pagination
│   ├── MemberFilters.jsx       # Advanced filtering interface
│   ├── MemberStatsCards.jsx    # Statistics dashboard
│   ├── AddMemberModal.jsx      # Add new member modal
│   ├── MemberRoleUpdateModal.jsx # Role management modal
│   ├── MemberRemoveDialog.jsx  # Member removal confirmation
│   ├── BulkActions.jsx         # Bulk operations interface
│   ├── ExportMembers.jsx       # Data export functionality
│   └── TablePagination.jsx     # Pagination controls
├── hooks/                       # Custom React hooks
│   ├── index.js                # Hook exports
│   ├── useMembers.js           # Member management operations
│   ├── useMemberFilters.js     # Filter state management
│   └── useBulkSelection.js     # Bulk selection logic
└── utils/                       # Utility functions
    ├── index.js                # Utility exports
    └── memberUtils.js          # Helper functions
```

## 🚀 Features

### Core Functionality
- **Member Management**: Add, update, remove organization members
- **Role-Based Access Control**: Owner, Admin, Manager, Member, Volunteer roles
- **Invitation System**: Send, resend, and cancel member invitations
- **Bulk Operations**: Select multiple members for batch actions
- **Advanced Filtering**: Filter by role, status, verification, gender, etc.
- **Search**: Real-time search across name, email, and phone
- **Sorting**: Sort by any column with ascending/descending order
- **Pagination**: Efficient pagination with customizable page sizes
- **Export**: Export member data in CSV, Excel, and JSON formats

### UI/UX Features
- **Responsive Design**: Works seamlessly on all device sizes
- **Modern Interface**: Clean, intuitive design with shadcn/ui components
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Comprehensive error states and user feedback
- **Accessibility**: Full keyboard navigation and screen reader support
- **Dark Mode**: Built-in theme support

## 📊 Statistics Dashboard

The system provides comprehensive statistics including:
- Total member count with filtered results
- Active vs pending vs inactive members
- Role distribution (Owner, Admin, Manager, Member, Volunteer)
- Gender distribution
- Email verification statistics

## 🔐 Permission System

### Role Hierarchy
```
Owner (Highest) → Admin → Manager → Member → Volunteer (Lowest)
```

### Permission Matrix
| Action | Owner | Admin | Manager | Member | Volunteer |
|--------|-------|-------|---------|---------|-----------|
| View Members | ✅ | ✅ | ✅ | ❌ | ❌ |
| Add Members | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Roles | ✅ | ✅* | ❌ | ❌ | ❌ |
| Remove Members | ✅ | ✅* | ❌ | ❌ | ❌ |
| Manage Invitations | ✅ | ✅ | ❌ | ❌ | ❌ |

*Admins cannot manage other admins or owners

## 🛠 API Integration

The system integrates with the Organization Members API documented in `ORGANIZATION_MEMBERS_API_DOCUMENTATION.md`:

### Key Endpoints
- `GET /org/members` - Fetch members with filtering/pagination
- `POST /org/members` - Add new member or invite existing user
- `PUT /org/members/{id}` - Update member role
- `DELETE /org/members/{id}` - Remove member
- `POST /org/members/{id}/resend-invitation` - Resend invitation
- `DELETE /org/members/{id}/cancel-invitation` - Cancel invitation

## 📱 Components Documentation

### Main Page (`page.jsx`)
The main component that orchestrates the entire member management interface. Manages state for modals, filters, and bulk selections.

### MemberTable (`MemberTable.jsx`)
- Displays members in a sortable data table
- Supports bulk selection with checkboxes
- Provides action menus for each member
- Includes pagination controls
- Handles loading and empty states

### MemberFilters (`MemberFilters.jsx`)
- Advanced filtering interface
- Real-time filter application
- Filter summary and active filter display
- Reset functionality

### MemberStatsCards (`MemberStatsCards.jsx`)
- Displays key metrics in card format
- Role and gender distribution charts
- Real-time updates based on filters

### AddMemberModal (`AddMemberModal.jsx`)
- Form for adding new members
- Email validation and user existence checking
- Role selection with descriptions
- Invitation system integration

### Bulk Operations (`BulkActions.jsx`)
- Multi-select functionality
- Bulk role updates
- Bulk invitation management
- Bulk member removal

### Export System (`ExportMembers.jsx`)
- Multiple export formats (CSV, Excel, JSON)
- Progress tracking for large exports
- Filtered data export support

## 🎣 Custom Hooks

### useMembers
Manages all member-related API operations:
```javascript
const {
  members,
  summary,
  pagination,
  loading,
  error,
  fetchMembers,
  addMember,
  updateMemberRole,
  removeMember,
  resendInvitation,
  cancelInvitation
} = useMembers();
```

### useMemberFilters
Handles filter state management:
```javascript
const {
  filters,
  updateFilter,
  resetFilters,
  hasActiveFilters,
  getFilterSummary
} = useMemberFilters();
```

### useBulkSelection
Manages bulk selection state:
```javascript
const {
  selectedMembers,
  selectMember,
  selectAllMembers,
  clearSelection,
  isSelected,
  isAllSelected
} = useBulkSelection(members);
```

## 🛠 Installation & Setup

1. **Prerequisites**: Ensure you have the required UI components installed:
   ```bash
   npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
   npm install @radix-ui/react-select @radix-ui/react-checkbox
   npm install @radix-ui/react-avatar @radix-ui/react-alert-dialog
   npm install lucide-react sonner
   ```

2. **API Configuration**: Update the API base URL in `lib/api.js`

3. **Environment Variables**: Set up your environment variables:
   ```env
   SERVER_URL=http://localhost:5050
   ```

## 🔧 Customization

### Adding New Filters
1. Add filter field to `useMemberFilters` initial state
2. Update the filter component in `MemberFilters.jsx`
3. Handle the new filter in the API call

### Custom Export Formats
1. Add new format to `ExportMembers.jsx` `exportFormats` array
2. Implement the generation function
3. Update the download handler

### Role System Extension
1. Update role arrays in components
2. Modify permission checking functions in `memberUtils.js`
3. Update API integration for new roles

## 🐛 Error Handling

The system includes comprehensive error handling:
- API error display with user-friendly messages
- Form validation with field-specific errors
- Network error recovery mechanisms
- Loading state management

## 🎨 Styling

Built with Tailwind CSS and shadcn/ui components:
- Consistent design system
- Responsive breakpoints
- Dark mode support
- Accessibility-first approach

## 📈 Performance Features

- **Lazy Loading**: Components load on demand
- **Debounced Search**: Prevents excessive API calls
- **Virtual Scrolling**: Efficient handling of large member lists
- **Memoized Components**: Optimized re-renders
- **Optimistic Updates**: Immediate UI feedback

## 🧪 Testing

The system is designed with testing in mind:
- Modular components for unit testing
- Custom hooks for logic testing
- API mocking capabilities
- Error boundary testing

## 🔮 Future Enhancements

Potential improvements for the system:
- Real-time updates with WebSockets
- Advanced analytics dashboard
- Member activity tracking
- Integration with external services
- Mobile app support
- Advanced permission system

This member management system provides a solid foundation for organization member administration with room for customization and extension based on specific requirements.
