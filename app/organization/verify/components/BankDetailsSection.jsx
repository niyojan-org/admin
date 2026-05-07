"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { IconCoin, IconCheck, IconClock } from "@tabler/icons-react";

export function BankDetailsSection({ bankDetails, allowsPaidEvents }) {
  if (!bankDetails) {
    return <p className="text-muted-foreground text-sm">Payment details not available</p>;
  }

  if (allowsPaidEvents === false) {
    return (
      <Alert className="border-primary/50">
        <IconCoin className="h-5 w-5 text-primary" />
        <AlertDescription className="ml-2">
          <p className="font-semibold">Free Events Only</p>
          <p className="text-sm mt-1 text-muted-foreground">
            This organization is set up for free events only
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
        <Badge variant={bankDetails.verified ? "default" : "secondary"}>
          {bankDetails.verified ? (
            <>
              <IconCheck className="w-3 h-3 mr-1" /> Verified
            </>
          ) : (
            <>
              <IconClock className="w-3 h-3 mr-1" /> Pending
            </>
          )}
        </Badge>
      </div>

      <div className="grid gap-4">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">Account Holder</p>
          <p className="font-medium">{bankDetails.accountHolderName}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
            <p className="font-medium text-sm">{bankDetails.bankName}</p>
          </div>
          {bankDetails.branchName && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Branch</p>
              <p className="font-medium text-sm">{bankDetails.branchName}</p>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Account Number</p>
            <p className="font-medium font-mono text-sm">
              ****{bankDetails.accountNumber?.slice(-4)}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
            <p className="font-medium font-mono text-sm">{bankDetails.ifscCode}</p>
          </div>
        </div>

        {bankDetails.upiId && (
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">UPI ID</p>
            <p className="font-medium font-mono text-sm">{bankDetails.upiId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
