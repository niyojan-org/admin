"use client";
import Tickets from "../../[eventId]/components/Ticket";

export default function TicketsStep({ event, setEvent }) {


  return (
    <Tickets className={'flex-1'} eventId={event?._id} />
  );
}
