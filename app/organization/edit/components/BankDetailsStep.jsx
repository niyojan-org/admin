"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconLoader2, IconCreditCard, IconInfoCircle, IconEye, IconEyeOff } from "@tabler/icons-react";

export default function BankDetailsStep({ orgData, onSave, saving }) {
  const [formData, setFormData] = useState({
    accountHolderName: orgData?.bankDetails?.accountHolderName || "",
    bankName: orgData?.bankDetails?.bankName || "",
    branchName: orgData?.bankDetails?.branchName || "",
    accountNumber: orgData?.bankDetails?.accountNumber || "",
    ifscCode: orgData?.bankDetails?.ifscCode || "",
    upiId: orgData?.bankDetails?.upiId || "",
  });

  const [errors, setErrors] = useState({});
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountHolderName?.trim()) {
      newErrors.accountHolderName = "Account holder name is required";
    }
    if (!formData.bankName?.trim()) {
      newErrors.bankName = "Bank name is required";
    }
    if (!formData.accountNumber?.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Please enter a valid account number";
    }
    if (!formData.ifscCode?.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = "Please enter a valid IFSC code";
    }
    
    if (formData.upiId && !/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
      newErrors.upiId = "Please enter a valid UPI ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ bankDetails: formData });
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Bank details are required for receiving payments from paid events. 
          All information is encrypted and stored securely.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name *</Label>
            <Input
              id="accountHolderName"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Enter account holder name"
              className={errors.accountHolderName ? "border-red-500" : ""}
            />
            {errors.accountHolderName && (
              <p className="text-sm text-red-500">{errors.accountHolderName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                className={errors.bankName ? "border-red-500" : ""}
              />
              {errors.bankName && (
                <p className="text-sm text-red-500">{errors.bankName}</p>
              )}
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                placeholder="Enter branch name"
                className={errors.branchName ? "border-red-500" : ""}
              />
              {errors.branchName && (
                <p className="text-sm text-red-500">{errors.branchName}</p>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <div className="relative">
              <Input
                id="accountNumber"
                name="accountNumber"
                type={showAccountNumber ? "text" : "password"}
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className={`pr-10 ${errors.accountNumber ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowAccountNumber(!showAccountNumber)}
              >
                {showAccountNumber ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.accountNumber && (
              <p className="text-sm text-red-500">{errors.accountNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IFSC Code */}
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code *</Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
                className={errors.ifscCode ? "border-red-500" : ""}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.ifscCode && (
                <p className="text-sm text-red-500">{errors.ifscCode}</p>
              )}
            </div>

            {/* UPI ID */}
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID (Optional)</Label>
              <Input
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="yourname@upi"
                className={errors.upiId ? "border-red-500" : ""}
              />
              {errors.upiId && (
                <p className="text-sm text-red-500">{errors.upiId}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Bank Details
        </Button>
      </div>
    </div>
  );
}
