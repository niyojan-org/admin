"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconAlertTriangle,
  IconDownload,
  IconCopy,
  IconCheck,
  IconShieldLock,
} from "@tabler/icons-react";
import { toast } from "sonner";

export function BackupCodesDialog({ open, onOpenChange, backupCodes, onConfirm }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = () => {
    const codesText = backupCodes.join("\n");
    navigator.clipboard.writeText(codesText);
    setCopied(true);
    toast.success("Backup codes copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const codesText = `BACKUP CODES - SAVE THESE SECURELY
Generated: ${new Date().toLocaleString()}

These codes can be used to access your account if you lose access to your authentication method.
Each code can only be used once.

IMPORTANT: You will NOT be able to see these codes again!

Backup Codes:
${backupCodes.map((code, i) => `${i + 1}. ${code}`).join("\n")}

Store these codes in a secure location such as a password manager.`;

    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    toast.success("Backup codes downloaded");
  };

  const handleConfirm = () => {
    if (!downloaded && !copied) {
      toast.error("Please download or copy your backup codes before continuing");
      return;
    }
    onConfirm?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShieldLock className="w-5 h-5" stroke={1.5} />
            Save Your Backup Codes
          </DialogTitle>
          <DialogDescription>
            Store these codes safely - you won't see them again
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Warning Alert */}
          <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-md flex gap-3">
            <IconAlertTriangle className="w-5 h-5 shrink-0 text-destructive mt-0.5" stroke={1.5} />
            <div className="space-y-1">
              <p className="font-semibold text-sm">Critical: Save These Codes Now</p>
              <p className="text-xs text-muted-foreground">
                These backup codes allow you to access your account if you lose your authentication device.
                You will NOT be able to view them again after closing this dialog.
              </p>
            </div>
          </div>

          {/* Backup Codes Grid */}
          <div className="p-4 border border-border rounded-md bg-muted/50">
            <div className="grid grid-cols-2 gap-3">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-background border border-border rounded font-mono text-sm"
                >
                  <span className="text-muted-foreground text-xs">{index + 1}.</span>
                  <span className="font-semibold tracking-wider">{code}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleDownload}
            >
              {downloaded ? (
                <>
                  <IconCheck className="w-4 h-4" stroke={1.5} />
                  Downloaded
                </>
              ) : (
                <>
                  <IconDownload className="w-4 h-4" stroke={1.5} />
                  Download
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <IconCheck className="w-4 h-4" stroke={1.5} />
                  Copied
                </>
              ) : (
                <>
                  <IconCopy className="w-4 h-4" stroke={1.5} />
                  Copy All
                </>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-2 p-3 border border-border/50 rounded-md bg-background">
            <p className="text-sm font-medium">How to use backup codes:</p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Each code can only be used once</li>
              <li>Use them when you can't access your normal authentication method</li>
              <li>Store them in a password manager or safe place</li>
              <li>Never share these codes with anyone</li>
            </ul>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={!downloaded && !copied}
          >
            I've Saved My Backup Codes
          </Button>

          {!downloaded && !copied && (
            <p className="text-xs text-center text-muted-foreground">
              Please download or copy your codes to continue
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
