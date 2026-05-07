import { useParams, useRouter } from "next/navigation";
import {
  IconCalendarEvent,
  IconCopy,
  IconCurrencyRupee,
  IconEdit,
  IconShieldCheck,
  IconShieldX,
  IconTicket,
  IconTrendingUp,
  IconUser,
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const toDate = (value) => {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getSalesWindowState = ({ isActive, salesStartTime, salesEndTime }) => {
  if (!isActive) {
    return { label: "Paused", variant: "secondary" };
  }

  const now = new Date();
  const start = toDate(salesStartTime);
  const end = toDate(salesEndTime);

  if (start && now < start) {
    return { label: "Upcoming", variant: "warning" };
  }

  if (end && now > end) {
    return { label: "Ended", variant: "secondary" };
  }

  return { label: "Live", variant: "success" };
};

function StatTile({ icon: Icon, label, value, toneClass }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p
        className={cn("mt-2 text-lg font-semibold text-foreground", toneClass)}
      >
        {value}
      </p>
    </div>
  );
}

function TicketCard({
  ticket,
  className,
  onDuplicate,
  onToggleActive,
  isBusy = false,
  ...props
}) {
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;

  const isActive = Boolean(ticket?.isActive);
  const isGroupTicket = Boolean(ticket?.isGroupTicket);
  const capacity = Number(ticket?.capacity || 0);
  const sold = Number(ticket?.sold || 0);
  const available = Math.max(capacity - sold, 0);
  const soldPercent = capacity > 0 ? Math.min((sold / capacity) * 100, 100) : 0;
  const salesState = getSalesWindowState(ticket || {});

  const availabilityLabel =
    sold >= capacity && capacity > 0
      ? "Sold out"
      : sold === 0
        ? "No sales yet"
        : available <= Math.max(10, Math.ceil(capacity * 0.15))
          ? "Low availability"
          : "Healthy inventory";

  const priceLabel =
    Number(ticket?.price || 0) === 0
      ? "Free"
      : `${numberFormatter.format(Number(ticket?.price || 0))}`;

  const handleEdit = () => {
    if (!routeEventId) return;
    router.push(`/events/${routeEventId}/tickets/edit?id=${ticket._id}`);
  };

  return (
    <Card
      className={cn(
        "h-full shadow-sm transition-all duration-300 hover:shadow-xl",
        className,
      )}
      {...props}
    >
      <CardHeader className="border-b border-border">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
              isGroupTicket
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border/60 bg-muted/60 text-foreground",
            )}
          >
            {isGroupTicket ? (
              <IconUsersGroup className="h-6 w-6" />
            ) : (
              <IconUser className="h-6 w-6" />
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
                variant={salesState.variant}
                className="rounded-full px-3 py-1"
              >
                {salesState.label}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {isGroupTicket ? "Group ticket" : "Individual"}
              </Badge>
            </div>

            <div className="mt-2">
              <h3 className="truncate text-xl font-semibold tracking-tight text-foreground">
                {ticket?.type || "Ticket"}
              </h3>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {ticket?.description ||
                  (isGroupTicket
                    ? "Built for team registrations with shared participant rules."
                    : "Single attendee access with its own inventory and sales schedule.")}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <StatTile
            icon={IconTicket}
            label="Capacity"
            value={numberFormatter.format(capacity)}
          />
          <StatTile
            icon={IconTrendingUp}
            label="Sold"
            value={numberFormatter.format(sold)}
          />
          <StatTile
            icon={IconUserCheck}
            label="Available"
            value={numberFormatter.format(available)}
            toneClass={available > 0 ? "text-emerald-600" : "text-destructive"}
          />
        </div>

        <div className="p-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Sales progress
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {availabilityLabel}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-lg font-semibold",
                  soldPercent >= 100
                    ? "text-destructive"
                    : soldPercent >= 70
                      ? "text-amber-600"
                      : "text-emerald-600",
                )}
              >
                {Math.round(soldPercent)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {numberFormatter.format(available)} remaining
              </p>
            </div>
          </div>

          <Progress value={soldPercent} className="mt-2 h-2.5 bg-background" />

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Price
              </p>
              <div className="mt-2 flex items-center gap-1 text-lg font-semibold text-foreground">
                {Number(ticket?.price || 0) === 0 ? (
                  <span>Free</span>
                ) : (
                  <>
                    <IconCurrencyRupee className="h-4 w-4" />
                    <span>{priceLabel}</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {isGroupTicket ? "Charged per team" : "Charged per attendee"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
              <div className="flex items-center gap-2">
                <IconCalendarEvent className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Sales window
                </p>
              </div>
              <div className="mt-2 space-y-1.5 text-sm">
                <p className="font-medium text-foreground">
                  {formatDateTime(ticket?.salesStartTime)}
                </p>
                <p className="text-muted-foreground">to</p>
                <p className="font-medium text-foreground">
                  {formatDateTime(ticket?.salesEndTime)}
                </p>
              </div>
            </div>
          </div>

          {isGroupTicket && ticket?.groupSettings ? (
            <div className="mt-3 rounded-2xl border border-primary/10 bg-primary/5 p-3 text-sm">
              <p className="font-medium text-foreground">Group rule</p>
              <p className="mt-1 text-muted-foreground">
                {ticket.groupSettings.minParticipants} to{" "}
                {ticket.groupSettings.maxParticipants} participants
                {ticket.groupSettings.groupLeaderRequired
                  ? ", including a group leader."
                  : "."}
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-border/60 bg-background/80 p-3 text-sm text-muted-foreground">
              This ticket is configured for single attendee admission.
            </div>
          )}
        </div>
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
          onClick={() => onDuplicate?.(ticket)}
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
          onClick={() => onToggleActive?.(ticket)}
        >
          {isActive ? "Deactivate" : "Activate"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TicketCard;
