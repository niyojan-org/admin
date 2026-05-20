"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import {
  IconCircleCheck,
  IconLock,
  IconRocket,
  IconShieldSearch,
} from "@tabler/icons-react";
import { useEventPublish } from "../../hooks/useEventPublish";
import PublishEventDialog from "./publish-event-dialog";

const publishRoles = ["owner", "admin"];

function PublishWindow({ event }) {
  const user = useUserStore((state) => state.user);
  const userRole = user?.organization?.role || "member";
  const canPublishEvent = publishRoles.includes(userRole);
  const eventPath = event?.slug || event?._id;
  const isPublished =
    event?.isPublished || String(event?.status).toLowerCase() === "published";
  const {
    open,
    testResult,
    isTesting,
    isPublishing,
    handleOpenChange,
    runPublishTest,
    handlePublish,
  } = useEventPublish({
    eventId: eventPath,
    eventUpdatedAt: event?.updatedAt,
  });

  const checklistCount = testResult?.errors?.length || 0;
  const summaryLabel = isPublished
    ? "Already published"
    : testResult?.canPublish
      ? "Ready to publish"
      : checklistCount > 0
        ? `${checklistCount} item${checklistCount > 1 ? "s" : ""} to fix`
        : "Run a publish test";

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconRocket />
                Publish Window
              </CardTitle>
              <CardDescription>
                Preview publish readiness before the final publish action.
              </CardDescription>
            </div>
            <Badge variant={isPublished ? "success" : "secondary"}>
              {summaryLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              {isPublished ? (
                <IconCircleCheck className="mt-0.5 text-green-600" />
              ) : (
                <IconShieldSearch className="mt-0.5 text-primary" />
              )}
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {isPublished
                    ? "This event is already live."
                    : "The modal runs the server-side publish-test route."}
                </p>
                <p>
                  {isPublished
                    ? "Refresh event details here anytime to review the current publish state."
                    : "It fetches canPublish plus a generic checklist array, so new backend rules can appear here without frontend changes."}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            variant={isPublished ? "outline" : "default"}
            onClick={() => handleOpenChange(true)}
            disabled={isTesting || isPublishing}
          >
            {canPublishEvent ? <IconRocket /> : <IconLock />}
            {isPublished ? "Review publish status" : "Open publish window"}
          </Button>

          {!canPublishEvent ? (
            <p className="text-xs text-muted-foreground">
              Anyone with access can run publish-test. Only owners and admins
              can confirm publishing.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <PublishEventDialog
        open={open}
        onOpenChange={handleOpenChange}
        event={event}
        eventPath={eventPath}
        testResult={testResult}
        isTesting={isTesting}
        isPublishing={isPublishing}
        canPublishEvent={canPublishEvent}
        onRunPublishTest={runPublishTest}
        onPublish={handlePublish}
      />
    </>
  );
}

export default PublishWindow;
