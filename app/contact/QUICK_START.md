# Contact Form - Quick Start Guide

## 🚀 What's Been Created

A production-ready contact form with the following features:

### ✅ Components Created
1. **`useContactForm` Hook** - Manages all form logic, validation, and API calls
2. **`ContactFormComponent`** - Main form with all fields
3. **`ContactFileUpload`** - Drag-and-drop file upload with validation
4. **`ContactMethods`** - Contact information cards (email, phone, office, chat)
5. **`SuccessModal`** - Beautiful success confirmation with reference ID

### ✅ Features Implemented
- ✨ Real-time validation for all fields
- 📎 File upload (max 5 files, 25MB total)
- 🎨 Beautiful UI with shadcn/ui components
- 📱 Fully responsive design
- 🔔 Toast notifications
- ⚡ Loading states
- 🎯 Error handling
- 📋 Copy reference ID functionality

## 📁 File Structure

```
app/contact/
├── page.jsx                          # Main page (updated)
├── README.md                         # Detailed documentation
├── QUICK_START.md                    # This file
├── components/
│   ├── ContactFormComponent.jsx      # Form component
│   ├── ContactFileUpload.jsx         # File upload
│   ├── ContactMethods.jsx            # Contact cards
│   └── SuccessModal.jsx              # Success modal
└── hooks/
    └── useContactForm.js             # Form logic hook
```

## 🎯 How It Works

### 1. Form Submission Flow
```
User fills form → Validation → API call → Success modal → Reset form
```

### 2. File Upload Flow
```
Drag/Drop or Click → Validate size/type → Add to list → Show preview → Submit
```

### 3. Validation Rules
- **Name**: Required, max 100 chars
- **Email**: Required, valid format
- **Phone**: Optional, valid format
- **Message**: Required, max 5000 chars
- **Files**: Max 5 files, 10MB each, 25MB total

## 🔧 Configuration

### API Endpoint
The form uses the `/contact` endpoint from your API configuration in `@/lib/api`.

Make sure your API base URL is configured correctly in `lib/api.js`.

### Categories
Categories are defined in `ContactFormComponent.jsx`. You can modify them:

```jsx
const CATEGORIES = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Support Request" },
  // Add more...
];
```

## 🧪 Testing

### Quick Test Checklist
1. Fill in all required fields (name, email, message)
2. Try invalid email format
3. Upload a file
4. Upload multiple files
5. Try to upload more than 5 files
6. Submit form
7. Check success modal appears
8. Copy reference ID
9. Click "Send Another"

### Browser Console
Open browser console to see:
- Form data being submitted
- API responses
- Any errors

## 📝 Common Customizations

### Change Response Time
Edit in `SuccessModal.jsx`:
```jsx
const categoryTimes = {
  general: "24-48 hours",  // Change these
  support: "12-24 hours",
  // ...
};
```

### Change File Limits
Edit in `useContactForm.js`:
```jsx
const maxFileSize = 10 * 1024 * 1024; // 10MB per file
const maxTotalSize = 25 * 1024 * 1024; // 25MB total
```

### Add New Field
1. Add to `formData` state in `useContactForm.js`
2. Add validation rule in `validateField` function
3. Add input field in `ContactFormComponent.jsx`
4. Add to form submission data

### Change Colors/Styling
All components use shadcn/ui classes. Modify:
- `className` props on components
- Tailwind classes
- Your theme configuration

## 🐛 Troubleshooting

### Form Won't Submit
- Check browser console for errors
- Verify API endpoint is correct
- Check all required fields are filled
- Ensure validation is passing

### Files Not Uploading
- Check file size limits
- Verify file types are allowed
- Check total size doesn't exceed 25MB
- Look for console errors

### Success Modal Not Showing
- Check `success` state in hook
- Verify API returns correct response format
- Check `submittedData` has `id` field

### Validation Errors Not Showing
- Check `errors` state in hook
- Verify field names match
- Check `validateField` function

## 📞 Support

### Documentation
- **Full Docs**: `app/contact/README.md`
- **API Guide**: `CONTACT_API_FRONTEND_GUIDE.md`

### Code Structure
All components are well-commented. Check:
- Component props and types
- Hook return values
- Validation functions
- Error handling

## 🎨 Customization Examples

### Change Form Layout
```jsx
// In ContactFormComponent.jsx
<div className="grid md:grid-cols-3 gap-4"> {/* Was md:grid-cols-2 */}
  {/* ... */}
</div>
```

### Add Character Counter to Name
```jsx
{formData.name && (
  <p className="text-xs text-muted-foreground text-right">
    {formData.name.length}/100
  </p>
)}
```

### Change Success Message
```jsx
// In SuccessModal.jsx
<DialogTitle className="text-center text-2xl">
  Thank You! {/* Change this */}
</DialogTitle>
```

## 🚀 Deployment Checklist

Before deploying:
- [ ] Test form submission
- [ ] Test file uploads
- [ ] Test all validations
- [ ] Test responsive design
- [ ] Check API endpoint URL
- [ ] Test error handling
- [ ] Verify email confirmation works
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Check accessibility

## 💡 Pro Tips

1. **Testing**: Use browser dev tools Network tab to see API requests
2. **Debugging**: Add console.logs in the hook for state changes
3. **Styling**: Use Tailwind's responsive prefixes (sm:, md:, lg:)
4. **Performance**: Form is optimized, no unnecessary re-renders
5. **Validation**: Add custom validation rules in `validateField` function

## 🎉 You're All Set!

Your contact form is production-ready. Just test it thoroughly and deploy!

---

**Need Help?** Check the full documentation in `README.md` or review the API guide.

**Made with ❤️ for Orgatick**
