"use client";

import { format } from "date-fns";
import Link from "next/link";
import {
  IconCalendarEvent,
  IconClock,
  IconMapPin,
  IconUsers,
  IconDots,
  IconEye,
  IconEdit,
  IconShare,
  IconCategory,
  IconTicket,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const STATUS_VARIANTS = {
  published: "success",
  ongoing: "warning",
  completed: "default",
  draft: "secondary",
  cancelled: "destructive",
  blocked: "destructive",
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

export default function EventCard({ event }) {
  const session = event.sessions?.[0];

  const calculateStats = () => {
    if (!event.tickets || event.tickets.length === 0)
      return { total: 0, sold: 0, percentage: 0 };
    const totalCapacity = event.tickets.reduce(
      (sum, ticket) => sum + ticket.capacity,
      0,
    );
    const totalSold = event.tickets.reduce(
      (sum, ticket) => sum + ticket.sold,
      0,
    );
    return {
      total: totalCapacity,
      sold: totalSold,
      percentage:
        totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0,
    };
  };

  const getLowestPrice = () => {
    if (!event.tickets || event.tickets.length === 0) return 0;
    return Math.min(...event.tickets.map((ticket) => ticket.price));
  };

  const stats = calculateStats();
  const lowestPrice = getLowestPrice();

  const formattedDate = session?.startTime
    ? format(new Date(session.startTime), "EEE, MMM dd")
    : "Date TBA";
  const formattedTime = session?.startTime
    ? format(new Date(session.startTime), "hh:mm a")
    : "Time TBA";
  const city =
    session?.venue?.city ||
    (event.mode?.toLowerCase() === "online" ? "Online" : "Location TBA");
  const status = event.status?.toLowerCase() || "draft";
  const statusVariant = STATUS_VARIANTS[status] || "secondary";
  const soldOut = stats.total > 0 && stats.sold >= stats.total;
  const progressTone =
    stats.percentage >= 80
      ? "text-green-600"
      : stats.percentage >= 40
        ? "text-amber-600"
        : "text-muted-foreground";

  return (
    <Card className="group h-full overflow-hidden border-border/80 p-0 px-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg sm:px-0 gap-0">
      {/* Banner Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {/* TODO: change the place holder image url to actual fall back image */}
        <Image
          src={event?.bannerImage || "https://placehold.co/1920x1080/png"}
          alt={event.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusVariant} className="capitalize shadow-sm">
              {status}
            </Badge>
            {event.mode && (
              <Badge
                variant="outline"
                className="border-white/40 bg-black/30 text-white backdrop-blur-sm capitalize"
              >
                {event.mode}
              </Badge>
            )}
          </div>

          {/* Actions dropdown */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 border border-white/30 bg-black/35 text-white backdrop-blur-sm hover:bg-black/50"
                  aria-label="Open event actions"
                >
                  <IconDots className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex w-full items-center"
                  >
                    <IconEye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/events/${event.slug}/edit`}
                    className="flex w-full items-center"
                  >
                    <IconEdit className="mr-2 h-4 w-4" />
                    Edit Event
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/events/participants/${event.slug}`}
                    className="flex w-full items-center"
                  >
                    <IconUsers className="mr-2 h-4 w-4" />
                    Participants
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/events/share/${event.slug}`}
                    className="flex w-full items-center"
                  >
                    <IconShare className="mr-2 h-4 w-4" />
                    Share Event
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="rounded-lg border border-white/20 bg-black/35 px-2.5 py-1.5 text-white backdrop-blur-sm">
            <p className="text-xs font-semibold">{formattedDate}</p>
            <p className="text-[11px] text-white/80">{formattedTime}</p>
          </div>

          {lowestPrice > 0 && (
            <Badge className="bg-background/90 text-foreground font-semibold shadow-sm">
              From Rs {formatPrice(lowestPrice)}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex h-full w-full flex-col justify-between p-4">
        {/* Event Title */}
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
            {event.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {event.description || "No description provided yet."}
          </p>
        </div>

        {/* Organization */}
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={event.organization?.logo} />
              <AvatarFallback className="text-xs">
                {event.organization?.name?.charAt(0) || "O"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium text-foreground">
              {event.organization?.name || "Organization"}
            </span>
            {event.organization?.verified && (
              <Badge variant="outline" className="px-2 py-0 text-xs">
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconMapPin className="h-3.5 w-3.5" />
            <span className="max-w-24 truncate">{city}</span>
          </div>
        </div>

        {/* Event Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border bg-background px-2.5 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconCalendarEvent className="h-3.5 w-3.5" />
              Start
            </div>
            <p className="truncate text-sm font-medium text-foreground">
              {formattedDate}
            </p>
          </div>

          <div className="rounded-md border bg-background px-2.5 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconClock className="h-3.5 w-3.5" />
              Time
            </div>
            <p className="truncate text-sm font-medium text-foreground">
              {formattedTime}
            </p>
          </div>

          <div className="rounded-md border bg-background px-2.5 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconCategory className="h-3.5 w-3.5" />
              Category
            </div>
            <p className="truncate text-sm font-medium text-foreground">
              {event.category || "Uncategorized"}
            </p>
          </div>

          <div className="rounded-md border bg-background px-2.5 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconTicket className="h-3.5 w-3.5" />
              Tickets
            </div>
            <p className="truncate text-sm font-medium text-foreground">
              {event.tickets?.length || 0} types
            </p>
          </div>
        </div>

        {/* Registration Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Registration</span>
            <span className={`font-medium ${progressTone}`}>
              {soldOut
                ? "Sold out"
                : `${stats.sold}/${stats.total} (${stats.percentage}%)`}
            </span>
          </div>
          <Progress value={stats.percentage} className="h-2" />
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
            {event.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{event.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/events/${event.slug}`}>
              <IconEye className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/events/${event.slug}/edit`}>
              <IconEdit className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/events/share/${event.slug}`}>
              <IconShare className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
