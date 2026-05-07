"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { EventStore } from "./event-store";
import { useEffect } from "react";

const pageLabels = {
  participants: "Participants",
  registration: "Registration",
  share: "Share",
  announcements: "Announcements",
  checkin: "Check-in",
  edit: "Edit Event",
  tickets: "Tickets",
  sessions: "Sessions",
};

function EventBreadcrumbs({ event, eventId }) {
  const pathname = usePathname();
  const activeSegment = pathname.split("/")[3];
  console.log(activeSegment);
  const activeLabel = pageLabels[activeSegment];
  const eventLabel = event?.title || decodeURIComponent(eventId);

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-2 text-sm"
    >
      <Link
        href="/events"
        className="font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
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
        <span className="max-w-48 truncate font-semibold text-foreground sm:max-w-80">
          {eventLabel}
        </span>
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

function EventDetailLayout({ children }) {
  const params = useParams();
  const { eventId } = params;
  const { fetchEvent, event, error } = EventStore();

  useEffect(() => {
    fetchEvent(eventId);
  }, [eventId, fetchEvent]);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-7xl py-4 sm:py-6">
        <EventBreadcrumbs event={event} eventId={eventId} />
        {children}
      </div>
    </div>
  );
}

export default EventDetailLayout;
