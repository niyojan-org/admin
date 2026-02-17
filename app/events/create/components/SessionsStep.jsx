"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Switch } from "@/components/ui/switch";
import { IconPlus, IconTrash, IconCalendar, IconMapPin } from "@tabler/icons-react";
import { useEventForm } from "../hooks/useEventForm";
import { Badge } from "@/components/ui/badge";

export default function SessionsStep() {
    const { eventDraft, sessions } = useEventForm();
    const [expandedSession, setExpandedSession] = useState(null);

    const addSpeaker = (sessionIndex) => {
        const session = eventDraft.sessions[sessionIndex];
        const speakerName = prompt("Enter speaker name:");
        if (speakerName?.trim()) {
            sessions.update(sessionIndex, {
                speakers: [...(session.speakers || []), speakerName.trim()]
            });
        }
    };

    const removeSpeaker = (sessionIndex, speakerIndex) => {
        const session = eventDraft.sessions[sessionIndex];
        sessions.update(sessionIndex, {
            speakers: session.speakers.filter((_, idx) => idx !== speakerIndex)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Event Sessions</h2>
                    <p className="text-muted-foreground">Add sessions and schedule for your event</p>
                </div>
                <Button onClick={() => sessions.add()} className="gap-2">
                    <IconPlus className="w-4 h-4" />
                    Add Session
                </Button>
            </div>

            {eventDraft.sessions.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <IconCalendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No sessions added yet</p>
                        <Button
                            onClick={() => sessions.add()}
                            variant="outline"
                            className="mt-4 gap-2"
                        >
                            <IconPlus className="w-4 h-4" />
                            Add Your First Session
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {eventDraft.sessions.map((session, index) => (
                        <Card key={index} className="relative">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">Session {index + 1}</CardTitle>
                                        {session.title && (
                                            <p className="text-sm text-muted-foreground mt-1">{session.title}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedSession(expandedSession === index ? null : index)}
                                        >
                                            {expandedSession === index ? "Collapse" : "Expand"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => sessions.remove(index)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <IconTrash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            {expandedSession === index && (
                                <CardContent className="space-y-4 pt-0">
                                    <div className="space-y-2">
                                        <Label>Session Title *</Label>
                                        <Input
                                            placeholder="e.g., Keynote: Future of AI"
                                            value={session.title || ""}
                                            onChange={(e) => sessions.update(index, { title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Describe this session..."
                                            value={session.description || ""}
                                            onChange={(e) => sessions.update(index, { description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Time *</Label>
                                            <DateTimePicker
                                                value={session.startTime ? new Date(session.startTime) : null}
                                                onChange={(date) => sessions.update(index, { startTime: date?.toISOString() })}
                                                use12HourFormat={true}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>End Time *</Label>
                                            <DateTimePicker
                                                value={session.endTime ? new Date(session.endTime) : null}
                                                onChange={(date) => sessions.update(index, { endTime: date?.toISOString() })}
                                                use12HourFormat={true}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <IconMapPin className="w-4 h-4" />
                                            Venue Details
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Venue Name</Label>
                                                <Input
                                                    placeholder="e.g., Grand Hall"
                                                    value={session.venue?.name || ""}
                                                    onChange={(e) => sessions.update(index, {
                                                        venue: { ...session.venue, name: e.target.value }
                                                    })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Locality/Address</Label>
                                                <Input
                                                    placeholder="e.g., 123 Tech Street"
                                                    value={session.venue?.locality || ""}
                                                    onChange={(e) => sessions.update(index, {
                                                        venue: { ...session.venue, locality: e.target.value }
                                                    })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>City</Label>
                                                <Input
                                                    placeholder="e.g., San Francisco"
                                                    value={session.venue?.city || ""}
                                                    onChange={(e) => sessions.update(index, {
                                                        venue: { ...session.venue, city: e.target.value }
                                                    })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>State/Province</Label>
                                                <Input
                                                    placeholder="e.g., California"
                                                    value={session.venue?.state || ""}
                                                    onChange={(e) => sessions.update(index, {
                                                        venue: { ...session.venue, state: e.target.value }
                                                    })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Country</Label>
                                                <Input
                                                    placeholder="e.g., USA"
                                                    value={session.venue?.country || ""}
                                                    onChange={(e) => sessions.update(index, {
                                                        venue: { ...session.venue, country: e.target.value }
                                                    })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Zip/Postal Code</Label>
                                                <Input
                                                    placeholder="e.g., 94105"
                                                    value={session.venue?.zipCode || ""}
                                                    onChange={(e) => sessions.update(index, {
                                                        venue: { ...session.venue, zipCode: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 space-y-4">
                                        <h4 className="font-semibold">Check-in Settings</h4>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Allow Check-in</Label>
                                                <p className="text-sm text-muted-foreground">Enable participant check-in</p>
                                            </div>
                                            <Switch
                                                checked={session.allowCheckIn ?? true}
                                                onCheckedChange={(checked) => sessions.update(index, { allowCheckIn: checked })}
                                            />
                                        </div>

                                        {session.allowCheckIn && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Check-in Start</Label>
                                                    <DateTimePicker
                                                        value={session.checkInStartTime ? new Date(session.checkInStartTime) : null}
                                                        onChange={(date) => sessions.update(index, { checkInStartTime: date?.toISOString() })}
                                                        use12HourFormat={true}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Check-in End</Label>
                                                    <DateTimePicker
                                                        value={session.checkInEndTime ? new Date(session.checkInEndTime) : null}
                                                        onChange={(date) => sessions.update(index, { checkInEndTime: date?.toISOString() })}
                                                        use12HourFormat={true}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">Speakers</h4>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addSpeaker(index)}
                                                className="gap-2"
                                            >
                                                <IconPlus className="w-4 h-4" />
                                                Add Speaker
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {session.speakers?.map((speaker, speakerIdx) => (
                                                <Badge key={speakerIdx} variant="secondary" className="pl-3 pr-1">
                                                    {speaker}
                                                    <button
                                                        onClick={() => removeSpeaker(index, speakerIdx)}
                                                        className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                                                    >
                                                        <IconTrash className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                            {(!session.speakers || session.speakers.length === 0) && (
                                                <p className="text-sm text-muted-foreground">No speakers added</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-4">
                                        <div className="space-y-0.5">
                                            <Label>Session Active</Label>
                                            <p className="text-sm text-muted-foreground">Make this session available</p>
                                        </div>
                                        <Switch
                                            checked={session.isActive ?? true}
                                            onCheckedChange={(checked) => sessions.update(index, { isActive: checked })}
                                        />
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
