"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EventLayout({ children }) {
    return (
        <ProtectedRoute roles={["owner", "admin", "manager", "volunteer"]}>
            <div className="h-dvh overflow-hidden sm:pt-0">
                <div className="flex items-center px-4 md:px-10 justify-center min-h-dvh py-5 md:py-0 overflow-hidden pt-16">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}