"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconChevronLeft,
  IconClockHour4,
  IconDeviceFloppy,
  IconTicket,
  IconUsers,
  IconUserStar,
  IconX,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function getSafeDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getInitialValues(defaultValues) {
  return {
    ticketType: defaultValues?.type ?? "",
    description: defaultValues?.description ?? "",
    price: String(defaultValues?.price ?? 0),
    capacity: String(defaultValues?.capacity ?? ""),
    salesStartTime: getSafeDate(defaultValues?.salesStartTime),
    salesEndTime: getSafeDate(defaultValues?.salesEndTime),
    isGroup: Boolean(
      defaultValues?.isGroupTicket ?? defaultValues?.groupSettings,
    ),
    isActive: defaultValues?.isActive ?? true,
    minParticipants: String(defaultValues?.groupSettings?.minParticipants ?? 2),
    maxParticipants: String(
      defaultValues?.groupSettings?.maxParticipants ?? 10,
    ),
    leaderRequired: defaultValues?.groupSettings?.groupLeaderRequired ?? false,
  };
}

function formatSchedule(value) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(value);
}

function getValidationErrors(form) {
  const errors = [];

  if (!form.ticketType.trim()) {
    errors.push("Ticket name is required.");
  }

  if (!form.capacity || Number(form.capacity) < 1) {
    errors.push("Capacity must be at least 1.");
  }

  if (
    form.salesStartTime &&
    form.salesEndTime &&
    form.salesEndTime < form.salesStartTime
  ) {
    errors.push("Sales end time must be after the start time.");
  }

  if (Number(form.price) < 0) {
    errors.push("Price cannot be negative.");
  }

  if (form.isGroup) {
    if (Number(form.minParticipants) < 2) {
      errors.push("Group tickets need at least 2 minimum participants.");
    }

    if (Number(form.maxParticipants) < Number(form.minParticipants)) {
      errors.push(
        "Maximum participants must be greater than minimum participants.",
      );
    }
  }

  return errors;
}

