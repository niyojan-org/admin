"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconFingerprint,
  IconKey,
  IconShieldCheck,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Passkey from "@/assets/svg/Passkey";
import api from "@/lib/api";
import { startRegistration } from "@simplewebauthn/browser";
import { BackupCodesDialog } from "./BackupCodesDialog";

export function PasskeyRegister({ open, onOpenChange, onSuccess }) {
  const [step, setStep] = useState(1);
  const [passkeyName, setPasskeyName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const handleRegister = async () => {
    if (!passkeyName.trim()) {
      toast.error("Please enter a name for your passkey");
      return;
    }

    setIsRegistering(true);
    setStep(2);

    try {
      // Step 1: Get registration options from server
      const optionsResponse = await api.post("/auth/passkeys/register/options");
      const { options } = optionsResponse.data;

      if (!options) {
        throw new Error("Invalid response from server: missing options");
      }

      // Step 2: Start registration with browser WebAuthn API
      const registrationResponse = await startRegistration({
        optionsJSON: options
      });

      // Step 3: Verify registration with server (include name in this request)
      const verifyResponse = await api.post("/auth/passkeys/register/verify", {
        credential: registrationResponse,
        name: passkeyName.trim() || "Unnamed Device"
      });

      setStep(3);

      // Check if backup codes were returned
      if (verifyResponse.data.backupCodes && verifyResponse.data.backupCodes.length > 0) {
        setBackupCodes(verifyResponse.data.backupCodes);
        setTimeout(() => {
          setShowBackupCodes(true);
        }, 1500);
      } else {
        setTimeout(() => {
          toast.success(verifyResponse.data.message || "Passkey registered successfully!");
          onSuccess?.();
          handleClose();
        }, 1500);
      }

    } catch (error) {
      setStep(1);

      if (error.name === "NotAllowedError" || error.message?.includes("not allowed")) {
        toast.error("Registration was cancelled. Please try again and complete the authentication prompt.");
      } else if (error.name === "InvalidStateError") {
        toast.error("This passkey is already registered.");
      } else if (error.message?.includes("timed out") || error.message?.includes("timeout")) {
        toast.error("Registration timed out. Please try again and complete the prompt within 2 minutes.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to register passkey. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleBackupCodesConfirmed = () => {
    setShowBackupCodes(false);
    toast.success("Passkey registered successfully!");
    onSuccess?.();
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setPasskeyName("");
    setIsRegistering(false);
    setBackupCodes([]);
    setShowBackupCodes(false);
    onOpenChange(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconKey className="w-5 h-5" stroke={1.5} />
            {step === 1 ? "Register New Passkey" : step === 2 ? "Authenticating..." : "Passkey Registered"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Create a passkey for passwordless sign-in"
              : step === 2
                ? "Follow the prompt on your device"
                : "You're all set! Your passkey has been registered"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <>
              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-border rounded-md">
                  <IconShieldCheck className="w-5 h-5 shrink-0 mt-0.5" stroke={1.5} />
                  <div>
                    <p className="text-sm font-medium">More Secure</p>
                    <p className="text-xs text-muted-foreground">
                      Passkeys are resistant to phishing and more secure than passwords
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-border rounded-md">
                  <IconFingerprint className="w-5 h-5 shrink-0 mt-0.5" stroke={1.5} />
                  <div>
                    <p className="text-sm font-medium">Faster Sign-In</p>
                    <p className="text-xs text-muted-foreground">
                      Use biometrics or PIN to sign in instantly
                    </p>
                  </div>
                </div>
              </div>

              {/* Passkey Name Input */}
              <div className="space-y-2">
                <Label htmlFor="passkey-name" className="text-sm font-medium">
                  Name this passkey
                </Label>
                <Input
                  id="passkey-name"
                  placeholder="e.g., MacBook Pro, iPhone 15"
                  value={passkeyName}
                  onChange={(e) => setPasskeyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
                <p className="text-xs text-muted-foreground">
                  Choose a name to help you identify this device
                </p>
              </div>

              <Button onClick={handleRegister} className="w-full" disabled={!passkeyName.trim()}>
                Create Passkey
              </Button>
            </>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center animate-pulse">
                  <IconFingerprint className="w-12 h-12" stroke={1.5} />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium">Authenticating...</p>
                <p className="text-sm text-muted-foreground">
                  Follow the prompt on your device to complete registration
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="w-24 h-24 rounded-full border-4 border-border flex items-center justify-center">
                <IconCheck className="w-12 h-12" stroke={1.5} />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium">Success!</p>
                <p className="text-sm text-muted-foreground">
                  Your passkey "{passkeyName}" has been registered
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Backup Codes Dialog */}
    <BackupCodesDialog
      open={showBackupCodes}
      onOpenChange={setShowBackupCodes}
      backupCodes={backupCodes}
      onConfirm={handleBackupCodesConfirmed}
    />
    </>
  );
}
