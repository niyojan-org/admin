import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useEventRegistrationStore from "@/store/eventRegistration";
import SingleParticipant from "./SingleParticipant";
import GroupMultiStepForm from "./group-registration";
import TicketCardSelectable from "./TicketCardSelectable";

export default function RegistrationForm({
  registrationForm,
}) {
  const allFields = [
    ...(registrationForm?.defaultFields || []),
    ...(registrationForm?.customFields || []),
  ];

  const { selectTicket, ticket, registerGroup } = useEventRegistrationStore();

  return (
    <Card className="shadow-md border border-border rounded-xl bg-card text-card-foreground mb-10">
      <CardTitle className="text-center text-2xl font-semibold p-0 ">
        {registrationForm?.eventDetails?.title || "Register"}
      </CardTitle>

      <CardContent className="space-y-2 w-full p-0">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:wrap-anywhere gap-2 sm:gap-4 w-full px-2 sm:px-6">
          {registrationForm?.tickets?.map((t) => (
            <TicketCardSelectable
              key={t._id}
              ticketName={t.type}
              price={t.price}
              soldOut={t.soldOut}
              badge={t.badge}
              selected={ticket && ticket._id === t._id}
              onClick={() => selectTicket(t._id)}
            />
          ))}
        </div>

        {/* INDIVIDUAL FORM */}
        {!ticket || !ticket.isGroupTicket ? (
          <div className="space-y-5 pt-5 px-4 sm:px-6">
            <SingleParticipant allFields={allFields} />
          </div>
        ) : (
          <div className="space-y-5 pt-5 px-4 sm:px-6">
            <GroupMultiStepForm
              allFields={allFields}
              onSubmit={(e) => {
                registerGroup(e)
              }}
              selectedTicket={ticket}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
