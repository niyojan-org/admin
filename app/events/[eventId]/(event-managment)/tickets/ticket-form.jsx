"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { IconTicket, IconUsers, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

function getSafeDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function TicketForm({
  isEditMode = false,
  defaultValues,
  onSubmit,
  eventSlug,
}) {
  const [ticketType, setTicketType] = useState(defaultValues?.type ?? "");
  const [isGroup, setIsGroup] = useState(
    Boolean(defaultValues?.isGroupTicket ?? defaultValues?.groupSettings),
  );
  const [price, setPrice] = useState(defaultValues?.price ?? 0);
  const [capacity, setCapacity] = useState(defaultValues?.capacity ?? "");
  const [salesStartTime, setSalesStartTime] = useState(
    getSafeDate(defaultValues?.salesStartTime),
  );
  const [salesEndTime, setSalesEndTime] = useState(
    getSafeDate(defaultValues?.salesEndTime),
  );
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true);
  const [minParticipants, setMinParticipants] = useState(
    defaultValues?.groupSettings?.minParticipants ?? 2,
  );
  const [maxParticipants, setMaxParticipants] = useState(
    defaultValues?.groupSettings?.maxParticipants ?? 10,
  );
  const [leaderRequired, setLeaderRequired] = useState(
    defaultValues?.groupSettings?.groupLeaderRequired ?? false,
  );
  const router = useRouter();

  const handleSubmit = () => {
    const payload = {
      ...defaultValues,
      type: ticketType.trim(),
      price: Number(price) || 0,
      capacity: Number(capacity) || 0,
      salesStartTime: salesStartTime?.toISOString(),
      salesEndTime: salesEndTime?.toISOString(),
      isGroupTicket: isGroup,
      isActive,
      groupSettings: isGroup
        ? {
            minParticipants: Number(minParticipants) || 2,
            maxParticipants: Number(maxParticipants) || 10,
            groupLeaderRequired: leaderRequired,
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
    <div className="sm:px-3 py-2">
      <Card className="gap-5 p-4 sm:p-5 justify-between">
        <CardHeader className="p-0 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <IconTicket className="h-5 w-5" />
                {isEditMode ? "Edit Ticket" : "Create Ticket"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Update the details of this ticket type"
                  : "Set up pricing and availability for this ticket"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={handleClose}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-0">
          <div className="space-y-2">
            <Label>Ticket Type *</Label>
            <Input
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              placeholder="e.g. Early Bird, VIP, General"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Price *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Capacity *</Label>
              <Input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {price === 0 && <Badge variant="secondary">Free Ticket</Badge>}
            {isGroup && (
              <Badge variant="outline" className="gap-1">
                <IconUsers className="h-3 w-3" />
                Group Ticket
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Sales Start</Label>
              <DateTimePicker
                value={salesStartTime}
                onChange={setSalesStartTime}
                use12HourFormat={true}
              />
            </div>

            <div className="space-y-2">
              <Label>Sales End</Label>
              <DateTimePicker
                value={salesEndTime}
                onChange={setSalesEndTime}
                use12HourFormat={true}
              />
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label>Group Ticket</Label>
                <p className="text-sm text-muted-foreground">
                  Allow multiple participants per ticket
                </p>
              </div>
              <Switch checked={isGroup} onCheckedChange={setIsGroup} />
            </div>

            {isGroup && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Minimum Participants</Label>
                    <Input
                      type="number"
                      min="2"
                      value={minParticipants}
                      onChange={(e) => setMinParticipants(e.target.value)}
                      placeholder="2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Participants</Label>
                    <Input
                      type="number"
                      min="2"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label>Group Leader Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Require one member as group leader
                    </p>
                  </div>
                  <Switch
                    checked={leaderRequired}
                    onCheckedChange={setLeaderRequired}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Ticket Active</Label>
              <p className="text-sm text-muted-foreground">
                Make this ticket available for purchase
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* <div ></div> */}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Update Ticket" : "Save Ticket"}
          </Button>
        </CardFooter>
      </Card>

      {/* TODO: handle form submission */}
      {/* TODO: call create/update ticket API */}
    </div>
  );
}
