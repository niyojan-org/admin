import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

function SessionBasicsSection({ form, onUpdate }) {
  return (
    <SectionCard
      title="Session basics"
      description="Share the title and a short description for the agenda."
    >
      <div className="space-y-2">
        <Label htmlFor="sessionTitle">Session title</Label>
        <Input
          id="sessionTitle"
          value={form.title}
          onChange={(event) => onUpdate("title", event.target.value)}
          placeholder="Opening keynote, Panel discussion"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sessionDescription">Description</Label>
        <Textarea
          id="sessionDescription"
          value={form.description}
          onChange={(event) => onUpdate("description", event.target.value)}
          placeholder="Highlight what attendees should expect."
          className="min-h-24 rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sessionSpeakers">Speakers (comma separated)</Label>
        <Input
          id="sessionSpeakers"
          value={form.speakers}
          onChange={(event) => onUpdate("speakers", event.target.value)}
          placeholder="Jane Doe, Sam Lee"
        />
      </div>
    </SectionCard>
  );
}

function SessionScheduleSection({ form, onUpdate }) {
  return (
    <SectionCard
      title="Schedule"
      description="Set the start and end time for the session."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-2">
          <Label>Start time</Label>
          <DateTimePicker
            value={form.startTime ? new Date(form.startTime) : null}
            onChange={(value) => onUpdate("startTime", value)}
            use12HourFormat={true}
          />
        </div>
        <div className="space-y-2">
          <Label>End time</Label>
          <DateTimePicker
            value={form.endTime ? new Date(form.endTime) : null}
            onChange={(value) => onUpdate("endTime", value)}
            use12HourFormat={true}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function SessionVenueSection({ form, onVenueUpdate, isVenueRequired }) {
  return (
    <SectionCard
      title="Venue"
      description="Add the location details when this session is in-person."
    >
      {isVenueRequired && (
        <Badge variant="outline" className="w-fit">
          Venue required for this event mode
        </Badge>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Venue name</Label>
          <Input
            value={form.venue.name}
            onChange={(event) => onVenueUpdate("name", event.target.value)}
            placeholder="Main Hall"
          />
        </div>
        <div className="space-y-2">
          <Label>Locality</Label>
          <Input
            value={form.venue.locality}
            onChange={(event) => onVenueUpdate("locality", event.target.value)}
            placeholder="Downtown"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Address</Label>
          <Input
            value={form.venue.address}
            onChange={(event) => onVenueUpdate("address", event.target.value)}
            placeholder="123 Tech Street"
          />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={form.venue.city}
            onChange={(event) => onVenueUpdate("city", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input
            value={form.venue.state}
            onChange={(event) => onVenueUpdate("state", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input
            value={form.venue.country}
            onChange={(event) => onVenueUpdate("country", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Zip code</Label>
          <Input
            value={form.venue.zipCode}
            onChange={(event) => onVenueUpdate("zipCode", event.target.value)}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function SessionCheckInSection({ form, onUpdate, checkInCodeValue }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState({
    start: form.checkInStartTime,
    end: form.checkInEndTime,
    code: checkInCodeValue,
  });

  useEffect(() => {
    if (!dialogOpen) return;
    setDraft({
      start: form.checkInStartTime,
      end: form.checkInEndTime,
      code: checkInCodeValue,
    });
  }, [dialogOpen, form.checkInStartTime, form.checkInEndTime, checkInCodeValue]);

  const updateDraft = (field, value) => {
    const nextValue =
      field === "code"
        ? String(value || "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 6)
        : value;
    setDraft((current) => ({ ...current, [field]: nextValue }));
  };

  const handleEnableCheckIn = () => {
    onUpdate("allowCheckIn", true);
    onUpdate("checkInStartTime", draft.start);
    onUpdate("checkInEndTime", draft.end);
    onUpdate("checkInCode", draft.code);
    setDialogOpen(false);
  };

  return (
    <SectionCard
      title="Check-in"
      description="Allow participants to check in with a secure code."
    >
      {form.allowCheckIn ? (
        <>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 p-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Check-in enabled</Label>
              <p className="text-sm text-muted-foreground">
                Toggle off if this session should not accept check-ins.
              </p>
            </div>
            <Switch
              checked={form.allowCheckIn}
              onCheckedChange={(value) => onUpdate("allowCheckIn", value)}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Check-in start</Label>
              <DateTimePicker
                value={
                  form.checkInStartTime ? new Date(form.checkInStartTime) : null
                }
                onChange={(value) => onUpdate("checkInStartTime", value)}
                use12HourFormat={true}
              />
            </div>
            <div className="space-y-2">
              <Label>Check-in end</Label>
              <DateTimePicker
                value={
                  form.checkInEndTime ? new Date(form.checkInEndTime) : null
                }
                onChange={(value) => onUpdate("checkInEndTime", value)}
                use12HourFormat={true}
              />
            </div>
            <div className="space-y-2">
              <Label>Check-in code</Label>
              <Input
                value={checkInCodeValue}
                onChange={(event) =>
                  onUpdate("checkInCode", event.target.value)
                }
                placeholder="ABC123"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                6 uppercase letters or numbers.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Check-in is currently disabled
            </p>
            <p className="text-xs text-muted-foreground">
              Enable it with a secure code and time window for this session.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-fit rounded-full">
                Enable check-in
              </Button>
            </DialogTrigger>
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
                    value={draft.start ? new Date(draft.start) : null}
                    onChange={(value) => updateDraft("start", value)}
                    use12HourFormat={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check-in end</Label>
                  <DateTimePicker
                    value={draft.end ? new Date(draft.end) : null}
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
                  Check-in can open up to 24 hours before the session and must
                  end before the session ends.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEnableCheckIn}>Enable check-in</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {form.allowCheckIn && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700">
          Check-in can open up to 24 hours before the session and must end
          before the session ends.
        </div>
      )}
    </SectionCard>
  );
}

function SessionStatusSection({ form, onUpdate }) {
  return (
    <SectionCard
      title="Session status"
      description="Decide whether the session is visible immediately."
    >
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 p-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Session active</Label>
          <p className="text-sm text-muted-foreground">
            Keep this session active for the agenda view.
          </p>
        </div>
        <Switch
          checked={form.isActive}
          onCheckedChange={(value) => onUpdate("isActive", value)}
        />
      </div>
    </SectionCard>
  );
}

export {
  SessionBasicsSection,
  SessionCheckInSection,
  SessionScheduleSection,
  SessionStatusSection,
  SessionVenueSection,
};
