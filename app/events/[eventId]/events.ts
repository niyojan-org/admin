import { createServerApi } from '@/lib/server-api';
import { notFound } from 'next/navigation';

const fetchEvent = async (eventId: string) => {
  try {
    const api = await createServerApi();
    const response = await api.get(`/events/admin/${eventId}`);
    return response.data.event;
  } catch (error) {
    if (error?.response?.status === 404) {
      notFound();
    }
    throw error;
  }
};

export default fetchEvent;
