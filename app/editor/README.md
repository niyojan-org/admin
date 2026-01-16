# Template Editor - Complete Feature Guide

## Overview

The Template Editor is a production-ready visual editor for creating **ticket** and **certificate** templates with full API integration. It supports all features documented in the Template API.

## Features

### 1. Template Metadata
- **Template Name**: Custom name for your template
- **Template Type**: Choose between "Ticket" or "Certificate"
- Displayed in the sidebar for easy access

### 2. Field Types

#### Text Fields
All text fields support:
- **Font Size**: 12px - 120px (adjustable via slider)
- **Font Family**: Multiple fonts (Ovo, Merienda, Roboto, Arial, Helvetica, Georgia, etc.)
- **Font Weight**: Normal, Bold, Semibold
- **Font Color**: Color picker + hex input
- **Text Alignment**: Left, Center, Right
- **Line Height**: Adjustable from 0.5 to 3.0
- **Opacity**: 0% - 100%
- **Rotation**: 0° - 360°
- **Position**: Drag & drop or arrow key nudging

Available text variables:
- Participant Name
- Event Name
- Ticket Code (mandatory)
- Certificate ID
- Seat Number
- Score
- Issue Date
- Event Date

#### QR Code Fields
QR codes support:
- **Size**: 50px - 300px (adjustable via slider)
- **Error Correction Level**: 
  - Low (~7% damage recovery)
  - Medium (~15% damage recovery) - default
  - Quartile (~25% damage recovery)
  - High (~30% damage recovery)
- **Opacity**: 0% - 100%
- **Rotation**: 0° - 360°
- **Position**: Drag & drop
- Visual neon glow effect for better visibility
- Mandatory field (at least one required)

#### Image Fields
Image fields support:
- **Image URL**: External image URL
- **Width**: Adjustable dimensions
- **Height**: Adjustable dimensions
- **Opacity**: 0% - 100%
- **Rotation**: 0° - 360°
- **Position**: Drag & drop
- Placeholder shown when no URL provided

### 3. Canvas Features

- **Live Preview**: Real-time visualization of your template
- **Drag & Drop**: Move elements freely on the canvas
- **Keyboard Navigation**: 
  - Arrow keys: Move selected element by 1px
  - Shift + Arrow keys: Move by 10px
- **Transform Controls**: Resize QR codes and images
- **Rotation**: Rotate any element
- **Scaling**: Automatically fits canvas to container
- **Selection**: Click to select, click empty space to deselect
- **Visual Feedback**: Selected elements highlighted in blue

### 4. History Management

- **Undo**: Revert last change (Ctrl+Z support coming soon)
- **Redo**: Restore undone change
- **Auto-save history**: Every change is tracked
- Visual indicators showing undo/redo availability

### 5. Element Management

- **Add Elements**: Select from dropdown and add to canvas
- **Edit Elements**: Click to select and edit in sidebar
- **Delete Elements**: Remove individual elements (except mandatory)
- **List View**: See all placed elements at a glance
- **Field Library**: Pre-configured fields with default styling

### 6. Export & API Integration

Full API compliance with:
- Template name validation
- Template type validation
- Mandatory field validation
- Base image upload (PNG, JPG, GIF, WebP)
- Field mapping to API format
- Variable collection and allowedVariables
- Error handling and user feedback

## API Field Mapping

The editor automatically converts internal fields to API format:

### Text Field
```javascript
{
  id: "field-uuid",
  type: "text",
  x: 100,
  y: 200,
  text: "{{participantName}}",
  textAlign: "center",
  font: {
    family: "Ovo",
    size: 48,
    color: "#000000",
    weight: "normal",
    lineHeight: 1.2
  },
  rotation: 0,
  opacity: 1,
  visible: true
}
```

### QR Code Field
```javascript
{
  id: "qr-uuid",
  type: "qr",
  x: 500,
  y: 500,
  qr: {
    data: "{{qrCode}}",
    size: 150,
    errorCorrectionLevel: "M"
  },
  width: 150,
  height: 150,
  rotation: 0,
  opacity: 1,
  visible: true
}
```

