"use client";
import { useEffect } from "react";
import { EventStore } from "../../../event-store";
import { TicketMainPage } from "../ticket-main-page";
import TicketForm from "../ticket-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FullPageLoader } from "@/components/ui/full-page-loader";
import Error404 from "@/app/not-found";

function page() {
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;
  const id = useSearchParams().get("id");

  const { event, loading, fetchEvent } = EventStore();

  useEffect(() => {
    if (!event && routeEventId) {
      fetchEvent(routeEventId);
    }
  }, [event, routeEventId, fetchEvent]);

  useEffect(() => {
    if (!event || !routeEventId) return;
    const ticketExists = event.tickets.some((ticket) => ticket._id === id);
    if (!id || !ticketExists) {
      router.replace(`/events/${routeEventId}/tickets`);
    }
  }, [event, id, routeEventId, router]);

  if (!routeEventId) {
    return <Error404 />;
  }

  if (!event || loading) {
    return <FullPageLoader />;
  }

  const selectedTicket = event.tickets.find((ticket) => ticket._id === id);
  if (!id || !selectedTicket) {
    return <FullPageLoader />;
  }

  return (
    <div className="sm:grid sm:grid-cols-7">
      <TicketMainPage
        needCreateOption={false}
        className="hidden sm:col-span-4  sm:block"
      />
      <div className="sm:col-span-3 h-fit">
        <TicketForm
          eventSlug={routeEventId}
          isEditMode={true}
          defaultValues={selectedTicket}
          onSubmit={(payload) => {
            console.log(payload);
          }}
        />
      </div>
    </div>
  );
}

export default page;
