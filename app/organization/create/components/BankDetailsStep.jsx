"use client";

import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useOrganizationCreationStore } from "@/store/organizationCreationStore";
import { Landmark, User, Building, GitBranch, CreditCard, Hash, Smartphone } from "lucide-react";

export default function BankDetailsStep() {
  const {
    organizationDraft,
    updateNestedField,
    stepErrors,
    setStepErrors,
    clearStepErrors,
  } = useOrganizationCreationStore();

  const errors = stepErrors[6] || {};
  const bankDetails = organizationDraft.bankDetails;

  // Check if any bank detail is filled
  const hasBankDetails = Object.values(bankDetails).some(
    (value) => value && value.trim()
  );

  // Validate fields - only validate if user starts filling
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };

    // Only validate if there's any value in bank details
    const allValues = { ...bankDetails, [field]: value };
    const hasAnyValue = Object.values(allValues).some((v) => v && v.trim());

    if (!hasAnyValue) {
      clearStepErrors(6);
      return;
    }

    // If user starts filling, validate required fields
    switch (field) {
      case "accountNumber":
        if (value && !/^\d{8,18}$/.test(value)) {
          newErrors.accountNumber = "Account number should be 8-18 digits";
        } else {
          delete newErrors.accountNumber;
        }
        break;
      case "ifscCode":
        if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) {
          newErrors.ifscCode = "Please enter a valid IFSC code (e.g., SBIN0001234)";
        } else {
          delete newErrors.ifscCode;
        }
        break;
      case "upiId":
        if (value && !/^[\w.-]+@[\w.-]+$/.test(value)) {
          newErrors.upiId = "Please enter a valid UPI ID (e.g., name@upi)";
        } else {
          delete newErrors.upiId;
        }
        break;
      default:
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setStepErrors(6, newErrors);
    } else {
      clearStepErrors(6);
    }
  }, [errors, bankDetails, setStepErrors, clearStepErrors]);

  const handleChange = (field, value) => {
    updateNestedField("bankDetails", field, value);
    validateField(field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="size-5" />
          Bank Details
          <Badge variant="secondary" className="ml-2">Optional</Badge>
        </CardTitle>
        <CardDescription>
          Add your organization&apos;s bank details for receiving payments. This section is entirely optional and can be added later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Holder Name */}
        <div className="space-y-2">
          <Label htmlFor="accountHolderName" className="flex items-center gap-1">
            <User className="size-4" />
            Account Holder Name
          </Label>
          <Input
            id="accountHolderName"
            placeholder="Enter account holder name"
            value={bankDetails.accountHolderName}
            onChange={(e) => handleChange("accountHolderName", e.target.value)}
          />
        </div>

        {/* Bank Name and Branch - Two columns */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName" className="flex items-center gap-1">
              <Building className="size-4" />
              Bank Name
            </Label>
            <Input
              id="bankName"
              placeholder="Enter bank name"
              value={bankDetails.bankName}
              onChange={(e) => handleChange("bankName", e.target.value)}
            />
          </div>

          {/* Branch Name */}
          <div className="space-y-2">
            <Label htmlFor="branchName" className="flex items-center gap-1">
              <GitBranch className="size-4" />
              Branch Name
            </Label>
            <Input
              id="branchName"
              placeholder="Enter branch name"
              value={bankDetails.branchName}
              onChange={(e) => handleChange("branchName", e.target.value)}
            />
          </div>
        </div>

        {/* Account Number and IFSC - Two columns */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="flex items-center gap-1">
              <CreditCard className="size-4" />
              Account Number
            </Label>
            <Input
              id="accountNumber"
              placeholder="Enter account number"
              value={bankDetails.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              aria-invalid={!!errors.accountNumber}
            />
            {errors.accountNumber && (
              <p className="text-sm text-destructive">{errors.accountNumber}</p>
            )}
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <Label htmlFor="ifscCode" className="flex items-center gap-1">
              <Hash className="size-4" />
              IFSC Code
            </Label>
            <Input
              id="ifscCode"
              placeholder="SBIN0001234"
              value={bankDetails.ifscCode}
              onChange={(e) => handleChange("ifscCode", e.target.value.toUpperCase())}
              aria-invalid={!!errors.ifscCode}
            />
            {errors.ifscCode && (
              <p className="text-sm text-destructive">{errors.ifscCode}</p>
            )}
          </div>
        </div>

        {/* UPI ID */}
        <div className="space-y-2">
          <Label htmlFor="upiId" className="flex items-center gap-1">
            <Smartphone className="size-4" />
            UPI ID
          </Label>
          <Input
            id="upiId"
            placeholder="yourname@paytm"
            value={bankDetails.upiId}
            onChange={(e) => handleChange("upiId", e.target.value)}
            aria-invalid={!!errors.upiId}
          />
          {errors.upiId && (
            <p className="text-sm text-destructive">{errors.upiId}</p>
          )}
        </div>

        {/* Info card */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Bank details are optional and will be verified by our team before any payouts are processed. You can add or update these details later from your organization settings.
          </p>
        </div>

        {hasBankDetails && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-primary">
              Bank details will be submitted for verification. Verification typically takes 2-3 business days.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
