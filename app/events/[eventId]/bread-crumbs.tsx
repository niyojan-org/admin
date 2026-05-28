import Link from 'next/link';

const pageLabels = {
  participants: 'Participants',
  registrations: 'Registrations',
  share: 'Share',
  announcements: 'Announcements',
  checkin: 'Check-in',
  edit: 'Edit Event',
  tickets: 'Tickets',
  sessions: 'Sessions',
};

export function EventBreadcrumbs({ event, eventId, pathname }) {
  const pathSegments = pathname.split('/').filter(Boolean);
  const activeSegment = pathSegments[2];
  const activeLabel = pageLabels[activeSegment];
  const eventLabel = event?.title || decodeURIComponent(eventId);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <Link href="/events" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
        All Events
      </Link>
      <span className="text-muted-foreground">/</span>
      {activeLabel ? (
        <Link
          href={`/events/${eventId}`}
          className="max-w-48 truncate font-medium text-muted-foreground transition-colors hover:text-foreground sm:max-w-80"
        >
          {eventLabel}
        </Link>
      ) : (
        <span className="max-w-48 truncate font-semibold text-foreground sm:max-w-80">{eventLabel}</span>
      )}
      {activeLabel && (
        <>
          <span className="text-muted-foreground">/</span>
          <span className="font-semibold text-foreground">{activeLabel}</span>
        </>
      )}
    </nav>
  );
}
