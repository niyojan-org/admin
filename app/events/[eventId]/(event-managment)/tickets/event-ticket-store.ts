'use client';

import { create } from 'zustand';
import { toast } from 'sonner';
import api from '@/lib/api';
import { EventStore } from '../../event-store';
import { EventTicket } from '@/types/event';

interface EventTicketStore {
  loading: boolean;
  error: string | null;
  editTicket: (ticketData: EventTicket & { originalType?: string }) => Promise<boolean>;
  addTicket: (ticketData: EventTicket) => Promise<boolean>;
  toggleTicketStatus: (ticketType: string) => Promise<void>;
}

export const EventTicketStore = create<EventTicketStore>((set) => ({
  loading: false,
  error: null,

  editTicket: async (ticketData: EventTicket & { originalType?: string }) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      const ticketType = ticketData.originalType || ticketData.type;
      await api.put(
        `/events/tickets/${event?.slug}/admin/${encodeURIComponent(ticketType)}`,
        ticketData
      );
      toast.success('Ticket updated successfully');
      EventStore.getState().refreshEvent();
      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to update ticket'
      );
      set({
        error: error.response?.data?.message || 'Failed to update ticket',
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  addTicket: async (ticketData: EventTicket) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      await api.post(
        `/events/tickets/${event?.slug}/admin`,
        ticketData
      );
      toast.success('Ticket added successfully');
      EventStore.getState().refreshEvent();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add ticket');
      set({
        error: error.response?.data?.message || 'Failed to add ticket',
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  toggleTicketStatus: async (ticketType: string) => {
    try {
      set({ loading: true, error: null });
      const event = EventStore.getState().event;
      const response = await api.patch(
        `/events/tickets/${event?.slug}/admin/${encodeURIComponent(ticketType)}/toggle-status`
      );
      EventStore.getState().refreshEvent();
      toast.success(
        response.data.message || 'Ticket status updated successfully'
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to update ticket status'
      );
      set({
        error:
          error.response?.data?.message || 'Failed to update ticket status',
      });
    } finally {
      set({ loading: false });
    }
  },
}));
