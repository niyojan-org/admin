"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconCalendar,
  IconMapPin,
  IconTicket,
  IconUsers,
  IconDiscount,
  IconForms,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useEventForm } from "../hooks/useEventForm";
import { Separator } from "@/components/ui/separator";

export default function ReviewStep() {
  const { eventDraft, validateDraft } = useEventForm();
  const validation = validateDraft();

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review & Create</h2>
        <p className="text-muted-foreground">
          Review your event details before adding
        </p>
      </div>

      {/* Validation Status */}
      <Card
        className={
          validation.isValid
            ? "border-green-500/50 bg-green-500/10"
            : "border-red-500/50 bg-red-500/10"
        }
      >
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            {validation.isValid ? (
              <>
                <IconCheck className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    Ready to Publish
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    All required fields are complete!
                  </p>
                </div>
              </>
            ) : (
              <>
                <IconAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    Missing Required Information
                  </p>
                  <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside mt-2 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="w-5 h-5" />
            Event Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-semibold">{eventDraft.title || "Not set"}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm">{eventDraft.description || "Not set"}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{eventDraft.category || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mode</p>
              <Badge variant="secondary">{eventDraft.mode || "Not set"}</Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Registration Start
              </p>
              <p className="text-sm font-medium">
                {formatDate(eventDraft.registrationStart)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration End</p>
              <p className="text-sm font-medium">
                {formatDate(eventDraft.registrationEnd)}
              </p>
            </div>
          </div>
          {eventDraft.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {eventDraft.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="w-5 h-5" />
            Sessions ({eventDraft.sessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventDraft.sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions added</p>
          ) : (
            <div className="space-y-3">
              {eventDraft.sessions.map((session, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.description}
                      </p>
                    </div>
                    {session.isActive && (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      {formatDate(session.startTime)} -{" "}
                      {formatDate(session.endTime)}
                    </p>
                    {session.venue?.name && (
                      <p className="flex items-center gap-1 text-muted-foreground mt-1">
                        <IconMapPin className="w-3 h-3" />
                        {session.venue.name}, {session.venue.city}
                      </p>
                    )}
                    {session.speakers?.length > 0 && (
                      <p className="text-muted-foreground mt-1">
                        Speakers: {session.speakers.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTicket className="w-5 h-5" />
            Tickets ({eventDraft.tickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventDraft.tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tickets added</p>
          ) : (
            <div className="space-y-3">
              {eventDraft.tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{ticket.type}</p>
                      {ticket.isGroupTicket && (
                        <Badge variant="secondary" className="gap-1">
                          <IconUsers className="w-3 h-3" />
                          Group
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Capacity: {ticket.capacity} | Price: $
                      {ticket.price.toFixed(2)}
                    </p>
                    {ticket.isGroupTicket && (
                      <p className="text-sm text-muted-foreground">
                        Group size: {ticket.groupSettings?.minParticipants}-
                        {ticket.groupSettings?.maxParticipants}
                      </p>
                    )}
                  </div>
                  {ticket.isActive && <Badge variant="secondary">Active</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Fields */}
      {eventDraft.customFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconForms className="w-5 h-5" />
              Custom Fields ({eventDraft.customFields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {eventDraft.customFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      Type: {field.type}
                    </p>
                  </div>
                  {field.required && (
                    <Badge variant="destructive">Required</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coupons */}
      {eventDraft.coupons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDiscount className="w-5 h-5" />
              Coupons ({eventDraft.coupons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {eventDraft.coupons.map((coupon, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-mono font-semibold">{coupon.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% off`
                        : `$${coupon.discountValue.toFixed(2)} off`}
                    </p>
                  </div>
                  {coupon.isActive && <Badge variant="secondary">Active</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Event Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              {eventDraft.visibility === "public" ? (
                <IconCheck className="w-4 h-4 text-green-600" />
              ) : null}
              <span>Visibility: {eventDraft.visibility}</span>
            </div>
            <div className="flex items-center gap-2">
              {eventDraft.allowMultipleSessions ? (
                <IconCheck className="w-4 h-4 text-green-600" />
              ) : null}
              <span>
                Multiple Sessions:{" "}
                {eventDraft.allowMultipleSessions ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {eventDraft.autoApproveParticipants ? (
                <IconCheck className="w-4 h-4 text-green-600" />
              ) : null}
              <span>
                Auto Approve:{" "}
                {eventDraft.autoApproveParticipants ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {eventDraft.allowCoupons ? (
                <IconCheck className="w-4 h-4 text-green-600" />
              ) : null}
              <span>
                Coupons: {eventDraft.allowCoupons ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {eventDraft.allowReferrals ? (
                <IconCheck className="w-4 h-4 text-green-600" />
              ) : null}
              <span>
                Referrals: {eventDraft.allowReferrals ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {eventDraft.enableEmailNotifications ? (
                <IconCheck className="w-4 h-4 text-green-600" />
              ) : null}
              <span>
                Email Notifications:{" "}
                {eventDraft.enableEmailNotifications ? "On" : "Off"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
