import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconCalendarEvent,
  IconCopy,
  IconEdit,
  IconMapPin,
  IconQrcode,
  IconShieldCheck,
  IconShieldX,
  IconTimelineEvent,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { formatDateTime, getDurationLabel } from "./session-helpers";
import SessionCheckInDialog from "./session-checkin-dialog";

function SessionCard({
  session,
  onDuplicate,
  onToggleActive,
  onEnableCheckIn,
  isBusy,
}) {
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);

  const isActive = Boolean(session?.isActive);
  const hasCheckIn = Boolean(session?.allowCheckIn);

  const handleEdit = () => {
    if (!routeEventId) return;
    router.push(`/events/${routeEventId}/sessions/edit?id=${session._id}`);
  };

  const handleEnableCheckIn = (payload) => {
    onEnableCheckIn?.(session, payload);
    setCheckInDialogOpen(false);
  };

  return (
    <Card className="h-full shadow-sm transition-all duration-300 hover:shadow-xl">
      <CardHeader className="border-b border-border">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
              hasCheckIn
                ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
                : "border-border/60 bg-muted/60 text-foreground",
            )}
          >
            {hasCheckIn ? (
              <IconQrcode className="h-6 w-6" />
            ) : (
              <IconCalendarEvent className="h-6 w-6" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={isActive ? "success" : "secondary"}
                className="rounded-full px-3 py-1"
              >
                {isActive ? (
                  <IconShieldCheck className="mr-1 h-3.5 w-3.5" />
                ) : (
                  <IconShieldX className="mr-1 h-3.5 w-3.5" />
                )}
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge
                variant={hasCheckIn ? "warning" : "outline"}
                className="rounded-full px-3 py-1"
              >
                {hasCheckIn ? "Check-in enabled" : "No check-in"}
              </Badge>
            </div>

            <div className="mt-2">
              <h3 className="text-xl font-semibold tracking-tight text-foreground line-clamp-2">
                {session?.title || "Session"}
              </h3>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {session?.description ||
                  "Keep your agenda organized with clear session details."}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <IconTimelineEvent className="h-4 w-4" />
            Session time
          </div>
          <div className="mt-2 space-y-1.5 text-sm">
            <p className="font-medium text-foreground">
              {formatDateTime(session?.startTime)}
            </p>
            <p className="text-muted-foreground">to</p>
            <p className="font-medium text-foreground">
              {formatDateTime(session?.endTime)}
            </p>
            <p className="text-xs text-muted-foreground">
              {getDurationLabel(session?.startTime, session?.endTime)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/80 p-3 text-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <IconMapPin className="h-4 w-4" />
            Venue
          </div>
          <p className="mt-2 font-medium text-foreground">
            {session?.venue?.name || "Venue not set"}
          </p>
          {session?.venue?.city || session?.venue?.state ? (
            <p className="text-xs text-muted-foreground">
              {[session?.venue?.city, session?.venue?.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          ) : null}
        </div>

        {!hasCheckIn && (
          <div className="rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-3">
            <p className="text-sm font-medium text-foreground">
              Check-in is disabled
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Enable it with a secure code and time window.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-fit rounded-full"
              onClick={() => setCheckInDialogOpen(true)}
            >
              Enable check-in
            </Button>
            <SessionCheckInDialog
              open={checkInDialogOpen}
              onOpenChange={setCheckInDialogOpen}
              onSubmit={handleEnableCheckIn}
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="grid grid-cols-1 gap-2 border-t border-border sm:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full"
          onClick={handleEdit}
        >
          <IconEdit className="h-4 w-4" />
          Edit
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full"
          onClick={() => onDuplicate?.(session)}
        >
          <IconCopy className="h-4 w-4" />
          Duplicate
        </Button>

        <Button
          type="button"
          className={cn(
            "h-10 rounded-full text-white",
            isActive
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-emerald-600 hover:bg-emerald-500",
          )}
          disabled={isBusy}
          onClick={() => onToggleActive?.(session)}
        >
          {isActive ? "Deactivate" : "Activate"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SessionCard;
