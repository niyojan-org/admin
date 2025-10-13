"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Ticket, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Registration Statistics Component
 * Displays registration progress and ticket breakdown
 */
export default function RegistrationStats({ statistics, tickets = [], eventId }) {
  if (!statistics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No registration data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    totalCapacity = 0,
    totalSold = 0,
    availableSpots = 0,
    registrationPercentage = 0
  } = statistics;

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAvailabilityStatus = () => {
    const percentage = registrationPercentage;
    if (percentage >= 100) return { label: 'Sold Out', variant: 'destructive' };
    if (percentage >= 90) return { label: 'Almost Full', variant: 'destructive' };
    if (percentage >= 75) return { label: 'Filling Fast', variant: 'secondary' };
    if (percentage >= 50) return { label: 'Half Full', variant: 'secondary' };
    return { label: 'Available', variant: 'default' };
  };

  const { label: statusLabel, variant: statusVariant } = getAvailabilityStatus();

  return (
    <div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Overall Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Registration Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Registration Progress</span>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
            <Progress 
              value={registrationPercentage} 
              className="h-3"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{totalSold} registered</span>
              <span>{availableSpots} spots remaining</span>
            </div>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{totalSold}</div>
              <div className="text-xs text-muted-foreground">Registered</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold">{totalCapacity}</div>
              <div className="text-xs text-muted-foreground">Total Capacity</div>
            </div>
          </div>

          {/* Percentage Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {Math.round(registrationPercentage)}%
            </div>
            <div className="text-sm text-muted-foreground">Capacity Filled</div>
            <Button variant="link" size="sm" className="mt-2 p-0">
             <Link href={`/event/${eventId}/participants`}>
               View Details
             </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Breakdown */}
      {tickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Ticket Sales Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.type}</span>
                      <Badge variant={ticket.isActive ? 'default' : 'secondary'} className="text-xs">
                        {ticket.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${ticket.price}
                    </div>
                  </div>
                  
                  <Progress 
                    value={parseFloat(ticket.soldPercentage)} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{ticket.sold}/{ticket.capacity} sold</span>
                    <span>{ticket.soldPercentage}% filled</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
			</div>
    </div>
  );
}
