import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  IconCalendarEvent,
  IconCalendarTime,
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
import { useParams, useRouter } from "next/navigation";

const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const priceFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
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

const formatPrice = (price) => {
  const numericPrice = Number(price || 0);
  return numericPrice === 0
    ? "Free"
    : `Rs ${priceFormatter.format(numericPrice)}`;
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

function MetricCard({ icon: Icon, label, value, helper, toneClass }) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-1 text-lg font-semibold text-foreground",
              toneClass,
            )}
          >
            {value}
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {/* <p className="mt-2 text-xs text-muted-foreground">{helper}</p> */}
    </div>
  );
}

function TicketCard({
  ticket,
  className,
  onEdit,
  onDuplicate,
  onToggleActive,
  ...props
}) {
  const isActive = Boolean(ticket?.isActive);
  const isGroupTicket = Boolean(ticket?.isGroupTicket);

  const capacity = Number(ticket?.capacity || 0);
  const sold = Number(ticket?.sold || 0);
  const available = Math.max(capacity - sold, 0);
  const soldPercent = capacity > 0 ? Math.min((sold / capacity) * 100, 100) : 0;
  const soldPercentLabel = Math.round(soldPercent);
  const salesState = getSalesWindowState(ticket || {});
  const router = useRouter();
  const params = useParams();
  const routeEventId = Array.isArray(params?.eventId)
    ? params.eventId[0]
    : params?.eventId;

  const handleEdit = () => {
    if (!routeEventId) return;
    router.push(`/events/${routeEventId}/tickets/edit?id=${ticket._id}`);
  };

  const availabilityLabel =
    sold >= capacity && capacity > 0
      ? "Sold out"
      : sold === 0
        ? "No sales yet"
        : available <= Math.max(10, Math.ceil(capacity * 0.15))
          ? "Low availability"
          : "Open inventory";

  const progressToneClass =
    soldPercent >= 100
      ? "text-destructive"
      : soldPercent >= 70
        ? "text-amber-600"
        : "text-emerald-600";

  return (
    <Card
      className={cn(
        "group h-full w-full max-w-md gap-0 overflow-hidden border-border/70 p-0 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-xl sm:p-0 justify-between",
        className,
      )}
      {...props}
    >
      {/* CARD HEADER */}
      <div className="border-b bg-linear-to-br from-background via-background to-muted/30 px-5 pb-0 py-2 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
              isGroupTicket
                ? "border-primary/15 bg-primary/10 text-primary"
                : "border-border/60 bg-muted/70 text-foreground",
            )}
          >
            {isGroupTicket ? (
              <IconUsersGroup className="h-6 w-6" />
            ) : (
              <IconUser className="h-6 w-6" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
                {ticket?.type || "Ticket"}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={isActive ? "success" : "secondary"}
                  className="gap-1 px-2.5 py-1"
                >
                  {isActive ? (
                    <IconShieldCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconShieldX className="h-3.5 w-3.5" />
                  )}
                  {isActive ? "Active" : "Inactive"}
                </Badge>

                <Badge variant="outline" className="px-2.5 py-1">
                  {isGroupTicket ? "Group" : "Individual"}
                </Badge>
              </div>
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {ticket?.description ||
                (isGroupTicket
                  ? "Designed for grouped registrations with shared participant rules."
                  : "Single-attendee ticket with its own inventory and sales window.")}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-2 px-2 py-2 gap-2">
        {/* SECTION 1 */}
        <div className="grid grid-cols-3 gap-2">
          <MetricCard
            icon={IconTicket}
            label="Capacity"
            value={numberFormatter.format(capacity)}
            helper="Total bookable slots"
          />
          <MetricCard
            icon={IconTrendingUp}
            label="Sold"
            value={numberFormatter.format(sold)}
            helper="Completed registrations"
          />
          <MetricCard
            icon={IconUserCheck}
            label="Available"
            value={numberFormatter.format(available)}
            helper={availabilityLabel}
            toneClass={available > 0 ? "text-emerald-600" : "text-destructive"}
          />
        </div>

        {/* SECTION 2 */}
        <div className="grid grid-cols-3 items-center justify-between w-full gap-2">
          {/* PRICE */}
          <div className="col-span-1 rounded-2xl border bg-background/90 px-2 py-3 text-right shadow-sm backdrop-blur-sm w-full h-full">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Price
            </p>
            <div className="mt-1 flex items-center justify-end gap-2 text-2xl font-semibold tracking-tight text-foreground">
              {Number(ticket?.price || 0) === 0 ? (
                <span>Free</span>
              ) : (
                <>
                  <IconCurrencyRupee className="h-5 w-5" />
                  <span>
                    {numberFormatter.format(Number(ticket?.price || 0))}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {isGroupTicket ? "Per team" : "Per attendee"}
            </p>
          </div>

          {/* SALES PROGRESS */}
          <div className="col-span-2 rounded-2xl border bg-muted/20 px-2 py-1 space-y-2 h-full justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Sales progress
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {numberFormatter.format(sold)} sold out of{" "}
                  {numberFormatter.format(capacity)} capacity
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-lg font-semibold", progressToneClass)}>
                  {soldPercentLabel}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {availabilityLabel}
                </p>
              </div>
            </div>

            <Progress value={soldPercent} className="h-2.5 bg-muted" />

            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{formatPrice(ticket?.price)}</span>
              <span>{numberFormatter.format(available)} remaining</span>
            </div>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="grid grid-cols-1 gap-3 w-full">
          <div className="rounded-2xl border bg-background p-2 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <IconCalendarEvent className="h-6 w-6" />
              </div>
              <span className="ml-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Sales window
              </span>
            </div>
            <div className="w-full flex flex-col items-center pt-1">
              <Badge variant={salesState.variant} className="text-xs">
                {salesState.label}
              </Badge>
              <div className="w-full flex flex-col items-center pt-2">
                <p className="font-semibold">
                  {formatDateTime(ticket?.salesStartTime)}
                </p>
                <p className="text-sm text-muted-foreground">TO</p>
                <p className="font-semibold">
                  {formatDateTime(ticket?.salesEndTime)}
                </p>
              </div>
            </div>
          </div>

          {isGroupTicket ? (
            <div className="w-full h-full">
              <div className="rounded-2xl border bg-background p-2 shadow-sm h-full">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <IconUsersGroup className="h-6 w-6" />
                  </div>
                  <span className="ml-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Group Rule
                  </span>
                </div>
                <div className="w-full flex flex-col items-center pt-1">
                  <p className="">Group can have:</p>
                  <p className="">
                    At least -{" "}
                    <span className="text-primary font-bold text-lg">
                      {ticket.groupSettings.minParticipants}
                    </span>
                  </p>
                  <p className="">
                    At max -{" "}
                    <span className="text-primary font-bold text-lg">
                      {ticket.groupSettings.maxParticipants}
                    </span>
                  </p>
                  <p>
                    Member{" "}
                    {ticket.groupSettings.groupLeaderRequired &&
                      "including leader"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border bg-background p-2 shadow-sm w-full">
              <div className="flex items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <IconCalendarTime className="h-6 w-6" />
                </div>
                <span className="ml-1 text-xs font-medium uppercase text-muted-foreground">
                  Ticket Access
                </span>
              </div>
              <p className="text-center font-semibold">
                Single Attendee Admission
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <div className="grid h-12 w-full grid-cols-3 gap-0 border-t p-0">
        <button
          type="button"
          className="flex h-full items-center justify-center gap-2 border-r rounded-bl-xl text-sm font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
          onClick={handleEdit}
        >
          <IconEdit className="h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          className="flex h-full items-center justify-center gap-2 border-r text-sm font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
          onClick={() => onDuplicate?.(ticket)}
        >
          <IconCopy className="h-4 w-4" />
          Duplicate
        </button>

        <button
          type="button"
          className={cn(
            "flex h-full items-center justify-center gap-2 rounded-br-xl text-sm font-semibold text-white transition-colors cursor-pointer",
            isActive
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-success hover:bg-success/90",
          )}
          onClick={() => onToggleActive?.(ticket)}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </Card>
  );
}

export default TicketCard;
