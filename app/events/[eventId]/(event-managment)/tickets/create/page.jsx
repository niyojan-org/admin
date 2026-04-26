"use client";
import { TicketMainPage } from "../ticket-main-page";
import TicketForm from "../ticket-form";
import { useParams } from "next/navigation";

function page() {
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;

  return (
    <div className="sm:grid sm:grid-cols-7">
      <TicketMainPage
        needCreateOption={false}
        className="hidden sm:col-span-4  sm:block"
      />
      <div className="sm:col-span-3 h-fit">
        <TicketForm
          eventSlug={routeEventId}
          onSubmit={(payload) => {
            console.log(payload);
          }}
        />
      </div>
    </div>
  );
}

export default page;
