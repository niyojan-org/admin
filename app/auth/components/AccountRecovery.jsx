"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IconArrowLeft, IconShieldCheck, IconKey, IconMail, IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

export default function AccountRecovery({ userId, onSuccess, onBack }) {
    const router = useRouter();
    const { verifyBackupCode, loading } = useUserStore();
    const [backupCode, setBackupCode] = useState(["", "", "", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [showContactOption, setShowContactOption] = useState(false);
    const inputRefs = useRef([]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Only allow alphanumeric characters
        if (value && !/^[a-zA-Z0-9]$/.test(value)) return;

        const newCode = [...backupCode];
        newCode[index] = value.toUpperCase();
        setBackupCode(newCode);

        // Auto-focus next input
        if (value && index < 7) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle Enter key
        if (e.key === "Enter") {
            const codeValue = backupCode.join("");
            if (codeValue.length === 8 && !isLoading) {
                handleVerify();
            }
            return;
        }

        // Handle backspace
        if (e.key === "Backspace" && !backupCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then((text) => {
                const chars = text.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).split("");
                const newCode = [...backupCode];
                chars.forEach((char, i) => {
                    if (i < 8) newCode[i] = char.toUpperCase();
                });
                setBackupCode(newCode);

                // Focus the last filled input or next empty one
                const nextIndex = Math.min(chars.length, 7);
                inputRefs.current[nextIndex]?.focus();
            });
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const chars = pastedData.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).split("");

        const newCode = [...backupCode];
        chars.forEach((char, i) => {
            if (i < 8) newCode[i] = char.toUpperCase();
        });
        setBackupCode(newCode);

        // Focus the last filled input or next empty one
        const nextIndex = Math.min(chars.length, 7);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleVerify = async () => {
        const codeValue = backupCode.join("");

        if (codeValue.length !== 8) {
            toast.error("Please enter the complete 8-character backup code");
            return;
        }

        const result = await verifyBackupCode(userId, codeValue);

        if (result.success) {
            if (onSuccess) onSuccess();
        } else {
            setBackupCode(["", "", "", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            setShowContactOption(true);
        }
    };

    const isComplete = backupCode.every((char) => char !== "");

    return (
        <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-md">
                <Card className="w-full p-2 sm:p-4 px-0 gap-2 sm:gap-4">
                    <CardHeader className="space-y-2 sm:space-y-3 pb-4">
                        <div className="flex items-center justify-center">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <IconKey className="size-6 sm:size-8 text-primary" />
                            </div>
                        </div>

                        <CardTitle className="text-xl sm:text-2xl text-center">
                            Account Recovery
                        </CardTitle>
                        <CardDescription className="text-center text-xs sm:text-sm">
                            Enter your 8-character backup recovery code to regain access to your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 sm:space-y-6">
                        {/* Backup Code Input Fields */}
                        <div className="flex gap-1.5 sm:gap-2 justify-center" onPaste={handlePaste}>
                            {backupCode.map((char, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="text"
                                    maxLength={1}
                                    value={char}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-9 h-11 sm:w-11 sm:h-14 text-center text-base sm:text-xl font-semibold uppercase"
                                    aria-label={`Character ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <Button
                            onClick={handleVerify}
                            disabled={!isComplete || loading}
                            className="w-full"
                            size="default"
                        >
                            {loading ? (
                                <>
                                    <IconKey className="size-4 animate-pulse" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Backup Code"
                            )}
                        </Button>

                        {/* Backup Code Info */}
                        <div className="bg-accent/10 border border-border rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                            <p className="text-xs font-medium flex items-center gap-2">
                                <IconShieldCheck className="size-4 text-primary" />
                                About Backup Codes
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Backup codes are provided when you set up two-factor authentication. Each code can only be used once. Keep them in a safe place.
                            </p>
                        </div>

                        {/* Contact Support Option - Show when verification fails */}
                        {showContactOption && (
                            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <IconAlertCircle className="size-4 sm:size-5 text-destructive mt-0.5 shrink-0" />
                                    <div className="space-y-1.5 sm:space-y-2 flex-1">
                                        <p className="text-sm font-medium text-destructive">
                                            Still Having Trouble?
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            If you've lost access to your backup codes and authentication methods, our support team can help you recover your account.
                                        </p>
                                        <Link href="/contact">
                                            <Button variant="outline" size="sm" className="w-full mt-2">
                                                <IconMail className="size-4" />
                                                Contact Support
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Warning */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                            <p className="text-xs font-medium flex items-center gap-2">
                                <IconShieldCheck className="size-4 text-primary" />
                                Security Reminder
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Never share your backup codes with anyone. Store them securely offline and generate new ones after use.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
