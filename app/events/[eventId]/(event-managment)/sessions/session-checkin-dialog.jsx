"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const normalizeCode = (value) =>
  String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

const getInitialDraft = (initialValues) => ({
  start: initialValues?.checkInStartTime
    ? new Date(initialValues.checkInStartTime)
    : null,
  end: initialValues?.checkInEndTime
    ? new Date(initialValues.checkInEndTime)
    : null,
  code: normalizeCode(initialValues?.checkInCode || ""),
});

function SessionCheckInDialog({ open, onOpenChange, onSubmit, initialValues }) {
  const [draft, setDraft] = useState(() => getInitialDraft(initialValues));

  useEffect(() => {
    if (!open) return;
    setDraft(getInitialDraft(initialValues));
  }, [open, initialValues]);

  const updateDraft = (field, value) => {
    const nextValue = field === "code" ? normalizeCode(value) : value;
    setDraft((current) => ({ ...current, [field]: nextValue }));
  };

  const handleSubmit = () => {
    onSubmit?.({
      checkInStartTime: draft.start ? draft.start.toISOString() : null,
      checkInEndTime: draft.end ? draft.end.toISOString() : null,
      checkInCode: normalizeCode(draft.code),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enable session check-in</DialogTitle>
          <DialogDescription>
            Set the check-in window and code for attendees.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Check-in start</Label>
            <DateTimePicker
              value={draft.start}
              onChange={(value) => updateDraft("start", value)}
              use12HourFormat={true}
            />
          </div>
          <div className="space-y-2">
            <Label>Check-in end</Label>
            <DateTimePicker
              value={draft.end}
              onChange={(value) => updateDraft("end", value)}
              use12HourFormat={true}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Check-in code</Label>
            <Input
              value={draft.code}
              onChange={(event) => updateDraft("code", event.target.value)}
              placeholder="ABC123"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              6 uppercase letters or numbers.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 sm:col-span-2">
            Check-in can open up to 24 hours before the session and must end
            before the session ends.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Enable check-in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SessionCheckInDialog;
