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
      <RegistrationPage registration={data} />
    </>
  );
}
