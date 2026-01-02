import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import {
  IconSettings2,
  IconEye,
  IconEyeOff,
  IconWorld,
  IconLock,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const QuickActions = ({ event, setEventData }) => {
  const { user } = useUserStore();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const response = await api.post(`/events/admin/${event._id}/publish`);
      toast.success(response.data.message || "Event published successfully!");
      setEventData((prev) => ({
        ...prev,
        event: {
          ...prev.event,
          isPublished: true,
        },
      }));
    } catch (err) {
      console.error("Error publishing event:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to publish event. Please try again later."
      );
    } finally {
      setIsPublishing(false);
    }
  };



  if (!event) {
    return null;
  }

  return (
    <Card className={"p-3 gap-2 border-none dark:bg-card/80 shadow-sm transition-[box-shadow,transform] duration-200 ease-out hover:shadow-md"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconSettings2 className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {["owner", "admin", "manager"].includes(user?.orgRole) && (
          <>
            <Button asChild className="w-full">
              <Link href={`/events/edit/${event._id}`}>Edit Event</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/events/${event._id}/participants`}>
                View Registrations
              </Link>
            </Button>

            <Separator />
          </>
        )}

        {!event.isPublished && (
        
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
                  This action will make your event visible to the public and
                  open registration for attendees. Once published, the event
                  cannot be unpublished. Make sure all event details are correct
                  before proceeding.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Publish Event"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Event Status Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="text-sm text-muted-foreground">Event Status:</span>
            <div className="flex items-center gap-2">
              {event.isPublished ? (
                <>
                  <IconWorld className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">
                    Published
                  </span>
                </>
              ) : (
                <>
                  <IconLock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Draft
                  </span>
                </>
              )}
            </div>
          </div>

          {event.isPublished && (
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">
                Event Registration:
              </span>
              <div className="flex items-center gap-2">
                {event.isRegistrationOpen ? (
                  <>
                    <IconEye className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      Open
                    </span>
                  </>
                ) : (
                  <>
                    <IconEyeOff className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      Closed
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Show participant details button if registration has started */}
        {event.isPublished && (
          <Button className="w-full" asChild>
            <Link href={`/events/${event.slug}/participants`}>
              View Participant Details
            </Link>
          </Button>
          
        )}

        {event.isPublished && event.isRegistrationOpen && (
            <Button className="w-full" asChild>
              <Link href={`/events/${event.slug}/registration`}>
                Add Participants
              </Link>
          </Button>
        )}

  
      </CardContent>
    </Card>
  );
};
