'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    IconEdit, 
    IconTrash, 
    IconClock, 
    IconMapPin,
    IconCalendar 
} from '@tabler/icons-react';
import moment from 'moment';

export function SessionCard({ 
    session, 
    onEdit, 
    onDelete, 
    userRole = 'volunteer',
    loading = false 
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const canEdit = ['owner', 'admin'].includes(userRole);
    
    // Only calculate time-based values after mounting to prevent hydration issues
    const getSessionStatus = () => {
        if (!mounted) return { label: 'Loading...', variant: 'outline' };
        
        const isPastSession = moment(session.startTime).isBefore(moment());
        const isOngoing = moment().isBetween(moment(session.startTime), moment(session.endTime));
        
        if (isPastSession && !isOngoing) return { label: 'Completed', variant: 'secondary' };
        if (isOngoing) return { label: 'Ongoing', variant: 'default' };
        return { label: 'Upcoming', variant: 'outline' };
    };

    const status = getSessionStatus();
    const isPastSession = mounted ? moment(session.startTime).isBefore(moment()) : false;

    return (
        <Card className={`transition-all duration-200 hover:shadow-md ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
            <CardContent className="">
                <div className="flex flex-col space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-semibold text-foreground">
                                    {session.title}
                                </h3>
                                <Badge variant={status.variant} className="text-xs">
                                    {status.label}
                                </Badge>
                            </div>
                            {session.description && (
                                <p className="text-sm text-muted-foreground leading-4 sm:line-clamp-none line-clamp-3">
                                    {session.description}
                                </p>
                            )}
                        </div>
                        
                        {/* Actions */}
                        {canEdit && (
                            <div className="flex gap-1 ml-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(session)}
                                    disabled={loading || isPastSession}
                                    className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                                >
                                    <IconEdit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(session)}
                                    disabled={loading || isPastSession}
                                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                                >
                                    <IconTrash className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Time Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <IconCalendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="font-medium text-sm">
                                    {mounted ? moment(session.startTime).format('MMM DD, YYYY') : 'Loading...'}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {mounted ? moment(session.startTime).format('dddd') : 'Loading...'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                            <IconClock className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="font-medium text-sm">
                                    {mounted ? `${moment(session.startTime).format('hh:mm A')} - ${moment(session.endTime).format('hh:mm A')}` : 'Loading...'}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {mounted ? moment.duration(moment(session.endTime).diff(moment(session.startTime))).humanize() : 'Loading...'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Venue Information */}
                    {session.venue && (
                        <div className="flex items-start gap-2 text-sm">
                            <IconMapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm">{session.venue.name}</p>
                                <p className="text-muted-foreground text-xs line-clamp-2">
                                    {session.venue.address}, {session.venue.city}, {session.venue.state} {session.venue.zipCode}, {session.venue.country}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default SessionCard;
