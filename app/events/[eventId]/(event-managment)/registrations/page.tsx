import { RegistrationsPage } from '@/app/events/[eventId]/(event-managment)/registrations/components/registrations-page';
import { parseRegistrationsSearchParams } from '@/app/events/[eventId]/(event-managment)/registrations/components/registrations-query';
import { getRegistrations } from './get-registrations';

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { eventId } = await params;
  const resolvedSearchParams = await searchParams;
  const query = parseRegistrationsSearchParams(resolvedSearchParams);
  const data = await getRegistrations({
    eventId,
    query,
  });

  return (
    <RegistrationsPage
      registrations={data.registrations}
      totalDocs={data.totalDocs}
      totalPages={data.totalPages}
      query={query}
    />
  );
}
