"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BankDetailsTab = ({ organization }) => {
  const bankDetails = organization.bankDetails || {};

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Bank Account Details</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Payment and banking information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-1">Account Holder Name</p>
              <p className="text-sm text-muted-foreground">{bankDetails.accountHolderName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Bank Name</p>
              <p className="text-sm text-muted-foreground">{bankDetails.bankName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Branch Name</p>
              <p className="text-sm text-muted-foreground">{bankDetails.branchName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Account Number</p>
              <p className="text-sm text-muted-foreground font-mono">{bankDetails.accountNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">IFSC Code</p>
              <p className="text-sm text-muted-foreground font-mono">{bankDetails.ifscCode || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">UPI ID</p>
              <p className="text-sm text-muted-foreground">{bankDetails.upiId || "N/A"}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-1">Razorpay Account ID</p>
            <p className="text-sm text-muted-foreground font-mono">{bankDetails.razorpayAccountId || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Platform Commission</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Revenue sharing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Platform Share</p>
              <p className="text-sm text-muted-foreground">Commission charged per transaction</p>
            </div>
            <div className="text-3xl font-bold">{organization.platformShare || 0}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankDetailsTab;
