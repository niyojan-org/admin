"use client";

import { RegistrationDashboard } from './registration';

/**
 * Example usage of the Registration Management System
 * This shows how to integrate the dashboard into an event page
 */
export default function EventRegistrationPage({ params }) {
  const { eventId } = params;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Registration Management</h1>
      </div>
      
      <RegistrationDashboard eventId={eventId} />
    </div>
  );
}

// Alternative: Using individual components
export function CustomRegistrationLayout({ eventId }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <RegistrationStats eventId={eventId} />
        <TimelineDisplay eventId={eventId} />
      </div>
      <div className="space-y-6">
        <QuickActions eventId={eventId} />
        <RegistrationSettings eventId={eventId} />
      </div>
    </div>
  );
}
