"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IconLock,
  IconAlertTriangle,
  IconShieldCheck,
  IconFileText,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { useOrgStore } from "@/store/orgStore";

export default function EventCreationNotAllowed() {
  const { organization } = useOrgStore();

  const getPossibleReasons = () => {
    const reasons = [];

    if (!organization?.verified) {
      reasons.push({
        icon: IconShieldCheck,
        title: "Organization Not Verified",
        description:
          "Your organization needs to be verified before you can create events.",
        severity: "high",
      });
    }

    if (!organization?.allowsEventCreation) {
      reasons.push({
        icon: IconLock,
        title: "Event Creation Disabled",
        description:
          "Event creation is currently disabled for your organization.",
        severity: "high",
      });
    }

    if (organization?.documents?.some((doc) => !doc.verified)) {
      reasons.push({
        icon: IconFileText,
        title: "Pending Document Verification",
        description: "Some of your uploaded documents are still under review.",
        severity: "medium",
      });
    }

    if (organization?.fraudFlags?.length > 0) {
      reasons.push({
        icon: IconAlertTriangle,
        title: "Fraud Flags Detected",
        description:
          "Your organization has been flagged for review due to security concerns.",
        severity: "high",
      });
    }

    if (organization?.warnings?.length > 0) {
      reasons.push({
        icon: IconAlertTriangle,
        title: "Active Warnings",
        description:
          "Your organization has active warnings that need to be addressed.",
        severity: "medium",
      });
    }

    if (organization?.isBlocked) {
      reasons.push({
        icon: IconLock,
        title: "Organization Blocked",
        description:
          "Your organization has been temporarily blocked from creating events.",
        severity: "high",
      });
    }

    // If no specific reasons found, show general message
    if (reasons.length === 0) {
      reasons.push({
        icon: IconLock,
        title: "Event Creation Not Available",
        description:
          "Event creation is currently not available for your organization.",
        severity: "medium",
      });
    }

    return reasons;
  };

  const reasons = getPossibleReasons();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <IconLock className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl text-destructive">
            Event Creation Not Allowed
          </CardTitle>
          <CardDescription className="text-base">
            You currently don't have permission to create events for this
            organization.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Possible Reasons:</h3>

            {reasons.map((reason, index) => (
              <Alert
                key={index}
                className={`border-l-4 ${
                  reason.severity === "high"
                    ? "border-l-destructive bg-destructive/5"
                    : reason.severity === "medium"
                      ? "border-l-yellow-500 bg-yellow-500/5"
                      : "border-l-blue-500 bg-blue-500/5"
                }`}
              >
                <reason.icon className="h-4 w-4" />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{reason.title}</h4>
                    <AlertDescription className="mt-1">
                      {reason.description}
                    </AlertDescription>
                  </div>
                  <Badge
                    variant={getSeverityColor(reason.severity)}
                    className="self-start sm:ml-2"
                  >
                    {reason.severity}
                  </Badge>
                </div>
              </Alert>
            ))}
          </div>

          {/* Organization Status Summary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Organization Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Verification Status
                  </span>
                  <Badge
                    variant={organization?.verified ? "success" : "destructive"}
                  >
                    {organization?.verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Event Creation
                  </span>
                  <Badge
                    variant={
                      organization?.allowsEventCreation
                        ? "success"
                        : "destructive"
                    }
                  >
                    {organization?.allowsEventCreation ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Paid Events
                  </span>
                  <Badge
                    variant={
                      organization?.allowsPaidEvents ? "success" : "secondary"
                    }
                  >
                    {organization?.allowsPaidEvents ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Trust Score
                  </span>
                  <Badge variant="outline">
                    {organization?.trustScore || 0}/100
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Status
                  </span>
                  <Badge
                    variant={organization?.active ? "success" : "destructive"}
                  >
                    {organization?.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Documents
                  </span>
                  <Badge variant="outline">
                    {organization?.documents?.filter((doc) => doc.verified)
                      .length || 0}
                    /{organization?.documents?.length || 0} Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/organization/verify">
                  <IconShieldCheck className="mr-2 h-4 w-4" />
                  Complete Verification
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/contact">
                  <IconMail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
            <Button variant="ghost" asChild className="w-full mt-3">
              <Link href="/organization">View Organization Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
