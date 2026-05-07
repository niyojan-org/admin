"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IconCheck,
  IconClock,
  IconLayoutDashboard,
  IconBuildingStore,
  IconCalendarEvent,
} from "@tabler/icons-react";

export function VerificationStateGate({ organization }) {
  const isVerified = organization?.verified === true;
  const isRequestPending = organization?.reqForVerification === true;

  if (isVerified) {
    return (
      <Card className="border-2 border-emerald-500/30 bg-emerald-500/5">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
            <IconCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Verified
            </span>
          </div>
          <CardTitle className="text-2xl">
            Organization is already verified
          </CardTitle>
          <CardDescription className="text-base">
            You are all set. You can continue managing your organization and
            creating events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Trust Score: {organization?.trustScore || 0}/100
            </Badge>
            <Badge variant="outline">
              Documents:{" "}
              {organization?.documents?.filter((doc) => doc.verified).length ||
                0}
              /{organization?.documents?.length || 0}
            </Badge>
            <Badge variant="outline">
              Status: {organization?.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard">
                <IconLayoutDashboard className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/events/create">
                <IconCalendarEvent className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/organization">
                <IconBuildingStore className="mr-2 h-4 w-4" />
                Organization Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isRequestPending) {
    return (
      <Alert className="border-2 border-amber-500/30 bg-amber-500/5">
        <IconClock className="h-5 w-5 text-amber-600" />
        <AlertDescription className="ml-2">
          <p className="font-semibold text-amber-900 dark:text-amber-100">
            Verification request is pending review
          </p>
          <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-200">
            Our team is reviewing your submission. You will receive an update
            once verification is complete.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
