import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { useUserStore } from '@/store/userStore'
import { IconSettings2, IconEye, IconEyeOff, IconWorld, IconLock } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export const QuickActions = ({ event, setEventData }) => {
    const { user } = useUserStore();
    const [isPublishing, setIsPublishing] = useState(false);
    const [isTogglingRegistration, setIsTogglingRegistration] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const response = await api.post(`/event/admin/${event._id}/publish`);
            toast.success(response.data.message || "Event published successfully!");
            setEventData((prev) => ({
                ...prev,
                event: {
                    ...prev.event,
                    isPublished: true,
                    isRegistrationOpen: true
                }
            }));
        } catch (err) {
            console.error("Error publishing event:", err);
            toast.error(
                err.response?.data?.message || "Failed to publish event. Please try again later."
            );
        } finally {
            setIsPublishing(false);
        }
    };

    const handleToggleRegistration = async () => {
        setIsTogglingRegistration(true);
        const action = event.isRegistrationOpen ? 'close' : 'open';

        try {
            const response = await api.post(`/event/admin/registration/${event._id}/toggle`);
            toast.success(response.data.message || `Registration ${action}ed successfully!`);

            // Update event data with response data
            setEventData((prev) => ({
                ...prev,
                event: {
                    ...prev.event,
                    isRegistrationOpen: response.data.data?.isRegistrationOpen ?? !prev.event.isRegistrationOpen,
                    registrationStart: response.data.data?.registrationStart,
                    registrationEnd: response.data.data?.registrationEnd
                }
            }));
        } catch (err) {
            console.error(`Error ${action}ing registration:`, err);
            toast.error(
                err.response?.data?.message || `Failed to ${action} registration. Please try again later.`
            );
        } finally {
            setIsTogglingRegistration(false);
        }
    };

    if (!event) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconSettings2 className="w-5 h-5" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Management Actions - Only for authorized users */}
                {["owner", "admin", "manager"].includes(user?.orgRole) && (
                    <>
                        <Button asChild className="w-full">
                            <Link href={`/event/edit/${event._id}`}>Edit Event</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href={`/event/${event.slug}/participants`}>View Registrations</Link>
                        </Button>
                        <Button variant="outline" className="w-full">
                            Download Report
                        </Button>
                        <Separator />
                    </>
                )}

                {/* Publishing and Registration Controls */}
                {!event.isPublished ? (
                    /* Event Not Published - Show Publish Button */
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full" disabled={isPublishing}>
                                <IconWorld className="w-4 h-4 mr-2" />
                                {isPublishing ? "Publishing..." : "Publish Event"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Publish Event?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will make your event visible to the public and open registration for attendees.
                                    Once published, the event cannot be unpublished. Make sure all event details are correct before proceeding.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handlePublish} disabled={isPublishing}>
                                    {isPublishing ? "Publishing..." : "Publish Event"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : (
                    /* Event Published - Show Registration Toggle */
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="w-full"
                                variant={event.isRegistrationOpen ? "destructive" : "default"}
                                disabled={isTogglingRegistration}
                            >
                                {event.isRegistrationOpen ? (
                                    <>
                                        <IconEyeOff className="w-4 h-4 mr-2" />
                                        {isTogglingRegistration ? "Closing..." : "Close Registration"}
                                    </>
                                ) : (
                                    <>
                                        <IconEye className="w-4 h-4 mr-2" />
                                        {isTogglingRegistration ? "Opening..." : "Open Registration"}
                                    </>
                                )}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {event.isRegistrationOpen ? "Close Registration?" : "Open Registration?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {event.isRegistrationOpen ? (
                                        "This will prevent new users from registering for the event. Existing registrations will remain valid. You can reopen registration at any time."
                                    ) : (
                                        "This will allow users to register for the event. Make sure all event details and registration settings are configured correctly."
                                    )}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleToggleRegistration}
                                    disabled={isTogglingRegistration}
                                    variant={event.isRegistrationOpen ? "destructive" : "default"}
                                >
                                    {isTogglingRegistration ? (
                                        event.isRegistrationOpen ? "Closing..." : "Opening..."
                                    ) : (
                                        event.isRegistrationOpen ? "Close Registration" : "Open Registration"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {/* Event Status Display */}
                <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <div className="flex items-center gap-2">
                        {event.isPublished ? (
                            <>
                                <IconWorld className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">Published</span>
                            </>
                        ) : (
                            <>
                                <IconLock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-500">Draft</span>
                            </>
                        )}
                    </div>
                </div>

                {event.isPublished && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm text-muted-foreground">Registration:</span>
                        <div className="flex items-center gap-2">
                            {event.isRegistrationOpen ? (
                                <>
                                    <IconEye className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Open</span>
                                </>
                            ) : (
                                <>
                                    <IconEyeOff className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">Closed</span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Share Actions */}
                {event.isPublished && (
                    <Button asChild variant="secondary" className="w-full">
                        <Link href={`/event/${event.slug}/share`}>
                            Share Event & Get QR
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
