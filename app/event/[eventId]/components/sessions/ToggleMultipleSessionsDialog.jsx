'use client'
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
import { IconSettings, IconAlertTriangle, IconCheck } from '@tabler/icons-react';

export function ToggleMultipleSessionsDialog({
    open,
    onOpenChange,
    currentState = false,
    sessionCount = 0,
    onConfirm,
    loading = false
}) {
    const isEnabling = !currentState;
    const hasMultipleSessions = sessionCount > 1;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <IconSettings className="w-5 h-5 text-primary" />
                        {isEnabling ? 'Enable Multiple Sessions' : 'Disable Multiple Sessions'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isEnabling
                            ? 'You are about to enable multiple sessions for this event.'
                            : 'You are about to disable multiple sessions for this event.'
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Content moved outside AlertDialogDescription to avoid ul inside p issue */}
                <div className="space-y-4 px-6">
                    {isEnabling ? (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10">
                            <IconCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="font-medium text-primary">Multiple Sessions Enabled</span>
                                <ul className="mt-2 space-y-1 text-muted-foreground ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>Participants can register for multiple sessions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>You can create up to 7 sessions for this event</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>Each session can have its own schedule and venue</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>Better organization for multi-day or complex events</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            {hasMultipleSessions && (
                                <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 text-sm flex-col items-center">
                                    <IconAlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                    <span className="font-medium text-destructive">Warning</span>
                                    <span className="text-muted-foreground">
                                        This event currently has {sessionCount} sessions. You cannot disable
                                        multiple sessions when more than 1 session exists. Please delete
                                        extra sessions first.
                                    </span>
                                </div>
                            )}

                            <div className="text-sm">
                                <span className="font-medium">Single Session Mode:</span>
                                <ul className="mt-2 space-y-1 text-muted-foreground ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>Event limited to only one session</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>Participants register for the single session</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>Simpler setup for single-day events</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></span>
                                        <span>Current session will become the default session</span>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}

                    <p className="text-sm text-muted-foreground">
                        {isEnabling
                            ? 'You can change this setting back later.'
                            : hasMultipleSessions
                                ? 'Remove extra sessions before disabling multiple sessions.'
                                : 'You can re-enable multiple sessions later if needed.'
                        }
                    </p>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading || (!isEnabling && hasMultipleSessions)}
                    >
                        {loading
                            ? 'Updating...'
                            : isEnabling
                                ? 'Enable Multiple Sessions'
                                : 'Disable Multiple Sessions'
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ToggleMultipleSessionsDialog;
