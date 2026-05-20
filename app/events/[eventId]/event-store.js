import api from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";

export const EventStore = create((set, get) => ({
  event: null,
  loading: false,
  error: null,
  setEvent: (event) => set({ event }),

  fetchEvent: async (eventId) => {
    try {
      if (get().loading) return; // Prevent multiple simultaneous fetches
      if (get().event?.slug === eventId) return; // If the requested event is already loaded, do nothing
      set({ loading: true, error: null, event: null });
      if (!eventId) {
        return null;
      }
      const response = await api.get(`/events/admin/${eventId}`);
      set({ event: response.data.event });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to load event data",
      });
      toast.error(
        error?.response?.data?.message || "Failed to load event data",
      );
    } finally {
      set({ loading: false });
    }
  },
  refreshEvent: async () => {
    try {
      set({ loading: true, error: null });
      const eventId = get().event?.slug || get().event?._id;
      if (!eventId) {
        return null;
      }
      const response = await api.get(`/events/admin/${eventId}`);
      set({ event: response.data.event });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to refresh event data",
      });
      toast.error(
        error?.response?.data?.message || "Failed to refresh event data",
      );
    } finally {
      set({ loading: false });
    }
  },
}));
