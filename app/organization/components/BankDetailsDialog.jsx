"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

export default function BankDetailsDialog({ open, onOpenChange, onSubmit, initialData = {} }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountHolderName: "",
        bankName: "",
        branchName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open && initialData) {
            setFormData({
                accountHolderName: initialData.accountHolderName || "",
                bankName: initialData.bankName || "",
                branchName: initialData.branchName || "",
                accountNumber: initialData.accountNumber || "",
                ifscCode: initialData.ifscCode || "",
                upiId: initialData.upiId || "",
            });
        }
    }, [open, initialData]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.accountHolderName || formData.accountHolderName.trim().length < 3) {
            newErrors.accountHolderName = "Account holder name is required";
        }

        if (!formData.bankName || formData.bankName.trim().length < 3) {
            newErrors.bankName = "Bank name is required";
        }

        if (!formData.accountNumber || formData.accountNumber.trim().length < 9) {
            newErrors.accountNumber = "Valid account number is required";
        }

        if (!formData.ifscCode) {
            newErrors.ifscCode = "IFSC code is required";
        } else {
            // IFSC code format: 4 letters + 7 digits (e.g., SBIN0001234)
            const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
            if (!ifscRegex.test(formData.ifscCode.toUpperCase())) {
                newErrors.ifscCode = "Invalid IFSC code format";
            }
        }

        if (formData.upiId) {
            const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
            if (!upiRegex.test(formData.upiId)) {
                newErrors.upiId = "Invalid UPI ID format";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const submissionData = {
                accountHolderName: formData.accountHolderName,
                bankName: formData.bankName,
                branchName: formData.branchName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode.toUpperCase(),
                reqForVerification: true,
            };

            // Only include upiId if it has a value
            if (formData.upiId && formData.upiId.trim()) {
                submissionData.upiId = formData.upiId;
            }

            await onSubmit(submissionData);

            // Reset form
            setFormData({
                accountHolderName: "",
                bankName: "",
                branchName: "",
                accountNumber: "",
                ifscCode: "",
                upiId: "",
            });
        } catch (error) {
            console.error("Bank details submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData?.accountNumber ? "Update Bank Details" : "Add Bank Details"}
                    </DialogTitle>
                    <DialogDescription>
                        Enter your bank account information for receiving payments
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="accountHolderName">
                            Account Holder Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="accountHolderName"
                            placeholder="As per bank records"
                            value={formData.accountHolderName}
                            onChange={(e) => handleChange("accountHolderName", e.target.value)}
                            className={errors.accountHolderName ? "border-destructive" : ""}
                        />
                        {errors.accountHolderName && (
                            <p className="text-sm text-destructive">{errors.accountHolderName}</p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="bankName">
                                Bank Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="bankName"
                                placeholder="e.g., State Bank of India"
                                value={formData.bankName}
                                onChange={(e) => handleChange("bankName", e.target.value)}
                                className={errors.bankName ? "border-destructive" : ""}
                            />
                            {errors.bankName && (
                                <p className="text-sm text-destructive">{errors.bankName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="branchName">Branch Name</Label>
                            <Input
                                id="branchName"
                                placeholder="e.g., Main Branch"
                                value={formData.branchName}
                                onChange={(e) => handleChange("branchName", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="accountNumber">
                            Account Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="accountNumber"
                            type="text"
                            placeholder="Enter account number"
                            value={formData.accountNumber}
                            onChange={(e) => handleChange("accountNumber", e.target.value)}
                            className={errors.accountNumber ? "border-destructive" : ""}
                        />
                        {errors.accountNumber && (
                            <p className="text-sm text-destructive">{errors.accountNumber}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ifscCode">
                            IFSC Code <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="ifscCode"
                            placeholder="e.g., SBIN0001234"
                            value={formData.ifscCode}
                            onChange={(e) => handleChange("ifscCode", e.target.value.toUpperCase())}
                            maxLength={11}
                            className={errors.ifscCode ? "border-destructive" : ""}
                        />
                        {errors.ifscCode && (
                            <p className="text-sm text-destructive">{errors.ifscCode}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            11-character code (e.g., SBIN0001234)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID (Optional)</Label>
                        <Input
                            id="upiId"
                            placeholder="e.g., yourname@paytm"
                            value={formData.upiId}
                            onChange={(e) => handleChange("upiId", e.target.value)}
                            className={errors.upiId ? "border-destructive" : ""}
                        />
                        {errors.upiId && (
                            <p className="text-sm text-destructive">{errors.upiId}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="size-4 mr-2" />
                                    Save Bank Details
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
