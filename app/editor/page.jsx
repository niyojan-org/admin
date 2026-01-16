"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import EditorSidebar from "./components/EditorSidebar";
import TicketCanvas from "./components/TicketCanvas";
import ImageUploadScreen from "./components/ImageUploadScreen";
import { FIELD_LIBRARY, AVAILABLE_VARIABLES } from "./constants";
import { createMandatoryFields, createNewField, exportTemplate } from "./utils/editorUtils";
import { toast } from "sonner";


export default function EditorPage() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [bgImage, setBgImage] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const [bgImageFile, setBgImageFile] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Template metadata
  const [templateName, setTemplateName] = useState("My Template");
  const [templateType, setTemplateType] = useState("ticket");

  // Loading state
  const [isExporting, setIsExporting] = useState(false);

  // History management
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Helper to ensure fields have required type properties
  const ensureFieldTypeProperties = (field) => {
    // If field already has proper type markers, return as is
    if (field.isQR || field.isImage || field.fontSize !== undefined) {
      return field;
    }
    
    // Look up the field definition from FIELD_LIBRARY using the key
    if (field.key) {
      const meta = FIELD_LIBRARY.find(f => f.key === field.key);
      if (meta) {
        if (meta.isQR) {
          return { ...field, isQR: true, size: field.size || meta.size || 150 };
        } else if (meta.isImage) {
          return { ...field, isImage: true };
        } else {
          // Text field - restore fontSize and other text properties
          return { 
            ...field, 
            fontSize: field.fontSize || meta.fontSize || 24,
            color: field.color || meta.color || "#000000",
            fontFamily: field.fontFamily || meta.fontFamily || "Ovo",
            fontWeight: field.fontWeight || meta.fontWeight || "normal",
            lineHeight: field.lineHeight || meta.lineHeight || 1.2,
            align: field.align || meta.textAlign || "center"
          };
        }
      }
    }
    
    // Try to infer from other properties if no key match
    if (field.size !== undefined && field.width && field.height) {
      console.warn('Field missing type properties, inferring QR from size:', field);
      return { ...field, isQR: true };
    }
    if (field.imageUrl !== undefined) {
      console.warn('Field missing type properties, inferring Image from imageUrl:', field);
      return { ...field, isImage: true };
    }
    
    // Default to text field with default fontSize if nothing else matches
    console.error('Field missing type properties and cannot infer type, defaulting to text:', field);
    return { ...field, fontSize: 24, color: "#000000", fontFamily: "Ovo", align: "center" };
  };

  // Reset all state when image changes
  const resetState = useCallback(() => {
    setFields([]);
    setSelectedField("");
    setEditingField(null);
    setSelectedId(null);
    setHistory([]);
    setHistoryStep(-1);
  }, []);

  // Initialize with mandatory fields after image is loaded
  const initializeFields = useCallback(() => {
    const mandatoryFields = createMandatoryFields();
    setFields(mandatoryFields);
    setHistory([JSON.parse(JSON.stringify(mandatoryFields))]);
    setHistoryStep(0);
  }, []);

  // Save to history
  const saveToHistory = (newFields) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFields)));
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setFields(JSON.parse(JSON.stringify(history[historyStep - 1])));
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setFields(JSON.parse(JSON.stringify(history[historyStep + 1])));
    }
  };

  // Responsive canvas - calculate based on container size
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [isImageLoaded]);

  // Load base image and get its actual dimensions
  useEffect(() => {
    if (!bgImageUrl) {
      setBgImage(null);
      setImageDimensions({ width: 0, height: 0 });
      setIsImageLoaded(false);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = bgImageUrl;
    img.onload = () => {
      setBgImage(img);
      setImageDimensions({ width: img.width, height: img.height });
      setIsImageLoaded(true);
      // Initialize fields after image loads
      initializeFields();
    };
  }, [bgImageUrl, initializeFields]);

  // Calculate scale to fit within container while maintaining aspect ratio
  const calculateScale = () => {
    if (!imageDimensions.width || !imageDimensions.height) return 1;

    const { width: containerWidth, height: containerHeight } = containerSize;
    const { width: imageWidth, height: imageHeight } = imageDimensions;

    // Calculate scale to fit both width and height
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;

    // Use the smaller scale to ensure it fits
    return Math.min(scaleX, scaleY, 1); // Max scale of 1 to not upscale
  };

  const scale = calculateScale();

  // Image upload handler - reset everything on new image
  const handleImageUpload = (payload) => {
    // Accept both string (legacy) and object { file, dataUrl }
    resetState();
    if (typeof payload === "string") {
      setBgImageUrl(payload);
      setBgImageFile(null);
    } else if (payload && typeof payload === "object") {
      setBgImageUrl(payload.dataUrl);
      setBgImageFile(payload.file || null);
    }
  };

  const addField = (selectedKey, overrides = {}) => {
    const meta = FIELD_LIBRARY.find(f => f.key === selectedKey);
    if (!meta) return;

    // Allow re-adding even mandatory fields

    const baseField = createNewField(selectedKey);
    if (!baseField) return;
    const newField = { ...baseField, ...overrides };
    const newFields = [...fields, newField];
    setFields(newFields);
    saveToHistory(newFields);
    setSelectedField("");
  };

  const updateField = (id, updates) => {
    const newFields = fields.map(f => {
      if (f.id === id) {
        // Preserve field type properties when updating
        const updatedField = { ...f, ...updates };
        
        // Ensure type flags are preserved
        if (f.isQR && !updates.hasOwnProperty('isQR')) {
          updatedField.isQR = true;
        }
        if (f.isImage && !updates.hasOwnProperty('isImage')) {
          updatedField.isImage = true;
        }
        
        return updatedField;
      }
      return f;
    });
    setFields(newFields);
    saveToHistory(newFields);
  };

  const deleteField = (id) => {
    const field = fields.find(f => f.id === id);
    const meta = FIELD_LIBRARY.find(f => f.key === field?.key);

    if (meta?.mandatory) {
      toast.error(`${meta.label} is mandatory and cannot be deleted`);
      return;
    }

    const newFields = fields.filter(f => f.id !== id);
    setFields(newFields);
    saveToHistory(newFields);
    if (editingField?.id === id) setEditingField(null);
    if (selectedId === id) setSelectedId(null);
  };

  const handleExport = async () => {
    // Build payload and submit to backend
    if (isExporting) return; // Prevent multiple submissions
    
    try {
      if (!bgImageFile) {
        toast.error("Please upload a base image before exporting");
        return;
      }

      if (!templateName || templateName.trim() === "") {
        toast.error("Please enter a template name");
        return;
      }

      if (!templateType) {
        toast.error("Please select a template type");
        return;
      }

      // Ensure all fields have proper type properties before validation
      const validatedFields = fields.map(ensureFieldTypeProperties);

      // Validate mandatory fields using existing utility
      const ok = exportTemplate(validatedFields, bgImageUrl);
      if (!ok) return;

      setIsExporting(true);
      toast.loading("Creating template...", { id: "export-template" });

      // Map fields to API payload and create template
      const { createTemplate } = await import("./utils/templateApi");

      // Collect all unique variable keys from fields
      const allowedVariables = Array.from(new Set(validatedFields.map(f => f.key)));

      const res = await createTemplate({
        file: bgImageFile,
        name: templateName,
        type: templateType,
        fields: validatedFields, // Pass editor fields, not API fields
        allowedVariables,
      });

      toast.success(res?.data?.message || res?.message || "Template created successfully", { id: "export-template" });
      console.log("Template API response:", res);
    } catch (err) {
      toast.error(err.message || "Failed to export template", { id: "export-template" });
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Canvas event handlers
  const handleSelectField = (field) => {
    setSelectedId(field.id);
    setEditingField(field);
  };

  const handleDeselectAll = () => {
    setSelectedId(null);
    setEditingField(null);
  };

  const handleFieldDragEnd = (index, event, isBackground = false) => {
    const updated = [...fields];
    const offset = isBackground ? 5 : 0;
    updated[index] = {
      ...updated[index],
      x: event.target.x() + offset,
      y: event.target.y() + offset
    };
    setFields(updated);
    saveToHistory(updated);
  };

  const handleFieldTransformEnd = (index, event, field, isBackground = false) => {
    const node = event.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const offset = isBackground ? 5 : 0;
    const updated = [...fields];

    if (field.isQR) {
      const newWidth = Math.max(50, node.width() * scaleX);
      const newHeight = Math.max(50, node.height() * scaleY);

      node.scaleX(1);
      node.scaleY(1);

      updated[index] = {
        ...updated[index],
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
        size: Math.round((newWidth + newHeight) / 2)
      };
    } else if (field.isImage) {
      // For images, update dimensions based on scale
      const newWidth = Math.max(50, node.width() * scaleX);
      const newHeight = Math.max(50, node.height() * scaleY);

      node.scaleX(1);
      node.scaleY(1);

      updated[index] = {
        ...updated[index],
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight
      };
    } else {
      // For text, just update position
      updated[index] = {
        ...updated[index],
        x: node.x() + offset,
        y: node.y() + offset
      };
    }

    setFields(updated);
    saveToHistory(updated);
  };

  // Keep editingField in sync with the latest state for the selectedId
  useEffect(() => {
    if (!selectedId) return;
    const current = fields.find((f) => f.id === selectedId);
    if (current) {
      setEditingField(current);
    }
  }, [fields, selectedId]);

  // Keyboard arrow nudge for selected field
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!selectedId) return;
      const idx = fields.findIndex((f) => f.id === selectedId);
      if (idx === -1) return;

      const step = e.shiftKey ? 10 : 1;
      let handled = false;

      const updated = [...fields];
      const field = updated[idx];
      let x = field.x;
      let y = field.y;
      const w = field.isQR ? (field.width || field.size || 50) : 50;
      const h = field.isQR ? (field.height || field.size || 50) : (field.fontSize || 12);

      switch (e.key) {
        case "ArrowLeft":
          x = Math.max(0, x - step);
          handled = true;
          break;
        case "ArrowRight":
          x = Math.min(imageDimensions.width - w, x + step);
          handled = true;
          break;
        case "ArrowUp":
          y = Math.max(0, y - step);
          handled = true;
          break;
        case "ArrowDown":
          y = Math.min(imageDimensions.height - h, y + step);
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        e.preventDefault();
        updated[idx] = { ...field, x, y };
        setFields(updated);
        saveToHistory(updated);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, fields, imageDimensions]);

  // Show upload screen if no image is loaded
  if (!isImageLoaded) {
    return <ImageUploadScreen onImageUpload={handleImageUpload} />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden px-2 pl-6 gap-2">
      <EditorSidebar
        onImageUpload={handleImageUpload}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyStep > 0}
        canRedo={historyStep < history.length - 1}
        selectedField={selectedField}
        onFieldChange={setSelectedField}
        onAddField={addField}
        fields={fields}
        editingField={editingField}
        onUpdateField={updateField}
        onDeleteField={deleteField}
        onCloseEditor={() => setEditingField(null)}
        onExport={handleExport}
        selectedId={selectedId}
        onSelectField={handleSelectField}
        templateName={templateName}
        templateType={templateType}
        onTemplateNameChange={setTemplateName}
        onTemplateTypeChange={setTemplateType}
        isExporting={isExporting}
      />

      <TicketCanvas
        containerRef={containerRef}
        stageRef={stageRef}
        transformerRef={transformerRef}
        bgImage={bgImage}
        imageDimensions={imageDimensions}
        fields={fields}
        selectedId={selectedId}
        onSelectField={handleSelectField}
        onDeselectAll={handleDeselectAll}
        onFieldDragEnd={handleFieldDragEnd}
        onFieldTransformEnd={handleFieldTransformEnd}
        scale={scale}
        onSave={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
}
