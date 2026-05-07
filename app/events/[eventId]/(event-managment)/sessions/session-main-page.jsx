"use client";

import { useParams, useRouter } from "next/navigation";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { EventSessionStore } from "./event-session-store";
import AddingSession from "./adding-session";
import SessionCard from "./session-card";
import SessionInfo from "./session-info";

function SessionPageSkeleton() {
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

export function SessionMainPage({ className, needCreateOption = true }) {
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;

  const { event, loading } = EventStore();
  const { loading: sessionActionLoading } = EventSessionStore();
  const sessions = event?.sessions || [];
  const allowMultipleSessions = event?.allowMultipleSessions ?? true;

  if (loading && !event) {
    return <SessionPageSkeleton />;
  }

  const canCreate =
    allowMultipleSessions ? sessions.length < 30 : sessions.length === 0;

  const handleCreateSession = () => {
    if (!routeEventId || !canCreate) return;
    router.push(`/events/${routeEventId}/sessions/create`);
  };

  const handleDuplicateSession = (session) => {
    if (!routeEventId) return;
    router.push(`/events/${routeEventId}/sessions/create?copy=${session._id}`);
  };

  const toggleSessionStatus = (session) => {
    EventSessionStore.getState().toggleSessionStatus(session._id);
  };

  const enableCheckIn = (session, payload) => {
    EventSessionStore.getState().enableCheckIn(session._id, payload);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <ManagementBanner />

      <SessionInfo
        sessions={sessions}
        onCreate={handleCreateSession}
        canCreate={needCreateOption && canCreate}
      />

      {sessions.length === 0 ? (
        <Card className="border-dashed border-border/70 bg-muted/20 p-6 shadow-none sm:p-8">
          <CardHeader className="gap-3 p-0">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              No sessions yet
            </Badge>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Add your first session to the agenda
            </CardTitle>
            <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">
              Sessions help attendees understand the flow of your event. Add a
              keynote, workshop, or panel to get started.
            </CardDescription>
          </CardHeader>
          {needCreateOption && (
            <CardContent className="p-0 pt-6">
              <Button
                size="lg"
                className="rounded-full px-5"
                onClick={handleCreateSession}
                disabled={!canCreate}
              >
                <IconPlus className="h-4 w-4" />
                Add your first session
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Current session lineup
              </h3>
              <p className="text-sm text-muted-foreground">
                Review timing, check-in status, and locations at a glance.
              </p>
            </div>
            {!needCreateOption && (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {sessions.length} configured sessions
              </Badge>
            )}
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-4 md:grid-cols-2",
              needCreateOption && "2xl:grid-cols-3",
            )}
          >
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onDuplicate={handleDuplicateSession}
                onToggleActive={toggleSessionStatus}
                onEnableCheckIn={enableCheckIn}
                isBusy={sessionActionLoading}
              />
            ))}

            {needCreateOption && canCreate && (
              <AddingSession onClick={handleCreateSession} />
            )}
          </div>

          {needCreateOption && !canCreate && (
            <div className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
              <span>
                {allowMultipleSessions
                  ? "You have reached the maximum of 30 sessions for this event."
                  : "Only one session is allowed for this event."}
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
