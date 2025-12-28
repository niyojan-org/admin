"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconInfoSquareRounded } from "@tabler/icons-react";

export default function SettingsStep({ eventData, handleInputChange }) {
  return (
    <Card className={"flex-1"}>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Event Settings</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-navy hover:text-blue-700">
                <IconInfoSquareRounded className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm text-gray-600">
                <p>• Configure event visibility and participant management</p>
                <p>• Enable notifications to keep attendees informed</p>
                <p>• Set up feedback collection for post-event insights</p>
                <p>• Consider coupon support for promotional activities</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {/* Event Visibility */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy">Event Visibility</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrivate"
                checked={eventData.isPrivate}
                onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPrivate">Private Event (invitation only)</Label>
            </div>
          </div>

          {/* Session Management */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy">Session Management</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowMultipleSessions"
                checked={eventData.allowMultipleSessions}
                onChange={(e) => handleInputChange("allowMultipleSessions", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="allowMultipleSessions">Allow participants to register for multiple sessions</Label>
            </div>
          </div>

          {/* Participant Management */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy">Participant Management</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={eventData.autoApproveParticipants}
                  onChange={(e) => handleInputChange("autoApproveParticipants", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="autoApprove">Auto-approve participant registrations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowCoupons"
                  checked={eventData.allowCoupons}
                  onChange={(e) => handleInputChange("allowCoupons", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="allowCoupons">Enable coupon/discount codes</Label>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy">Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={eventData.enableEmailNotifications}
                  onChange={(e) => handleInputChange("enableEmailNotifications", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="emailNotifications">Send email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={eventData.enableSmsNotifications}
                  onChange={(e) => handleInputChange("enableSmsNotifications", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="smsNotifications">Send SMS notifications</Label>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy">Post-Event</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="feedbackEnabled"
                checked={eventData.feedbackEnabled}
                onChange={(e) => handleInputChange("feedbackEnabled", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="feedbackEnabled">Enable feedback collection</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
