"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import PushNotification from "@/components/PushNotification";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLayout({ children, event, notifications, revenue, summary, visitors }) {
    return (
        <ProtectedRoute>
            {/* Mobile: Single column stack */}
            <div className="md:hidden flex flex-col min-h-dvh pt-16 gap-2 w-full">
                <div className="">{summary}</div>
                <div className="">{event}</div>
                <div className="">{revenue}</div>
                <div className="">{notifications}</div>
            </div>

            {/* Tablet & Desktop: Original grid layout */}
            <div className="hidden md:grid grid-cols-6 grid-rows-2 gap-4 py-4 h-screen">
                {/* Summary */}
                <div className="col-span-2">
                    {summary}
                </div>

                {/* Event */}
                <div className="col-span-2">
                    {event}
                </div>

                {/* Visitors */}
                <div className="col-span-2">
                    {visitors}
                </div>

                {/* Chat section */}
                <div className="col-span-4">
                    {revenue}
                </div>

                {/* Team illustration placeholder */}
                <div className="col-span-2">
                    {notifications}
                </div>
            </div>
            {/* <PushNotification /> */}
        </ProtectedRoute>
    );
}