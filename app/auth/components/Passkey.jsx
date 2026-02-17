"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PasskeyIllustration from "@/assets/svg/Passkey";
import { IconArrowLeft, IconFingerprint, IconShieldCheck, IconKey } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { isPasskeySupported, isPlatformAuthenticatorAvailable } from "@/lib/passkey";

// const abortConditionalPasskey = () => {
//     if (passkeyAbortControllerRef.current) {
//         passkeyAbortControllerRef.current.abort();
//         passkeyAbortControllerRef.current = null;
//         passkeyStartedRef.current = false;
//     }
// };

export default function PasskeyVerification({ userId, onSuccess, onFailed, onBack, showTOTPSwitch, onSwitchToTOTP }) {
    const { loginWithPasskey, loading } = useUserStore();
    const [isSupported, setIsSupported] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        const checkSupport = async () => {
            const supported = isPasskeySupported();
            setIsSupported(supported);

            if (supported) {
                const available = await isPlatformAuthenticatorAvailable();
                setIsAvailable(available);
            }
        };

        checkSupport();
    }, []);

    const handlePasskeyAuth = async () => {
        if (!isSupported) {
            toast.error("Passkeys are not supported on this device");
            return;
        }

        if (!isAvailable) {
            toast.error("No passkey authenticator available on this device");
            return;
        }

        setIsAuthenticating(true);

        try {
            // Use modal/prompt passkey login
            const success = await loginWithPasskey(false);

            if (success) {
                toast.success("Authentication successful!");
                if (onSuccess) onSuccess();
            } else {
                toast.error("Authentication failed. Please try again.");
                if (onFailed) onFailed();
            }
        } catch (error) {
            toast.error("Authentication failed. Please try again.");
            if (onFailed) onFailed();
        } finally {
            setIsAuthenticating(false);
        }
    };

    if (!isSupported) {
        return (
            <div className="h-full bg-linear-to-br from-background via-background to-accent/5 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-3">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                            >
                                <IconArrowLeft className="size-4" />
                                Back
                            </button>
                        )}

                        <div className="flex items-center justify-center">
                            <div className="bg-destructive/10 p-4 rounded-full">
                                <IconShieldCheck className="size-8 text-destructive" />
                            </div>
                        </div>

                        <CardTitle className="text-2xl text-center">
                            Passkeys Not Supported
                        </CardTitle>
                        <CardDescription className="text-center">
                            Your device or browser doesn't support passkey authentication. Please use a different authentication method.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-full bg-linear-to-br from-background via-background to-accent/5 flex items-center justify-center">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center sm:bg-card sm:p-8 sm:border border-border sm:rounded-lg sm:shadow-lg">
                {/* Illustration Side */}
                <div className="hidden lg:flex flex-col items-center justify-center">
                    <PasskeyIllustration className="w-full h-auto max-w-xl relative" />
                </div>

                {/* Passkey Auth Form Side */}
                <div className="flex items-center justify-center">
                    <Card className="w-full max-w-md sm:bg-transparent sm:border-0 sm:shadow-none">
                        <CardHeader className="sm:space-y-3">
                            <PasskeyIllustration className="w-full h-40 mx-auto sm:hidden" />

                            <div className="hidden sm:flex items-center justify-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <IconFingerprint className="size-8 text-primary" />
                                </div>
                            </div>

                            <CardTitle className="text-2xl text-center">
                                Sign in with Passkey
                            </CardTitle>
                            <CardDescription className="text-center">
                                Use your device's biometric authentication or security key to sign in securely.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Passkey Authentication Button */}
                            <div className="space-y-4">
                                <Button
                                    onClick={handlePasskeyAuth}
                                    disabled={!isAvailable || isAuthenticating || loading}
                                    className="w-full"
                                    size="lg"
                                >
                                    <IconKey className="size-5" />
                                    {isAuthenticating || loading ? "Authenticating..." : "Authenticate with Passkey"}
                                </Button>

                                {!isAvailable && (
                                    <p className="text-xs text-destructive text-center">
                                        No passkey authenticator detected on this device
                                    </p>
                                )}
                            </div>

                            {/* How it Works */}
                            <div className="bg-accent/10 border border-border rounded-lg p-4 space-y-3 hidden">
                                <p className="text-xs font-medium flex items-center gap-2">
                                    <IconShieldCheck className="size-4 text-primary" />
                                    How Passkeys Work
                                </p>
                                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                                    <li>Use your fingerprint, face ID, or device PIN</li>
                                    <li>More secure than passwords - no phishing risk</li>
                                    <li>Works across all your devices seamlessly</li>
                                    <li>Encrypted and stored securely on your device</li>
                                </ul>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                                <p className="text-xs font-medium flex items-center gap-2">
                                    <IconShieldCheck className="size-4 text-primary" />
                                    Security Notice
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Your biometric data never leaves your device. Passkey authentication uses industry-standard cryptographic protocols.
                                </p>
                            </div>

                            {/* Switch to TOTP Option */}
                            {showTOTPSwitch && (
                                <div className="bg-accent/10 border border-border rounded-lg p-4 space-y-2">
                                    <p className="text-xs font-medium text-center mb-2">
                                        Having trouble with passkey?
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onSwitchToTOTP}
                                        className="w-full"
                                    >
                                        <IconKey className="size-4" />
                                        Use Authenticator App
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
