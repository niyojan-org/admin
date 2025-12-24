import api from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";
import { validateSessions } from "@/lib/eventUtils";

export const useEventStore = create((set, get) => ({
  // Event data
  events: [],
  currentEvent: null,
  loading: false,
  error: null,

  // Set events list
  setEvents: (events) => set({ events }),

  // Set current event
  setCurrentEvent: (event) => set({ currentEvent: event }),

  // Validate event data before submission
  validateEventData: (eventData) => {
    const errors = [];

    // Validate sessions against registration end date
    if (eventData.sessions && eventData.registrationEnd) {
      const sessionValidation = validateSessions(eventData.sessions, eventData.registrationEnd);
      if (!sessionValidation.isValid) {
        errors.push(...sessionValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Create new event
  createEvent: async (eventData) => {
    set({ loading: true, error: null });

    try {
      // Validate event data
      const validation = get().validateEventData(eventData);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(', ');
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Proceed with API call using component formatted data
      const response = await api.post("/events/admin/create", eventData);
      if (response.data) {
        const newEvent = response.data.event || response.data;
        set((state) => ({
          events: [...state.events, newEvent],
          currentEvent: newEvent,
          loading: false
        }));
        toast.success("Event created successfully!");
        return newEvent;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create event";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage, { description: error.response?.data?.error?.details || "Please check your input and try again." });
      throw error;
    }
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    set({ loading: true, error: null });

    try {
      // Validate event data
      // const validation = get().validateEventData(eventData);
      // if (!validation.isValid) {
      //   const errorMessage = validation.errors.join(', ');
      //   set({ error: errorMessage, loading: false });
      //   toast.error(errorMessage);
      //   throw new Error(errorMessage);
      // }

      // Proceed with API call using component formatted data
      const response = await api.put(`/events/admin/${eventId}`, eventData);
      if (response.data) {
        const updatedEvent = response.data.event;
        set((state) => ({
          events: state.events.map(event =>
            event._id === eventId ? updatedEvent : event
          ),
          currentEvent: state.currentEvent?._id === eventId ? updatedEvent : state.currentEvent,
          loading: false
        }));
        toast.success("Event updated successfully!");
        return updatedEvent;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update event";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage, { description: error.response?.data?.error?.details || "Please check your input and try again." });
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/events/admin/${eventId}`);
      set((state) => ({
        events: state.events.filter(event => event._id !== eventId),
        currentEvent: state.currentEvent?._id === eventId ? null : state.currentEvent,
        loading: false
      }));
      toast.success("Event deleted successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete event";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Fetch events
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/events/admin/my-events");
      if (response.data) {
        const events = response.data.events || response.data.data?.events || [];
        set({ events, loading: false });
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch events";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Fetch single event for editing
  fetchEvent: async (eventId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/events/admin/${eventId}`);
      if (response.data) {
        const eventData = response.data.data.event || response.data;
        set({ currentEvent: eventData, loading: false });
        return eventData;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch event";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage, { description: error.response?.data?.error?.details || "Please check your input and try again." });
      throw error;
    }
  },

  // Coupon Management Functions
  addCoupon: async (eventId, couponData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/events/admin/${eventId}/coupons`, couponData);
      if (response.data) {
        const coupon = response.data.data.coupon;
        set((state) => ({
          currentEvent: state.currentEvent ? {
            ...state.currentEvent,
            coupons: [...(state.currentEvent.coupons || []), coupon]
          } : state.currentEvent,
          loading: false
        }));
        toast.success("Coupon added successfully!");
        return coupon;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add coupon";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateCoupon: async (eventId, couponId, couponData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/events/admin/${eventId}/coupons/${couponId}`, couponData);
      if (response.data) {
        const updatedCoupon = response.data.data.coupon;
        set((state) => ({
          currentEvent: state.currentEvent ? {
            ...state.currentEvent,
            coupons: state.currentEvent.coupons?.map(coupon =>
              coupon._id === couponId ? updatedCoupon : coupon
            ) || []
          } : state.currentEvent,
          loading: false
        }));
        toast.success("Coupon updated successfully!");
        return updatedCoupon;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update coupon";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteCoupon: async (eventId, couponId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/events/admin/${eventId}/coupons/${couponId}`);
      set((state) => ({
        currentEvent: state.currentEvent ? {
          ...state.currentEvent,
          coupons: state.currentEvent.coupons?.filter(coupon =>
            coupon._id !== couponId
          ) || []
        } : state.currentEvent,
        loading: false
      }));
      toast.success("Coupon deleted successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete coupon";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  toggleCouponStatus: async (eventId, couponId) => {
    try {
      const response = await api.patch(`/events/admin/${eventId}/coupons/${couponId}/toggle`);
      if (response.data) {
        const updatedCoupon = response.data.data.coupon;
        set((state) => ({
          currentEvent: state.currentEvent ? {
            ...state.currentEvent,
            coupons: state.currentEvent.coupons?.map(coupon =>
              coupon._id === couponId ? updatedCoupon : coupon
            ) || []
          } : state.currentEvent
        }));
        toast.success(response.data.message);
        return updatedCoupon;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to toggle coupon status";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    events: [],
    currentEvent: null,
    loading: false,
    error: null
  })
}));
