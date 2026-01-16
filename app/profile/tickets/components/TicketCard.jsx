"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Eye, CheckCircle2, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function TicketCard({ ticket, onViewDetails, className }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventDate = () => {
    if (ticket.sessionCheckIn && ticket.sessionCheckIn.length > 0) {
      return ticket.sessionCheckIn[0].sessionDetails?.startTime;
    }
    return ticket.createdAt;
  };

  const getVenue = () => {
    if (ticket.sessionCheckIn && ticket.sessionCheckIn.length > 0) {
      const venue = ticket.sessionCheckIn[0].sessionDetails?.venue;
      if (venue) {
        return `${venue.city}, ${venue.state}`;
      }
    }
    return "Venue TBA";
  };

  const hasCheckedIn = ticket.sessionCheckIn?.some(
    (session) => session.checkedIn
  );

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-xl transition-all duration-300 w-full border-2 hover:border-primary/50 py-0",
        className
      )}
    >
      {/* Banner with Gradient Overlay */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={ticket.event?.bannerImage}
          alt={ticket.event?.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={cn("text-white border-0", getStatusColor(ticket.status))}
          >
            {ticket.status}
          </Badge>
        </div>

        {/* Check-in Indicator */}
        {hasCheckedIn && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-500 text-white border-0 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Checked In
            </Badge>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg line-clamp-2 mb-1">
            {ticket.event?.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {ticket.event?.category}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-white/20 text-white border-white/30"
            >
              {ticket.ticket?.type}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1 w-full">
        {/* Ticket Code */}
        <div className="flex items-center justify-between p-2.5 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium">
              Ticket Code
            </p>
            <p className="font-mono font-bold text-sm tracking-wide">
              {ticket.ticket?.code}
            </p>
          </div>
          {ticket.ticket?.price > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Price</p>
              <p className="font-bold text-primary text-lg">
                ₹{ticket.ticket?.price}
              </p>
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">{formatDate(getEventDate())}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{getVenue()}</span>
          </div>
        </div>

        {/* Group Badge */}
        {ticket.groupInfo?.groupName && (
          <Badge variant="outline" className="w-full justify-center text-xs">
            Group: {ticket.groupInfo.groupName}
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="flex w-full gap-2 pt-2">
          <Button
            size="sm"
            variant="default"
            className="gap-1.5 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(ticket.ticket.code);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          {ticket?.status?.toLowerCase() === "confirmed" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsSheetOpen(true);
              }}
            >
              <Ticket className="h-3.5 w-3.5" />
              Show Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Ticket Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-dvh sm:h-[90vh] p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-2xl font-bold">Your Ticket</SheetTitle>
            <SheetDescription>
              Present this QR code at the venue entrance
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
            <p className="text-2xl font-bold text-center">{ticket.event.title}</p>
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-background rounded-lg">
                <QRCodeSVG
                  value={ticket._id || ticket.ticket.code}
                  size={200}
                  level="H"
                  fgColor="var(--foreground)"
                  bgColor="var(--background)"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Scan this QR code for entry
              </p>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Ticket Code
                </p>
                <p className="font-mono font-bold text-lg tracking-wide">
                  {ticket.ticket?.code}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {ticket.ticket?.price > 0 && (
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Price
                    </p>
                    <p className="font-bold text-primary text-xl">
                      ₹{ticket.ticket?.price}
                    </p>
                  </div>
                )}
                <div className="p-4 bg-card rounded-lg border">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Type
                  </p>
                  <p className="font-semibold text-sm">
                    {ticket.ticket?.type}
                  </p>
                </div>
              </div>

              {/* Event Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Event Date
                    </p>
                    <p className="font-semibold">{formatDate(getEventDate())}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Venue
                    </p>
                    <p className="font-semibold">{getVenue()}</p>
                  </div>
                </div>
              </div>

              {/* Check-in Status */}
              {hasCheckedIn && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="font-semibold text-green-700 dark:text-green-400">
                      You have checked in
                    </p>
                  </div>
                </div>
              )}

              {/* Group Info */}
              {ticket.groupInfo?.groupName && (
                <div className="p-4 bg-card rounded-lg border">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Group
                  </p>
                  <p className="font-semibold">{ticket.groupInfo.groupName}</p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
