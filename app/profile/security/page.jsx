"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { IconShield, IconDeviceLaptop } from "@tabler/icons-react";
import { SecurityOverview } from "@/app/profile/security/components/SecurityOverview";
import PasswordSection, { getPasswordAge } from "./components/PasswordSection";
import { TwoFactorSection } from "@/app/profile/security/components/TwoFactorSection";
import { PasskeysSection } from "@/app/profile/security/components/PasskeysSection";
import { EmailVerificationSection } from "@/app/profile/security/components/EmailVerificationSection";
import { AccountStatusSection } from "@/app/profile/security/components/AccountStatusSection";
import { SignOutSection } from "@/app/profile/security/components/SignOutSection";
import { DangerZoneSection } from "@/app/profile/security/components/DangerZoneSection";
import api from "@/lib/api";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export default function SecurityPage() {
    const { user } = useUserStore();
    const [securityOverview, setSecurityOverview] = useState({
        lastPasswordChange: "Loading...",
        twoFactorEnabled: false,
        passkeysCount: 0,
    });
    const [showTotpSetup, setShowTotpSetup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState(null);

    // Fetch security overview data
    useEffect(() => {
        const fetchSecurityData = async () => {
            setIsLoading(true);
            try {
                // Fetch 2FA status and passkeys in parallel
                const response = await api.get("/auth/2fa/status");
                const { status } = response.data;
                setStatus(status);
                setSecurityOverview({
                    lastPasswordChange: getPasswordAge(user?.lastPasswordChange),
                    twoFactorEnabled: status.enabled || false,
                    passkeysCount: status?.methods?.passkeys?.count || 0,
                });
            } catch (error) {
                console.error("Failed to fetch security data:", error);
                toast.error("Failed to load security settings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSecurityData();
    }, []);

    const handlePasskeyCountChange = (count) => {
        setSecurityOverview(prev => ({ ...prev, passkeysCount: count }));
    };

    const handleTotpStatusChange = async () => {
        try {
            const response = await api.get("/auth/2fa/status");
            const { status: newStatus } = response.data;
            setStatus(newStatus);
            setSecurityOverview(prev => ({
                ...prev,
                twoFactorEnabled: newStatus.enabled || false
            }));
        } catch (error) {
            console.error("Failed to update 2FA status:", error);
        }
    };

    const handlePasswordChanged = async () => {
        // Update to "Today" after successful password change
        setSecurityOverview(prev => ({
            ...prev,
            lastPasswordChange: "Today"
        }));
    };

    return (
        <div className="h-full px-2 space-y-4 pb-10 w-full">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <IconShield className="w-6 h-6" stroke={1.5} />
                    Security
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account security and monitor activity
                </p>
            </div>

            {/* Security Overview */}
            {isLoading ? (
                <div className="space-y-3 p-6 border rounded-lg w-full">
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            ) : (
                <SecurityOverview securityData={securityOverview} />
            )}

            {/* Password Section */}
            {isLoading ? (
                <div className="space-y-3 p-6 border rounded-lg w-full">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-30 mt-4" />
                </div>
            ) : (
                <PasswordSection onPasswordChanged={handlePasswordChanged} />
            )}

            <Separator />

            {/* Two-Factor Authentication */}
            {isLoading ? (
                <div className="space-y-3 p-6 border rounded-lg w-full">
                    <Skeleton className="h-6 w-50" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-30 mt-4" />
                </div>
            ) : (
                <TwoFactorSection
                    isEnabled={status?.methods?.totp?.enabled || false}
                    showSetup={showTotpSetup}
                    onShowSetupChange={setShowTotpSetup}
                    onStatusChange={handleTotpStatusChange}
                />
            )}

            {/* Passkeys Section */}
            {isLoading ? (
                <div className="space-y-3 p-6 border rounded-lg w-full">
                    <Skeleton className="h-6 w-50" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-30 mt-4" />
                </div>
            ) : (
                <PasskeysSection onCountChange={handlePasskeyCountChange} />
            )}

            <Separator />

            {/* Email Verification */}
            {isLoading ? (
                <div className="space-y-3 p-6 border rounded-lg w-full">
                    <Skeleton className="h-6 w-50" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ) : (
                <EmailVerificationSection user={user} />
            )}

            <Separator />

            {/* Account Status */}
            {isLoading ? (
                <div className="space-y-3 p-6 border rounded-lg w-full">
                    <Skeleton className="h-6 w-50" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2 mt-4">
                        <Skeleton className="h-6 w-30" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                </div>
            ) : (
                <AccountStatusSection user={user} />
            )}

            <Separator />

            {/* Sign Out */}
            <SignOutSection />

            <Separator />

            {/* Danger Zone */}
            <DangerZoneSection user={user} />
        </div>
    );
}