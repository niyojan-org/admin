# Contact Form Implementation

## Overview
This is a production-ready contact form implementation with file upload support, real-time validation, and success confirmation modals. The implementation follows the Contact Management API documentation.

## Features
- ✅ Real-time form validation
- ✅ File upload with drag-and-drop support
- ✅ Multiple file attachments (max 5 files, 25MB total)
- ✅ Category selection
- ✅ Success confirmation modal with reference ID
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications

## File Structure

```
app/contact/
├── page.jsx                          # Main contact page
├── components/
│   ├── ContactFormComponent.jsx      # Main form component
│   ├── ContactFileUpload.jsx         # File upload with drag-and-drop
│   ├── ContactMethods.jsx            # Contact information cards
│   └── SuccessModal.jsx              # Success confirmation dialog
└── hooks/
    └── useContactForm.js             # Custom hook for form logic
```

## Components

### 1. `useContactForm` Hook
Custom hook that manages:
- Form state management
- Real-time validation
- File upload validation
- API submission
- Error handling

**Usage:**
```jsx
const {
  formData,
  files,
  loading,
  success,
  errors,
  submittedData,
  handleChange,
  handleFileChange,
  removeFile,
  handleSubmit,
  resetForm,
} = useContactForm();
```

### 2. `ContactFormComponent`
Main form component with all input fields:
- Name (required, max 100 chars)
- Email (required, validated)
- Phone (optional, validated)
- Category (select dropdown)
- Subject (optional, max 200 chars)
- Message (required, max 5000 chars)
- File attachments

### 3. `ContactFileUpload`
File upload component with:
- Drag-and-drop interface
- File type validation
- File size validation
- File preview with icons
- Remove file functionality

**Supported file types:**
- Images: JPG, JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX, TXT

**Limits:**
- Max 5 files per submission
- Max 10MB per file
- Max 25MB total size

### 4. `ContactMethods`
Displays contact information cards:
- Email
- Live chat (with coming soon dialog)
- Office location
- Phone number

### 5. `SuccessModal`
Success confirmation dialog showing:
- Reference ID (with copy functionality)
- Status badge
- Expected response time
- Attachment count
- Email confirmation notice

## Validation Rules

### Name
- Required
- Max 100 characters
- Cannot be empty or whitespace only

