"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import {
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  XCircle
} from "lucide-react";
import BankDetailsDialog from "./BankDetailsDialog";
import { toast } from "sonner";
import api from "@/lib/api";

const BankDetailsTab = ({ organization, onUpdate }) => {
  const bankDetails = organization.bankDetails || {};
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [requestingVerification, setRequestingVerification] = useState(false);

  const hasBankDetails = bankDetails && bankDetails.accountNumber;

  const handleBankDetailsSubmit = async (data) => {
    try {
      const response = await api.post("/organizations/admin/bank", data);
      if (response.data.success) {
        toast.success("Bank details updated successfully!");
        setShowBankDialog(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update bank details");
      throw error;
    }
  };

  const handleRequestVerification = async () => {
    try {
      setRequestingVerification(true);
      const response = await api.post("/organizations/admin/bank/verification/raise");
      if (response.data.success) {
        toast.success("Bank verification request submitted successfully!");
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request bank verification");
    } finally {
      setRequestingVerification(false);
    }
  };

  const getVerificationStatus = () => {
    if (bankDetails.verified) {
      return {
        label: "Verified",
        variant: "success",
        icon: CheckCircle2,
        color: "text-green-600"
      };
    } else if (bankDetails.rejected) {
      return {
        label: "Rejected",
        variant: "destructive",
        icon: XCircle,
        color: "text-red-600"
      };
    } else if (bankDetails.reqForVerification) {
      return {
        label: "Pending Verification",
        variant: "warning",
        icon: Clock,
        color: "text-yellow-600"
      };
    }
    return {
      label: "Not Verified",
      variant: "secondary",
      icon: AlertCircle,
      color: "text-gray-600"
    };
  };

  const status = getVerificationStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Bank Account Details</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Payment and banking information
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant={hasBankDetails ? "outline" : "default"}
              onClick={() => setShowBankDialog(true)}
            >
              {hasBankDetails ? (
                <>
                  <Edit className="size-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Plus className="size-4 mr-2" />
                  Add Bank Details
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasBankDetails ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No bank details added. Add your bank account to enable paid events.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Verification Status */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`size-5 ${status.color}`} />
                  <span className="font-medium">Verification Status:</span>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              {bankDetails.rejected && bankDetails.rejectionReason && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Rejection Reason:</strong> {bankDetails.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium mb-1">Account Holder Name</p>
                  <p className="text-sm text-muted-foreground">
                    {bankDetails.accountHolderName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Bank Name</p>
                  <p className="text-sm text-muted-foreground">
                    {bankDetails.bankName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Branch Name</p>
                  <p className="text-sm text-muted-foreground">
                    {bankDetails.branchName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Account Number</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {bankDetails.accountNumber ?
                      `****${bankDetails.accountNumber.slice(-4)}` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">IFSC Code</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {bankDetails.ifscCode || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">UPI ID</p>
                  <p className="text-sm text-muted-foreground">
                    {bankDetails.upiId || "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              {!bankDetails.verified && !bankDetails.reqForVerification && (
                <div className="space-y-2">
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription>
                      Your bank details need to be verified before you can create paid events.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleRequestVerification}
                    disabled={requestingVerification}
                    className="w-full sm:w-auto"
                  >
                    {requestingVerification ? (
                      <>
                        <Clock className="size-4 mr-2 animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-4 mr-2" />
                        Request Bank Verification
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1">Razorpay Account ID</p>
                <div>
                  {bankDetails.razorpayAccountId ? (
                    <span className="text-sm text-muted-foreground font-mono">
                      {bankDetails.razorpayAccountId}
                    </span>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        You are not allowed to create paid event
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <Link href="/contact" className="text-primary hover:underline">
                          Please visit our support page
                        </Link>{" "}
                        to set up your payment gateway.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Platform Commission</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Revenue sharing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Platform Share</p>
              <p className="text-sm text-muted-foreground">
                Commission charged per transaction
              </p>
            </div>
            <div className="text-3xl font-bold">{organization.platformShare || 0}%</div>
          </div>
        </CardContent>
      </Card>

      <BankDetailsDialog
        open={showBankDialog}
        onOpenChange={setShowBankDialog}
        onSubmit={handleBankDetailsSubmit}
        initialData={bankDetails}
      />
    </div>
  );
};

export default BankDetailsTab;
