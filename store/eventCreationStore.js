import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialEventState = {
  title: "",
  description: "",
  bannerImage: "",
  tags: [],
  category: "",
  organizationId: "",
  mode: "hybrid", // hybrid, online, offline
  visibility: "public", // public, private
  registrationStart: null,
  registrationEnd: null,
  allowMultipleSessions: true,
  allowCoupons: true,
  allowReferrals: true,
  autoApproveParticipants: true,
  enableEmailNotifications: true,
  enableWhatsappNotifications: false,
  sessions: [],
  tickets: [],
  customFields: [],
  coupons: [],
};

const initialSessionTemplate = {
  title: "",
  description: "",
  startTime: null,
  endTime: null,
  venue: {
    name: "",
    locality: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  },
  isActive: true,
  allowCheckIn: true,
  checkInStartTime: null,
  checkInEndTime: null,
  speakers: [],
};

const initialTicketTemplate = {
  type: "",
  price: 0,
  capacity: 0,
  salesStartTime: null,
  salesEndTime: null,
  isActive: true,
  isGroupTicket: false,
  groupSettings: {
    minParticipants: 2,
    maxParticipants: 10,
    groupLeaderRequired: false,
  },
};

const initialCustomFieldTemplate = {
  label: "",
  name: "",
  type: "text", // text, dropdown, radio, checkbox, textarea
  required: false,
  placeholder: "",
  options: [], // for dropdown, radio, checkbox
};

const initialCouponTemplate = {
  code: "",
  discountType: "percentage", // percentage, fixed
  discountValue: 0,
  maxUsage: 0,
  startsAt: null,
  endsAt: null,
  isActive: true,
};

