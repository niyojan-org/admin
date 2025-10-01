"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconInfoSquareRounded,
  IconPlus,
  IconTrash,
  IconMapPin,
} from "@tabler/icons-react";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { Textarea } from "@/components/ui/textarea";

export default function SessionsStep({
  eventData,
  updateSession,
  updateSessionVenue,
  addSession,
  removeSession,
}) {
  return (
    <Card className={"flex-1"}>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Event Sessions</h2>
          <div className="flex gap-2">
            <Button onClick={addSession} variant="outline" size="sm">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-navy hover:text-blue-700">
                  <IconInfoSquareRounded className="h-5 w-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Sessions Guidelines</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>• Each session should have a clear title and description</p>
                  <p>• Set realistic time durations for each session</p>
                  <p>• For offline/hybrid events, specify venue details</p>
                  <p>• Avoid overlapping sessions unless intentional</p>
                  <p>• Consider breaks between sessions</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          {eventData.sessions.map((session, index) => {
            // Helper for session validation
            const handelSessionStart = (isoString) => {
              if (eventData.registrationEnd) {
                const regEnd = new Date(eventData.registrationEnd);
                const start = new Date(isoString);
                if (start <= regEnd) {
                  return "Session must start after registration ends";
                }
              }
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              if (new Date(isoString) < now) {
                return "Session cannot start in the past";
              }
              return null;
            };

            const validateSessionEnd = (startIso, endIso) => {
              if (!startIso || !endIso) return null;
              const start = new Date(startIso);
              const end = new Date(endIso);
              if (end <= start) {
                return "End time must be after start time";
              }
              return null;
            };

            return (
              <div key={index} className="border rounded-lg p-4 space-y-4 bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-navy">Session {index + 1}</h3>
                  {eventData.sessions.length > 1 && (
                    <Button
                      onClick={() => removeSession(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Session Title *</Label>
                    <Input
                      value={session.title}
                      onChange={(e) => updateSession(index, "title", e.target.value)}
                      placeholder="Enter session title"
                      className=""
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Description</Label>
                    <Textarea
                      value={session.description}
                      onChange={(e) => updateSession(index, "description", e.target.value)}
                      placeholder="Describe this session"
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent bg-white"
                    />
                  </div>

                  {/* Start Date and Time */}
                  <div className="space-y-2">
                    <Label>Session Start Time *</Label>
                    <DateTimeInput 
                      value={session.startTime} 
                      onChange={(isoString) => {
                        const error = handelSessionStart(isoString);
                        if (error) {
                          return;
                        }
                        updateSession(index, "startTime", isoString);
                      }}
                      minDateTime={eventData.registrationEnd}
                    />
                  </div>

                  {/* End Date and Time */}
                  <div className="space-y-2">
                    <Label>Session End Time *</Label>
                    <DateTimeInput
                      value={session.endTime}
                      onChange={(isoString) => {
                        const error = validateSessionEnd(session.startTime, isoString);
                        if (error) {
                          return;
                        }
                        updateSession(index, "endTime", isoString);
                      }}
                      minDateTime={session.startTime}
                    />
                  </div>

                  {(eventData.mode === "offline" || eventData.mode === "hybrid") && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium text-navy flex items-center gap-2">
                        <IconMapPin className="h-4 w-4" />
                        Venue Details
                      </h4>

                      <div className="space-y-2">
                        <Label>Venue Name *</Label>
                        <Input
                          value={session.venue.name}
                          onChange={(e) => updateSessionVenue(index, "name", e.target.value)}
                          placeholder="Enter venue name"
                          className="bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Address *</Label>
                        <Input
                          value={session.venue.address}
                          onChange={(e) => updateSessionVenue(index, "address", e.target.value)}
                          placeholder="Enter venue address"
                          className="bg-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Input
                            value={session.venue.city}
                            onChange={(e) => updateSessionVenue(index, "city", e.target.value)}
                            placeholder="City"
                            className="bg-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>State *</Label>
                          <Input
                            value={session.venue.state}
                            onChange={(e) => updateSessionVenue(index, "state", e.target.value)}
                            placeholder="State"
                            className="bg-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Country *</Label>
                          <Input
                            value={session.venue.country}
                            onChange={(e) => updateSessionVenue(index, "country", e.target.value)}
                            placeholder="Country"
                            className="bg-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Zip Code</Label>
                          <Input
                            value={session.venue.zipCode}
                            onChange={(e) => updateSessionVenue(index, "zipCode", e.target.value)}
                            placeholder="Zip Code"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
