"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IconBrandWhatsapp, IconMail } from "@tabler/icons-react";
import { CheckCircle2, Ticket, Calendar, MapPin, Users, IndianRupee } from "lucide-react";

export default function RegistrationDetails({
  registrationId,
  eventName,
  eventDate,
  eventLocation,
  ticketType,
  ticketPrice = 0,
  isPaid = false,
  isGroup = false,
  participants = [],
  participantCount = 1,
  totalAmount = 0,
  qrCode = "",
}) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 border-primary/20 p-0 px-2">
      <CardContent className="p-2 space-y-3">
        {/* Registration ID */}
        {registrationId && (
          <div className="bg-accent/50 rounded-lg p-3 text-center border border-primary/10">
            <p className="text-xs text-muted-foreground mb-0.5">
              {isPaid ? "Order ID" : "Registration ID"}
            </p>
            <p className="text-lg font-mono font-bold text-primary">{registrationId}</p>
          </div>
        )}

        {/* Event Details */}
        <div className="space-y-2.5">
          {eventName && (
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Event</p>
                <p className="font-semibold text-sm text-foreground truncate">{eventName}</p>
              </div>
            </div>
          )}

          {eventDate && (
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Date & Time</p>
                <p className="font-semibold text-sm text-foreground">{eventDate}</p>
              </div>
            </div>
          )}

          {eventLocation && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-sm text-foreground truncate">{eventLocation}</p>
              </div>
            </div>
          )}

          {ticketType && (
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Ticket Type</p>
                <p className="font-semibold text-sm text-foreground">{ticketType}</p>
              </div>
            </div>
          )}

          {/* Group Registration Info */}
          {isGroup && (
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="font-semibold text-sm text-foreground">
                  {participantCount} {participantCount === 1 ? "Person" : "People"}
                </p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          {isPaid && (
            <div className="flex items-center gap-2.5">
              <IndianRupee className="w-4 h-4 text-success shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Amount Paid</p>
                <p className="font-semibold text-sm text-success">
                  ₹{isGroup ? totalAmount : ticketPrice}
                </p>
              </div>
            </div>
          )}

          {/* Free Event Badge */}
          {!isPaid && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-2 text-center">
              <p className="text-xs font-semibold text-success">FREE EVENT - No Payment Required</p>
            </div>
          )}
        </div>

        {/* Participants List - Show for both single and group */}
        {participants?.length > 0 && (
          <div className="border-t border-border space-y-1.5 pt-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {isGroup ? "Registered Participants:" : "Your Details:"}
            </p>
            <div
              className={`space-y-1.5 ${
                isGroup ? "max-h-32 overflow-x-auto flex h-full gap-3" : ""
              }`}
            >
              {participants.map((participant, index) => (
                <div key={index} className="bg-accent/30 rounded p-2 text-xs">
                  <p className="font-semibold text-foreground">{participant?.name || "N/A"}</p>
                  {participant?.email && (
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <IconMail size={14} /> {participant.email}
                    </p>
                  )}
                  {participant?.phone && (
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <IconBrandWhatsapp size={14} /> {participant.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