### Email
- Required
- Must be valid email format
- Regex: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`

### Phone
- Optional
- Must be valid phone format if provided
- Regex: `/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/`
- Supports international formats

### Subject
- Optional
- Max 200 characters

### Message
- Required
- Max 5000 characters
- Character counter displayed

### Files
- Optional
- Max 5 files
- Max 10MB per file
- Max 25MB total
- Allowed types: JPG, PNG, GIF, PDF, DOC, DOCX, TXT

## API Integration

The form integrates with the Contact Management API:

**Endpoint:** `POST /contact`

**Request Format:** `multipart/form-data`

**Fields sent:**
- name
- email
- phone (if provided)
- subject (if provided)
- message
- category
- source (automatically set to "website")
- sourceDetails (optional)
- attachments (files array)

**Success Response:**
```json
{
  "success": true,
  "message": "Your message has been received successfully.",
  "data": {
    "id": "670895abc123def456789012",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Need Help",
    "status": "new",
    "attachmentCount": 2,
    "createdAt": "2025-10-11T10:30:00.000Z"
  }
}
```

## Category Options

| Value | Label | Expected Response Time |
|-------|-------|----------------------|
| `general` | General Inquiry | 24-48 hours |
| `support` | Support Request | 12-24 hours |
| `sales` | Sales Inquiry | 4-8 hours |
| `project-inquiry` | Project Inquiry | 24 hours |
| `collaboration` | Collaboration | 48 hours |
| `feedback` | Feedback | 48 hours |
| `complaint` | Complaint | 8-12 hours |
| `bug-report` | Bug Report | 12-24 hours |
| `feature-request` | Feature Request | 48-72 hours |
| `other` | Other | 24-48 hours |

## Error Handling

### Form Validation Errors
- Displayed inline below each field
- Red border on invalid fields
- Alert banner at top when form has errors
- Toast notification on submit attempt with errors

### API Errors
- Network errors: "Failed to submit form. Please try again."
- Validation errors: Display API error message
- File errors: Specific error for each file issue

### File Upload Errors
- Too many files: "Maximum 5 files allowed"
- File too large: "[filename] exceeds 10MB limit"
- Total size exceeded: "Total file size cannot exceed 25MB"
- Invalid file type: "[filename] is not a supported file type"

## Toast Notifications

The form uses `sonner` for toast notifications:
- Success: "Message sent successfully!"
- Error: Specific error message from API
- Info: "Downloading ticket..." (for reference ID copy)
- Success: "Reference ID copied to clipboard"

## Responsive Design

The form is fully responsive:
- **Mobile (< 768px):**
  - Single column layout
  - Stacked form fields
  - Full-width inputs
  - Adjusted padding and spacing

- **Tablet (768px - 1024px):**
  - 2-column grid for name/email
  - 2-column grid for phone/category
  - Optimized spacing

- **Desktop (> 1024px):**
  - Two-column layout (contact methods + form)
  - Multi-column form fields
  - Maximum width constraints

## Loading States

- Submit button shows spinner and "Sending Message..." text
- Form fields are disabled during submission
- File upload is disabled during submission

## Accessibility

- All form fields have proper labels
- Required fields marked with asterisk
- Error messages associated with fields
- Keyboard navigation support
- Focus management
- ARIA attributes on interactive elements

## Usage Example

```jsx
import Contact02Page from "@/app/contact/page";

export default function ContactRoute() {
  return <Contact02Page />;
}
```

## Testing Checklist

### Form Validation
- [ ] Submit with all required fields filled
- [ ] Submit without name (should show error)
- [ ] Submit without email (should show error)
- [ ] Submit with invalid email format
- [ ] Submit without message (should show error)
- [ ] Test character limits (name: 100, subject: 200, message: 5000)
- [ ] Test phone validation with various formats

### File Upload
- [ ] Upload 1 file
- [ ] Upload 5 files (max allowed)
- [ ] Try to upload 6 files (should fail)
- [ ] Upload file > 10MB (should fail)
- [ ] Upload files totaling > 25MB (should fail)
- [ ] Test drag-and-drop functionality
- [ ] Remove uploaded files
- [ ] Upload various file types

### Success Flow
- [ ] Successful form submission shows modal
- [ ] Reference ID is displayed correctly
- [ ] Copy reference ID functionality
- [ ] Expected response time is shown
- [ ] Attachment count is accurate
- [ ] Email confirmation notice appears
- [ ] "Send Another" resets form
- [ ] "Done" closes modal

### Error Handling
- [ ] Network error handling
- [ ] API validation error handling
- [ ] File validation error messages
- [ ] Toast notifications appear

### Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test on desktop
- [ ] Test form layout responsiveness
- [ ] Test modal responsiveness

## Future Enhancements

Possible improvements:
- [ ] Track submission status feature
- [ ] View submission history
- [ ] Rate response functionality
- [ ] Add feedback on resolved submissions
- [ ] Real-time chat integration
- [ ] Notification preferences
- [ ] Multi-language support
- [ ] Dark mode optimization

## Dependencies

- `@/lib/api` - API client (axios/fetch wrapper)
- `@/components/ui/*` - shadcn/ui components
- `@tabler/icons-react` - Icons
- `sonner` - Toast notifications
- `next/navigation` - Next.js routing (if needed for tracking)

## Support

For issues or questions:
- Check API documentation: `/CONTACT_API_FRONTEND_GUIDE.md`
- Review component props and hooks
- Check browser console for errors
- Verify API endpoint configuration

---

**Last Updated:** October 11, 2025
**Version:** 1.0.0
