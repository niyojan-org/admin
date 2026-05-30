'use client';

import { create } from 'zustand';
import { toast } from 'sonner';
import api from '@/lib/api';
import { EventData } from '@/types/event';

interface EventStore {
  event: EventData | null;
  loading: boolean;
  error: string | null;
  setEvent: (event: EventData) => void;
  fetchEvent: (eventId: string) => Promise<void>;
  refreshEvent: () => Promise<void>;
}

export const EventStore = create<EventStore>((set, get) => ({
  event: null,
  loading: false,
  error: null,

  setEvent: (event: EventData) => set({ event }),

  fetchEvent: async (eventId: string) => {
    try {
      const state = get();
      if (state.loading) return; // Prevent multiple simultaneous fetches
      if (state.event?.slug === eventId || state.event?._id === eventId)
        return; // If the requested event is already loaded, do nothing

      set({ loading: true, error: null, event: null });

      if (!eventId) {
        return;
      }

      const response = await api.get(`/events/admin/${eventId}`);
      set({ event: response.data.event });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to load event data';
      set({
        error: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  refreshEvent: async () => {
    try {
      set({ loading: true, error: null });
      const state = get();
      const eventId = state.event?.slug || state.event?._id;

      if (!eventId) {
        return;
      }

      const response = await api.get(`/events/admin/${eventId}`);
      set({ event: response.data.event });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to refresh event data';
      set({
        error: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
}));
