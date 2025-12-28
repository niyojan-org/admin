import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import { Badge } from '../../../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../components/ui/avatar';

export default function EventInfo({ event, loading, error }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!event) {
    return (
      <Alert>
        <AlertDescription>
          Event not found
        </AlertDescription>
      </Alert>
    );
  }

  const firstSession = event.sessions?.[0];
  const firstTicket = event.tickets?.[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{event.category}</Badge>
              <Badge variant="outline">{event.type}</Badge>
              <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                {event.status}
              </Badge>
            </div>
            {event.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {firstSession && (
            <div className="space-y-1">
              <span className="font-medium">Date & Time</span>
              <p className="text-muted-foreground">
                {new Date(firstSession.startTime).toLocaleDateString()}
              </p>
              <p className="text-muted-foreground text-xs">
                {new Date(firstSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                {new Date(firstSession.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

          {firstSession?.venue && (
            <div className="space-y-1">
              <span className="font-medium">Venue</span>
              <p className="text-muted-foreground">{firstSession.venue.name}</p>
              <p className="text-muted-foreground text-xs">
                {firstSession.venue.city}, {firstSession.venue.state}
              </p>
            </div>
          )}

          {firstTicket && (
            <div className="space-y-1">
              <span className="font-medium">Ticket</span>
              <p className="text-muted-foreground">
                {firstTicket.type} - {firstTicket.price > 0 ? `₹${firstTicket.price}` : 'Free'}
              </p>
              <p className="text-muted-foreground text-xs">
                {firstTicket.sold} / {firstTicket.capacity} sold
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
