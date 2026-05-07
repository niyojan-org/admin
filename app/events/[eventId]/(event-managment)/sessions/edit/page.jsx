"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { FullPageLoader } from "@/components/ui/full-page-loader";
import Error404 from "@/app/not-found";

import { EventStore } from "../../../event-store";
import { SessionMainPage } from "../session-main-page";
import SessionForm from "../session-form";
import { EventSessionStore } from "../event-session-store";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;
  const id = useSearchParams().get("id");

  const { event, loading, fetchEvent } = EventStore();
  const { editSession, loading: sessionLoading } = EventSessionStore();

  useEffect(() => {
    if (!event && routeEventId) {
      fetchEvent(routeEventId);
    }
  }, [event, routeEventId, fetchEvent]);

  useEffect(() => {
    if (!event || !routeEventId) return;
    const sessionExists = event.sessions.some((session) => session._id === id);
    if (!id || !sessionExists) {
      router.replace(`/events/${routeEventId}/sessions`);
    }
  }, [event, id, routeEventId, router]);

  const handleEditSession = async (sessionData) => {
    const response = await editSession(sessionData);
    if (response) {
      router.push(`/events/${routeEventId}/sessions`);
    }
  };

  if (!routeEventId) {
    return <Error404 />;
  }

  if (!event || loading) {
    return <FullPageLoader />;
  }

  const selectedSession = event.sessions.find((session) => session._id === id);
  if (!id || !selectedSession) {
    return <FullPageLoader />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,28rem)]">
      <SessionMainPage
        needCreateOption={false}
        className="order-2 xl:order-1"
      />
      <div className="order-1 xl:order-2 xl:sticky xl:top-6 xl:self-start">
        <SessionForm
          eventSlug={routeEventId}
          isEditMode={true}
          defaultValues={selectedSession}
          onSubmit={handleEditSession}
          isLoading={sessionLoading}
          eventMode={event?.mode}
          allowMultipleSessions={event?.allowMultipleSessions ?? true}
          sessionCount={event?.sessions?.length || 0}
          existingTitles={(event?.sessions || []).map((session) => session.title)}
        />
      </div>
    </div>
  );
}
