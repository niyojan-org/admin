# Dynamic Fields API Documentation

## Overview
The Dynamic Fields API allows you to manage custom input fields for events. These fields can be used to collect additional information from event participants during registration.

## Base URL
```
/event/admin/dynamic-field/{eventId}
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authorization Roles
- **owner**: Full access to all operations
- **admin**: Full access to all operations
- **manager**: Read-only access (GET operations only)

---

## Endpoints

### 1. Add Dynamic Field
**POST** `/event/admin/dynamic-field/{eventId}`

Adds a new dynamic field to an event.

#### Required Roles
- `owner`, `admin`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |

#### Request Body
```json
{
  "label": "string",           // Required: Display label for the field
  "name": "string",            // Required: Unique field name (alphanumeric + underscores)
  "type": "string",            // Required: Field type (see supported types below)
  "placeholder": "string",     // Optional: Placeholder text
  "required": boolean,         // Optional: Whether field is required (default: false)
  "options": [                 // Required for radio, dropdown, checkbox types
    {
      "label": "string",
      "value": "string|number"  // Can be string or number
    }
  ],
  "maxLength": number,         // Optional: Max length for text fields
  "min": number,              // Optional: Min value for number fields
  "max": number               // Optional: Max value for number fields
}
```

#### Supported Field Types
- `text` - Single line text input
- `textarea` - Multi-line text input
- `number` - Numeric input
- `email` - Email input with validation
- `checkbox` - Checkbox input
- `radio` - Radio button group
- `dropdown` - Select dropdown
- `date` - Date picker
- `file` - File upload
- `tel` - Telephone number
- `url` - URL input

#### Response
```json
{
  "success": true,
  "message": "Dynamic field added successfully",
  "dynamicFields": [
    {
      "_id": "string",
      "label": "string",
      "name": "string",
      "type": "string",
      "placeholder": "string",
      "required": boolean,
      "options": [],
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date",
      "createdBy": "string"
    }
  ],
  "totalFields": number
}
```

#### Error Responses
- `400` - Invalid field data or validation error
- `401` - Authentication required
- `403` - Insufficient permissions
- `404` - Event not found

---

### 2. Get All Dynamic Fields
**GET** `/event/admin/dynamic-field/{eventId}`

Retrieves all dynamic fields for an event.

#### Required Roles
- `owner`, `admin`, `manager`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |

#### Response
```json
{
  "success": true,
  "message": "Dynamic fields retrieved successfully",
  "dynamicFields": [
    {
      "_id": "string",
      "label": "string",
      "name": "string",
      "type": "string",
      "placeholder": "string",
      "required": boolean,
      "options": [],
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date",
      "createdBy": "string"
    }
  ],
  "totalFields": number
}
```

---

### 3. Get Dynamic Field by ID
**GET** `/event/admin/dynamic-field/{eventId}/{fieldId}`

Retrieves a specific dynamic field by its ID.

#### Required Roles
- `owner`, `admin`, `manager`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |
| fieldId | string | The unique identifier of the field |

#### Response
```json
{
  "success": true,
  "message": "Dynamic field retrieved successfully",
  "field": {
    "_id": "string",
    "label": "string",
    "name": "string",
    "type": "string",
    "placeholder": "string",
    "required": boolean,
    "options": [],
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date",
    "createdBy": "string"
  }
}
```

#### Error Responses
- `404` - Field not found

---

### 4. Update Dynamic Field
**PUT** `/event/admin/dynamic-field/{eventId}/{fieldId}`

Updates an existing dynamic field.

#### Required Roles
- `owner`, `admin`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |
| fieldId | string | The unique identifier of the field |

#### Request Body
Same as Add Dynamic Field, but all fields are optional. Only provided fields will be updated.

#### Response
```json
{
  "success": true,
  "message": "Dynamic field updated successfully",
  "dynamicFields": [
    {
      "_id": "string",
      "label": "string",
      "name": "string",
      "type": "string",
      "placeholder": "string",
      "required": boolean,
      "options": [],
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date",
      "updatedBy": "string"
    }
  ],
  "totalFields": number
}
```

---

### 5. Delete Dynamic Field
**DELETE** `/event/admin/dynamic-field/{eventId}/{fieldId}`

Deletes a dynamic field from an event.

#### Required Roles
- `owner`, `admin`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |
| fieldId | string | The unique identifier of the field |

#### Response
```json
{
  "success": true,
  "message": "Dynamic field deleted successfully",
  "deletedFieldId": "string",
  "dynamicFields": [],
  "remainingFields": number
}
```

---

### 6. Arrange Dynamic Fields
**POST** `/event/admin/dynamic-field/{eventId}/arrange`

Reorders the dynamic fields for an event.

#### Required Roles
- `owner`, `admin`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | The unique identifier of the event |

#### Request Body
```json
{
  "order": ["fieldId1", "fieldId2", "fieldId3"]  // Array of field IDs in desired order
}
```

#### Response
```json
{
  "success": true,
  "message": "Dynamic fields arranged successfully",
  "dynamicFields": [
    {
      "_id": "string",
      "label": "string",
      "name": "string",
      "type": "string"
    }
  ],
  "totalFields": number
}
```

#### Validation Rules
- All existing field IDs must be included in the order array
- No duplicate IDs allowed
- All IDs must be valid ObjectIds
- All IDs must exist in the event

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error description"
  }
}
```

