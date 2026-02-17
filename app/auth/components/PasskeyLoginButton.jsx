"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { isPasskeySupported, isPlatformAuthenticatorAvailable } from "@/lib/passkey";

export default function PasskeyLoginButton({ className = "", onBeforeLogin }) {
  const router = useRouter();
  const { loginWithPasskey, loading } = useUserStore();
  const [isSupported, setIsSupported] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check if passkeys are supported and available
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

  const handlePasskeyLogin = async () => {
    // Abort any ongoing conditional passkey request before starting a new one
    if (onBeforeLogin) {
      onBeforeLogin();
    }

    // Use modal/prompt passkey login (NOT conditional UI)
    // This shows a browser prompt for passkey selection
    const success = await loginWithPasskey(false);
    
    if (success) {
      router.push("/events");
    }
  };

  // Don't render the button if passkeys are not supported
  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePasskeyLogin}
      disabled={loading || !isAvailable}
      className={`w-full ${className}`}
      title={!isAvailable ? "No passkey authenticator available" : "Login with passkey"}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Authenticating...
        </span>
      ) : (
        <>
          <Fingerprint className="h-5 w-5 mr-2" />
          Login with Passkey
        </>
      )}
    </Button>
  );
}
