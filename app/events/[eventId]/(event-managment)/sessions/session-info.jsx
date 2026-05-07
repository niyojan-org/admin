import {
  IconCalendarEvent,
  IconCircleCheck,
  IconMapPin,
  IconQrcode,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function SummaryCard({ title, value, helper, icon: Icon, accentClass }) {
  return (
    <Card className="border-border/70 bg-background/80 shadow-sm">
      <CardContent className="flex items-start justify-between gap-3 p-0">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                accentClass,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionInfo({ sessions, onCreate, canCreate }) {
  const liveSessions = sessions.filter((session) => session?.isActive).length;
  const checkInSessions = sessions.filter(
    (session) => session?.allowCheckIn,
  ).length;
  const venueSessions = sessions.filter((session) => session?.venue?.name).length;

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Schedule sessions for this event
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Plan the agenda, set check-in windows, and keep sessions organized.
            </p>
          </div>
          {canCreate && (
            <Button
              size="lg"
              className="h-11 rounded-full px-5"
              onClick={onCreate}
            >
              Create session
            </Button>
          )}
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Sessions"
            value={numberFormatter.format(sessions.length)}
            helper="Total agenda items"
            icon={IconCalendarEvent}
            accentClass="border-primary/20 bg-primary/10 text-primary"
          />
          <SummaryCard
            title="Live"
            value={numberFormatter.format(liveSessions)}
            helper={`${numberFormatter.format(
              Math.max(sessions.length - liveSessions, 0),
            )} inactive`}
            icon={IconCircleCheck}
            accentClass="border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
          />
          <SummaryCard
            title="Check-in"
            value={numberFormatter.format(checkInSessions)}
            helper="Sessions with check-in enabled"
            icon={IconQrcode}
            accentClass="border-amber-500/20 bg-amber-500/10 text-amber-600"
          />
          <SummaryCard
            title="Venue"
            value={numberFormatter.format(venueSessions)}
            helper="Sessions with venue details"
            icon={IconMapPin}
            accentClass="border-sky-500/20 bg-sky-500/10 text-sky-600"
          />
        </div>

        {!canCreate && (
          <Badge variant="secondary" className="mt-3 w-fit rounded-full px-3">
            Session creation is locked based on event settings.
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

export default SessionInfo;
