"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrgStore } from "@/store/orgStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Step3({ goNext, goBack }) {
  const { organization, setOrganization } = useOrgStore();

  // Initialize form data with organization data if available
  const [formData, setFormData] = useState({
    accountHolderName: organization?.bankDetails?.accountHolderName || "",
    bankName: organization?.bankDetails?.bankName || "",
    branchName: organization?.bankDetails?.branchName || "",
    accountNumber: organization?.bankDetails?.accountNumber || "",
    ifscCode: organization?.bankDetails?.ifscCode || "",
    upiId: organization?.bankDetails?.upiId || "",
  });

  // State for guidelines dialog
  const [showGuidelinesDialog, setShowGuidelinesDialog] = useState(false);

  // Update form data when organization changes
  useEffect(() => {
    if (organization?.paymentDetails) {
      setFormData({
        accountHolderName: organization.bankDetails.accountHolderName || "",
        bankName: organization.bankDetails.bankName || "",
        branchName: organization.bankDetails.branchName || "",
        accountNumber: organization.bankDetails.accountNumber || "",
        ifscCode: organization.bankDetails.ifscCode || "",
        upiId: organization.bankDetails.upiId || "",
      });
    }
  }, [organization]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validation function
  const validateForm = () => {
    // Check if all required fields are present
    if (!formData.upiId || formData.upiId.trim().length === 0) {
      toast.error("Please provide UPI ID.");
      return false;
    }

    if (
      !formData.accountHolderName ||
      !formData.bankName ||
      !formData.branchName ||
      !formData.accountNumber ||
      !formData.ifscCode
    ) {
      toast.error(
        "Please provide all bank details (Account Holder Name, Bank Name, Branch Name, Account Number, and IFSC Code)."
      );
      return false;
    }

    // Validate UPI format
    if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
      toast.error("Please enter a valid UPI ID (e.g., user@bank).");
      return false;
    }

    // Validate bank details
    if (formData.accountHolderName.length < 2) {
      toast.error("Account holder name must be at least 2 characters long.");
      return false;
    }
    if (formData.bankName.length < 2) {
      toast.error("Bank name must be at least 2 characters long.");
      return false;
    }
    if (formData.accountNumber.length < 8) {
      toast.error("Account number must be at least 8 digits long.");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      toast.error("Please enter a valid IFSC code (e.g., SBIN0000123).");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/org/register/bank", { ...formData });
      toast.success(response.data.message || "Payment details have been successfully saved!");
      setOrganization(response.data.org);
      goNext();
    } catch (error) {
      if (error.response?.data.error?.code === "PAYMENT_EXISTS") {
        toast.info("Let's move to next step");
        goNext();
        return;
      }
      toast.error(
        error.response?.data?.message || "Failed to save payment details. Please try again.",
        {
          description:
            error.response?.data?.error?.details ||
            "An error occurred while saving your payment details.",
        }
      );
    }
  };

  const handleSkip = async () => {
    try {
      // Send dummy data for free events
      const dummyData = {
        accountHolderName: "Free Events Only",
        bankName: "N/A",
        branchName: "N/A",
        accountNumber: "000000000000",
        ifscCode: "FREE0000001",
        upiId: "freevents@dummy",
        isSkipped: true,
        eventType: "free",
      };

      const response = await api.post("/org/register/bank", dummyData);
      toast.success("Skipped payment details for free events only!");
      setOrganization(response.data.org);
      goNext();
    } catch (error) {
      if (error.response?.data.error?.code === "PAYMENT_EXISTS") {
        toast.info("Let's move to next step");
        goNext();
        return;
      }
      toast.error(
        error.response?.data?.message || "Failed to skip payment details. Please try again.",
        {
          description:
            error.response?.data?.error?.details ||
            "An error occurred while skipping payment details.",
        }
      );
    }
  };
  return (
    <div className="h-full bg-background rounded border border-border shadow flex flex-col justify-between py-2 sm:py-4 md:py-8 space-y-4 w-full px-2 sm:px-4 md:px-10">

      {/* Header and Info Button Row */}
      <div className="flex gap-4 justify-between items-start flex-wrap">
        <p className="text-foreground text-sm sm:text-lg flex-1">Please provide your payment details for transactions</p>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground text-center">
            <span className="text-destructive">*</span> All fields are required
          </div>
          <Dialog open={showGuidelinesDialog} onOpenChange={setShowGuidelinesDialog}>
            <DialogTrigger asChild>
              <Button type="button" title="View Guidelines" variant={'icon'}>
                <IconInfoSquareRounded />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">Payment Details Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <ul className="text-sm text-primary space-y-1">
                    <li>• Both UPI and complete bank details are required for paid events</li>
                    <li>• UPI ID format: username@bankname (e.g., john@paytm)</li>
                    <li>• IFSC code format: 4 letters + 0 + 6 alphanumeric characters</li>
                    <li>• Account holder name should match organization registration</li>
                    <li>• All bank details will be verified for authenticity</li>
                    <li>• These details are used for payment processing and settlements</li>
                  </ul>
                </div>
                <div className="p-4 bg-secondary/5 rounded-lg border-l-4 border-secondary">
                  <h4 className="font-medium text-secondary mb-2">Free Events Option</h4>
                  <ul className="text-sm text-secondary space-y-1">
                    <li>• If you plan to create only free events, you can skip this step</li>
                    <li>• Use the "Skip (Free Events Only)" button at the bottom</li>
                    <li>• You can always add payment details later in settings</li>
                    <li>• Skipping will allow you to proceed without payment setup</li>
                  </ul>
                </div>
                <div className="p-4 bg-success/5 rounded-lg border-l-4 border-success">
                  <h4 className="font-medium text-success mb-2">Tips</h4>
                  <ul className="text-sm text-success space-y-1">
                    <li>• Double-check account number and IFSC code for accuracy</li>
                    <li>• Use the UPI ID that's linked to the same bank account</li>
                    <li>• Ensure the account is active and operational</li>
                    <li>• Business/current accounts are preferred over savings accounts</li>
                    <li>• Keep bank statements ready for verification if needed</li>
                  </ul>
                </div>
                <div className="p-4 bg-warning/5 rounded-lg border-l-4 border-warning">
                  <h4 className="font-medium text-warning mb-2">Security</h4>
                  <ul className="text-sm text-warning space-y-1">
                    <li>• Your payment details are encrypted and secure</li>
                    <li>• Only authorized transactions will be processed</li>
                    <li>• You can update these details later in settings</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Card Section */}
      <Card className="shadow-sm bg-background py-1 border-0 p-0">
        <CardContent className="py-2 sm:py-4 sm:space-y-6">
          {/* UPI Section */}
          <div className="space-y-2">
            <div className="border-b pb-1 flex items-center gap-4">
              <h3 className="text-primary font-semibold text-lg">UPI Details</h3>
              <p className="text-sm text-muted-foreground">Provide UPI ID for quick payments</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="upiId" className="text-foreground font-semibold text-base">
                UPI ID *
              </Label>
              <Input
                type="text"
                id="upiId"
                name="upiId"
                value={formData.upiId || ""}
                onChange={handleChange}
                placeholder="e.g., xyz12345@oksbi"
                className="h-11 border-border focus:border-primary focus:ring-primary"
                required
              />
              {formData.upiId && !/^[\w.-]+@[\w.-]+$/.test(formData.upiId) && (
                <p className="text-sm text-destructive mt-1">Please enter a valid UPI ID format</p>
              )}
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="space-y-2">
            <div className="border-b pb-2 flex items-center gap-4">
              <h3 className="text-primary font-semibold text-lg">Bank Details</h3>
              <p className="text-sm text-muted-foreground">Provide complete bank account information</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-0 sm:gap-x-6 gap-y-4">
              {/* Account Holder Name */}
              <div className="space-y-1">
                <Label htmlFor="accountHolderName" className="text-foreground font-semibold text-base">
                  Account Holder Name *
                </Label>
                <Input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName || ""}
                  onChange={handleChange}
                  placeholder="Enter account holder name"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  required
                />
                {formData.accountHolderName && formData.accountHolderName.length < 2 && (
                  <p className="text-sm text-destructive mt-1">Name must be at least 2 characters long</p>
                )}
              </div>

              {/* Bank Name */}
              <div className="space-y-1">
                <Label htmlFor="bankName" className="text-foreground font-semibold text-base">
                  Bank Name *
                </Label>
                <Input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName || ""}
                  onChange={handleChange}
                  placeholder="e.g., State Bank Of India"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  required
                />
                {formData.bankName && formData.bankName.length < 2 && (
                  <p className="text-sm text-destructive mt-1">Bank name must be at least 2 characters long</p>
                )}
              </div>

              {/* Branch Name */}
              <div className="space-y-1">
                <Label htmlFor="branchName" className="text-foreground font-semibold text-base">
                  Branch Name *
                </Label>
                <Input
                  type="text"
                  id="branchName"
                  name="branchName"
                  value={formData.branchName || ""}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <Label htmlFor="accountNumber" className="text-foreground font-semibold text-base">
                  Account Number *
                </Label>
                <Input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  required
                />
                {formData.accountNumber && formData.accountNumber.length < 8 && (
                  <p className="text-sm text-destructive mt-1">Account number must be at least 8 digits</p>
                )}
              </div>

              {/* IFSC Code */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="ifscCode" className="text-foreground font-semibold text-base">
                  IFSC Code *
                </Label>
                <Input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode || ""}
                  onChange={handleChange}
                  placeholder="e.g., SBIN0000123"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  style={{ textTransform: "uppercase" }}
                  required
                />
                {formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode) && (
                  <p className="text-sm text-destructive mt-1">Please enter a valid IFSC code (e.g., SBIN0000123)</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-1 sm:mt-4 gap-2 sm:gap-4 w-full">
        <Button onClick={handleSkip} variant="outline" className="w-full sm:w-auto">
          <span>Skip</span>
          <span className="text-xs text-muted-foreground">(Free Events Only)</span>
        </Button>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-4 justify-end">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => goBack()}>
            Back
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              if (!validateForm()) {
                return;
              }
              handleSubmit();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
