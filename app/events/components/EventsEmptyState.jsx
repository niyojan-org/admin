import Link from "next/link";
import { IconCalendarEvent, IconPlus } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventsEmptyState({ hasFilters }) {
  return (
    <Card className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border-dashed p-10 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <IconCalendarEvent className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          {hasFilters ? "No events found" : "No events yet"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? "Try changing your search, status, or publish filter."
            : "Start by creating your first event for your organization."}
        </p>
      </div>
      {!hasFilters && (
        <Button asChild>
          <Link href="/events/create">
            <IconPlus className="mr-2 h-4 w-4" />
            Create Your First Event
          </Link>
        </Button>
      )}
    </Card>
  );
}
