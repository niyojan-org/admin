"use client";

import { format } from "date-fns";
import Link from "next/link";
import {
  IconCalendarEvent,
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

export default function EventCard({ event, index = 0 }) {

  const calculateStats = () => {
    if (!event.tickets || event.tickets.length === 0) return { total: 0, sold: 0, percentage: 0 };
    const totalCapacity = event.tickets.reduce((sum, ticket) => sum + ticket.capacity, 0);
    const totalSold = event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0);
    return {
      total: totalCapacity,
      sold: totalSold,
      percentage: totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0
    };
  };

  const getLowestPrice = () => {
    if (!event.tickets || event.tickets.length === 0) return 0;
    return Math.min(...event.tickets.map(ticket => ticket.price));
  };

  const stats = calculateStats();
  const lowestPrice = getLowestPrice();

  return (

    <Card className="transition-all duration-300 overflow-hidden p-0 gap-0 px-0 sm:px-0 h-full">
      {/* Banner Image */}
      <div className="relative h-46 overflow-hidden w-full object-cover ">
        <Image
          src={event?.bannerImage || "https://placehold.co/600x400/png"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={event.status === "published" ? "default" : "secondary"}>
            {event.status}
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {event.mode}
          </Badge>
        </div>

        {/* Actions dropdown */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
              >
                <IconDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/event/${event.slug}`} className="flex items-center w-full">
                  <IconEye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/event/${event.slug}/edit`} className="flex items-center w-full">
                  <IconEdit className="h-4 w-4 mr-2" />
                  Edit Event
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/event/participants/${event.slug}`} className="flex items-center w-full">
                  <IconUsers className="h-4 w-4 mr-2" />
                  Participants
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/event/share/${event.slug}`} className="flex items-center w-full">
                  <IconShare className="h-4 w-4 mr-2" />
                  Share Event
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Price tag */}
        {lowestPrice > 0 && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-primary text-primary-foreground font-semibold">
              From ₹{lowestPrice}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="w-full h-full justify-between flex flex-col gap-1 p-2">
        {/* Event Title */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 text-foreground">{event.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
        </div>

        {/* Organization */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={event.organization?.logo} />
            <AvatarFallback className="text-xs">
              {event.organization?.name?.charAt(0) || "O"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">{event.organization?.name}</span>
          {event.organization?.verified && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              ✓
            </Badge>
          )}
        </div>

        {/* Event Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {event.sessions?.[0] && (
            <>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconCalendarEvent className="h-4 w-4 text-primary" />
                <span className="truncate">{format(new Date(event.sessions[0].startTime), "MMM dd")}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconMapPin className="h-4 w-4 text-destructive" />
                <span className="truncate">{event.sessions[0].venue?.city}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCategory className="h-4 w-4 text-secondary-foreground" />
            <span className="truncate">{event.category}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTicket className="h-4 w-4 text-accent-foreground" />
            <span className="truncate">{event.tickets?.length || 0} ticket types</span>
          </div>
        </div>

        {/* Registration Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Registration</span>
            <span className="font-medium text-foreground">
              {stats.sold}/{stats.total} ({stats.percentage}%)
            </span>
          </div>
          <Progress value={stats.percentage} className="h-2" />
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/event/${event.slug}`}>
              <IconEye className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/event/${event.slug}/edit`}>
              <IconEdit className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/event/share/${event.slug}`}>
              <IconShare className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
