"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconChevronLeft, IconX } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { validateSessionForm } from "./session-validation";
import {
  SessionBasicsSection,
  SessionCheckInSection,
  SessionScheduleSection,
  SessionStatusSection,
  SessionVenueSection,
} from "./session-form-sections";

const getInitialValues = (defaultValues) => ({
  title: defaultValues?.title ?? "",
  description: defaultValues?.description ?? "",
  startTime: defaultValues?.startTime ?? null,
  endTime: defaultValues?.endTime ?? null,
  isActive: defaultValues?.isActive ?? true,
  allowCheckIn: defaultValues?.allowCheckIn ?? false,
  checkInStartTime: defaultValues?.checkInStartTime ?? null,
  checkInEndTime: defaultValues?.checkInEndTime ?? null,
  checkInCode: defaultValues?.checkInCode ?? "",
  speakers: (defaultValues?.speakers || []).join(", "),
  venue: {
    name: defaultValues?.venue?.name ?? "",
    locality: defaultValues?.venue?.locality ?? "",
    address: defaultValues?.venue?.address ?? "",
    city: defaultValues?.venue?.city ?? "",
    state: defaultValues?.venue?.state ?? "",
    country: defaultValues?.venue?.country ?? "",
    zipCode: defaultValues?.venue?.zipCode ?? "",
  },
});

export default function SessionForm({
  eventSlug,
  defaultValues,
  isEditMode = false,
  isLoading = false,
  eventMode,
  allowMultipleSessions,
  sessionCount,
  existingTitles,
  onSubmit,
}) {
  const router = useRouter();
  const [form, setForm] = useState(() => getInitialValues(defaultValues));
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    setForm(getInitialValues(defaultValues));
    setAttemptedSubmit(false);
  }, [defaultValues]);

  const validationErrors = useMemo(
    () =>
      validateSessionForm(form, {
        mode: eventMode,
        allowMultipleSessions,
        sessionCount,
        existingTitles,
        originalTitle: defaultValues?.title,
        isEditMode,
      }),
    [form, eventMode, allowMultipleSessions, sessionCount, existingTitles, isEditMode, defaultValues],
  );

  const updateField = (field, value) => {
    const nextValue =
      field === "checkInCode"
        ? String(value || "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 6)
        : value;

    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const updateVenue = (field, value) => {
    setForm((current) => ({
      ...current,
      venue: { ...current.venue, [field]: value },
    }));
  };

  const handleClose = () => {
    if (eventSlug) {
      router.replace(`/events/${eventSlug}/sessions`);
      return;
    }
    router.back();
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if (validationErrors.length > 0) return;

    const speakers = form.speakers
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const payload = {
      ...(isEditMode ? defaultValues : {}),
      title: form.title.trim(),
      description: form.description.trim(),
      startTime: form.startTime ? new Date(form.startTime).toISOString() : null,
      endTime: form.endTime ? new Date(form.endTime).toISOString() : null,
      isActive: form.isActive,
      allowCheckIn: form.allowCheckIn,
      checkInStartTime: form.allowCheckIn
        ? new Date(form.checkInStartTime).toISOString()
        : null,
      checkInEndTime: form.allowCheckIn
        ? new Date(form.checkInEndTime).toISOString()
        : null,
      checkInCode: form.allowCheckIn ? form.checkInCode.trim() : undefined,
      speakers,
      venue: {
        ...form.venue,
      },
    };

    onSubmit?.(payload);
  };

  const checkInCodeValue = form.checkInCode;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="rounded-full px-3"
          onClick={handleClose}
        >
          <IconChevronLeft className="h-4 w-4" />
          Back to sessions
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

      <Card className="border-border/70 p-5 shadow-sm sm:p-6">
        <CardHeader className="gap-4 border-b border-border/70 p-0 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="w-fit rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
              >
                {isEditMode ? "Update session" : "Create session"}
              </Badge>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {isEditMode ? "Refine session details" : "Set up a session"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Define the agenda, location, and check-in settings in one go.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={form.isActive ? "success" : "secondary"}>
                {form.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant={form.allowCheckIn ? "warning" : "outline"}>
                {form.allowCheckIn ? "Check-in enabled" : "Check-in off"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-0 pt-5">
          {attemptedSubmit && validationErrors.length > 0 && (
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

          <SessionBasicsSection form={form} onUpdate={updateField} />
          <SessionScheduleSection form={form} onUpdate={updateField} />
          <SessionVenueSection
            form={form}
            onVenueUpdate={updateVenue}
            isVenueRequired={["offline", "hybrid"].includes(eventMode)}
          />
          {!isEditMode ? (
            <SessionCheckInSection
              form={form}
              onUpdate={updateField}
              checkInCodeValue={checkInCodeValue}
            />
          ) : (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
              Check-in settings are managed from the session cards.
            </div>
          )}
          <SessionStatusSection form={form} onUpdate={updateField} />
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
            {isEditMode ? "Save changes" : "Create session"}
          </Button>
        </CardFooter>
      </Card>

      {!allowMultipleSessions && !isEditMode && sessionCount > 0 && (
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
          Single-session event
        </Badge>
      )}
    </div>
  );
}
