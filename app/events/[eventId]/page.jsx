"use client";
import AboutEvent from "./components/about-event";
import EventBanner from "./components/EventBanner";
import MetricsCard from "./components/metrics-card";
import OverviewEvent from "./components/overview-event";
import QuickActionsCard from "./components/quick-actions-card";
import RegistrationCard from "./components/registration-card";
import { EventStore } from "./event-store";

function Page() {
  const { event } = EventStore();

  if (!event) return null;

  return (
    <div className="mx-auto w-full max-w-400 space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <EventBanner event={event} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RegistrationCard event={event} className="h-full" />
            <MetricsCard event={event} className="h-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <AboutEvent event={event} className="lg:col-span-4" />
            <OverviewEvent event={event} className="lg:col-span-8" />
          </div>
        </div>

        <div className="col-span-1 xl:col-span-4">
          <QuickActionsCard event={event} />
        </div>
      </div>
    </div>
  );
}

export default Page;
