'use client'
import { CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IconUsers, IconAlertTriangle, IconPlus } from '@tabler/icons-react';
import GuestSpeakerCard from './GuestSpeakerCard';

export function GuestSpeakerList({
    speakers = [],
    loading = false,
    error = null,
    userRole = 'volunteer',
    onEditSpeaker,
    onDeleteSpeaker,
    onAddFirstSpeaker
}) {
    const canManage = ['owner', 'admin'].includes(userRole);

    if (loading) {
        return (
            <CardContent className="">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="border rounded-lg p-4 sm:p-6 bg-gradient-to-br from-card to-card/80">
                            <div className="flex gap-4">
                                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-32 sm:w-48" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                        {canManage && (
                                            <div className="hidden sm:flex gap-1 flex-shrink-0">
                                                <Skeleton className="h-8 w-8" />
                                                <Skeleton className="h-8 w-8" />
                                                <Skeleton className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-14" />
                                    </div>
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
            <CardContent className="">
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                    <IconAlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <span className="text-sm">{error}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.reload()}
                            className="self-start sm:self-auto flex-shrink-0"
                        >
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </CardContent>
        );
    }

    if (speakers.length === 0) {
        return (
            <CardContent className="">
                <div className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-md mx-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <IconUsers className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h3 className="text-lg sm:text-xl font-semibold">No Guest Speakers Yet</h3>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {canManage
                                    ? 'Add notable guest speakers to make your event more attractive to participants. Include their bio, photo, and social media links to build credibility.'
                                    : 'Guest speakers will appear here once they are added by the event organizers.'
                                }
                            </p>
                        </div>
                        {canManage && (
                            <Button
                                onClick={onAddFirstSpeaker}
                                className="flex items-center gap-2 mt-2"
                                size="lg"
                            >
                                <IconPlus className="w-4 h-4" />
                                Add Your First Speaker
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        );
    }

    return (
        <CardContent className="">
            <div className="grid gap-2 sm:gap-4 grid-cols-1">
                {speakers.map((speaker) => (
                    <GuestSpeakerCard
                        key={speaker._id}
                        speaker={speaker}
                        userRole={userRole}
                        onEdit={onEditSpeaker}
                        onDelete={onDeleteSpeaker}
                    />
                ))}
            </div>
        </CardContent>
    );
}

export default GuestSpeakerList;
