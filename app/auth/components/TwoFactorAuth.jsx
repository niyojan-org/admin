"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TOTPVerification from "./TOTP";
import AccountRecovery from "./AccountRecovery";
import PasskeyVerification from "./Passkey";

export default function TwoFactorAuth({ requiresTOTP, requiresPasskey, userId, onBack }) {
    const router = useRouter();
    const [currentMethod, setCurrentMethod] = useState(() => {
        // Priority: Passkey > TOTP
        if (requiresPasskey) return "passkey";
        if (requiresTOTP) return "totp";
        return "totp";
    });
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [showRecovery, setShowRecovery] = useState(false);

    const handleVerificationFailed = () => {
        setFailedAttempts((prev) => prev + 1);
        if (failedAttempts >= 2) {
            setShowRecovery(true);
        }
    };

    const handleSuccess = () => {
        router.push("/events");
    };

    // If showing recovery, show the recovery component
    if (showRecovery) {
        return (
            <AccountRecovery
                userId={userId}
                onSuccess={handleSuccess}
                onBack={() => setShowRecovery(false)}
            />
        );
    }

    // Determine what to show based on current method
    if (currentMethod === "passkey") {
        return (
            <PasskeyVerification
                userId={userId}
                onSuccess={handleSuccess}
                onFailed={handleVerificationFailed}
                onBack={onBack}
                showTOTPSwitch={requiresTOTP}
                onSwitchToTOTP={() => setCurrentMethod("totp")}
            />
        );
    }

    if (currentMethod === "totp") {
        return (
            <TOTPVerification
                userId={userId}
                onSuccess={handleSuccess}
                onFailed={handleVerificationFailed}
                onBack={onBack}
                showPasskeySwitch={requiresPasskey}
                onSwitchToPasskey={() => setCurrentMethod("passkey")}
            />
        );
    }

    return null;
}
