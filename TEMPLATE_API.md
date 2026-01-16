# Template API Documentation

## Overview

The Template API allows you to create, manage, and customize templates for **tickets** and **certificates**. These templates define the layout and design of dynamic documents that can be generated with variable data (participant names, event details, QR codes, etc.).

**Use Cases:**
- Create certificate templates with participant names and QR codes
- Design ticket templates with event details and barcodes
- Build customizable layouts with text, images, and QR elements
- Support variable substitution for personalized documents

---

## Create Template

Creates a new template with a base image and configurable fields.

### Endpoint
```
POST /templates
```

### Authentication
- **Required:** Yes
- **Type:** Bearer Token (JWT)
- **Roles:** `owner`, `admin`

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

### Request Format

**Content-Type:** `multipart/form-data`

#### Form Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Base image for the template (PNG, JPG, GIF, WebP, or PDF). Max size: 2MB |
| `data` | JSON String | Yes | Template configuration (see structure below) |

#### `data` Field Structure

The `data` field must be a **stringified JSON object** with the following structure:

```json
{
  "name": "string (required)",
  "type": "string (required, enum: ['ticket', 'certificate'])",
  "fields": "array (required, min 1 item)",
  "allowedVariables": "array (optional)"
}
```

##### Properties

**`name`** *(string, required)*
- Human-readable template name
- Example: `"Event Certificate Template"`, `"VIP Ticket Design"`

**`type`** *(enum, required)*
- Template type
- Allowed values: `"ticket"` or `"certificate"`

