import { notFound } from 'next/navigation';
import { createServerApi } from '@/lib/server-api';
import type { RegistrationsQuery } from '@/app/events/[eventId]/(event-managment)/registrations/components/registrations-query';
import { Registration, RegistrationSchema } from './[registrationId]/registration-type';

interface GetRegistrationsProps {
  eventId: string;
  query: RegistrationsQuery;
}

export async function getRegistrations({ eventId, query }: GetRegistrationsProps) {
  try {
    const api = await createServerApi();
    const response = await api.get(`/registrations/managment/${eventId}`, {
      params: {
        ...query,
        needParticipants: true,
      },
    });
    if (!response.data.success) {
      throw new Error('Failed to fetch registrations');
    }
    if (!response.data.docs) {
      notFound();
    }
    return {
      registrations: response.data.docs,
      totalDocs: response.data.totalDocs,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      notFound();
    }
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
}

export async function getRegistration(eventId: string, registrationId: string): Promise<Registration> {
  try {
    const api = await createServerApi();
    const response = await api.get(`/registrations/managment/${eventId}/${registrationId}`);
    if (!response.data.success) {
      throw new Error('Failed to fetch registration');
    }
    if (!response.data.data) {
      notFound();
    }
    const data = RegistrationSchema.parse(response.data.data);
    return data;
  } catch (error) {
    console.error('Error fetching registration:', error.response?.data || error);
    if (error.response?.status === 404) {
      notFound();
    }
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
}
