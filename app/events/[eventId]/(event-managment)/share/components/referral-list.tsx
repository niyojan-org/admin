'use client';

import { useState } from 'react';
import { Copy, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ReferralLink, ReferralStats } from '@/types/referral';
import { EventCoupon } from '@/types/event';

interface ReferralListProps {
  referrals: ReferralLink[];
  stats: ReferralStats[];
  eventSlug: string;
  coupons: EventCoupon[];
  onDelete: (referralCode: string) => Promise<void>;
  onViewTracking: (referralCode: string) => void;
}

export function ReferralList({
  referrals,
  stats,
  eventSlug,
  coupons,
  onDelete,
  onViewTracking,
}: ReferralListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const getStats = (referralCode: string) => {
    return stats.find((s) => s.referralCode === referralCode);
  };

  const getCoupon = (couponCode?: string) => {
    if (!couponCode) return null;
    return coupons.find((c) => c.code === couponCode);
  };

  const generateShareUrl = (
    referralCode: string,
    couponCode?: string
  ): string => {
    const baseUrl = `https://orgatick.in/events/${eventSlug}`;
    const params = new URLSearchParams();
    params.append('ref', referralCode);
    if (couponCode) {
      params.append('coupon', couponCode);
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const handleDelete = async (referralCode: string) => {
    setDeleting(referralCode);
    try {
      await onDelete(referralCode);
      toast.success('Referral link deleted successfully');
    } catch (error: any) {
      toast.error(
        error.message || 'Failed to delete referral link'
      );
    } finally {
      setDeleting(null);
    }
  };

  if (referrals.length === 0) {
    return (
      <Card className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No referral links yet</p>
          <p className="text-sm text-gray-500">
            Create a referral link to start sharing your event
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {referrals.map((referral) => {
        const referralStats = getStats(referral.referralCode);
        const coupon = getCoupon(referral.couponCode);
        const shareUrl = generateShareUrl(
          referral.referralCode,
          referral.couponCode
        );

        return (
          <Card key={referral._id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    Referral Code: {referral.referralCode}
                  </h3>
                  {coupon && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Coupon: {coupon.code} (
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                      )
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(referral.referralCode)}
                  disabled={deleting === referral.referralCode}
                  className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                >
                  {deleting === referral.referralCode ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">
                  Share Link
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 text-sm px-3 py-2 bg-white border rounded"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(shareUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {referralStats && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {referralStats.totalViews}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total Views
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {referralStats.totalRegistrations}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registrations
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {referralStats.totalConversions}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Conversions
                    </p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewTracking(referral.referralCode)}
              >
                View Tracking Details
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
