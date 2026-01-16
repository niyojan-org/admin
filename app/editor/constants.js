// Field types available in the editor
export const FIELD_TYPES = {
  TEXT: "text",
  QR: "qr",
  IMAGE: "image"
};

// Template types
export const TEMPLATE_TYPES = [
  { value: "ticket", label: "Ticket" },
  { value: "certificate", label: "Certificate" }
];

// Available variables for templates
export const AVAILABLE_VARIABLES = [
  { key: "participantName", label: "Participant Name", example: "John Doe" },
  { key: "eventName", label: "Event Name", example: "Tech Conference 2026" },
  { key: "ticketCode", label: "Ticket Code", example: "TICKET-12345" },
  { key: "certificateId", label: "Certificate ID", example: "CERT-12345" },
  { key: "seat", label: "Seat Number", example: "A-25" },
  { key: "score", label: "Score", example: "95" },
  { key: "issueDate", label: "Issue Date", example: "2026-01-06" },
  { key: "eventDate", label: "Event Date", example: "2026-02-15" },
  { key: "qrCode", label: "QR Code Data", example: "https://verify.example.com/12345" }
];

export const FIELD_LIBRARY = [
  { 
    key: "participantName", 
    label: "Participant Name", 
    type: FIELD_TYPES.TEXT,
    fontSize: 48,
    fontFamily: "Ovo",
    color: "#000000",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "center"
  },
  { 
    key: "eventName", 
    label: "Event Name", 
    type: FIELD_TYPES.TEXT,
    fontSize: 36,
    fontFamily: "Ovo",
    color: "#000000",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "center"
  },
  { 
    key: "ticketCode", 
    label: "Ticket Code", 
    type: FIELD_TYPES.TEXT,
    fontSize: 28,
    fontFamily: "Ovo",
    color: "#000000",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "left",
    mandatory: true 
  },
  { 
    key: "certificateId", 
    label: "Certificate ID", 
    type: FIELD_TYPES.TEXT,
    fontSize: 24,
    fontFamily: "Ovo",
    color: "#000000",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "left"
  },
  { 
    key: "seat", 
    label: "Seat Number", 
    type: FIELD_TYPES.TEXT,
    fontSize: 28,
    fontFamily: "Ovo",
    color: "#000000",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "center"
  },
  { 
    key: "score", 
    label: "Score", 
    type: FIELD_TYPES.TEXT,
    fontSize: 28,
    fontFamily: "Ovo",
    color: "#000000",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "center"
  },
  { 
    key: "issueDate", 
    label: "Issue Date", 
    type: FIELD_TYPES.TEXT,
    fontSize: 20,
    fontFamily: "Ovo",
    color: "#666666",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "left"
  },
  { 
    key: "eventDate", 
    label: "Event Date", 
    type: FIELD_TYPES.TEXT,
    fontSize: 24,
    fontFamily: "Ovo",
    color: "#000000",
    fontWeight: "normal",
    lineHeight: 1.2,
    textAlign: "center"
  },
  { 
    key: "qrCode", 
    label: "QR Code", 
    type: FIELD_TYPES.QR,
    size: 150,
    errorCorrectionLevel: "M",
    mandatory: true,
    isQR: true 
  },
  {
    key: "logo",
    label: "Logo Image",
    type: FIELD_TYPES.IMAGE,
    width: 150,
    height: 80,
    isImage: true
  }
];

export const FONTS = [
  "Ovo", 
  "Merienda", 
  "Roboto", 
  "Arial", 
  "Helvetica", 
  "Georgia", 
  "Times New Roman",
  "Montserrat",
  "Inter"
];

export const FONT_WEIGHTS = [
  { value: "normal", label: "Normal" },
  { value: "bold", label: "Bold" },
  { value: "semibold", label: "Semibold" }
];

export const QR_ERROR_CORRECTION_LEVELS = [
  { value: "L", label: "Low (~7%)", description: "Low damage recovery" },
  { value: "M", label: "Medium (~15%)", description: "Medium damage recovery" },
  { value: "Q", label: "Quartile (~25%)", description: "Quartile damage recovery" },
  { value: "H", label: "High (~30%)", description: "High damage recovery" }
];
