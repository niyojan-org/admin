"use client";
import Tickets from "../../[eventId]/components/Ticket";

export default function TicketsStep({ event }) {
  return (
    <Tickets className={'flex-1'} eventId={event?._id} />
  );
}
