"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconDeviceMobile, IconCircleCheck, IconAlertTriangle } from "@tabler/icons-react";
import { TotpSetup } from "./TotpSetup";
import { toast } from "sonner";
import api from "@/lib/api";

export function TwoFactorSection({ isEnabled, onStatusChange, showSetup, onShowSetupChange }) {
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  const handleManageClick = () => {
    if (isEnabled) {
      setShowDisableDialog(true);
    } else {
      onShowSetupChange(true);
    }
  };

  const handleDisable = async () => {
    setIsDisabling(true);
    try {
      await api.post("/auth/totp/disable");
      toast.success("Two-factor authentication disabled successfully");
      setShowDisableDialog(false);
      onStatusChange?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <IconDeviceMobile className="w-5 h-5" stroke={1.5} />
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add an extra layer of security to your account
          </p>
        </div>
        <div className="flex items-center justify-between p-4 border border-border rounded-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
              <IconCircleCheck className="w-5 h-5" stroke={1.5} />
            </div>
            <div>
              <p className="font-medium text-sm">Authenticator App</p>
              <p className="text-xs text-muted-foreground">
                {isEnabled ? "Currently active" : "Not configured"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShowSetupChange(true)}
              >
                View Setup
              </Button>
            )}
            <Button
              variant={isEnabled ? "destructive" : "default"}
              size="sm"
              onClick={handleManageClick}
            >
              {isEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </div>

      <TotpSetup 
        open={showSetup} 
        onOpenChange={onShowSetupChange}
        onSuccess={onStatusChange}
        isEnabled={isEnabled}
      />

      {/* Disable TOTP Confirmation Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <IconAlertTriangle className="w-5 h-5" stroke={1.5} />
              Disable Two-Factor Authentication?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove two-factor authentication from your account. You'll only need
              your password to sign in. Your backup codes will be deleted if you have no passkeys
              registered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDisabling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              disabled={isDisabling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDisabling ? "Disabling..." : "Disable 2FA"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
