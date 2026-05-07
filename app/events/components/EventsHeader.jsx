import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EventsHeader({
  totalEvents,
  pageCount,
  publishedCount,
  draftCount,
  seatsOnPage,
}) {
  const stats = [
    { label: "Total", value: totalEvents },
    { label: "On page", value: pageCount },
    { label: "Published", value: publishedCount },
    { label: "Draft", value: draftCount },
    // { label: "Seats", value: seatsOnPage },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-5 md:p-6 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_45%)]" />
      <div className="relative flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Events</h1>
              <Badge variant="outline" className="w-fit bg-background/70">
                Control center
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Track publish health, discover events faster, and jump into edits
              in fewer clicks.
            </p>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/events/create">
                <IconPlus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-background/70 px-3 py-2"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-xl font-semibold leading-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
