"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DataTable from "./components/DataTable";
import EventCard from "./components/EventCard";
import { fetchEvent } from "./components/useEvent";

export default function ParticipantPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const [event, setEvent] = useState(null);
  const [org, setOrg] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    fetchEvent(eventId).then((ev) => {
      setEvent(ev);
      setOrg(ev?.organization);
    });
  }, [eventId]);
  if (!eventId) return <div className="p-6 text-center text-muted-foreground">Event ID not found.</div>;
  return (
    <div className="flex flex-col w-full">
        <EventCard event={event} organization={org} />
        <DataTable eventId={eventId} event={event} />
    </div>
  );
}