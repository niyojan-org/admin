// /events/[eventId]/(event-managment)/registrations/[registrationId]/page.tsx
import { Breadcrumb } from '@/components/breadcrumb';
import { getRegistration } from '../get-registrations';
import RegistrationPage from './Registration-page';

interface PageProps {
  params: Promise<{
    eventId: string;
    registrationId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { eventId, registrationId } = await params;

  const data = await getRegistration(eventId, registrationId);

  return (
    <>
      <Breadcrumb pathname={`/events/${eventId}/registrations/${registrationId}`} />
      <RegistrationPage registration={data} />
    </>
  );
}
