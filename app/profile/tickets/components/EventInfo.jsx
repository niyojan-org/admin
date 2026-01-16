import { Calendar, MapPin, Users, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function EventInfo({ event, sessionCheckIn, className }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getEventDateTime = () => {
    if (sessionCheckIn && sessionCheckIn.length > 0) {
      const firstSession = sessionCheckIn[0];
      if (firstSession.sessionDetails?.startTime) {
        return formatDateTime(firstSession.sessionDetails.startTime);
      }
    }
    return null;
  };

  const getVenue = () => {
    if (sessionCheckIn && sessionCheckIn.length > 0) {
      const venue = sessionCheckIn[0].sessionDetails?.venue;
      if (venue) {
        return `${venue.name}, ${venue.city}, ${venue.state}`;
      }
    }
    return "Venue TBA";
  };

  const dateTime = getEventDateTime();
  const venue = getVenue();

  return (
    <div className={cn("space-y-3", className)}>
      {/* Date & Time */}
      {dateTime && (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">Date & Time</p>
            <p className="text-sm font-semibold text-foreground">{dateTime.date}</p>
            <p className="text-xs text-muted-foreground">{dateTime.time}</p>
          </div>
        </div>
      )}

      {/* Venue */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium">Venue</p>
          <p className="text-sm font-semibold text-foreground line-clamp-2">{venue}</p>
        </div>
      </div>

      {/* Event Type & Category */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium">Event Details</p>
          <div className="flex gap-2 flex-wrap mt-1">
            <Badge variant="secondary" className="text-xs">
              {event.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {event.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {event.mode}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap pt-1">
          {event.tags.slice(0, 4).map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
              #{tag}
            </Badge>
          ))}
          {event.tags.length > 4 && (
            <Badge variant="outline" className="text-xs bg-muted/50">
              +{event.tags.length - 4} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
