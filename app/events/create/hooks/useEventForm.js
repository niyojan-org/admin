import { useCallback, useEffect } from "react";
import { useEventCreationStore } from "@/store/eventCreationStore";
import { toast } from "sonner";

/**
 * Custom hook for managing event creation form
 * Provides methods to interact with the event creation store
 */
export const useEventForm = () => {
  const {
    eventDraft,
    isDraftSaved,
    lastSavedAt,
    draftId,
    updateEventField,
    updateEventFields,
    addSession,
    updateSession,
    removeSession,
    addTicket,
    updateTicket,
    removeTicket,
    addCustomField,
    updateCustomField,
    removeCustomField,
    addCoupon,
    updateCoupon,
    removeCoupon,
    saveDraft,
    loadDraft,
    clearDraft,
    resetStore,
    getDraft,
    hasUnsavedChanges,
    validateDraft,
  } = useEventCreationStore();

  // Auto-save draft every 30 seconds if there are changes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges()) {
        saveDraft();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, saveDraft]);

  // Manual save handler
  const handleSaveDraft = useCallback(() => {
    saveDraft();
    toast.success("Draft saved successfully");
  }, [saveDraft]);

  // Submit handler with validation
  const handleSubmit = useCallback(async () => {
    const validation = validateDraft();
    
    if (!validation.isValid) {
      toast.error("Please fix the following errors:");
      validation.errors.forEach((error) => {
        toast.error(error, { duration: 5000 });
      });
      return { success: false, errors: validation.errors };
    }

    return { success: true, data: getDraft() };
  }, [validateDraft, getDraft]);

  // Clear draft with confirmation
  const handleClearDraft = useCallback(() => {
    if (hasUnsavedChanges()) {
      // const confirmed = window.confirm(
      //   "You have unsaved changes. Are you sure you want to clear the draft?"
      // );
      // if (!confirmed) return;
    }
    clearDraft();
    toast.info("Draft cleared");
  }, [clearDraft, hasUnsavedChanges]);

  return {
    // State
    eventDraft,
    isDraftSaved,
    lastSavedAt,
    draftId,
    
    // Field updates
    updateField: updateEventField,
    updateFields: updateEventFields,
    
    // Session management
    sessions: {
      add: addSession,
      update: updateSession,
      remove: removeSession,
    },
    
    // Ticket management
    tickets: {
      add: addTicket,
      update: updateTicket,
      remove: removeTicket,
    },
    
    // Custom fields management
    customFields: {
      add: addCustomField,
      update: updateCustomField,
      remove: removeCustomField,
    },
    
    // Coupon management
    coupons: {
      add: addCoupon,
      update: updateCoupon,
      remove: removeCoupon,
    },
    
    // Draft operations
    saveDraft: handleSaveDraft,
    loadDraft,
    clearDraft: handleClearDraft,
    resetStore,
    
    // Utilities
    getDraft,
    hasUnsavedChanges: hasUnsavedChanges(),
    validateDraft,
    handleSubmit,
  };
};

export default useEventForm;
