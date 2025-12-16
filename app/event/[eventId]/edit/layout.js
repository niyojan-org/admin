"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function EventEditLayout({ children }) {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated === false) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);

    // Optionally, show a loading state while auth is being determined
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center h-screen">Checking authentication...</div>;
    }

    return <>{children}</>;
}
