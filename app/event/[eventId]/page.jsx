"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventHeader from "./components/EventHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";
import Coupons from "./components/Coupons";
import Ticket from "./components/Ticket";
import Sessions from "./components/Sessions";
import InputField from "./components/InputField";
import Referrals from "./components/Referrals";
import { QuickActions } from "./components/QuickActions";
import Announcement from "./components/Announcement.jsx";
import ProtectedComp from "@/components/ProtectedComp";
import GuestSpeaker from "./components/GuestSpeaker";
import { RegistrationDashboard } from "./components/registration";
import { Benefits } from "./components/Benefits";

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
    <div className="container mx-auto space-y-6">
      {/* Event Header */}
      <EventHeader event={event} organization={organization} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6 order-2 sm:order-1">
          {/* Ticket */}
          <Ticket eventId={event._id} />

          {/* sessions */}
          <Sessions eventId={event._id} />

          {/* Custom Fields */}
          <InputField eventId={event._id} className={'max-h-dvh'} />

          <Referrals eventId={event._id} />

          <GuestSpeaker eventId={event._id} />

          <Benefits eventId={event._id} />

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6 order-1 sm:order-2">


          {/* Quick Actions */}
          <QuickActions event={event} setEventData={setEventData} />


          {/* Announcement */}
          <ProtectedComp roles={["admin", "owner", "manager"]}>
            <Announcement eventId={event._id} />
          </ProtectedComp>
          {/* Coupons */}
          <ProtectedComp roles={["admin", "owner", "manager"]}>
            <Coupons eventId={event._id} />
          </ProtectedComp>

          {/* Registration Timeline */}
          <ProtectedComp roles={["admin", "owner", "manager"]}>
            <RegistrationDashboard eventId={event._id} />
            {/* <RegistrationStats eventId={event._id} /> */}
          </ProtectedComp>


        </div>
      </div>
    </div>
  );
};

export default EventPage;
