'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Building2, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'MMM dd, yyyy • hh:mm a');
    } catch {
        return 'Invalid date';
    }
};

export default function EventInfoBanner({ event, serverTime, checkInStatus }) {
    return (
        <div className="space-y-2">
            {/* Event Header */}
            <div className="-space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold break-words">Event Check-In</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 flex-shrink-0" />
                        <span className="break-words">{event?.title}</span>
                    </div>
                    {event?.organization?.name && (
                        <>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-2 ml-6 sm:ml-0">
                                <Building2 className="w-4 h-4 flex-shrink-0" />
                                <span className="break-words">{event.organization.name}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Server Time */}
                {serverTime && (
                    <Card className={'p-0 px-2'}>
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground font-medium">Server Time</p>
                                    <p className="text-sm font-semibold break-words mt-1">
                                        {formatDateTime(serverTime)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Check-in Status */}
                {checkInStatus && (
                    <>
                        <Card className={'p-0 px-2'}>
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground font-medium">Check-In Status</p>
                                        <div className="mt-2">
                                            <Badge
                                                variant={checkInStatus.isOpen ? "default" : "secondary"}
                                                className={checkInStatus.isOpen ? "bg-green-600" : ""}
                                            >
                                                {checkInStatus.isOpen ? "Open" : "Closed"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {checkInStatus.timeRemaining && checkInStatus.isOpen && (
                            <Card className={'p-0 px-2'}>
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground font-medium">Time Remaining</p>
                                            <p className="text-sm font-semibold break-words mt-1">
                                                {checkInStatus.timeRemaining.formatted}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Valid until {formatDateTime(checkInStatus.validUntil)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
