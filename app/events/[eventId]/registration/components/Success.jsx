"use client";

import { useEffect, useState } from "react";
import SuccessHeader from "./success/SuccessHeader";
import RegistrationDetails from "./success/RegistrationDetails";
import NextSteps from "./success/NextSteps";
import ActionButtons from "./success/ActionButtons";
import ConfettiEffect from "./success/ConfettiEffect";

export default function RegistrationSuccess({ data }) {
  const [isVisible, setIsVisible] = useState(false);

  const {
    registrationId = "",
    message = "",
    eventName = "",
    eventDate = "",
    eventLocation = "",
    ticketType = "",
    ticketPrice = 0,
    isPaid = false,
    isGroup = false,
    participants = [],
    participantCount = 1,
    totalAmount = 0,
    qrCode = "",
    eventSlug = "",
  } = data || {};

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div
          className={`space-y-3 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* <SuccessIcon /> */}
          <SuccessHeader isPaid={isPaid} message={message} />
          <RegistrationDetails
            registrationId={registrationId}
            message={message}
            eventName={eventName}
            eventDate={eventDate}
            eventLocation={eventLocation}
            ticketType={ticketType}
            ticketPrice={ticketPrice}
            isPaid={isPaid}
            isGroup={isGroup}
            participants={participants}
            participantCount={participantCount}
            totalAmount={totalAmount}
            qrCode={qrCode}
          />
          <NextSteps isPaid={isPaid} isGroup={isGroup} />
          <ActionButtons eventSlug={eventSlug} />
        </div>
      </div>

      <ConfettiEffect />
    </div>
  );
}
