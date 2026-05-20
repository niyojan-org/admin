import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconLoader2, IconRocket, IconShieldCheck } from "@tabler/icons-react";
import PublishErrorList from "./publish-error-list";
import PublishStatusPanel from "./publish-status-panel";

function PublishEventDialog({
  open,
  onOpenChange,
  event,
  eventPath,
  testResult,
  isTesting,
  isPublishing,
  canPublishEvent,
  onRunPublishTest,
  onPublish,
}) {
  const canPublish = testResult?.canPublish === true;
  const hasChecklist = Array.isArray(testResult?.errors);
  const hasErrors = (testResult?.errors?.length || 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-6xl min-h-0 flex-col gap-0 p-0 shadow-2xl backdrop-blur">
        <DialogHeader>
          <div className="sr-only">
            <DialogTitle>Publish Event</DialogTitle>
            <DialogDescription>
              Review the latest server-side publish checklist.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[20rem_minmax(0,1fr)] h-full ">
          <div className="space-y-4 xl:sticky xl:top-0 xl:self-start">
            <PublishStatusPanel
              event={event}
              testResult={testResult}
              isTesting={isTesting}
            />

            {!canPublishEvent ? (
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-700 dark:text-blue-300">
                You can review publish readiness here, but only organization
                owners and admins can publish the event.
              </div>
            ) : null}
          </div>

          <div className="space-y-4 h-full ">
            <div className="rounded-3xl border bg-background p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  {isTesting ? (
                    <IconLoader2 className="mt-0.5 animate-spin text-primary" />
                  ) : (
                    <IconShieldCheck
                      className={`mt-0.5 ${canPublish ? "text-green-600" : "text-muted-foreground"}`}
                    />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      {isTesting
                        ? "Refreshing publish readiness"
                        : canPublish
                          ? "This event can be published"
                          : "Fix the blockers below before publishing"}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {isTesting
                        ? "Fetching the latest readiness state from the server."
                        : canPublish
                          ? "Everything required by the backend has passed. You can safely confirm publish."
                          : "Blockers are grouped by target so repeated issues for the same ticket or session stay together and are easier to fix."}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onRunPublishTest()}
                  disabled={isTesting || isPublishing}
                  className="w-full sm:w-auto"
                >
                  {isTesting ? <IconLoader2 className="animate-spin" /> : null}
                  Run publish test
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-[60vh] pr-3 overflow-y-scroll">
              {hasChecklist ? (
                canPublish ? (
                  <PublishErrorList errors={[]} eventPath={eventPath} />
                ) : hasErrors ? (
                  <PublishErrorList
                    errors={testResult.errors}
                    eventPath={eventPath}
                  />
                ) : (
                  <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm text-yellow-700 dark:text-yellow-300">
                    The server marked this event as not ready to publish, but it
                    did not return any checklist items. Run the publish test
                    again after your next edit.
                  </div>
                )
              ) : (
                <div className="rounded-2xl border bg-muted/20 p-5 text-sm text-muted-foreground">
                  Run the publish test to load the latest server-side checklist.
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="border-t py-3 px-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onRunPublishTest()}
            disabled={isTesting || isPublishing}
            className="w-full sm:w-auto"
          >
            {isTesting ? <IconLoader2 className="animate-spin" /> : null}
            Run publish test
          </Button>
          <Button
            type="button"
            onClick={onPublish}
            disabled={
              !canPublishEvent || !canPublish || isTesting || isPublishing
            }
            className="w-full sm:w-auto"
          >
            {isPublishing ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              <IconRocket />
            )}
            Publish event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PublishEventDialog;
