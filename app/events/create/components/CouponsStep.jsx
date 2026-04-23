"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Switch } from "@/components/ui/switch";
import { IconPlus, IconTrash, IconDiscount } from "@tabler/icons-react";
import { useEventForm } from "../hooks/useEventForm";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CouponsStep() {
  const { eventDraft, coupons } = useEventForm();
  const [expandedCoupon, setExpandedCoupon] = useState(null);

  const generateCouponCode = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
  };

  const isCouponComplete = (coupon) => {
    const code = (coupon?.code || "").trim();
    if (!/^[A-Z0-9]{5,}$/.test(code)) {
      return false;
    }

    if ((coupon?.discountValue ?? 0) <= 0) {
      return false;
    }

    if (
      coupon?.discountType === "percentage" &&
      (coupon?.discountValue ?? 0) > 100
    ) {
      return false;
    }

    if ((coupon?.maxUsage ?? 0) < 0) {
      return false;
    }

    if (
      coupon?.startsAt &&
      coupon?.endsAt &&
      new Date(coupon.startsAt) >= new Date(coupon.endsAt)
    ) {
      return false;
    }

    return true;
  };

  const handleAddCoupon = () => {
    if (!eventDraft.allowCoupons) {
      toast.error("Enable Allow Coupons in Basic Info before adding coupons");
      return;
    }

    const couponList = eventDraft.coupons;
    const lastCouponIndex = couponList.length - 1;

    if (
      lastCouponIndex >= 0 &&
      !isCouponComplete(couponList[lastCouponIndex])
    ) {
      setExpandedCoupon(lastCouponIndex);
      toast.error(
        "Complete the current coupon details before adding another one",
      );
      return;
    }

    coupons.add();
    setExpandedCoupon(couponList.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discount Coupons</h2>
          <p className="text-muted-foreground">
            Create promotional codes for your event
          </p>
        </div>
        <Button
          onClick={handleAddCoupon}
          className="gap-2"
          disabled={!eventDraft.allowCoupons}
        >
          <IconPlus className="w-4 h-4" />
          Add Coupon
        </Button>
      </div>

      {!eventDraft.allowCoupons && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="py-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Coupons are currently disabled in event settings. Enable "Allow
              Coupons" in Basic Info to use this feature.
            </p>
          </CardContent>
        </Card>
      )}

      {eventDraft.coupons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <IconDiscount className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No coupons added yet</p>
            <Button
              onClick={handleAddCoupon}
              variant="outline"
              className="mt-4 gap-2"
              disabled={!eventDraft.allowCoupons}
            >
              <IconPlus className="w-4 h-4" />
              Add Your First Coupon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {eventDraft.coupons.map((coupon, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Coupon {index + 1}
                      {isCouponComplete(coupon) ? (
                        <Badge variant="secondary">Complete</Badge>
                      ) : (
                        <Badge variant="outline">Incomplete</Badge>
                      )}
                      {coupon.isActive && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </CardTitle>
                    {coupon.code && (
                      <p className="text-sm text-muted-foreground mt-1 font-mono">
                        {coupon.code}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedCoupon(
                          expandedCoupon === index ? null : index,
                        )
                      }
                    >
                      {expandedCoupon === index ? "Collapse" : "Expand"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => coupons.remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedCoupon === index && (
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coupon Code *</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., EARLYBIRD2026"
                          value={coupon.code || ""}
                          onChange={(e) =>
                            coupons.update(index, {
                              code: e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, ""),
                            })
                          }
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            coupons.update(index, {
                              code: generateCouponCode(8),
                            })
                          }
                        >
                          Generate
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum 5 characters, uppercase letters and numbers only
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Type *</Label>
                      <Select
                        value={coupon.discountType || "percentage"}
                        onValueChange={(value) =>
                          coupons.update(index, { discountType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Value *</Label>
                      <Input
                        type="number"
                        min="0"
                        max={
                          coupon.discountType === "percentage" ? 100 : undefined
                        }
                        step={
                          coupon.discountType === "percentage" ? "1" : "0.01"
                        }
                        placeholder={
                          coupon.discountType === "percentage" ? "20" : "10.00"
                        }
                        value={coupon.discountValue || 0}
                        onChange={(e) =>
                          coupons.update(index, {
                            discountValue: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {coupon.discountType === "percentage"
                          ? "Enter percentage (0-100)"
                          : "Enter fixed amount"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Maximum Usage</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="50"
                        value={coupon.maxUsage || ""}
                        onChange={(e) =>
                          coupons.update(index, {
                            maxUsage: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        0 = unlimited
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Valid From</Label>
                      <DateTimePicker
                        value={
                          coupon.startsAt ? new Date(coupon.startsAt) : null
                        }
                        onChange={(date) =>
                          coupons.update(index, {
                            startsAt: date?.toISOString(),
                          })
                        }
                        use12HourFormat={true}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Valid Until</Label>
                      <DateTimePicker
                        value={coupon.endsAt ? new Date(coupon.endsAt) : null}
                        onChange={(date) =>
                          coupons.update(index, { endsAt: date?.toISOString() })
                        }
                        use12HourFormat={true}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="space-y-0.5">
                      <Label>Coupon Active</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this coupon available for use
                      </p>
                    </div>
                    <Switch
                      checked={coupon.isActive ?? true}
                      onCheckedChange={(checked) =>
                        coupons.update(index, { isActive: checked })
                      }
                    />
                  </div>

                  {coupon.code && coupon.discountValue > 0 && (
                    <div className="border-t pt-4 bg-muted/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Preview</h4>
                      <p className="text-sm">
                        Code{" "}
                        <span className="font-mono font-semibold">
                          {coupon.code}
                        </span>{" "}
                        provides{" "}
                        <span className="font-semibold">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% off`
                            : `$${coupon.discountValue.toFixed(2)} off`}
                        </span>
                        {coupon.maxUsage > 0 &&
                          ` (limited to ${coupon.maxUsage} uses)`}
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
