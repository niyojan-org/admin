"use client";
import { TicketMainPage } from "../ticket-main-page";
import TicketForm from "../ticket-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { EventTicketStore } from "../event-ticket-store";
import { EventStore } from "../../../event-store";
import Error404 from "@/app/not-found";

function page() {
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;
  const searchParams = useSearchParams();
  const copyId = searchParams.get("copy");

  const router = useRouter();
  const { event } = EventStore();

  const { loading, addTicket } = EventTicketStore();

  if (!routeEventId) {
    return <Error404 />;
  }

  const sourceTicket = copyId
    ? event?.tickets?.find((ticket) => ticket._id === copyId)
    : null;
  const duplicateDefaults = sourceTicket
    ? {
        ...sourceTicket,
        _id: undefined,
        sold: 0,
        type: `${sourceTicket.type} Copy`,
        isActive: false,
      }
    : undefined;

  const handleAddTicket = async (ticketData) => {
    const response = await addTicket(ticketData);
    if (response) {
      router.replace(`/events/${routeEventId}/tickets`);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,28rem)]">
      <TicketMainPage
        needCreateOption={false}
        className="order-2 xl:order-1"
      />
      <div className="order-1 xl:order-2 xl:sticky xl:top-6 xl:self-start">
        <TicketForm
          eventSlug={routeEventId}
          defaultValues={duplicateDefaults}
          onSubmit={(payload) => {
            handleAddTicket(payload);
          }}
          isLoading={loading}
        />
      </div>
    </div>
  );
}

export default page;
