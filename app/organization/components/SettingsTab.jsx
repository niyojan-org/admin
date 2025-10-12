"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { IconCheck, IconX } from "@tabler/icons-react";

const SettingsTab = ({ organization }) => {
  const stepsCompleted = organization.stepsCompleted || {};
  const completedSteps = Object.values(stepsCompleted).filter(Boolean).length;
  const totalSteps = Object.keys(stepsCompleted).length;
  const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Profile Completion</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Complete all steps to unlock full features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completion Progress</span>
              <span className="text-sm font-semibold">{completedSteps}/{totalSteps} steps</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          <div className="grid gap-2">
            {Object.entries(stepsCompleted).map(([key, completed]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg border">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                {completed ? (
                  <IconCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <IconX className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Event Preferences</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Customize your event hosting settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Preferred Event Types</p>
            <div className="flex flex-wrap gap-2">
              {organization.eventPreferences?.preferredEventTypes?.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Max Events Per Month</span>
              <Badge>{organization.eventPreferences?.maxEventsPerMonth || "N/A"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Allows Paid Events</span>
              {organization.eventPreferences?.allowsPaidEvents ? (
                <IconCheck className="h-5 w-5 text-green-500" />
              ) : (
                <IconX className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Approve Events</span>
              {organization.eventPreferences?.autoApproveEvents ? (
                <IconCheck className="h-5 w-5 text-green-500" />
              ) : (
                <IconX className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Account Status</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Organization account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Verified</span>
            <Badge variant={organization.verified ? "default" : "secondary"}>
              {organization.verified ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Active</span>
            <Badge variant={organization.active ? "default" : "destructive"}>
              {organization.active ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Can Create Events</span>
            <Badge variant={organization.canCreateEvents ? "default" : "destructive"}>
              {organization.canCreateEvents ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Blocked</span>
            <Badge variant={organization.isBlocked ? "destructive" : "default"}>
              {organization.isBlocked ? "Yes" : "No"}
            </Badge>
          </div>
          {organization.verified && organization.verifiedAt && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Verified At</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(organization.verifiedAt).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
