"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventHeader from "./components/EventHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import { toast } from "sonner";
import Coupons from "./components/Coupons";
import Ticket from "./components/Ticket";
import Sessions from "./components/Sessions";
import InputField from "./components/InputField";
import Referrals from "./components/Referrals";
import ProtectedComp from "@/components/ProtectedComp";
import GuestSpeaker from "./components/GuestSpeaker";
import { RegistrationDashboard } from "./components/registration";
import { Benefits } from "./components/Benefits";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuickActions } from "./components/QuickActions";
import { useEventStore } from "@/store/eventStore";

const EventPage = () => {
  const params = useParams();
  const eventId = params.eventId;
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setCurrentEvent } = useEventStore();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api.get(`/events/admin/${eventId}`);
        const data = await response.data;
        if (data.success) {
          setEventData(data.data);
          setCurrentEvent(data.data.event);
        } else {
          setError("Failed to fetch event data");
        }
      } catch (err) {
        setError("Error fetching event data");
        console.error("Error:", err);
        toast.error(
          err.response.data.message || "Failed to load event data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-destructive">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground">The requested event could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { event, organization } = eventData;

  return (
    <div className="container mx-auto py-6 h-full pb-6">
      {/* Event Header */}
      <div className="mb-8">
        <EventHeader event={event} organization={organization} setEventData={setEventData} />
      </div>

      {/* Quick Actions - Mobile Only (below header) */}
      <div className="mb-6 lg:hidden">
        <QuickActions event={event} setEventData={setEventData} />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 auto-rows-min">
        {/* Registration Dashboard */}
        <ProtectedComp roles={["admin", "owner", "manager"]}>
          <div className="md:col-span-3 lg:col-span-4 lg:row-span-2">
            <RegistrationDashboard eventId={event._id} />
          </div>
        </ProtectedComp>

        {/* Quick Actions + Share + Announcements - Desktop Only */}
        <div className="hidden lg:flex md:col-span-3 lg:col-span-2 lg:row-span-2 flex-col gap-4 h-full justify-between">
          <QuickActions event={event} setEventData={setEventData} />

          <Card className="shadow-sm hover:shadow-md transition-shadow gap-2 p-4">
            <CardHeader className="">
              <CardTitle className="text-lg">Share Hub</CardTitle>
              <CardDescription className="text-sm">
                Spread the word about your event easily.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/events/${event.slug}/share`}>Share Event</Link>
              </Button>
            </CardContent>
          </Card>

          <ProtectedComp roles={["admin", "owner", "manager"]}>
            <Card className="shadow-sm hover:shadow-md transition-shadow gap-2 p-4">
              <CardHeader className="">
                <CardTitle className="text-lg">Announcements</CardTitle>
                <CardDescription className="text-sm">
                  Keep attendees informed in real time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/events/${event.slug}/announcements`}>Manage Announcements</Link>
                </Button>
              </CardContent>
            </Card>
          </ProtectedComp>
        </div>

        {/* Share Hub - Mobile/Tablet */}
        <div className="lg:hidden md:col-span-3">
          <Card className="shadow-sm hover:shadow-md transition-shadow gap-2 p-4">
            <CardHeader className="">
              <CardTitle className="text-lg">Share Hub</CardTitle>
              <CardDescription className="text-sm">
                Spread the word about your event easily.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/events/${event.slug}/share`}>Share Event</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Announcements - Mobile/Tablet */}
        <ProtectedComp roles={["admin", "owner", "manager"]}>
          <div className="lg:hidden md:col-span-3">
            <Card className="shadow-sm hover:shadow-md transition-shadow gap-2 p-4">
              <CardHeader className="">
                <CardTitle className="text-lg">Announcements</CardTitle>
                <CardDescription className="text-sm">
                  Keep attendees informed in real time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/events/${event.slug}/announcements`}>Manage Announcements</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </ProtectedComp>

        {/* Tickets */}
        <div className="md:col-span-3 lg:col-span-4">
          <Ticket eventId={event._id} className={"h-[600px]"} />
        </div>

        {/* Custom Fields */}
        <div className="md:col-span-3 lg:col-span-2">
          <InputField eventId={event._id} className={"h-[600px]"} />
        </div>

        {/* Sessions */}
        <div className="md:col-span-3 lg:col-span-4">
          <Sessions eventId={event._id} className={"h-[600px]"} />
        </div>

        {/* Benefits */}
        <div className="md:col-span-3 lg:col-span-2">
          <Benefits eventId={event._id} className={"h-[600px]"} />
        </div>

        {/* Guest Speakers */}
        <div className="md:col-span-3 lg:col-span-3 h-full">
          <GuestSpeaker eventId={event._id} />
        </div>

        {/* Referrals */}
        <div className="hidden">
          <ScrollArea className="h-[420px]">
            <Referrals eventId={event._id} />
          </ScrollArea>
        </div>

        {/* Coupons */}
        <ProtectedComp roles={["admin", "owner", "manager"]}>
          <div className="md:col-span-3 h-full">
            <Coupons eventId={event._id} />
          </div>
        </ProtectedComp>
      </div>
    </div>
  );
};

export default EventPage;
