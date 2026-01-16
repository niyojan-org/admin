"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IconArrowLeft, IconFingerprint, IconShieldCheck, IconDeviceMobile, IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import TOTP from "@/assets/svg/TOTP";

export default function TOTPVerification({ userId, onSuccess, onFailed, onBack, showPasskeySwitch, onSwitchToPasskey }) {
    const router = useRouter();
    const { verifyTOTP, loading } = useUserStore();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle Enter key
        if (e.key === "Enter") {
            const otpValue = otp.join("");
            if (otpValue.length === 6 && !loading) {
                handleVerify();
            }
            return;
        }

        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then((text) => {
                const digits = text.replace(/\D/g, "").slice(0, 6).split("");
                const newOtp = [...otp];
                digits.forEach((digit, i) => {
                    if (i < 6) newOtp[i] = digit;
                });
                setOtp(newOtp);

                // Focus the last filled input or next empty one
                const nextIndex = Math.min(digits.length, 5);
                inputRefs.current[nextIndex]?.focus();
            });
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

        const newOtp = [...otp];
        digits.forEach((digit, i) => {
            if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);

        // Focus the last filled input or next empty one
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleVerify = async () => {
        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            toast.error("Please enter the complete 6-digit code");
            return;
        }

        const result = await verifyTOTP(userId, otpValue);

        if (result.success) {
            if (onSuccess) onSuccess();
        } else {
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            if (onFailed) onFailed();
        }
    };



    const isComplete = otp.every((digit) => digit !== "");

    return (
        <div className="h-full bg-linear-to-br from-background via-background to-accent/5 flex items-center justify-center">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center sm:bg-card sm:p-8 sm:border border-border sm:rounded-lg sm:shadow-lg">
                {/* Illustration Side */}
                <div className="hidden lg:flex flex-col items-center justify-center">
                    <TOTP className="w-full h-auto max-w-xl relative" />
                </div>

                {/* OTP Form Side */}
                <div className="flex items-center justify-center">
                    <Card className="w-full max-w-md sm:bg-transparent sm:border-0 sm:shadow-none">
                        <CardHeader className="sm:space-y-3">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit sm:hidden"
                                >
                                    <IconArrowLeft className="size-4" />
                                    Back
                                </button>
                            )}

                            <TOTP className="w-full h-40 mx-auto sm:hidden" />

                            <div className="hidden sm:flex items-center justify-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <IconFingerprint className="size-8 text-primary" />
                                </div>
                            </div>

                            <CardTitle className="text-2xl text-center">
                                Enter Authentication Code
                            </CardTitle>
                            <CardDescription className="text-center">
                                Open your authenticator app and enter the 6-digit code to verify your identity.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* OTP Input Fields */}
                            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-semibold"
                                        aria-label={`Digit ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Verify Button */}
                            <Button
                                onClick={handleVerify}
                                disabled={!isComplete || loading}
                                className="w-full"
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <IconLoader2 className="size-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Code"
                                )}
                            </Button>
                            {/* Security Notice */}
                            <div className="bg-accent/10 border border-border rounded-lg p-4 space-y-2">
                                <p className="text-xs font-medium flex items-center gap-2">
                                    <IconShieldCheck className="size-4 text-primary" />
                                    Security Tip
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Keep your authenticator app secure and never share your TOTP codes with anyone.
                                </p>
                            </div>

                            {/* Switch to Passkey Option */}
                            {showPasskeySwitch && (
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                                    <p className="text-xs font-medium text-center mb-2">
                                        Prefer biometric login?
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onSwitchToPasskey}
                                        className="w-full"
                                    >
                                        <IconFingerprint className="size-4" />
                                        Use Passkey Instead
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
