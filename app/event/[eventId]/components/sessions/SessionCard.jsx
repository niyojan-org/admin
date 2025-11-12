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
    IconCalendar,
    IconQrcode,
    IconCircleCheck,
    IconCircleX
} from '@tabler/icons-react';
import moment from 'moment';
import EnableCheckInDialog from './EnableCheckInDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function SessionCard({
    session,
    onEdit,
    onDelete,
    onEnableCheckIn,
    onDisableCheckIn,
    userRole = 'volunteer',
    loading = false
}) {
    const [mounted, setMounted] = useState(false);
    const [showEnableDialog, setShowEnableDialog] = useState(false);
    const [showDisableDialog, setShowDisableDialog] = useState(false);

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

    const handleEnableCheckIn = async (checkInData) => {
        try {
            await onEnableCheckIn(session._id, checkInData);
            setShowEnableDialog(false);
        } catch (error) {
            // Error is handled in the parent
        }
    };

    const handleDisableCheckIn = async () => {
        try {
            await onDisableCheckIn(session._id);
            setShowDisableDialog(false);
        } catch (error) {
            // Error is handled in the parent
        }
    };

    return (
        <>
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

                        {/* Check-in Status and Actions */}
                        {canEdit && (
                            <div className="pt-2 border-t">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <IconQrcode className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Check-in:</span>
                                        {session.allowCheckIn ? (
                                            <Badge variant="default" className="text-xs gap-1">
                                                <IconCircleCheck className="w-3 h-3" />
                                                Enabled
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-xs gap-1">
                                                <IconCircleX className="w-3 h-3" />
                                                Disabled
                                            </Badge>
                                        )}
                                    </div>

                                    {session.allowCheckIn ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowDisableDialog(true)}
                                            disabled={loading || isPastSession}
                                            className="h-8 text-xs"
                                        >
                                            Disable Check-in
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => setShowEnableDialog(true)}
                                            disabled={loading || isPastSession}
                                            className="h-8 text-xs"
                                        >
                                            Enable Check-in
                                        </Button>
                                    )}
                                </div>
                                {session.allowCheckIn && session.checkInCode && (
                                    <div className="mt-2 space-x-4 flex">
                                        <div className="text-xs text-muted-foreground">
                                            <span className="font-medium">Code:</span> {session.checkInCode}
                                        </div>
                                        {session.checkInStartTime && session.checkInEndTime && mounted && (
                                            <div className="text-xs text-muted-foreground">
                                                <span className="font-semibold">Check-in Window:</span>{' '}
                                                {moment(session.checkInStartTime).format('MMM DD, hh:mm A')} - {moment(session.checkInEndTime).format('hh:mm A')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Enable Check-in Dialog */}
            <EnableCheckInDialog
                open={showEnableDialog}
                onOpenChange={setShowEnableDialog}
                session={session}
                onConfirm={handleEnableCheckIn}
                loading={loading}
            />

            {/* Disable Check-in Confirmation Dialog */}
            <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Disable Check-in?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to disable check-in for "{session.title}"?
                            Participants will no longer be able to check in to this session.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDisableCheckIn}
                            disabled={loading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {loading ? 'Disabling...' : 'Disable Check-in'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default SessionCard;
