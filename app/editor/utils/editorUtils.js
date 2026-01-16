import { toast } from "sonner";
import { FIELD_LIBRARY, FIELD_TYPES } from "../constants";

export const useHistory = (initialState = []) => {
  const [history, setHistory] = React.useState([initialState]);
  const [historyStep, setHistoryStep] = React.useState(0);

  const saveToHistory = (newState) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(JSON.parse(JSON.stringify(newState)));
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      return history[historyStep - 1];
    }
    return null;
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      return history[historyStep + 1];
    }
    return null;
  };

  return {
    saveToHistory,
    undo,
    redo,
    canUndo: historyStep > 0,
    canRedo: historyStep < history.length - 1
  };
};

export const createMandatoryFields = () => {
  const mandatoryFields = FIELD_LIBRARY.filter(f => f.mandatory);
  return mandatoryFields.map(meta => {
    const baseField = {
      id: crypto.randomUUID(),
      key: meta.key,
      x: 50,
      y: 50,
      rotation: 0,
      opacity: 1,
      visible: true
    };

    if (meta.isQR) {
      return {
        ...baseField,
        isQR: true,
        size: meta.size || 150,
        width: meta.size || 150,
        height: meta.size || 150,
        errorCorrectionLevel: meta.errorCorrectionLevel || "M"
      };
    } else if (meta.isImage) {
      return {
        ...baseField,
        isImage: true,
        imageUrl: "",
        width: meta.width || 150,
        height: meta.height || 80
      };
    } else {
      return {
        ...baseField,
        fontSize: meta.fontSize || 24,
        color: meta.color || "#000000",
        fontFamily: meta.fontFamily || "Ovo",
        fontWeight: meta.fontWeight || "normal",
        lineHeight: meta.lineHeight || 1.2,
        align: meta.textAlign || "left"
      };
    }
  });
};

export const createNewField = (selectedField) => {
  const meta = FIELD_LIBRARY.find(f => f.key === selectedField);
  if (!meta) return null;

  const baseField = {
    id: crypto.randomUUID(),
    key: meta.key,
    x: 100,
    y: 100,
    rotation: 0,
    opacity: 1,
    visible: true
  };

  if (meta.isQR) {
    return {
      ...baseField,
      isQR: true,
      size: meta.size || 150,
      width: meta.size || 150,
      height: meta.size || 150,
      errorCorrectionLevel: meta.errorCorrectionLevel || "M"
    };
  } else if (meta.isImage) {
    return {
      ...baseField,
      isImage: true,
      imageUrl: "",
      width: meta.width || 150,
      height: meta.height || 80
    };
  } else {
    return {
      ...baseField,
      fontSize: meta.fontSize || 24,
      color: meta.color || "#000000",
      fontFamily: meta.fontFamily || "Ovo",
      fontWeight: meta.fontWeight || "normal",
      lineHeight: meta.lineHeight || 1.2,
      align: meta.textAlign || "left"
    };
  }
};

export const exportTemplate = (fields, bgImageUrl) => {
  const hasMandatoryFields = FIELD_LIBRARY
    .filter(f => f.mandatory)
    .every(mandatoryField => fields.some(f => f.key === mandatoryField.key));

  if (!hasMandatoryFields) {
    const mandatoryLabels = FIELD_LIBRARY.filter(f => f.mandatory).map(f => f.label).join(", ");
    toast.error(`Please add mandatory fields: ${mandatoryLabels}`);
    return false;
  }

  const template = {
    fields: fields.map(f => {
      const baseField = {
        id: f.id,
        x: Math.round(f.x),
        y: Math.round(f.y),
        rotation: f.rotation || 0,
        opacity: f.opacity !== undefined ? f.opacity : 1,
        visible: f.visible !== undefined ? f.visible : true
      };

      if (f.isQR) {
        return {
          ...baseField,
          type: "qr",
          qr: {
            data: `{{${f.key}}}`,
            size: f.size || Math.round((f.width + f.height) / 2),
            errorCorrectionLevel: f.errorCorrectionLevel || "M"
          }
        };
      } else if (f.isImage) {
        return {
          ...baseField,
          type: "image",
          imageUrl: f.imageUrl || "",
          width: f.width,
          height: f.height
        };
      } else {
        return {
          ...baseField,
          type: "text",
          text: `{{${f.key}}}`,
          textAlign: f.align || "left",
          font: {
            family: f.fontFamily || "Ovo",
            size: f.fontSize || 24,
            color: f.color || "#000000",
            weight: f.fontWeight || "normal",
            lineHeight: f.lineHeight || 1.2
          }
        };
      }
    })
  };
  return true;
};
