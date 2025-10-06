"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EventLayout({ children }) {
    return (
        <ProtectedRoute roles={["owner", "admin", "manager", "volunteer"]}>
            <ScrollArea className="h-dvh overflow-hidden sm:pt-0 w-full">
                <div className="h-dvh overflow-hidden sm:pt-0 w-full">
                    {children}
                </div>
            </ScrollArea>
        </ProtectedRoute>
    );
}