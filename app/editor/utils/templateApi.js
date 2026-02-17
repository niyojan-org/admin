import api from "@/lib/api";

/**
 * Validate editor fields for API contract
 * Ensures x/y are numbers (pixels) and field-specific requirements.
 */
export const validateFieldsForApi = (fields) => {
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new Error("At least one field is required");
  }
  for (const f of fields) {
    if (typeof f.x !== "number" || typeof f.y !== "number" || Number.isNaN(f.x) || Number.isNaN(f.y)) {
      throw new Error(`Invalid coordinates for field ${f.id || f.key}`);
    }
    if (f.isQR) {
      const size = f.size || Math.round(((f.width || 0) + (f.height || 0)) / 2);
      if (!size || size <= 0) {
        throw new Error(`Invalid QR size for field ${f.id || f.key}`);
      }
    } else if (f.isImage) {
      // Image fields: validate width and height
      if (!f.width || f.width <= 0 || !f.height || f.height <= 0) {
        throw new Error(`Invalid dimensions for image field ${f.id || f.key}`);
      }
    } else if (f.fontSize !== undefined) {
      // Text fields: validate font size (only if fontSize exists)
      const fontSize = f.fontSize || 0;
      if (!fontSize || fontSize <= 0) {
        throw new Error(`Invalid font size for field ${f.id || f.key}`);
      }
    } else {
      // Field without proper type identification
      console.error('Field validation issue:', f);
      throw new Error(`Field ${f.id || f.key} is missing required properties (isQR, isImage, or fontSize)`);
    }
  }
};

/**
 * Map editor fields into API `data` payload format
 */
export const mapEditorFieldsToApiFields = (fields) => {
  return fields.map((f) => {
    const baseField = {
      id: f.id,
      x: Math.round(f.x),
      y: Math.round(f.y),
      rotation: f.rotation || 0,
      opacity: f.opacity !== undefined ? f.opacity : 1,
      visible: f.visible !== undefined ? f.visible : true
    };

    if (f.isQR) {
      const size = f.size || Math.round(((f.width || 0) + (f.height || 0)) / 2);
      return {
        ...baseField,
        type: "qr",
        qr: {
          data: `{{${f.key}}}`,
          size,
          errorCorrectionLevel: f.errorCorrectionLevel || "M"
        },
        width: f.width,
        height: f.height
      };
    } else if (f.isImage) {
      return {
        ...baseField,
        type: "image",
        imageUrl: f.imageUrl || "",
        width: f.width || 150,
        height: f.height || 80
      };
    } else {
      return {
        ...baseField,
        type: "text",
        text: `{{${f.key}}}`,
        textAlign: f.align || "center",
        font: {
          family: f.fontFamily || "Inter",
          size: f.fontSize || 24,
          color: f.color || "#000000",
          weight: f.fontWeight || "normal",
          lineHeight: f.lineHeight || 1.2
        }
      };
    }
  });
};

/**
 * Create template via multipart/form-data POST /templates
 * @param {Object} params
 * @param {File} params.file - Base image file (PNG/JPG)
 * @param {string} params.name - Human-readable template name
 * @param {"ticket"|"certificate"} params.type - Template type
 * @param {Array} params.fields - Editor fields array
 * @param {Array<string>} [params.allowedVariables] - Optional allowed variable names
 * @returns {Promise<Object>} API response data
 */
export const createTemplate = async ({ file, name, type, fields, allowedVariables = [] }) => {
  if (!file) throw new Error("Base image file is required");
  if (!name || typeof name !== "string") throw new Error("Template name is required");
  if (!["ticket", "certificate"].includes(type)) throw new Error("Template type must be 'ticket' or 'certificate'");

  // Validate and map fields
  validateFieldsForApi(fields);
  const apiFields = mapEditorFieldsToApiFields(fields);

  const payload = {
    name,
    type,
    fields: apiFields,
    allowedVariables,
  };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("data", JSON.stringify(payload));

  try {
    const res = await api.post("/templates", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { success, message, data }
  } catch (error) {
    const msg = error?.response?.data?.message || error.message || "Failed to create template";
    throw new Error(msg);
  }
};
