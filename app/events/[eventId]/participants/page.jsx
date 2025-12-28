"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DataTable from "./components/DataTable";
import EventCard from "./components/EventCard";
import { fetchEvent } from "./components/useEvent";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  if (!eventId)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Event ID not found.
      </div>
    );

  return (
    <>
      {/* Hidden on smaller screens, visible on lg and above */}
      <div className="hidden lg:block h-dvh w-full">
        <ScrollArea className="h-full w-full" innerClassName="px-4 w-full">
          <div className="max-w-7xl mx-auto space-y-6 py-4 w-full">
            <EventCard event={event} organization={org} />
            <DataTable eventId={eventId} event={event} />
          </div>
        </ScrollArea>
      </div>

      {/* Visible on smaller screens, hidden on lg and above */}
      <div className="lg:hidden bg-background p-4 w-full">
        <div className="max-w-7xl mx-auto space-y-6 w-full">
          <EventCard event={event} organization={org} />
          <DataTable eventId={eventId} event={event} />
        </div>
      </div>
    </>
  );
}