"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCurrencyDollar,
  IconCalendar,
  IconUsers,
  IconEye,
  IconCopy,
  IconPercentage,
  IconCurrencyRupee,
} from "@tabler/icons-react";

export default function CouponManagementStep({ eventData, setEventData, currentEvent }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percent",
    discountValue: 0,
    maxUsage: 1,
    expiresAt: "",
    isActive: true,
  });

  // Generate random coupon code
  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerateCode = () => {
    const generatedCode = generateCouponCode();
    if (editingCoupon) {
      setEditingCoupon({ ...editingCoupon, code: generatedCode });
    } else {
      setNewCoupon({ ...newCoupon, code: generatedCode });
    }
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setNewCoupon({
      code: "",
      discountType: "percent",
      discountValue: 0,
      maxUsage: 1,
      expiresAt: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon({ ...coupon });
    setIsDialogOpen(true);
  };

  const handleSaveCoupon = () => {
    const couponData = editingCoupon || newCoupon;

    // Validation
    if (!couponData.code?.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    if (couponData.discountValue <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    if (couponData.discountType === "percent" && couponData.discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    if (couponData.maxUsage <= 0) {
      toast.error("Max usage must be at least 1");
      return;
    }

    // Check for duplicate codes (excluding current coupon if editing)
    const existingCoupons = eventData.coupons || [];
    const duplicateCode = existingCoupons.find(
      (c) =>
        c.code.toUpperCase() === couponData.code.toUpperCase() &&
        (!editingCoupon || c.id !== editingCoupon.id)
    );

    if (duplicateCode) {
      toast.error("A coupon with this code already exists");
      return;
    }

    const updatedCoupons = [...existingCoupons];

    if (editingCoupon) {
      // Update existing coupon
      const index = updatedCoupons.findIndex((c) => c.id === editingCoupon.id);
      if (index !== -1) {
        updatedCoupons[index] = { ...editingCoupon };
        toast.success("Coupon updated successfully");
      }
    } else {
      // Add new coupon
      const newCouponWithId = {
        ...couponData,
        id: Math.random().toString(36).substr(2, 9),
        usedCount: 0,
        code: couponData.code.toUpperCase(),
      };
      updatedCoupons.push(newCouponWithId);
      toast.success("Coupon added successfully");
    }

    setEventData({ ...eventData, coupons: updatedCoupons });
    setIsDialogOpen(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (couponId) => {
    const coupon = eventData.coupons?.find((c) => c.id === couponId);
    if (coupon?.usedCount > 0) {
      if (!confirm("This coupon has been used. Are you sure you want to delete it?")) {
        return;
      }
    }

    const updatedCoupons = (eventData.coupons || []).filter((c) => c.id !== couponId);
    setEventData({ ...eventData, coupons: updatedCoupons });
    toast.success("Coupon deleted successfully");
  };

  const handleToggleCouponStatus = (couponId) => {
    const updatedCoupons = (eventData.coupons || []).map((coupon) =>
      coupon.id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon
    );
    setEventData({ ...eventData, coupons: updatedCoupons });

    const coupon = updatedCoupons.find((c) => c.id === couponId);
    toast.success(`Coupon ${coupon.isActive ? "activated" : "deactivated"}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percent") {
      return `${coupon.discountValue}% OFF`;
    }
    return `$${coupon.discountValue} OFF`;
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const currentCoupon = editingCoupon || newCoupon;

  return (
    <Card className="space-y-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-navy">Coupon Management</h2>
          <p className="text-gray-600 mt-1">Create and manage discount coupons for your event</p>
        </div>
        <Button onClick={handleAddCoupon} >
          <IconPlus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Coupons List */}
      {!eventData.coupons || eventData.coupons.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <IconPlus className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No coupons created yet</h3>
            <p className="text-gray-500 mb-4">
              Create discount coupons to boost your event registrations
            </p>
            <Button onClick={handleAddCoupon} className="bg-navy hover:bg-navy/90">
              <IconPlus className="h-4 w-4 mr-2" />
              Create Your First Coupon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventData.coupons.map((coupon) => (
            <Card
              key={coupon.id}
              className={`hover:shadow-md transition-shadow ${
                !coupon.isActive ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-navy/10 text-navy rounded font-mono text-sm">
                      {coupon.code}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(coupon.code)}
                      className="p-1 h-6 w-6"
                    >
                      <IconCopy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={() => handleToggleCouponStatus(coupon.id)}
                      className="scale-75"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {coupon.discountType === "percent" ? (
                    <IconPercentage className="h-4 w-4 text-green-600" />
                  ) : (
                    <IconCurrencyRupee className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-lg font-semibold text-green-600">
                    {formatDiscount(coupon)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Usage Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <IconUsers className="h-3 w-3" />
                      <span>
                        Used: {coupon.usedCount}/{coupon.maxUsage}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <IconCalendar className="h-3 w-3" />
                      <span>{formatExpiryDate(coupon.expiresAt)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((coupon.usedCount / coupon.maxUsage) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditCoupon(coupon)}
                      className="flex-1"
                    >
                      <IconEdit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <IconTrash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
            <DialogDescription>
              {editingCoupon
                ? "Update the coupon details below."
                : "Create a new discount coupon for your event."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code *</Label>
              <div className="flex gap-2">
                <Input
                  id="couponCode"
                  placeholder="Enter coupon code"
                  value={currentCoupon.code}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (editingCoupon) {
                      setEditingCoupon({ ...editingCoupon, code: value });
                    } else {
                      setNewCoupon({ ...newCoupon, code: value });
                    }
                  }}
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateCode}
                  className="shrink-0"
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Discount Type and Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={currentCoupon.discountType}
                  onValueChange={(value) => {
                    if (editingCoupon) {
                      setEditingCoupon({ ...editingCoupon, discountType: value });
                    } else {
                      setNewCoupon({ ...newCoupon, discountType: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value *{currentCoupon.discountType === "percent" && " (1-100)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  max={currentCoupon.discountType === "percent" ? "100" : undefined}
                  step={currentCoupon.discountType === "percent" ? "1" : "0.01"}
                  placeholder={currentCoupon.discountType === "percent" ? "20" : "10.00"}
                  value={currentCoupon.discountValue}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    if (editingCoupon) {
                      setEditingCoupon({ ...editingCoupon, discountValue: value });
                    } else {
                      setNewCoupon({ ...newCoupon, discountValue: value });
                    }
                  }}
                />
              </div>
            </div>

            {/* Max Usage */}
            <div className="space-y-2">
              <Label htmlFor="maxUsage">Maximum Usage *</Label>
              <Input
                id="maxUsage"
                type="number"
                min="1"
                placeholder="How many times can this coupon be used?"
                value={currentCoupon.maxUsage}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (editingCoupon) {
                    setEditingCoupon({ ...editingCoupon, maxUsage: value });
                  } else {
                    setNewCoupon({ ...newCoupon, maxUsage: value });
                  }
                }}
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={currentCoupon.expiresAt}
                onChange={(e) => {
                  if (editingCoupon) {
                    setEditingCoupon({ ...editingCoupon, expiresAt: e.target.value });
                  } else {
                    setNewCoupon({ ...newCoupon, expiresAt: e.target.value });
                  }
                }}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={currentCoupon.isActive}
                onCheckedChange={(checked) => {
                  if (editingCoupon) {
                    setEditingCoupon({ ...editingCoupon, isActive: checked });
                  } else {
                    setNewCoupon({ ...newCoupon, isActive: checked });
                  }
                }}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            {/* Preview */}
            {currentCoupon.code && currentCoupon.discountValue > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Preview:</div>
                    <code className="text-lg font-bold text-navy">{currentCoupon.code}</code>
                    <div className="text-lg font-semibold text-green-600 mt-1">
                      {formatDiscount(currentCoupon)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCoupon}>
              {editingCoupon ? "Update Coupon" : "Add Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