**`fields`** *(array, required)*
- Array of field objects defining elements on the template
- Must contain at least 1 field
- See [Field Types](#field-types) below

**`allowedVariables`** *(array, optional)*
- List of variable names that can be used in this template
- These variables will be replaced with actual data when generating documents
- Example: `["participantName", "eventName", "certificateId", "date"]`

---

## Field Types

Each field in the `fields` array represents a visual element on the template. All fields share common properties, with type-specific requirements.

### Common Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for this field |
| `type` | enum | Yes | Field type: `"text"`, `"qr"`, or `"image"` |
| `x` | number | Yes | Horizontal position in pixels from left edge |
| `y` | number | Yes | Vertical position in pixels from top edge |
| `width` | number | No | Element width in pixels |
| `height` | number | No | Element height in pixels |
| `rotation` | number | No | Rotation in degrees (default: 0) |
| `opacity` | number | No | Opacity from 0 to 1 (default: 1) |
| `visible` | boolean | No | Whether field is visible (default: true) |

---

### 1. Text Field

Used for displaying text content with font styling.

#### Required Properties
```json
{
  "id": "participant_name",
  "type": "text",
  "x": 100,
  "y": 200,
  "text": "{{participantName}}",
  "font": {
    "family": "Arial",
    "size": 24,
    "color": "#000000"
  }
}
```

#### Additional Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | string | Yes | Text content (supports variable syntax: `{{variableName}}`) |
| `font.family` | string | Yes | Font family name (e.g., "Arial", "Helvetica") |
| `font.size` | number | Yes | Font size in pixels |
| `font.color` | string | No | Hex color code (default: `"#000000"`) |
| `font.weight` | enum | No | Font weight: `"normal"`, `"bold"`, `"semibold"` (default: `"normal"`) |
| `font.lineHeight` | number | No | Line height multiplier (default: 1.2) |
| `textAlign` | enum | No | Alignment: `"left"`, `"center"`, `"right"` (default: `"center"`) |

#### Example
```json
{
  "id": "event_title",
  "type": "text",
  "x": 300,
  "y": 150,
  "text": "{{eventName}}",
  "textAlign": "center",
  "font": {
    "family": "Montserrat",
    "size": 36,
    "weight": "bold",
    "color": "#1a1a1a",
    "lineHeight": 1.4
  }
}
```

---

### 2. QR Code Field

Generates QR codes with encoded data.

#### Required Properties
```json
{
  "id": "certificate_qr",
  "type": "qr",
  "x": 500,
  "y": 500,
  "qr": {
    "data": "{{certificateId}}",
    "size": 100
  }
}
```

#### Additional Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `qr.data` | string | Yes | Data to encode (supports variable syntax: `{{variableName}}`) |
| `qr.size` | number | Yes | QR code size in pixels |
| `qr.errorCorrectionLevel` | enum | No | Error correction: `"L"`, `"M"`, `"Q"`, `"H"` (default: `"M"`) |

#### Error Correction Levels
- **L** (Low): ~7% damage recovery
- **M** (Medium): ~15% damage recovery *(default)*
- **Q** (Quartile): ~25% damage recovery
- **H** (High): ~30% damage recovery

#### Example
```json
{
  "id": "verification_qr",
  "type": "qr",
  "x": 50,
  "y": 650,
  "qr": {
    "data": "https://verify.example.com/{{certificateId}}",
    "size": 150,
    "errorCorrectionLevel": "H"
  }
}
```

---

### 3. Image Field

Displays static or dynamic images.

#### Required Properties
```json
{
  "id": "logo",
  "type": "image",
  "x": 50,
  "y": 50,
  "imageUrl": "https://example.com/logo.png"
}
```

#### Additional Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `imageUrl` | string | Yes | URL of the image to display |
| `width` | number | No | Image width in pixels |
| `height` | number | No | Image height in pixels |

#### Example
```json
{
  "id": "sponsor_logo",
  "type": "image",
  "x": 700,
  "y": 50,
  "width": 150,
  "height": 80,
  "imageUrl": "https://cdn.example.com/sponsors/logo.png"
}
```

---

## Complete Request Example

### JavaScript (Fetch API)

```javascript
async function createTemplate({ token, imageFile, templateData }) {
  const formData = new FormData();
  
  // Add the base image file
  formData.append('file', imageFile);
  
  // Add template configuration as stringified JSON
  formData.append('data', JSON.stringify(templateData));

  const response = await fetch('https://api.example.com/templates', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create template');
  }

  return await response.json();
}

// Usage
const templateData = {
  name: "Event Certificate Template",
  type: "certificate",
  fields: [
    {
      id: "participant_name",
      type: "text",
      x: 400,
      y: 300,
      text: "{{participantName}}",
      textAlign: "center",
      font: {
        family: "Georgia",
        size: 32,
        weight: "bold",
        color: "#2c3e50"
      }
    },
    {
      id: "event_name",
      type: "text",
      x: 400,
      y: 200,
      text: "{{eventName}}",
      textAlign: "center",
      font: {
        family: "Arial",
        size: 24,
        color: "#34495e"
      }
    },
    {
      id: "certificate_qr",
      type: "qr",
      x: 650,
      y: 550,
      qr: {
        data: "https://verify.example.com/cert/{{certificateId}}",
        size: 120,
        errorCorrectionLevel: "H"
      }
    }
  ],
  allowedVariables: [
    "participantName",
    "eventName",
    "certificateId",
    "issueDate"
  ]
};

// Get file from input element
const fileInput = document.getElementById('template-image');
const imageFile = fileInput.files[0];

// Create template
const result = await createTemplate({
  token: 'your-jwt-token',
  imageFile: imageFile,
  templateData: templateData
});

console.log('Template created:', result.data);
```

### cURL Example

```bash
curl -X POST "https://api.example.com/templates" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/certificate-background.png" \
  -F 'data={
    "name": "Certificate Template",
    "type": "certificate",
    "fields": [
      {
        "id": "name",
        "type": "text",
        "x": 400,
        "y": 300,
        "text": "{{participantName}}",
        "font": {
          "family": "Arial",
          "size": 28,
          "color": "#000000"
        }
      },
      {
        "id": "qr",
        "type": "qr",
        "x": 600,
        "y": 500,
        "qr": {
          "data": "{{certificateId}}",
          "size": 100
        }
      }
    ],
    "allowedVariables": ["participantName", "certificateId"]
  }'
```

---

## Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "_id": "6785a3f1e4b0c8d9a1234567",
    "name": "Event Certificate Template",
    "type": "certificate",
    "baseImage": {
      "url": "https://res.cloudinary.com/example/templates/certificate/1736789489-background.png",
      "width": 1920,
      "height": 1080,
      "publicId": "templates/certificate/1736789489-background"
    },
    "fields": [
      {
        "id": "participant_name",
        "type": "text",
        "x": 400,
        "y": 300,
        "text": "{{participantName}}",
        "textAlign": "center",
        "font": {
          "family": "Georgia",
          "size": 32,
          "weight": "bold",
          "color": "#2c3e50",
          "lineHeight": 1.2
        },
        "rotation": 0,
        "opacity": 1,
        "visible": true
      }
    ],
    "allowedVariables": ["participantName", "eventName", "certificateId"],
    "version": 1,
    "isDefault": false,
    "createdBy": "693582b11d9917e2c6b3f5a9",
    "createdAt": "2026-01-06T18:30:00.000Z",
    "updatedAt": "2026-01-06T18:30:00.000Z"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "status": 400,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

#### Authentication Errors (401)

| Code | Message | Cause |
|------|---------|-------|
| `TOKEN_REQUIRED` | Access denied. Token required in Authorization header. | No Bearer token provided |
| `TOKEN_EXPIRED` | Token expired. Please log in again. | JWT token has expired |
| `TOKEN_INVALID` | Invalid token. | Malformed or invalid JWT |
| `SESSION_EXPIRED` | Session expired or logged in from another device. | User session revoked |

#### Authorization Errors (403)

| Code | Message | Cause |
|------|---------|-------|
| `FORBIDDEN` | You do not have permission to perform this action. | User lacks `owner` or `admin` role |

#### Validation Errors (400)

| Code | Message | Description |
|------|---------|-------------|
| `BASE_IMAGE_REQUIRED` | Base image file is required | No file uploaded in `file` field |
| `TEMPLATE_DATA_REQUIRED` | Template data is required | No data provided in `data` field |
| `TEMPLATE_NAME_REQUIRED` | Template name is required | Missing `name` property |
| `INVALID_TEMPLATE_TYPE` | Invalid template type | `type` is not "ticket" or "certificate" |
| `INVALID_FIELDS_FORMAT` | Fields must be an array | `fields` is not an array |
| `NO_FIELDS_PROVIDED` | At least one field is required | `fields` array is empty |
| `FIELD_ID_REQUIRED` | Field[n]: id is required | Field missing `id` property |
| `FIELD_TYPE_REQUIRED` | Field[n]: type is required | Field missing `type` property |
| `FIELD_POSITION_REQUIRED` | Field[n]: x & y are required | Field missing `x` or `y` coordinates |
| `FIELD_TEXT_REQUIRED` | Field[n]: text is required | Text field missing `text` property |
| `FIELD_FONT_REQUIRED` | Field[n]: font family & size required | Text field missing font configuration |
| `FIELD_QR_REQUIRED` | Field[n]: qr data & size required | QR field missing `qr.data` or `qr.size` |

#### Server Errors (500)

| Code | Message | Cause |
|------|---------|-------|
| `TEMPLATE_CREATION_FAILED` | Failed to create template | Unexpected server error |
| `CLOUDINARY_UPLOAD_ERROR` | Failed to upload file to Cloudinary | Image upload failed |

---

## Frontend Integration Guide

### 1. File Upload Component

```jsx
import { useState } from 'react';

function TemplateCreator() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={handleFileSelect}
      />
      {imagePreview && <img src={imagePreview} alt="Preview" />}
    </div>
  );
}
```

### 2. Canvas Editor Integration

For Canva-like editors, export the canvas as a blob/file and the layout configuration:

```javascript
// Export canvas as image
async function exportCanvasAsFile(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'template.png', { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
}

// Convert canvas editor state to template data
function canvasToTemplateData(canvasState) {
  return {
    name: canvasState.templateName,
    type: canvasState.documentType, // 'ticket' or 'certificate'
    fields: canvasState.elements.map((element) => {
      if (element.type === 'text') {
        return {
          id: element.id,
          type: 'text',
          x: element.position.x,
          y: element.position.y,
          text: element.content,
          textAlign: element.align,
          font: {
            family: element.fontFamily,
            size: element.fontSize,
            weight: element.fontWeight,
            color: element.color
          }
        };
      }
      
      if (element.type === 'qrcode') {
        return {
          id: element.id,
          type: 'qr',
          x: element.position.x,
          y: element.position.y,
          qr: {
            data: element.qrData,
            size: element.size,
            errorCorrectionLevel: element.errorCorrection
          }
        };
      }
      
      // Add more element types as needed
    }),
    allowedVariables: canvasState.variables || []
  };
}

// Usage
const canvasElement = document.getElementById('template-canvas');
const imageFile = await exportCanvasAsFile(canvasElement);
const templateData = canvasToTemplateData(editorState);

await createTemplate({ token, imageFile, templateData });
```

### 3. Variable Placeholder UI

Help users insert variable placeholders:

```javascript
const AVAILABLE_VARIABLES = [
  { key: 'participantName', label: 'Participant Name', example: 'John Doe' },
  { key: 'eventName', label: 'Event Name', example: 'Tech Conference 2026' },
  { key: 'certificateId', label: 'Certificate ID', example: 'CERT-12345' },
  { key: 'issueDate', label: 'Issue Date', example: '2026-01-06' },
  { key: 'eventDate', label: 'Event Date', example: '2026-02-15' }
];

function VariablePicker({ onSelect }) {
  return (
    <div className="variable-picker">
      <h3>Insert Variable</h3>
      {AVAILABLE_VARIABLES.map((variable) => (
        <button
          key={variable.key}
          onClick={() => onSelect(`{{${variable.key}}}`)}
        >
          {variable.label}
          <span className="example">{variable.example}</span>
        </button>
      ))}
    </div>
  );
}
```

### 4. Error Handling

```javascript
async function createTemplate({ token, imageFile, templateData }) {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('data', JSON.stringify(templateData));

    const response = await fetch('/templates', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle specific error codes
      switch (result.error.code) {
        case 'TOKEN_EXPIRED':
          // Redirect to login
          window.location.href = '/login';
          break;
        case 'FIELD_TEXT_REQUIRED':
          // Show field validation error
          showFieldError('Text content is required');
          break;
        case 'INVALID_TEMPLATE_TYPE':
          // Show type selection error
          showTypeError('Please select ticket or certificate');
          break;
        default:
          showError(result.message);
      }
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error('Template creation failed:', error);
    throw error;
  }
}
```

### 5. Form Validation

Validate before submission to provide better UX:

```javascript
function validateTemplateData(data, imageFile) {
  const errors = [];

  if (!imageFile) {
    errors.push('Please upload a base image');
  }

  if (!data.name || data.name.trim() === '') {
    errors.push('Template name is required');
  }

  if (!['ticket', 'certificate'].includes(data.type)) {
    errors.push('Please select a valid template type');
  }

  if (!data.fields || data.fields.length === 0) {
    errors.push('Add at least one field to the template');
  }

  data.fields?.forEach((field, index) => {
    if (!field.id) errors.push(`Field ${index + 1}: Missing ID`);
    if (!field.type) errors.push(`Field ${index + 1}: Missing type`);
    if (field.x === undefined) errors.push(`Field ${index + 1}: Missing X position`);
    if (field.y === undefined) errors.push(`Field ${index + 1}: Missing Y position`);

    if (field.type === 'text') {
      if (!field.text) errors.push(`Field ${index + 1}: Missing text content`);
      if (!field.font?.family) errors.push(`Field ${index + 1}: Missing font family`);
      if (!field.font?.size) errors.push(`Field ${index + 1}: Missing font size`);
    }

    if (field.type === 'qr') {
      if (!field.qr?.data) errors.push(`Field ${index + 1}: Missing QR data`);
      if (!field.qr?.size) errors.push(`Field ${index + 1}: Missing QR size`);
    }
  });

  return errors;
}

// Usage
const errors = validateTemplateData(templateData, imageFile);
if (errors.length > 0) {
  showErrors(errors);
  return;
}
```

---

## Best Practices

### 1. Coordinate System
- Origin (0,0) is at the **top-left corner**
- X increases to the right
- Y increases downward
- All coordinates are in **pixels**
- Use the base image dimensions as boundaries

### 2. Variable Naming
- Use camelCase: `participantName`, not `participant_name`
- Be descriptive: `eventStartDate` instead of `date1`
- List all variables in `allowedVariables` for validation

### 3. Font Selection
- Test fonts availability in your rendering engine
- Provide fallback fonts: `"Arial, Helvetica, sans-serif"`
- Consider web-safe fonts for consistency

### 4. Image Optimization
- Recommended base image size: 1920x1080 px (Full HD)
- Use PNG for transparency support
- Keep file size under 5MB for faster uploads
- Higher DPI (300) for print-quality certificates

### 5. QR Code Sizing
- Minimum size: 100px for reliable scanning
- Recommended: 120-150px
- Higher error correction = larger QR code
- Test scanning with actual devices

### 6. Testing Templates
- Validate with real variable data
- Check all field positions and alignments
- Test different name lengths (short/long)
- Verify QR code scannability
- Preview at actual print size

---

## Rate Limits

- **Requests:** 100 per hour per user
- **File Size:** Max 10MB per upload
- **Concurrent Requests:** 5 per user

---

## Support

For additional help:
- **API Issues:** Open a ticket in your project repository
- **Integration Questions:** Contact the backend team
- **Feature Requests:** Submit via GitHub Issues

---

**Version:** 1.0.0  
**Last Updated:** January 6, 2026
