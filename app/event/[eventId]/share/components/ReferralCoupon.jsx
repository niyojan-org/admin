import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function CombinedShareUrl({
  referrals = [],
  coupons = [],
  onCopy,
  getShareUrlWithBoth,
  hasReferral,
  hasCoupon
}) {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const currentReferral = selectedReferral || (referrals.length > 0 ? referrals[0] : null);
  const currentCoupon = selectedCoupon || (coupons.length > 0 ? coupons[0] : null);
  const shareUrl = getShareUrlWithBoth(currentReferral, currentCoupon);

  if (!hasReferral && !hasCoupon) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Combined Share URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Generate a referral link or coupon to create a combined share URL
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Combined Share URL</CardTitle>
        <p className="text-sm text-muted-foreground">
          URL with both referral tracking and discount coupon
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasReferral && referrals.length > 1 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Referral</Label>
                <Select onValueChange={(value) => {
                  const referral = referrals.find(r => r._id === value);
                  setSelectedReferral(referral);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose referral..." />
                  </SelectTrigger>
                  <SelectContent>
                    {referrals.map((referral) => (
                      <SelectItem key={referral._id} value={referral._id}>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs">{referral.code}</span>
                          <span className="text-muted-foreground text-xs">- {referral.whose.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {hasCoupon && coupons.length > 1 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Coupon</Label>
                <Select onValueChange={(value) => {
                  const coupon = coupons.find(c => c._id === value);
                  setSelectedCoupon(coupon);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose coupon..." />
                  </SelectTrigger>
                  <SelectContent>
                    {coupons.map((coupon) => (
                      <SelectItem key={coupon._id} value={coupon._id}>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs">{coupon.code}</span>
                          <Badge variant="outline" className="text-xs">
                            {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Current Selection Display */}
          <div className="flex flex-wrap gap-2">
            {hasReferral && currentReferral && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span className="text-xs">Referral:</span>
                <span className="font-mono">{currentReferral.code}</span>
                <span className="text-muted-foreground">({currentReferral.whose.name})</span>
              </Badge>
            )}
            {hasCoupon && currentCoupon && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span className="text-xs">Coupon:</span>
                <span className="font-mono">{currentCoupon.code}</span>
                <span className="text-muted-foreground">
                  ({currentCoupon.discountType === 'percent' ? `${currentCoupon.discountValue}%` : `₹${currentCoupon.discountValue}`})
                </span>
              </Badge>
            )}
          </div>

          {/* Combined URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Combined Share URL</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={() => onCopy(shareUrl)}
                variant="default"
                size="sm"
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>This URL includes both referral tracking and discount benefits for users.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
