"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EventLayout({ children }) {
    return (
        <ProtectedRoute roles={["owner", "admin", "manager", "volunteer"]}>
            <ScrollArea className="h-dvh" innerClassName={'px-4'}>
                <div className="h-dvh sm:pt-0 w-full">
                    {children}
                </div>
            </ScrollArea>
        </ProtectedRoute>
    );
}