'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventCoupon } from '@/types/event';

interface CreateReferralFormProps {
  onSubmit: (couponCode?: string) => Promise<void>;
  coupons: EventCoupon[];
  isLoading?: boolean;
}

export function CreateReferralForm({
  onSubmit,
  coupons,
  isLoading = false,
}: CreateReferralFormProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(selectedCoupon);
      setSelectedCoupon(undefined);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create referral link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Referral Link</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Coupon (Optional)
          </label>
          <Select 
            value={selectedCoupon || 'none'} 
            onValueChange={(value) => setSelectedCoupon(value === 'none' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a coupon or leave blank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Coupon</SelectItem>
              {coupons.map((coupon) => (
                <SelectItem key={coupon._id} value={coupon.code}>
                  {coupon.code} (
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`}
                  )
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            The selected coupon will be automatically applied to registrations
            using this referral link
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting || isLoading}
          className="w-full"
        >
          {submitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Referral Link'
          )}
        </Button>
      </div>
    </Card>
  );
}
