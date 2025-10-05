'use client'
import { CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { IconCalendar, IconAlertTriangle } from '@tabler/icons-react';
import SessionCard from './SessionCard';
import { sortSessionsByTime } from './sessionUtils';

export function SessionList({
    sessions = [],
    loading = false,
    error = null,
    onEditSession,
    onDeleteSession,
    userRole
}) {
    const sortedSessions = sortSessionsByTime(sessions);

    if (loading) {
        return (
            <CardContent>
                <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="border rounded-lg p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        );
    }

    if (error) {
        return (
            <CardContent>
                <Alert variant="destructive">
                    <IconAlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </CardContent>
        );
    }

    if (sortedSessions.length === 0) {
        return (
            <CardContent>
                <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <IconCalendar className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">No Sessions Yet</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                                {['owner', 'admin'].includes(userRole)
                                    ? 'Get started by adding your first session to this event.'
                                    : 'Sessions will appear here once they are configured by the event organizers.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        );
    }

    return (
        <CardContent>
            <div className="space-y-4">
                {sortedSessions.map((session) => (
                    <SessionCard
                        key={session?._id || session || Math.random().toString(36).substr(2, 9)}
                        session={session}
                        onEdit={onEditSession}
                        onDelete={onDeleteSession}
                        userRole={userRole}
                        loading={loading}
                    />
                ))}
            </div>
        </CardContent>
    );
}

export default SessionList;