### Image Field
```javascript
{
  id: "image-uuid",
  type: "image",
  x: 50,
  y: 50,
  imageUrl: "https://example.com/logo.png",
  width: 150,
  height: 80,
  rotation: 0,
  opacity: 1,
  visible: true
}
```

## Workflow

1. **Upload Base Image**: Start by uploading a background image
2. **Set Template Info**: Enter name and select type (ticket/certificate)
3. **Add Elements**: Add text, QR codes, and images from the field selector
4. **Position Elements**: Drag elements to desired positions
5. **Style Elements**: Click to select and customize in the editor panel
6. **Fine-tune**: Use arrow keys for pixel-perfect positioning
7. **Export**: Click "Export" to create the template via API

## Keyboard Shortcuts

- **Arrow Keys**: Move selected element by 1px
- **Shift + Arrow**: Move selected element by 10px
- **Click Empty Space**: Deselect current element
- **Click Element**: Select element for editing

## Validation

Before export, the editor validates:
- ✅ Base image is uploaded
- ✅ Template name is provided
- ✅ Template type is selected
- ✅ All mandatory fields are present (Ticket Code, QR Code)
- ✅ All fields have valid coordinates
- ✅ QR codes have valid sizes
- ✅ Text fields have valid font sizes

## Error Handling

User-friendly error messages for:
- Missing base image
- Missing template name
- Missing template type
- Missing mandatory fields
- API errors with detailed messages
- Field validation errors

## Visual Design

- **Modern UI**: Clean, professional interface
- **Dark/Light Mode**: Respects system theme
- **Responsive**: Works on desktop and large tablets
- **Smooth Animations**: Polished user experience
- **Visual Hierarchy**: Clear distinction between sections
- **Color Coding**: Different colors for different field types

## Best Practices

1. **Start with Background**: Upload your template background first
2. **Name Your Template**: Use descriptive names
3. **Position Mandatory Fields**: Add and position QR code and ticket code
4. **Test Variables**: Ensure variable names match your data source
5. **Use Appropriate Fonts**: Choose web-safe fonts for consistency
6. **Check Alignment**: Use alignment controls for professional layouts
7. **Preview Before Export**: Verify all elements are correctly positioned
8. **Save Regularly**: Use the export feature to save progress

## Technical Details

### Dependencies
- **React**: UI framework
- **React Konva**: Canvas rendering
- **use-image**: Image loading for canvas
- **Tailwind CSS**: Styling
- **Radix UI**: UI components

### State Management
- Local state for editor data
- History management for undo/redo
- Synchronized field updates
- Real-time canvas rendering

### Performance
- Optimized re-renders
- Efficient canvas updates
- Image caching
- Smooth drag operations

## Future Enhancements

Potential features for future versions:
- [ ] Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- [ ] Copy/paste elements
- [ ] Duplicate elements
- [ ] Layer ordering (bring to front, send to back)
- [ ] Snap to grid
- [ ] Alignment guides
- [ ] Template presets
- [ ] Export to JSON for backup
- [ ] Import from JSON
- [ ] Custom variable creation
- [ ] Text preview with real data
- [ ] Multi-select elements
- [ ] Group elements
- [ ] Lock elements
- [ ] Custom fonts upload

## Troubleshooting

### Image not loading in canvas
- Check if the image URL is accessible
- Verify CORS headers for external images
- Try using HTTPS URLs

### Export fails
- Check console for detailed error messages
- Verify all mandatory fields are present
- Ensure template name and type are set
- Check network connection

### Element won't move
- Click to select the element first
- Check if element is within bounds
- Try using arrow keys instead of dragging

### QR code not visible
- Increase the size using the slider
- Check opacity settings
- Verify it's not behind other elements

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API endpoint is accessible
3. Review TEMPLATE_API.md for API details
4. Check field validation rules
