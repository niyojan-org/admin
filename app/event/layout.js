"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function EventLayout({ children }) {
    return (
        <ProtectedRoute roles={["owner", "admin", "manager", "volunteer"]}>
            <div className="h-dvh sm:pt-0 w-full">
                {children}
            </div>
        </ProtectedRoute>
    );
}