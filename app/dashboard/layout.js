"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import PushNotification from "@/components/PushNotification";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLayout({ children, event, payment, revenue, summary }) {
    return (
        <ProtectedRoute>
            {/* Mobile: Single column stack */}
            <div className="md:hidden flex flex-col min-h-dvh pt-16 gap-2 w-full">
                <div className="">{summary}</div>
                <div className="">{event}</div>
                <div className="">{revenue}</div>
                <div className="">{payment}</div>
            </div>

            {/* Tablet & Desktop: Original grid layout */}
            <div className="hidden md:grid grid-cols-6 grid-rows-6 gap-4 py-4 h-screen">
                {/* Better Now Closer */}
                <div className="col-span-2 row-span-3">
                    {summary}
                </div>

                {/* Handshake */}
                <div className="col-span-2 row-span-3">
                    {event}
                </div>

                {/* Team Adaptation */}
                <Card className="col-span-2 row-span-2">
                    <CardContent className="p-0 flex flex-col justify-between h-full">
                        <div className="flex justify-between text-sm opacity-90">
                            <span>24 Mar</span>
                            <span>09:00–10:00</span>
                        </div>
                        <h2 className="text-2xl font-semibold mt-2">Team Adaptation</h2>
                        <p className="text-xs opacity-80">HR grooming</p>
                    </CardContent>
                </Card>

                {/* Bring People Together */}
                <Card className="col-span-2 row-span-1">
                    <CardContent className="p-0">
                        <h2 className="text-red-600 font-semibold leading-tight">
                            Bring People<br />Together
                        </h2>
                        <p className="text-gray-600 text-sm mt-2">sync.com</p>
                    </CardContent>
                </Card>

                {/* Chat section */}
                <div className="col-span-4 row-span-4">
                    {revenue}
                </div>

                {/* Team illustration placeholder */}
                <div className="col-span-2 row-span-3">
                    {payment}
                </div>
            </div>
            {/* <PushNotification /> */}
        </ProtectedRoute>
    );
}