"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function ProtectedComp({ children, roles }) {
    const { isAuthenticated, loading, user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (loading === false && isAuthenticated === false) {
            console.warn("User is not authenticated, redirecting to auth page.");
        }
    }, [loading, isAuthenticated, router]);

    // Optionally show nothing or a loader while checking
    if (loading || isAuthenticated === null) return null;

    // Role-based access check
    if (roles && roles.length > 0) {
        const userRole = user?.organization.role;
        if (!roles.includes(userRole)) {
            return null;
        }
    }
    return children;
}
