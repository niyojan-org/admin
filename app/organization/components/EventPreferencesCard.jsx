"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconCheck, IconX } from "@tabler/icons-react";

const EventPreferencesCard = ({ organization }) => {
  const preferences = organization.eventPreferences || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Preferences</CardTitle>
        <CardDescription>Your event hosting configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Max Events/Month</span>
          <Badge variant="secondary">{preferences.maxEventsPerMonth || "N/A"}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Paid Events</span>
          {preferences.allowsPaidEvents ? (
            <IconCheck className="h-5 w-5 text-green-500" />
          ) : (
            <IconX className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Auto Approve</span>
          {preferences.autoApproveEvents ? (
            <IconCheck className="h-5 w-5 text-green-500" />
          ) : (
            <IconX className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Can Create Events</span>
          {organization.canCreateEvents ? (
            <IconCheck className="h-5 w-5 text-green-500" />
          ) : (
            <IconX className="h-5 w-5 text-red-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventPreferencesCard;
