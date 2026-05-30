'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  IconCalendarEvent,
  IconCalendarTime,
  IconDeviceLaptop,
  IconFlag,
  IconInfoCircle,
  IconMapPin,
  IconWorld,
} from '@tabler/icons-react';
import { EventStore } from '../event-store';

const toTitleCase = (value) => {
  if (!value) return 'Unknown';
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const formatDate = (value) => {
  const date = toDate(value);
  if (!date) return 'Not set';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return 'Not set';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const getRangeLabel = (start, end, formatter) => {
  if (!start && !end) return 'Not set';
  if (start && !end) return formatter(start);
  if (!start && end) return formatter(end);

  const from = formatter(start);
  const to = formatter(end);

  return `${from} - ${to}`;
};

const getSessionRange = (sessions) => {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { start: null, end: null };
  }

  return sessions.reduce(
    (range, session) => {
      const start = toDate(session?.startTime);
      const end = toDate(session?.endTime) || start;

      if (start && (!range.start || start < range.start)) {
        range.start = start;
      }

      if (end && (!range.end || end > range.end)) {
        range.end = end;
      }

      return range;
    },
    { start: null, end: null },
  );
};

const getStatusVariant = (status) => {
  if (status === 'published') return 'success';
  if (status === 'cancelled') return 'destructive';

  return 'warning';
};

function ManagementBanner() {
  const { event } = EventStore();
  if (!event) return null;

  const status = String(event.status || 'draft').toLowerCase();
  const statusLabel = toTitleCase(status);
  const visibilityLabel = event.isPrivate || event.visibility === 'private' ? 'Private' : 'Public';
  const modeLabel = event.mode ? toTitleCase(event.mode) : 'Online';

  const registrationLabel = getRangeLabel(event.registrationStart, event.registrationEnd, formatDateTime);

  const sessionRange = getSessionRange(event.sessions);
  const eventDateLabel = getRangeLabel(sessionRange.start, sessionRange.end, formatDate);

  return (
    <div className="w-full rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1.5fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border bg-muted/20">
            <Image
              src={event?.bannerImage || '/banner/default-event-banner.png'}
              alt={event?.title || 'Event Banner'}
              fill
              sizes="(max-width: 1024px) 176px, 176px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="font-medium">
                {event?.category || 'General'}
              </Badge>
              <Badge variant={getStatusVariant(status)} className="font-medium">
                {statusLabel}
              </Badge>
            </div>

            <h1 className="truncate text-3xl font-semibold text-foreground">{event?.title || 'Untitled Event'}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                {modeLabel.toLowerCase() === 'online' ? <IconDeviceLaptop size={16} /> : <IconMapPin size={16} />}
                {modeLabel} Event
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="inline-flex items-center gap-1.5">
                <IconWorld size={16} />
                {visibilityLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex items-start gap-2">
            <IconCalendarEvent size={18} className="mt-0.5 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Registration</p>
              <p className="text-sm font-semibold text-foreground">{registrationLabel}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <IconCalendarTime size={18} className="mt-0.5 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Event Date (Session)</p>
              <p className="text-sm font-semibold text-foreground">{eventDateLabel}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              <IconInfoCircle size={16} className="text-muted-foreground" />
              Event Status
            </span>
            <Badge variant={getStatusVariant(status)}>{statusLabel}</Badge>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              <IconFlag size={16} className="text-muted-foreground" />
              Registration
            </span>
            <Badge variant={event.isRegistrationOpen ? 'success' : 'destructive'}>
              {event.isRegistrationOpen ? 'Open' : 'Not Open'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagementBanner;