export const useEventCreationStore = create(
  persist(
    (set, get) => ({
      // Event draft data
      eventDraft: { ...initialEventState },
      
      // Draft management
      isDraftSaved: false,
      lastSavedAt: null,
      draftId: null,

      // Update entire event draft
      setEventDraft: (eventData) => 
        set({ 
          eventDraft: eventData, 
          isDraftSaved: false 
        }),

      // Update specific field in event draft
      updateEventField: (field, value) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            [field]: value,
          },
          isDraftSaved: false,
        })),

      // Update multiple fields at once
      updateEventFields: (fields) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            ...fields,
          },
          isDraftSaved: false,
        })),

      // Session management
      addSession: (session = null) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            sessions: [
              ...state.eventDraft.sessions,
              session || { ...initialSessionTemplate },
            ],
          },
          isDraftSaved: false,
        })),

      updateSession: (index, sessionData) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            sessions: state.eventDraft.sessions.map((session, i) =>
              i === index ? { ...session, ...sessionData } : session
            ),
          },
          isDraftSaved: false,
        })),

      removeSession: (index) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            sessions: state.eventDraft.sessions.filter((_, i) => i !== index),
          },
          isDraftSaved: false,
        })),

      // Ticket management
      addTicket: (ticket = null) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            tickets: [
              ...state.eventDraft.tickets,
              ticket || { ...initialTicketTemplate },
            ],
          },
          isDraftSaved: false,
        })),

      updateTicket: (index, ticketData) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            tickets: state.eventDraft.tickets.map((ticket, i) =>
              i === index ? { ...ticket, ...ticketData } : ticket
            ),
          },
          isDraftSaved: false,
        })),

      removeTicket: (index) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            tickets: state.eventDraft.tickets.filter((_, i) => i !== index),
          },
          isDraftSaved: false,
        })),

      // Custom fields management
      addCustomField: (field = null) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            customFields: [
              ...state.eventDraft.customFields,
              field || { ...initialCustomFieldTemplate },
            ],
          },
          isDraftSaved: false,
        })),

      updateCustomField: (index, fieldData) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            customFields: state.eventDraft.customFields.map((field, i) =>
              i === index ? { ...field, ...fieldData } : field
            ),
          },
          isDraftSaved: false,
        })),

      removeCustomField: (index) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            customFields: state.eventDraft.customFields.filter(
              (_, i) => i !== index
            ),
          },
          isDraftSaved: false,
        })),

      // Coupon management
      addCoupon: (coupon = null) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            coupons: [
              ...state.eventDraft.coupons,
              coupon || { ...initialCouponTemplate },
            ],
          },
          isDraftSaved: false,
        })),

      updateCoupon: (index, couponData) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            coupons: state.eventDraft.coupons.map((coupon, i) =>
              i === index ? { ...coupon, ...couponData } : coupon
            ),
          },
          isDraftSaved: false,
        })),

      removeCoupon: (index) =>
        set((state) => ({
          eventDraft: {
            ...state.eventDraft,
            coupons: state.eventDraft.coupons.filter((_, i) => i !== index),
          },
          isDraftSaved: false,
        })),

      // Draft operations
      saveDraft: () => {
        const state = get();
        set({
          isDraftSaved: true,
          lastSavedAt: new Date().toISOString(),
          draftId: state.draftId || `draft_${Date.now()}`,
        });
      },

      loadDraft: (draftData) =>
        set({
          eventDraft: draftData,
          isDraftSaved: true,
          lastSavedAt: new Date().toISOString(),
        }),

      clearDraft: () =>
        set({
          eventDraft: { ...initialEventState },
          isDraftSaved: false,
          lastSavedAt: null,
          draftId: null,
        }),

      // Reset store to initial state
      resetStore: () =>
        set({
          eventDraft: { ...initialEventState },
          isDraftSaved: false,
          lastSavedAt: null,
          draftId: null,
        }),

      // Get current draft
      getDraft: () => get().eventDraft,

      // Check if draft has unsaved changes
      hasUnsavedChanges: () => !get().isDraftSaved,

      // Validation helper
      validateDraft: () => {
        const draft = get().eventDraft;
        const errors = [];

        if (!draft.title?.trim()) {
          errors.push("Event title is required");
        }

        if (!draft.description?.trim()) {
          errors.push("Event description is required");
        }

        if (!draft.organizationId) {
          errors.push("Organization is required");
        }

        if (!draft.registrationStart) {
          errors.push("Registration start date is required");
        }

        if (!draft.registrationEnd) {
          errors.push("Registration end date is required");
        }

        if (
          draft.registrationStart &&
          draft.registrationEnd &&
          new Date(draft.registrationStart) >= new Date(draft.registrationEnd)
        ) {
          errors.push("Registration end date must be after start date");
        }

        if (draft.sessions.length === 0) {
          errors.push("At least one session is required");
        }

        if (draft.tickets.length === 0) {
          errors.push("At least one ticket type is required");
        }

        // Validate sessions
        draft.sessions.forEach((session, index) => {
          if (!session.title?.trim()) {
            errors.push(`Session ${index + 1}: Title is required`);
          }
          if (!session.startTime) {
            errors.push(`Session ${index + 1}: Start time is required`);
          }
          if (!session.endTime) {
            errors.push(`Session ${index + 1}: End time is required`);
          }
          if (
            session.startTime &&
            session.endTime &&
            new Date(session.startTime) >= new Date(session.endTime)
          ) {
            errors.push(`Session ${index + 1}: End time must be after start time`);
          }
        });

        // Validate tickets
        draft.tickets.forEach((ticket, index) => {
          if (!ticket.type?.trim()) {
            errors.push(`Ticket ${index + 1}: Type is required`);
          }
          if (ticket.price < 0) {
            errors.push(`Ticket ${index + 1}: Price cannot be negative`);
          }
          if (ticket.capacity <= 0) {
            errors.push(`Ticket ${index + 1}: Capacity must be greater than 0`);
          }
        });

        return {
          isValid: errors.length === 0,
          errors,
        };
      },
    }),
    {
      name: "event-creation-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        eventDraft: state.eventDraft,
        isDraftSaved: state.isDraftSaved,
        lastSavedAt: state.lastSavedAt,
        draftId: state.draftId,
      }),
    }
  )
);

// Export templates for external use
export {
  initialEventState,
  initialSessionTemplate,
  initialTicketTemplate,
  initialCustomFieldTemplate,
  initialCouponTemplate,
};
