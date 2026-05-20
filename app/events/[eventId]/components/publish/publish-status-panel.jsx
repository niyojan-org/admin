import { Badge } from "@/components/ui/badge";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconFocus2,
  IconLoader2,
  IconRoute,
  IconShieldCheck,
} from "@tabler/icons-react";
import { getPublishSummary, getSourceMeta } from "./publish-targets";
import { Card } from "@/components/ui/card";

function PublishStatusPanel({ event, testResult, isTesting }) {
  const canPublish = testResult?.canPublish === true;
  const summary = getPublishSummary(testResult?.errors);
  const sourceEntries = Object.entries(summary.sourceCounts);

  return (
    <div className="space-y-2">
      <Card className="gap-0">
        <div className="">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">Publish Event</p>
                <Badge variant={canPublish ? "success" : "secondary"}>
                  {isTesting
                    ? "Refreshing"
                    : canPublish
                      ? "Ready to go"
                      : "Needs attention"}
                </Badge>
              </div>
            </div>
            {isTesting ? (
              <IconLoader2 className="size-5 animate-spin text-primary" />
            ) : canPublish ? (
              <IconCircleCheck className="size-5 text-green-600" />
            ) : (
              <IconAlertTriangle className="size-5 text-yellow-600" />
            )}
          </div>

          <div className="text-sm">
            <div className="flex items-start gap-1">
              <IconShieldCheck
                className={
                  canPublish ? "mt-0.5 text-green-600" : "mt-0.5 text-primary"
                }
              />
              <div className="space-y-0">
                <p className="font-medium text-foreground">
                  {isTesting
                    ? "Syncing the latest checklist"
                    : canPublish
                      ? "Everything required by the backend has passed"
                      : `${summary.blockerCount} blocker${summary.blockerCount === 1 ? "" : "s"} need attention`}
                </p>
                <p className="text-muted-foreground">
                  Publish test is a preview only. The real publish action still
                  re-validates everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {sourceEntries.length > 0 ? (
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <p className="text-sm font-medium text-foreground">
            Where to fix things
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sourceEntries.map(([sourceType, count]) => (
              <Badge
                key={sourceType}
                variant={getSourceMeta(sourceType).tone}
                className="px-3 py-1"
              >
                {getSourceMeta(sourceType).label}: {count}
              </Badge>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            We group blockers by source so you can jump into the right session,
            ticket, or event area instead of hunting through the whole setup.
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border bg-muted/20 p-4">
        <p className="text-sm font-medium text-foreground">How this helps</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Unknown future rule codes still render safely here, and targeted
          blockers can open the exact edit screen.
        </p>
      </div>
    </div>
  );
}

export default PublishStatusPanel;
