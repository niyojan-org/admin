"use client";

import { useParams, useRouter } from "next/navigation";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { EventStore } from "../../event-store";
import ManagementBanner from "../../components/management-banner";
import { EventTicketStore } from "./event-ticket-store";
import AddingTicket from "./adding-tickets";
import TicketCard from "./ticket-card";
import TicketInfo from "./ticket-info";

function TicketPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-52 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-104 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export function TicketMainPage({ className, needCreateOption = true }) {
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;

  const { event, loading } = EventStore();
  const { loading: ticketActionLoading } = EventTicketStore();
  const tickets = event?.tickets || [];

  if (loading && !event) {
    return <TicketPageSkeleton />;
  }

  const handleCreateTicket = () => {
    if (!routeEventId) return;
    router.push(`/events/${routeEventId}/tickets/create`);
  };

  const handleDuplicateTicket = (ticket) => {
    if (!routeEventId) return;
    router.push(`/events/${routeEventId}/tickets/create?copy=${ticket._id}`);
  };

  const toggleTicketStatus = (ticket) => {
    EventTicketStore.getState().toggleTicketStatus(ticket.type);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <ManagementBanner />

      <TicketInfo
        tickets={tickets}
        handleCreateTicket={handleCreateTicket}
        needCreateOption={needCreateOption}
      />

      {tickets.length === 0 ? (
        <Card className="border-dashed border-border/70 bg-muted/20 p-6 shadow-none sm:p-8">
          <CardHeader className="gap-3 p-0">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              No tickets yet
            </Badge>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Start with your first ticket type
            </CardTitle>
            <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">
              Add a general pass, early bird offer, VIP tier, or a team-based
              registration option. You can refine timings and inventory any time
              later.
            </CardDescription>
          </CardHeader>
          {needCreateOption && (
            <CardContent className="p-0 pt-6">
              <Button
                size="lg"
                className="rounded-full px-5"
                onClick={handleCreateTicket}
              >
                <IconPlus className="h-4 w-4" />
                Add your first ticket
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Current ticket lineup
              </h3>
              <p className="text-sm text-muted-foreground">
                Review pricing, inventory, and sales availability at a glance.
              </p>
            </div>
            {!needCreateOption && (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {tickets.length} configured tickets
              </Badge>
            )}
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-4 md:grid-cols-2",
              needCreateOption && "2xl:grid-cols-3",
            )}
          >
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onDuplicate={handleDuplicateTicket}
                onToggleActive={toggleTicketStatus}
                isBusy={ticketActionLoading}
              />
            ))}

            {needCreateOption && tickets.length < 7 && (
              <AddingTicket onClick={handleCreateTicket} />
            )}
          </div>

          {needCreateOption && tickets.length >= 7 && (
            <div className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
              <span>
                You have reached the current recommendation of 7 ticket types
                for a simple buyer journey.
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                Keep it focused
                <IconArrowRight className="h-4 w-4" />
              </span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
