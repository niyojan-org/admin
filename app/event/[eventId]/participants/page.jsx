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

  if (!eventId) return <div>Event ID not found.</div>;
  return (
    <div className="p-4">
      <EventCard event={event} organization={org} />
      <h1 className="text-2xl font-bold mb-4">Participants</h1>
      <DataTable eventId={eventId} event={event} />
    </div>
  );
}