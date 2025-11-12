
'use client';

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { IconHome, IconLogin } from "@tabler/icons-react";

export default function Layout({ children }) {
    const { isAuthenticated } = useUserStore();
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8 bg-background animate-in fade-in">
                <div className="flex flex-col items-center gap-4 max-w-md w-full">
                    <div className="rounded-full bg-primary/10 p-4">
                        {/* Tabler Login Icon */}
                        <IconLogin className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Authentication Required</h2>
                    <p className="text-muted-foreground text-center text-base">
                        Please log in to access this page.<br />
                        You need to be authenticated to continue.
                    </p>
                    <Button
                        className="mt-6 px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors duration-200"
                        onClick={() => window.location.href = '/'}
                    >
                        <span className="inline-flex items-center gap-2">
                            {/* Tabler Home Icon */}
                            <IconHome className="h-4 w-4" />
                            Go to Home
                        </span>
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <main >
            {children}
        </main>
    );
}