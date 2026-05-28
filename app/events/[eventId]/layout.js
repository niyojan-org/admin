import { Breadcrumb } from '@/components/breadcrumb';
import EventHydrator from './event-hydrator';
import fetchEvent from './events';

async function EventDetailLayout({ children, params }) {
  const { eventId } = params;
  const event = await fetchEvent(eventId);
  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full py-4 sm:py-6">
        <Breadcrumb pathname={`/events/${eventId}`} />
        <EventHydrator event={event} />
        <div className="mt-4 w-full">{children}</div>
      </div>
    </div>
  );
}

export default EventDetailLayout;
