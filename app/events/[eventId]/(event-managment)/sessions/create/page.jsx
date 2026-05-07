"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import Error404 from "@/app/not-found";

import { EventStore } from "../../../event-store";
import { SessionMainPage } from "../session-main-page";
import SessionForm from "../session-form";
import { EventSessionStore } from "../event-session-store";

export default function Page() {
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;
  const searchParams = useSearchParams();
  const copyId = searchParams.get("copy");

  const router = useRouter();
  const { event } = EventStore();
  const { loading, addSession } = EventSessionStore();

  if (!routeEventId) {
    return <Error404 />;
  }

  const sourceSession = copyId
    ? event?.sessions?.find((session) => session._id === copyId)
    : null;
  const duplicateDefaults = sourceSession
    ? {
        ...sourceSession,
        _id: undefined,
        title: `${sourceSession.title} Copy`,
        isActive: false,
      }
    : undefined;

  const handleAddSession = async (sessionData) => {
    const response = await addSession(sessionData);
    if (response) {
      router.replace(`/events/${routeEventId}/sessions`);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,28rem)]">
      <SessionMainPage
        needCreateOption={false}
        className="order-2 xl:order-1"
      />
      <div className="order-1 xl:order-2 xl:sticky xl:top-6 xl:self-start">
        <SessionForm
          eventSlug={routeEventId}
          defaultValues={duplicateDefaults}
          onSubmit={handleAddSession}
          isLoading={loading}
          eventMode={event?.mode}
          allowMultipleSessions={event?.allowMultipleSessions ?? true}
          sessionCount={event?.sessions?.length || 0}
          existingTitles={(event?.sessions || []).map((session) => session.title)}
        />
      </div>
    </div>
  );
}
