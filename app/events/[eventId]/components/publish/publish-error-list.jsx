import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconCircleCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  formatFieldLabel,
  getPublishErrorTarget,
  getSourceMeta,
} from "./publish-targets";
import { Card } from "@/components/ui/card";

const groupPublishErrors = (errors) =>
  errors.reduce((groups, error) => {
    const key = [
      error?.sourceType || "general",
      error?.sourceId || error?.sourceLabel || error?.field || error?.code,
    ].join(":");

    if (!groups[key]) {
      groups[key] = {
        sourceType: error?.sourceType || "general",
        sourceId: error?.sourceId || null,
        sourceLabel: error?.sourceLabel || null,
        target: null,
        errors: [],
      };
    }

    groups[key].errors.push(error);
    return groups;
  }, {});

function PublishErrorList({ errors, eventPath, className }) {
  if (!errors?.length) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 border border-green-500/30 bg-green-500/10 p-4",
          className,
        )}
      >
        <IconCircleCheck className="mt-0.5 text-green-600" />
        <div className="space-y-1">
          <p className="font-medium text-green-700 dark:text-green-300">
            All publish checks passed.
          </p>
          <p className="text-sm text-muted-foreground">
            The server says this event is ready for the final publish action.
          </p>
        </div>
      </div>
    );
  }

  const groupedErrors = Object.values(groupPublishErrors(errors)).map(
    (group) => ({
      ...group,
      target: getPublishErrorTarget(eventPath, group.errors[0]),
    }),
  );

  return (
    <div className={cn("space-y-4", className)}>
      {groupedErrors.map((group, index) => {
        const sourceMeta = getSourceMeta(group.sourceType);
        return (
          <Card
            key={`${group.sourceType}-${group.sourceId || group.sourceLabel || index}`}
            className="p-0 sm:px-0"
          >
            <div className="border-b px-4 pb-1">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-2xl bg-yellow-500/10 p-3 text-yellow-600">
                    <IconAlertTriangle className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={sourceMeta.tone}>
                        {sourceMeta.label}
                      </Badge>
                      {group.sourceLabel ? (
                        <Badge
                          variant="outline"
                          className="max-w-full truncate"
                          title={group.sourceLabel}
                        >
                          {group.sourceLabel}
                        </Badge>
                      ) : null}
                      <Badge variant="outline">
                        {group.errors.length} issue
                        {group.errors.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        {group.sourceLabel || `${sourceMeta.label} checklist`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {group.errors.length === 1
                          ? "One publish blocker is tied to this target."
                          : `${group.errors.length} publish blockers are tied to this target.`}
                      </p>
                    </div>
                  </div>
                </div>

                {group.target ? (
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="w-full lg:w-auto"
                  >
                    <Link href={group.target.href}>
                      {group.target.label}
                      <IconArrowUpRight />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="px-4">
              {group.errors.map((error, errorIndex) => (
                <div
                  key={`${error.code}-${error.field || errorIndex}`}
                  className={`${group.errors.length > 1 ? "pt-3 border-b" : ""}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="max-w-full truncate"
                      title={error.code}
                    >
                      {error.code}
                    </Badge>
                    {error.field ? (
                      <Badge variant="outline">
                        {formatFieldLabel(error.field)}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="font-medium leading-7 text-foreground">
                      {error.message}
                    </p>
                    {error.details ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {error.details}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default PublishErrorList;