### Common Error Codes
- `FIELD_DATA_REQUIRED` - Field data is missing or invalid
- `FIELD_LABEL_REQUIRED` - Field label is missing
- `FIELD_NAME_REQUIRED` - Field name is missing
- `INVALID_FIELD_NAME_FORMAT` - Field name format is invalid
- `DUPLICATE_FIELD_NAME` - Field name already exists
- `INVALID_FIELD_TYPE` - Unsupported field type
- `FIELD_OPTIONS_REQUIRED` - Options required for choice fields
- `EVENT_NOT_FOUND` - Event not found or no access
- `FIELD_NOT_FOUND` - Dynamic field not found
- `ORDER_ARRAY_REQUIRED` - Order array is missing for arrange operation

---

## Validation Rules

### Field Name Requirements
- Must start with a letter
- Can contain letters, numbers, and underscores only
- Must be unique within the event
- Cannot be empty

### Field Type Specific Validations
- **Choice fields** (radio, dropdown, checkbox): Must have at least one option
- **Text fields**: Optional maxLength validation
- **Number fields**: Optional min/max validation
- **All fields**: Required flag validation (boolean)

### Options Format (for choice fields)
```json
{
  "label": "Display Text",           // Required: What users see
  "value": "internal_value|number"   // Required: What gets stored (string or number)
}
```

---

## Examples

### Example 1: Adding a Text Field
```json
POST /event/admin/dynamic-field/64a7b8c9d1e2f3a4b5c6d7e8
{
  "label": "Company Name",
  "name": "company_name",
  "type": "text",
  "placeholder": "Enter your company name",
  "required": true,
  "maxLength": 100
}
```

### Example 2: Adding a Dropdown Field
```json
POST /event/admin/dynamic-field/64a7b8c9d1e2f3a4b5c6d7e8
{
  "label": "T-Shirt Size",
  "name": "tshirt_size",
  "type": "dropdown",
  "required": true,
  "options": [
    {"label": "Small", "value": "S"},
    {"label": "Medium", "value": "M"},
    {"label": "Large", "value": "L"},
    {"label": "Extra Large", "value": "XL"}
  ]
}
```

### Example 3: Arranging Fields
```json
POST /event/admin/dynamic-field/64a7b8c9d1e2f3a4b5c6d7e8/arrange
{
  "order": [
    "64a7b8c9d1e2f3a4b5c6d7e9",
    "64a7b8c9d1e2f3a4b5c6d7ea",
    "64a7b8c9d1e2f3a4b5c6d7eb"
  ]
}
```