function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-muted/20 p-4 sm:p-5">
      <div className="mb-4 space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function TicketForm({
  isEditMode = false,
  defaultValues,
  onSubmit,
  eventSlug,
  isLoading = false,
}) {
  const router = useRouter();
  const [form, setForm] = useState(() => getInitialValues(defaultValues));
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    setForm(getInitialValues(defaultValues));
    setHasAttemptedSubmit(false);
  }, [defaultValues]);

  const validationErrors = getValidationErrors(form);
  const isFreeTicket = Number(form.price || 0) === 0;

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);

    if (validationErrors.length > 0) {
      return;
    }

    const payload = {
      ...(isEditMode ? defaultValues : {}),
      type: form.ticketType.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      capacity: Number(form.capacity) || 0,
      salesStartTime: form.salesStartTime?.toISOString(),
      salesEndTime: form.salesEndTime?.toISOString(),
      isGroupTicket: form.isGroup,
      isActive: form.isActive,
      ...(isEditMode && defaultValues?.type
        ? { originalType: defaultValues.type }
        : {}),
      groupSettings: form.isGroup
        ? {
            minParticipants: Number(form.minParticipants) || 2,
            maxParticipants: Number(form.maxParticipants) || 10,
            groupLeaderRequired: form.leaderRequired,
          }
        : undefined,
    };

    onSubmit?.(payload);
  };

  const handleClose = () => {
    if (eventSlug) {
      router.replace(`/events/${eventSlug}/tickets`);
      return;
    }

    router.back();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="rounded-full px-3"
          onClick={handleClose}
        >
          <IconChevronLeft className="h-4 w-4" />
          Back to tickets
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Close editor"
          className="rounded-full"
          onClick={handleClose}
        >
          <IconX className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,22rem)]">
        <Card className="border-border/70 p-5 shadow-sm sm:p-6">
          <CardHeader className="gap-4 border-b border-border/70 p-0 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <Badge
                  variant="outline"
                  className="w-fit rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
                >
                  {isEditMode ? "Update ticket" : "Create ticket"}
                </Badge>
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                      <IconTicket className="h-5 w-5" />
                    </span>
                    {isEditMode
                      ? "Refine ticket details"
                      : "Set up a new ticket"}
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base">
                    Configure the name, price, sales schedule, and attendee
                    rules in one place with a quick preview beside it.
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isFreeTicket && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Free ticket
                  </Badge>
                )}
                {form.isGroup && (
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    <IconUsers className="mr-1 h-3.5 w-3.5" />
                    Group ticket
                  </Badge>
                )}
                <Badge
                  variant={form.isActive ? "success" : "secondary"}
                  className="rounded-full px-3 py-1"
                >
                  {form.isActive ? "Active after save" : "Saved as inactive"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-0 pt-5">
            {hasAttemptedSubmit && validationErrors.length > 0 && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <div className="flex items-start gap-2">
                  <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="space-y-1">
                    {validationErrors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <SectionCard
              title="Ticket basics"
              description="Choose a clear name and short description so organizers can recognize this tier instantly."
            >
              <div className="space-y-2">
                <Label htmlFor="ticketType">Ticket name</Label>
                <Input
                  id="ticketType"
                  value={form.ticketType}
                  onChange={(event) =>
                    updateField("ticketType", event.target.value)
                  }
                  placeholder="Early Bird, VIP, General Pass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketDescription">Description</Label>
                <Textarea
                  id="ticketDescription"
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Explain who this ticket is for and what makes it useful."
                  className="min-h-24 rounded-2xl"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Pricing and inventory"
              description="Set how much the ticket costs and how many registrations it can accept."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ticketPrice">Price</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField("price", event.target.value)
                    }
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use `0` for a free ticket.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticketCapacity">Capacity</Label>
                  <Input
                    id="ticketCapacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(event) =>
                      updateField("capacity", event.target.value)
                    }
                    placeholder="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    This controls how many registrations can be sold.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Sales schedule"
              description="Optionally control when this ticket becomes available and when sales stop."
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sales start</Label>
                  <DateTimePicker
                    value={form.salesStartTime}
                    onChange={(value) => updateField("salesStartTime", value)}
                    use12HourFormat={true}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sales end</Label>
                  <DateTimePicker
                    value={form.salesEndTime}
                    onChange={(value) => updateField("salesEndTime", value)}
                    use12HourFormat={true}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Ticket rules"
              description="Decide whether this is for one attendee or a team, and whether it should go live immediately."
            >
              <div className="rounded-[1.25rem] border border-border/70 bg-background/80 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Group ticket</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow multiple participants under one registration.
                    </p>
                    {isEditMode && (
                      <p className="text-xs text-amber-600">
                        Group mode stays locked after ticket creation.
                      </p>
                    )}
                  </div>
                  <Switch
                    checked={form.isGroup}
                    onCheckedChange={(value) => updateField("isGroup", value)}
                    disabled={isEditMode}
                  />
                </div>

                {form.isGroup && (
                  <div className="mt-4 space-y-4 border-t border-border/70 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="minParticipants">
                          Minimum participants
                        </Label>
                        <Input
                          id="minParticipants"
                          type="number"
                          min="2"
                          value={form.minParticipants}
                          onChange={(event) =>
                            updateField("minParticipants", event.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxParticipants">
                          Maximum participants
                        </Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          min="2"
                          value={form.maxParticipants}
                          onChange={(event) =>
                            updateField("maxParticipants", event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Group leader required
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Require one participant to be marked as the lead for
                          the group.
                        </p>
                      </div>
                      <Switch
                        checked={form.leaderRequired}
                        onCheckedChange={(value) =>
                          updateField("leaderRequired", value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-border/70 bg-background/80 p-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Ticket active</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn this on when buyers should be allowed to see and buy
                    the ticket after save.
                  </p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(value) => updateField("isActive", value)}
                />
              </div>
            </SectionCard>
          </CardContent>

          <CardFooter className="flex flex-col-reverse gap-3 border-t border-border/70 p-0 pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="w-full rounded-full sm:w-auto"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full px-5 sm:w-auto"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {isEditMode ? "Save changes" : "Create ticket"}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4 2xl:sticky 2xl:top-6 2xl:self-start">
          <Card className="border-border/70 p-5 shadow-sm">
            <CardHeader className="gap-2 p-0">
              <CardTitle className="text-lg">Live preview</CardTitle>
              <CardDescription>
                A quick summary of how this setup reads before you save it.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-0 pt-5">
              <div className="border border-border/70 bg-linear-to-br from-background to-muted/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={form.isActive ? "success" : "secondary"}
                        className="rounded-full px-3 py-1"
                      >
                        {form.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1"
                      >
                        {form.isGroup ? "Group" : "Individual"}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {form.ticketType.trim() || "Untitled ticket"}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {form.description.trim() ||
                        "Add a short description to help your team understand this ticket quickly."}
                    </p>
                  </div>
                  <span className="rounded-2xl border border-primary/15 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                    {isFreeTicket ? "Free" : `Rs ${Number(form.price || 0)}`}
                  </span>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium text-foreground">
                      {form.capacity || "0"} seats
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Sales start</span>
                    <span className="text-right font-medium text-foreground">
                      {formatSchedule(form.salesStartTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Sales end</span>
                    <span className="text-right font-medium text-foreground">
                      {formatSchedule(form.salesEndTime)}
                    </span>
                  </div>
                </div>

                {form.isGroup && (
                  <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/[0.05] p-3 text-sm">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <IconUsers className="h-4 w-4 text-primary" />
                      Group rules
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {form.minParticipants} to {form.maxParticipants} members
                      {form.leaderRequired ? " with a required leader." : "."}
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <IconClockHour4 className="h-4 w-4 text-primary" />
                  Quick guidance
                </div>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <p>
                    Keep ticket names short so they stay readable in checkout
                    and reports.
                  </p>
                  <p>
                    Use inactive mode if you want to prepare inventory before
                    opening sales.
                  </p>
                  <p
                    className={cn(
                      "rounded-2xl border px-3 py-2",
                      form.isGroup
                        ? "border-primary/10 bg-primary/[0.05] text-foreground"
                        : "border-border/70 bg-background/80",
                    )}
                  >
                    {form.isGroup ? (
                      <>
                        <IconUserStar className="mr-2 inline h-4 w-4 text-primary" />
                        Group tickets work best when the participation rules are
                        very clear.
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="mr-2 inline h-4 w-4 text-primary" />
                        Individual tickets are the simplest option for most
                        events.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
