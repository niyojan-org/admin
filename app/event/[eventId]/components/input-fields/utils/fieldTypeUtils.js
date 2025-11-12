import { 
  IconTextCaption,
  IconNumbers,
  IconChevronDown,
  IconSquareCheck,
  IconCircleDot,
  IconTextSize,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUpload,
  IconLink
} from "@tabler/icons-react";

export const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "url", label: "URL" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "radio", label: "Radio Group" },
  { value: "checkbox", label: "Checkbox" }
];

export const getFieldTypeIcon = (type) => {
  const iconMap = {
    text: IconTextCaption,
    textarea: IconTextSize,
    number: IconNumbers,
    email: IconMail,
    tel: IconPhone,
    url: IconLink,
    date: IconCalendar,
    dropdown: IconChevronDown,
    radio: IconCircleDot,
    checkbox: IconSquareCheck,
    file: IconUpload,
  };
  
  return iconMap[type] || IconTextCaption;
};

export const getFieldTypeColor = (type) => {
  const colorMap = {
    text: "text-blue-600 bg-blue-50 border-blue-200",
    textarea: "text-indigo-600 bg-indigo-50 border-indigo-200",
    number: "text-purple-600 bg-purple-50 border-purple-200",
    email: "text-green-600 bg-green-50 border-green-200",
    tel: "text-orange-600 bg-orange-50 border-orange-200",
    url: "text-cyan-600 bg-cyan-50 border-cyan-200",
    date: "text-rose-600 bg-rose-50 border-rose-200",
    dropdown: "text-pink-600 bg-pink-50 border-pink-200",
    radio: "text-yellow-600 bg-yellow-50 border-yellow-200",
    checkbox: "text-teal-600 bg-teal-50 border-teal-200",
    file: "text-gray-600 bg-gray-50 border-gray-200",
  };
  
  return colorMap[type] || "text-gray-600 bg-gray-50 border-gray-200";
};
