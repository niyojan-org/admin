"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IconCheck, IconClock, IconSparkles } from "@tabler/icons-react";

export function StatusBanner({ isVerified, isRequestPending }) {
    if (isVerified) {
        return (
            <Alert className="border-2 border-green-500/50 bg-green-500/5">
                <IconCheck className="h-5 w-5 text-green-600" />
                <AlertDescription className="ml-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-semibold text-lg text-green-900 dark:text-green-100">
                                Organization Verified
                            </p>
                            <p className="text-sm mt-1 text-green-700 dark:text-green-200">
                                Your organization has been successfully verified!
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="sm:ml-4 whitespace-nowrap"
                            onClick={() => (window.location.href = "/dashboard")}
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    if (isRequestPending) {
        return (
            <Alert className="border-2 border-yellow-500/50 bg-yellow-500/5">
                <IconClock className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="ml-2">
                    <p className="font-semibold text-lg text-yellow-900 dark:text-yellow-100">
                        Verification Pending
                    </p>
                    <p className="text-sm mt-1 text-yellow-700 dark:text-yellow-200">
                        Your request is being reviewed by our team. We'll notify you via email.
                    </p>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert className="border-2 border-primary/50 bg-primary/5">
            <IconSparkles className="h-5 w-5 text-primary" />
            <AlertDescription className="ml-2">
                <p className="font-semibold text-lg">Ready for Verification</p>
                <p className="text-sm mt-1 text-muted-foreground">
                    Please review your details below and submit your request.
                </p>
            </AlertDescription>
        </Alert>
    );
}
