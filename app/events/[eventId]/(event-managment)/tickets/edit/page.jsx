"use client";
import { useEffect } from "react";
import { EventStore } from "../../../event-store";
import { TicketMainPage } from "../ticket-main-page";
import TicketForm from "../ticket-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FullPageLoader } from "@/components/ui/full-page-loader";
import Error404 from "@/app/not-found";
import { EventTicketStore } from "../event-ticket-store";

function page() {
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;
  const id = useSearchParams().get("id");

  const { event, loading, fetchEvent } = EventStore();
  const { editTicket, loading: ticketLoading } = EventTicketStore();
  console.log(event)

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

  const handleEditTicket = async (ticketData) => {
    const response = await editTicket(ticketData);
    if (response) {
      router.push(`/events/${routeEventId}/tickets`);
    }
  };

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,28rem)]">
      <TicketMainPage
        needCreateOption={false}
        className="order-2 xl:order-1"
      />
      <div className="order-1 xl:order-2 xl:sticky xl:top-6 xl:self-start">
        <TicketForm
          eventSlug={routeEventId}
          isEditMode={true}
          defaultValues={selectedTicket}
          onSubmit={(payload) => {
            handleEditTicket(payload);
          }}
          isLoading={ticketLoading}
        />
      </div>
    </div>
  );
}

export default page;
