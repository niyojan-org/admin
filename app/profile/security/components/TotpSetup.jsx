"use client";

import { useState, useEffect } from "react";
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
import { IconKey, IconCopy, IconCheck, IconLoader2, IconCircleCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { BackupCodesDialog } from "./BackupCodesDialog";

export function TotpSetup({ open, onOpenChange, onSuccess, isEnabled }) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUri, setQrCodeDataUri] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Fetch QR code when dialog opens and 2FA is not enabled
  useEffect(() => {
    const setupTotp = async () => {
      if (open && !isEnabled && !qrCodeDataUri) {
        setIsLoading(true);
        try {
          const response = await api.post("/auth/totp/setup");
          const { qrCode, secret } = response.data.data;
          setQrCodeDataUri(qrCode);
          setManualCode(secret);
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to setup 2FA");
          onOpenChange(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    setupTotp();
  }, [open, isEnabled, qrCodeDataUri, onOpenChange]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(manualCode);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return; // Only allow digits

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setVerificationCode(newCode);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`code-${lastIndex}`)?.focus();
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");

    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await api.post("/auth/totp/verify-setup", {
        token: code
      });

      // Check if backup codes were returned
      if (response.data.backupCodes && response.data.backupCodes.length > 0) {
        setBackupCodes(response.data.backupCodes);
        setShowBackupCodes(true);
      } else {
        toast.success(response.data.message || "2FA enabled successfully!");
        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code. Please try again.");
      setVerificationCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackupCodesConfirmed = () => {
    setShowBackupCodes(false);
    toast.success("2FA enabled successfully!");
    onSuccess?.();
    handleClose();
  };

  const handleClose = () => {
    setVerificationCode(["", "", "", "", "", ""]);
    setQrCodeDataUri("");
    setManualCode("");
    setCopied(false);
    setBackupCodes([]);
    setShowBackupCodes(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange(isOpen);
      }}
      >
        <DialogContent className="max-w-[90vw] sm:max-w-2xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconKey className="w-5 h-5" stroke={1.5} />
              {isEnabled ? "Two-Factor Authentication Status" : "Enable Two-Factor Authentication"}
            </DialogTitle>
            <DialogDescription>
              {isEnabled
                ? "Two-factor authentication is currently enabled on your account"
                : "Scan the QR code and enter the verification code from your authenticator app"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isEnabled ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconCircleCheck className="w-8 h-8 text-primary" stroke={1.5} />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium">2FA is Active</p>
                    <p className="text-sm text-muted-foreground">
                      Your account is protected with two-factor authentication
                    </p>
                  </div>
                </div>
                <Button onClick={() => onOpenChange(false)} className="w-full">
                  Close
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <IconLoader2 className="h-8 w-8 animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Setting up 2FA...</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side - QR Code Section */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Step 1: Scan QR Code</h3>
                    <p className="text-xs text-muted-foreground">
                      Use your authenticator app to scan this code
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 border-2 border-border rounded-lg flex items-center justify-center bg-background">
                      {qrCodeDataUri ? (
                        <img src={qrCodeDataUri} alt="QR Code" className="w-full h-full p-2" />
                      ) : (
                        <p className="text-sm text-muted-foreground">Loading QR code...</p>
                      )}
                    </div>
                  </div>

                  {/* Manual Code */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Can't scan? Enter this code manually:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={manualCode}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyCode}
                        className="shrink-0"
                      >
                        {copied ? (
                          <IconCheck className="w-4 h-4" stroke={1.5} />
                        ) : (
                          <IconCopy className="w-4 h-4" stroke={1.5} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Verification Code Section */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Step 2: Verify Code</h3>
                    <p className="text-xs text-muted-foreground">
                      Enter the 6-digit code from your app
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-sm font-medium">Verification code:</Label>
                    <div className="flex gap-2 justify-center">
                      {verificationCode.map((digit, index) => (
                        <Input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className="w-12 h-12 text-center text-lg font-semibold"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      This code changes every 30 seconds
                    </p>

                    <Button
                      onClick={handleVerify}
                      disabled={verificationCode.some((d) => !d) || isVerifying}
                      className="w-full"
                    >
                      {isVerifying ? (
                        <>
                          <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Enable 2FA"
                      )}
                    </Button>
                  </div>
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
