"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar, Timer } from 'lucide-react';
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

/**
 * Timeline Display Component
 * Shows registration timeline with countdown and status information
 */
export default function TimelineDisplay({ 
  registrationStart, 
  registrationEnd, 
  isRegistrationOpen,
  className = "" 
}) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const startDate = registrationStart ? new Date(registrationStart) : null;
      const endDate = registrationEnd ? new Date(registrationEnd) : null;

      if (!startDate || !endDate) {
        setTimeLeft(null);
        return;
      }

      // Registration hasn't started yet
      if (now < startDate) {
        setTimeLeft({
          target: startDate,
          label: 'Starts in',
          type: 'start'
        });
      }
      // Registration is active
      else if (now >= startDate && now <= endDate) {
        setTimeLeft({
          target: endDate,
          label: 'Ends in',
          type: 'end'
        });
      }
      // Registration has ended
      else {
        setTimeLeft(null);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [registrationStart, registrationEnd]);

  const formatCountdown = (targetDate) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) return '00:00:00';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimelineStatus = () => {
    const now = new Date();
    const startDate = registrationStart ? new Date(registrationStart) : null;
    const endDate = registrationEnd ? new Date(registrationEnd) : null;

    if (!startDate || !endDate) {
      return { status: 'not-scheduled', color: 'text-muted-foreground' };
    }

    if (now < startDate) {
      return { status: 'upcoming', color: 'text-blue-600' };
    } else if (now <= endDate) {
      return { status: 'active', color: 'text-green-600' };
    } else {
      return { status: 'ended', color: 'text-red-600' };
    }
  };

  const { status, color } = getTimelineStatus();

  if (!registrationStart && !registrationEnd) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No registration timeline set</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4" />
          Registration Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Countdown Timer */}
        {timeLeft && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className={`w-4 h-4 ${timeLeft.type === 'start' ? 'text-blue-600' : 'text-orange-600'}`} />
              <span className="text-sm font-medium">{timeLeft.label}</span>
            </div>
            <div className="text-2xl font-mono font-bold tracking-wider">
              {formatCountdown(timeLeft.target)}
            </div>
          </div>
        )}

        <Separator />

        {/* Timeline Details */}
        <div className="space-y-3">
          {registrationStart && (
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                status === 'upcoming' ? 'bg-blue-500' : 
                status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Registration Opens</span>
                  <Badge variant={status === 'upcoming' ? 'secondary' : 'outline'} className="text-xs">
                    {isPast(new Date(registrationStart)) ? 'Started' : 'Scheduled'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(registrationStart), 'PPP p')}
                </div>
                {isFuture(new Date(registrationStart)) && (
                  <div className="text-xs text-blue-600">
                    {formatDistanceToNow(new Date(registrationStart), { addSuffix: true })}
                  </div>
                )}
              </div>
            </div>
          )}

          {registrationEnd && (
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                status === 'ended' ? 'bg-red-500' : 
                status === 'active' ? 'bg-orange-500' : 'bg-gray-400'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Registration Closes</span>
                  <Badge variant={status === 'ended' ? 'destructive' : 'outline'} className="text-xs">
                    {isPast(new Date(registrationEnd)) ? 'Ended' : 'Scheduled'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(registrationEnd), 'PPP p')}
                </div>
                {isFuture(new Date(registrationEnd)) && (
                  <div className="text-xs text-orange-600">
                    {formatDistanceToNow(new Date(registrationEnd), { addSuffix: true })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Summary */}
        <div className={`text-xs text-center py-2 px-3 rounded-md bg-muted/30 ${color}`}>
          Status: {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </div>
      </CardContent>
    </Card>
  );
}