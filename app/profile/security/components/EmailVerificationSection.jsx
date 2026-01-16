"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconMail, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";

export function EmailVerificationSection({ user }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleResendVerification = async () => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/resend-verification", { email: user.email });
            toast.success(response.data.message || "Verification email sent! Check your inbox.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send verification email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <IconMail className="w-5 h-5" />
                        <CardTitle>Email Verification</CardTitle>
                    </div>
                    {user?.isVerified ? (
                        <div className="flex items-center gap-2">
                            <IconCircleCheck className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Verified</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <IconCircleX className="h-5 w-5 text-destructive" />
                            <span className="text-sm font-medium text-destructive">Not Verified</span>
                        </div>
                    )}
                </div>
                <CardDescription>
                    {user?.isVerified 
                        ? "Your email address has been verified" 
                        : "Verify your email address to secure your account"}
                </CardDescription>
            </CardHeader>
            {!user?.isVerified && (
                <CardContent>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            We sent a verification email to <span className="font-medium">{user?.email}</span>
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleResendVerification}
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Resend Email"}
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
