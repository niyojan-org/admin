import api from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";
import { EventStore } from "../../event-store";

export const EventTicketStore = create((set, get) => ({
  loading: false,
  error: null,

  editTicket: async (ticketData) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      const ticketType = ticketData.originalType || ticketData.type;
      await api.put(
        `/events/tickets/${event.slug}/admin/${encodeURIComponent(ticketType)}`,
        ticketData,
      );
      toast.success("Ticket updated successfully");
      EventStore.getState().refreshEvent();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update ticket");
      set({
        error: error.response?.data?.message || "Failed to update ticket",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  addTicket: async (ticketData) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      await api.post(`/events/tickets/${event.slug}/admin`, ticketData);
      toast.success("Ticket added successfully");
      EventStore.getState().refreshEvent();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add ticket");
      set({
        error: error.response?.data?.message || "Failed to add ticket",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  toggleTicketStatus: async (ticketType) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      const response = await api.patch(
        `/events/tickets/${event.slug}/admin/${encodeURIComponent(ticketType)}/toggle-status`,
      );
      EventStore.getState().refreshEvent();
      toast.success(
        response.data.message || "Ticket status updated successfully",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update ticket status",
      );
      set({
        error:
          error.response?.data?.message || "Failed to update ticket status",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
