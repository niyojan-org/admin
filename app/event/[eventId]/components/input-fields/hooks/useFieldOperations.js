import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export function useFieldOperations(eventId, callbacks = {}) {
  const [fieldForm, setFieldForm] = useState({
    label: "",
    name: "",
    type: "text",
    required: false,
    options: [],
    placeholder: "",
    newOption: "",
    maxLength: "",
    min: "",
    max: ""
  });

  const resetForm = () => {
    setFieldForm({
      label: "",
      name: "",
      type: "text",
      required: false,
      options: [],
      placeholder: "",
      newOption: "",
      maxLength: "",
      min: "",
      max: ""
    });
  };

  const preparePayload = (formData) => {
    const payload = { ...formData };
    
    // Handle options for choice fields
    if (["dropdown", "checkbox", "radio"].includes(payload.type)) {
      if (typeof payload.options === "string") {
        // Convert string to array of option objects
        payload.options = payload.options
          .split(",")
          .map(o => o.trim())
          .filter(Boolean)
          .map(option => ({
            label: option,
            value: option
          }));
      } else if (Array.isArray(payload.options)) {
        // Ensure each option has the correct format
        payload.options = payload.options.map(option => {
          if (typeof option === "string") {
            return {
              label: option,
              value: option
            };
          } else if (typeof option === "object" && option.label && option.value !== undefined) {
            return {
              label: option.label,
              value: option.value
            };
          } else {
            // Fallback for malformed options
            return {
              label: String(option),
              value: String(option)
            };
          }
        });
      } else {
        payload.options = [];
      }
    } else {
      payload.options = [];
    }

    // Handle maxLength for text fields
    if (["text", "textarea"].includes(payload.type) && payload.maxLength) {
      payload.maxLength = parseInt(payload.maxLength);
    }

    // Handle min/max for number fields
    if (payload.type === "number") {
      if (payload.min !== undefined && payload.min !== "") {
        payload.min = parseInt(payload.min);
      }
      if (payload.max !== undefined && payload.max !== "") {
        payload.max = parseInt(payload.max);
      }
    }

    // Remove newOption from payload
    delete payload.newOption;
    
    return payload;
  };

  const handleAddField = async () => {
    try {
      const payload = preparePayload(fieldForm);
      
      // Check if using new API endpoint structure from docs
      let response;
      try {
        // Try new endpoint first (from documentation)
        response = await api.post(`/event/admin/dynamic-field/${eventId}`, payload);
      } catch (newApiError) {
        // Fallback to old endpoint if new one doesn't exist
        response = await api.post(`/event/admin/${eventId}/add-input-field`, payload);
      }
      
      toast.success("Field added successfully");
      callbacks.onFieldAdded?.(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add field");
      throw error;
    }
  };

  const handleEditField = async (fieldId) => {
    try {
      console.log('Editing field with ID:', fieldId, 'with data:', fieldForm);
      
      const payload = preparePayload(fieldForm);
      
      console.log('Edit payload:', payload);
      
      // Check if using new API endpoint structure from docs
      let response;
      try {
        // Try new endpoint first (from documentation)
        response = await api.put(`/event/admin/dynamic-field/${eventId}/${fieldId}`, payload);
      } catch (newApiError) {
        console.log('New API failed, trying old endpoint:', newApiError.message);
        // Fallback to old endpoint if new one doesn't exist
        response = await api.put(`/event/admin/${eventId}/update-input-field/${fieldId}`, payload);
      }
      
      toast.success("Field updated successfully");
      callbacks.onFieldUpdated?.(response.data);
    } catch (error) {
      console.error('Failed to update field:', error);
      toast.error(error.response?.data?.message || "Failed to update field");
      throw error;
    }
  };

  const handleDeleteField = async (fieldId) => {
    try {
      console.log('Deleting field with ID:', fieldId);
      
      // Check if using new API endpoint structure from docs
      let response;
      try {
        // Try new endpoint first (from documentation)
        response = await api.delete(`/event/admin/dynamic-field/${eventId}/${fieldId}`);
      } catch (newApiError) {
        console.log('New API failed, trying old endpoint:', newApiError.message);
        // Fallback to old endpoint if new one doesn't exist
        response = await api.delete(`/event/admin/${eventId}/delete-input-field/${fieldId}`);
      }
      
      toast.success("Field deleted successfully");
      callbacks.onFieldDeleted?.(response.data);
    } catch (error) {
      console.error('Failed to delete field:', error);
      toast.error(error.response?.data?.message || "Failed to delete field");
      throw error;
    }
  };

  const handleArrangeFields = async (order) => {
    try {
      console.log('Arranging fields with order:', order);
      
      // Check if using new API endpoint structure from docs
      let response;
      try {
        // Try new endpoint first (from documentation)
        response = await api.post(`/event/admin/dynamic-field/${eventId}/arrange`, { order });
        console.log('New API response:', response.data);
      } catch (newApiError) {
        console.log('New API failed, trying old endpoint:', newApiError.message);
        // Fallback to old endpoint if new one doesn't exist
        response = await api.put(`/event/admin/${eventId}/arrange-input-fields`, { order });
        console.log('Old API response:', response.data);
      }
      
      toast.success("Fields reordered successfully");
      callbacks.onFieldsArranged?.(response.data);
    } catch (error) {
      console.error('Failed to arrange fields:', error);
      toast.error(error.response?.data?.message || "Failed to reorder fields");
      throw error;
    }
  };

  return {
    fieldForm,
    setFieldForm,
    handleAddField,
    handleEditField,
    handleDeleteField,
    handleArrangeFields,
    resetForm,
  };
}
