'use client'
import { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import moment from 'moment';

export function DeleteSessionDialog({
    open,
    onOpenChange,
    session,
    onConfirm,
    loading = false
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!session) return null;

    const isPastSession = mounted ? moment(session.startTime).isBefore(moment()) : false;
    const isOngoing = mounted ? moment().isBetween(moment(session.startTime), moment(session.endTime)) : false;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <IconTrash className="w-5 h-5 text-destructive" />
                        Delete Session
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <p>
                            Are you sure you want to delete "<strong>{session.title}</strong>"?
                        </p>

                        {(isPastSession || isOngoing) && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10">
                                <IconAlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-destructive">Warning</p>
                                    <p className="text-muted-foreground">
                                        {isOngoing
                                            ? 'This session is currently ongoing.'
                                            : 'This session has already ended.'
                                        } Deleting it may affect participant records and notifications.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="text-sm text-muted-foreground px-4">
                            <p><strong>Session Details:</strong></p>
                            <ul className="mt-1 space-y-1 list-disc text-start">
                                <li>Date: {mounted ? moment(session.startTime).format('MMMM DD, YYYY') : 'Loading...'}</li>
                                <li>Time: {mounted ? `${moment(session.startTime).format('hh:mm A')} - ${moment(session.endTime).format('hh:mm A')}` : 'Loading...'}</li>
                                {session.venue && (
                                    <li>Venue: {session.venue.name}</li>
                                )}
                            </ul>
                        </div>

                        <p className="text-sm font-medium text-destructive">
                            This action cannot be undone.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? 'Deleting...' : 'Delete Session'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteSessionDialog;
