"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EventStore } from "../event-store";
import {
  getPublishFailure,
  getPublishTest,
  publishEvent,
} from "@/lib/api/event-publish";

export function useEventPublish({ eventId, eventUpdatedAt }) {
  const [open, setOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const setEvent = EventStore((state) => state.setEvent);
  const refreshEvent = EventStore((state) => state.refreshEvent);

  const runPublishTest = useCallback(
    async ({ silent = false } = {}) => {
      if (!eventId) return null;

      setIsTesting(true);

      try {
        const result = await getPublishTest(eventId);

        if (result.event) {
          const currentEvent = EventStore.getState().event || {};
          setEvent({ ...currentEvent, ...result.event });
        }

        setTestResult(result);
        return result;
      } catch (error) {
        if (!silent) {
          toast.error(
            error?.response?.data?.message || "Failed to load publish readiness",
          );
        }

        setTestResult(null);
        return null;
      } finally {
        setIsTesting(false);
      }
    },
    [eventId, setEvent],
  );

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (nextOpen) {
      runPublishTest();
    }
  };

  const handlePublish = async () => {
    if (!eventId) return false;

    setIsPublishing(true);

    try {
      const result = await publishEvent(eventId);

      toast.success(result.message || "Event published successfully");
      await refreshEvent();
      setOpen(false);
      return true;
    } catch (error) {
      const failure = getPublishFailure(error);

      if (failure.code === "EVENT_NOT_READY_FOR_PUBLISH") {
        setTestResult({
          canPublish: false,
          errors: failure.errors,
          event: null,
        });
      }

      toast.error(failure.message, {
        description:
          failure.code === "EVENT_NOT_READY_FOR_PUBLISH"
            ? "The latest server checklist still has items to fix."
            : undefined,
      });

      await refreshEvent();
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    if (open) {
      runPublishTest({ silent: true });
    }
  }, [open, eventId, eventUpdatedAt, runPublishTest]);

  return {
    open,
    testResult,
    isTesting,
    isPublishing,
    handleOpenChange,
    runPublishTest,
    handlePublish,
  };
}
