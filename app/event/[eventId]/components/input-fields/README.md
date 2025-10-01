# Input Fields Component Documentation

This is a completely redesigned and modular Input Fields management system for event registration fields. The component has been broken down into smaller, reusable components following modern React patterns and shadcn/ui design system.

## Component Structure

```
input-fields/
├── index.js                    # Export barrel
├── InputFieldManager.jsx       # Main container component
├── FieldsList.jsx             # List container with drag/drop
├── FieldItem.jsx              # Individual field display
├── FieldFormDialog.jsx        # Add/Edit form dialog
├── FieldTypeSelector.jsx      # Field type selection component
├── FieldOptions.jsx           # Options management for choice fields
├── FieldPreview.jsx           # Field preview component
├── DeleteFieldDialog.jsx      # Delete confirmation dialog
├── hooks/
│   └── useFieldOperations.js  # Custom hook for API operations
└── utils/
    └── fieldTypeUtils.js      # Field type utilities and icons
```

## Features

### 🎨 Modern Design
- Clean, card-based layout
- Proper spacing and typography
- Hover effects and smooth transitions
- Responsive design for mobile and desktop
- shadcn/ui component consistency

### 🔧 Modular Architecture
- Each component under 400 lines
- Separation of concerns
- Reusable components
- Custom hooks for business logic
- Utility functions for common operations

### 🎛️ Enhanced Field Types
- Text Input
- Text Area (Multi-line)
- Number
- Email
- Phone (Tel)
- URL
- Date
- Dropdown
- Radio Group
- Checkbox
- File Upload

### 🎯 Improved UX
- Visual field type indicators with icons
- Better drag and drop experience
- Improved form validation
- Clear field previews
- Better error handling
- Loading states

### ⚡ Advanced Features
- Drag and drop field reordering
- Field type switching with option preservation
- Live field preview
- Comprehensive validation
- API compatibility layer (supports both old and new endpoints)

## Usage

### Basic Usage
```jsx
import { InputFieldManager } from './input-fields';

function EventPage({ event, setEvent }) {
  return (
    <InputFieldManager 
      event={event} 
      setEvent={setEvent} 
    />
  );
}
```

### Individual Components
```jsx
import { 
  FieldsList, 
  FieldFormDialog, 
  DeleteFieldDialog 
} from './input-fields';

// Use individual components for custom layouts
```

## Component API

### InputFieldManager
Main container component that orchestrates all field management operations.

**Props:**
- `event` (object): Event object containing inputFields array
- `setEvent` (function): Function to update the event state

### FieldsList
Renders the list of fields with drag-and-drop functionality.

**Props:**
- `fields` (array): Array of field objects
- `onEdit` (function): Callback for editing a field
- `onDelete` (function): Callback for deleting a field
- `onArrange` (function): Callback for reordering fields

### FieldFormDialog
Modal dialog for adding or editing fields.

**Props:**
- `open` (boolean): Dialog open state
- `onOpenChange` (function): Dialog state change handler
- `fieldForm` (object): Form data object
- `setFieldForm` (function): Form data setter
- `onSubmit` (function): Form submission handler
- `title` (string): Dialog title
- `isEdit` (boolean): Whether this is an edit operation

### DeleteFieldDialog
Confirmation dialog for field deletion.

**Props:**
- `open` (boolean): Dialog open state
- `onOpenChange` (function): Dialog state change handler
- `onConfirm` (function): Deletion confirmation handler
- `fieldName` (string): Name of field being deleted

## Field Types

Each field type has:
- **Icon**: Visual identifier using Tabler icons
- **Color**: Unique color scheme for easy recognition
- **Validation**: Type-specific validation rules
- **Options**: Configurable options for choice fields

### Choice Fields (dropdown, radio, checkbox)
- Support for multiple options
- Add/remove options dynamically
- Drag and drop option reordering
- Validation for minimum options

### Text Fields (text, textarea, email, tel, url)
- Placeholder text support
- Format validation (email, URL, phone)
- Character limits
- Required field validation

### Special Fields (date, number, file)
- Type-specific input controls
- Min/max validation for numbers
- File type restrictions for uploads
- Date range validation

## API Compatibility

The component supports both old and new API endpoints:

### Old Endpoints (Fallback)
- `POST /event/admin/{eventId}/add-input-field`
- `PUT /event/admin/{eventId}/update-input-field/{fieldId}`
- `DELETE /event/admin/{eventId}/delete-input-field/{fieldId}`
- `PUT /event/admin/{eventId}/arrange-input-fields`

### New Endpoints (Primary)
- `POST /event/admin/dynamic-field/{eventId}`
- `PUT /event/admin/dynamic-field/{eventId}/{fieldId}`
- `DELETE /event/admin/dynamic-field/{eventId}/{fieldId}`
- `POST /event/admin/dynamic-field/{eventId}/arrange`

## Styling

The component uses:
- **shadcn/ui**: For consistent UI components
- **Tailwind CSS**: For utility-first styling
- **Tabler Icons**: For consistent iconography
- **Default Colors**: No custom color definitions, relies on CSS variables

### Design Tokens
- Uses semantic color tokens (`primary`, `destructive`, `muted-foreground`, etc.)
- Consistent spacing using Tailwind's spacing scale
- Responsive design breakpoints
- Dark mode compatible

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- Focus management in dialogs
- High contrast mode support

## Performance

- Optimized re-renders with proper key usage
- Debounced API calls for arrange operations
- Lazy loading of options
- Minimal bundle size with tree-shaking support

## Migration Guide

To migrate from the old monolithic component:

1. **Replace import:**
   ```jsx
   // Old
   import InputField from './InputField';
   
   // New
   import { InputFieldManager } from './input-fields';
   ```

2. **Update usage:**
   ```jsx
   // Old
   <InputField event={event} setEvent={setEvent} />
   
   // New  
   <InputFieldManager event={event} setEvent={setEvent} />
   ```

3. **API compatibility:** The new component handles both old and new API endpoints automatically.

## Contributing

When adding new features:

1. Keep components under 400 lines
2. Use TypeScript for better type safety
3. Follow the existing naming conventions
4. Add proper error handling
5. Include accessibility features
6. Test with both API endpoint formats

## Troubleshooting

### Common Issues

1. **API Errors**: Check that event._id is properly set
2. **Drag and Drop**: Ensure fields have proper _id properties
3. **State Updates**: Verify setEvent function is working correctly
4. **Styling Issues**: Check that Tailwind CSS is properly configured

### Debug Mode
Enable debug mode by setting localStorage item:
```javascript
localStorage.setItem('inputFields_debug', 'true');
```

This will log additional information about API calls and state changes.
