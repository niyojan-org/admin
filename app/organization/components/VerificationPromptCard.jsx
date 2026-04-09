"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    IconShieldCheck,
    IconSparkles,
    IconTrendingUp,
    IconUsers,
    IconInfoCircle,
    IconAlertCircle,
    IconBadge,
} from "@tabler/icons-react";

const VerificationPromptCard = ({ organization }) => {
    const router = useRouter();
    const isVerified = organization?.verified === true;
    const isRequestPending = organization?.reqForVerification === true;

    // Don't show if already verified
    if (isVerified) {
        return null;
    }

    const benefits = [
        {
            icon: IconBadge,
            title: "Trust Badge",
            description: "Display a verified badge on all your events",
        },
        {
            icon: IconTrendingUp,
            title: "Higher Visibility",
            description: "Verified organizations rank higher in search results",
        },
        {
            icon: IconUsers,
            title: "Build Credibility",
            description: "Increase attendee confidence and registration rates",
        },
        {
            icon: IconSparkles,
            title: "Premium Features",
            description: "Access to advanced analytics and priority support",
        },
    ];

    const handleVerifyClick = () => {
        router.push("/organization/verify");
    };

    if (isRequestPending) {
        return (
            <Alert className="border-primary/50 bg-primary/5">
                <IconInfoCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Verification Request Pending</AlertTitle>
                <AlertDescription>
                    Your verification request is under review. We&apos;ll notify you once it&apos;s processed.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 via-background to-background relative overflow-hidden">
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10">
                            <IconShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div >
                            <div>
                                <CardTitle className="text-2xl">Verify Your Organization</CardTitle>
                                <CardDescription className="text-base mt-1">
                                    Get verified to unlock premium features and build trust
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Benefits Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className="flex gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                            >
                                <div className="shrink-0 mt-0.5">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-semibold">{benefit.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <IconAlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <p>
                            Verification helps attendees trust your events and improves your organization&apos;s reputation.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        onClick={handleVerifyClick}
                        className="w-full sm:w-auto shrink-0"
                    >
                        <IconShieldCheck className="h-4 w-4" />
                        Start Verification
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default VerificationPromptCard;
