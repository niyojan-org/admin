"use client";
import { EventStore } from "../../event-store";
import TicketCard from "./ticket-card";
import AddingTicket from "./adding-tickets";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ManagementBanner from "../../components/management-banner";

export function TicketMainPage({ className, needCreateOption = true }) {
  const { event } = EventStore.getState();
  const tickets = event?.tickets || [];
  if (tickets.length === 0) {
    return <div>No tickets available</div>;
  }
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;

  const handleCreateTicket = () => {
    if (!routeEventId) return;
    router.replace(`/events/${routeEventId}/tickets/create`);
  };

  return (
    <div className={cn("w-full", className)}>
      <ManagementBanner />
      <div
        className={`grid grid-cols-1 gap-4 ${needCreateOption ? "md:grid-cols-3 " : "sm:grid-cols-1"} mt-3`}
      >
        {tickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
        {needCreateOption && tickets.length < 7 && (
          <AddingTicket onClick={handleCreateTicket} />
        )}
      </div>
    </div>
  );
}
