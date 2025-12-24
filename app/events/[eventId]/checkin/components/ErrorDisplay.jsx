'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'MMM dd, yyyy • hh:mm a');
    } catch {
        return 'Invalid date';
    }
};

export default function ErrorDisplay({ error, onRetry }) {
    if (!error) return null;

    return (
        <div className="space-y-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-lg font-semibold">{error.message}</AlertTitle>
                <AlertDescription className="mt-3 space-y-3">
                    {/* Event Not Published */}
                    {error.code === 'EVENT_NOT_PUBLISHED' && (
                        <div className="space-y-2">
                            <p className="text-sm">
                                This event is not yet published. Please publish the event to enable check-in.
                            </p>
                            {error.details && (
                                <div className="mt-2 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                                    <p className="text-xs">{error.details}</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* No Active Session */}
                    {error.code === 'NO_ACTIVE_SESSION' && (
                        <div className="space-y-3">
                            <p className="text-sm">
                                {error.details?.message || 'Check-in is not currently available.'}
                            </p>
                            
                            {error.details?.nextSession && (
                                <div className="mt-3 p-4 bg-background rounded-md border border-destructive/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock className="w-4 h-4" />
                                        <p className="font-semibold text-sm">Next Session Available:</p>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <Badge variant="outline" className="mt-0.5">
                                                Title
                                            </Badge>
                                            <span className="flex-1 break-words">
                                                {error.details.nextSession.title}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                            <Badge variant="outline" className="mt-0.5">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Starts
                                            </Badge>
                                            <span className="flex-1 break-words">
                                                {formatDateTime(error.details.nextSession.startTime)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                            <Badge variant="outline" className="mt-0.5 bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Check-in Opens
                                            </Badge>
                                            <span className="flex-1 break-words font-medium">
                                                {formatDateTime(error.details.nextSession.checkInAvailableAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Invalid Check-in Code */}
                    {error.code === 'INVALID_CODE' && (
                        <div className="space-y-2">
                            <p className="text-sm">
                                The check-in code you entered is not valid. Please verify the code and try again.
                            </p>
                            {error.details && (
                                <div className="mt-2 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                                    <p className="text-xs">{error.details}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Generic Error with Details */}
                    {!['EVENT_NOT_PUBLISHED', 'NO_ACTIVE_SESSION', 'INVALID_CODE'].includes(error.code) && (
                        <div className="space-y-2">
                            {typeof error.details === 'string' && (
                                <p className="text-sm">{error.details}</p>
                            )}
                            {error.code && (
                                <div className="mt-2 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                                    <p className="text-xs font-mono">Error Code: {error.code}</p>
                                </div>
                            )}
                        </div>
                    )}
                </AlertDescription>
            </Alert>

            {/* Retry Button */}
            {onRetry && (
                <Button onClick={onRetry} className="gap-2 w-full sm:w-auto" variant="outline">
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </Button>
            )}
        </div>
    );
}
