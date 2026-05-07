import api from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";
import { EventStore } from "../../event-store";

const updateEventSessions = async (sessions) => {
  const event = EventStore.getState().event;
  if (!event?.slug) {
    throw new Error("Event details are not available yet.");
  }

  await api.put(`/events/admin/${event.slug}`, { sessions });
  await EventStore.getState().refreshEvent();
};

export const EventSessionStore = create((set) => ({
  loading: false,
  error: null,

  addSession: async (sessionData) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      const sessions = [...(event?.sessions || []), sessionData];
      await updateEventSessions(sessions);
      toast.success("Session added successfully");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add session";
      toast.error(message);
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  editSession: async (sessionData) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      const sessions = (event?.sessions || []).map((session) =>
        session._id === sessionData._id ? sessionData : session,
      );
      await updateEventSessions(sessions);
      toast.success("Session updated successfully");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update session";
      toast.error(message);
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  toggleSessionStatus: async (sessionId) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      const sessions = (event?.sessions || []).map((session) => {
        if (session._id !== sessionId) return session;
        return { ...session, isActive: !session.isActive };
      });
      await updateEventSessions(sessions);
      toast.success("Session status updated successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update session status";
      toast.error(message);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  enableCheckIn: async (sessionId, payload) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      if (!event) {
        throw new Error("Event details are not available yet.");
      }

      const sessions = (event.sessions || []).map((session) => {
        if (session._id !== sessionId) return session;
        return {
          ...session,
          allowCheckIn: true,
          checkInStartTime: payload?.checkInStartTime || null,
          checkInEndTime: payload?.checkInEndTime || null,
          checkInCode: payload?.checkInCode || session.checkInCode,
        };
      });

      EventStore.setState({ event: { ...event, sessions } });
      toast.success("Check-in enabled (demo)");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to enable check-in";
      toast.error(message);
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
