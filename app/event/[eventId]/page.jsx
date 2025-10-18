"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventHeader from "./components/EventHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const EventPage = () => {
  const params = useParams();
  const eventId = params.eventId;
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api.get(`/event/admin/${eventId}`);
        const data = await response.data;
        if (data.success) {
          setEventData(data.data);
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
    <div className="container mx-auto space-y-6 h-full">
      {/* Event Header */}
      <EventHeader event={event} organization={organization} setEventData={setEventData} />

      {/* Bento Grid Layout - 6 columns with auto-fit rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 grid-rows-4 ">

        {/* Registration Dashboard - spans 4 columns (main focus) */}
        <ProtectedComp roles={["admin", "owner", "manager"]}>
          <div className="md:col-span-3 lg:col-span-4 h-full">
            <RegistrationDashboard eventId={event._id} />
          </div>
        </ProtectedComp>

        {/* Quick Actions - spans 2 columns (sidebar) */}
        <div className="md:col-span-3 lg:col-span-2 h-full space-y-2 ">
          <QuickActions event={event} setEventData={setEventData} />
          <Card className="h-fit gap-2">
            <CardHeader>
              <CardTitle>Share Hub</CardTitle>
              <CardDescription>
                Share your event on social media and other platforms to boost visibility and attendance.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full items-end flex">
              <Button asChild className="w-full">
                <Link href={`/event/${event._id}/share`}>Share Event</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Announcement - spans 2 columns */}
          <ProtectedComp roles={["admin", "owner", "manager"]}>
            <div className="">
              <Card className="h-fit gap-2">
                <CardHeader>
                  <CardTitle>Announcement</CardTitle>
                  <CardDescription>
                    Make your event announcements for this event.
                  </CardDescription>
                </CardHeader>
                <CardContent className="w-full items-end flex">
                  <Button asChild className="w-full">
                    <Link href={`/event/${event._id}/announcements`}>Make announcements</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ProtectedComp>


        </div>

        {/* Ticket - spans 4 columns */}
        <div className="md:col-span-3 lg:col-span-4 h-full max-h-[50dvh]">
          <Ticket eventId={event._id} className={'h-full'} />
        </div>

        <div className="md:col-span-2 lg:col-span-2 max-h-[50dvh]">
          <InputField eventId={event._id} className="max-h-dvh h-full" />
        </div>

        {/* Share Hub - spans 2 columns */}

        {/* Sessions - spans 4 columns */}
        <div className="md:col-span-3 lg:col-span-4">
          <Sessions eventId={event._id} />
        </div>

        {/* Benefits - spans 3 columns */}
        <div className="md:col-span-3 lg:col-span-3">
          <Benefits eventId={event._id} />
        </div>

        {/* Guest Speaker - spans 3 columns */}
        <div className="md:col-span-3 lg:col-span-3">
          <GuestSpeaker eventId={event._id} />
        </div>

        {/* Custom Fields - spans 3 columns */}


        {/* Referrals - spans 3 columns */}
        <div className="md:col-span-3 lg:col-span-3">
          <Referrals eventId={event._id} />
        </div>

        {/* Coupons - spans full width (6 columns) */}
        <ProtectedComp roles={["admin", "owner", "manager"]}>
          <div className="md:col-span-3 lg:col-span-6">
            <Coupons eventId={event._id} />
          </div>
        </ProtectedComp>

      </div>
    </div>
  );
};

export default EventPage;