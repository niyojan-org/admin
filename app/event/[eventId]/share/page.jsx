"use client";
import { useParams } from "next/navigation";
import ShareLink from "./components/ShareLink";
import ShareQRCode from "./components/ShareQRCode";
import ReferralManagement from "./components/ReferralManagement";
import CouponManagement from "./components/CouponManagement";
import CombinedShareUrl from "./components/ReferralCoupon";
import EventInfo from "./components/EventInfo";
import useShareManagement from "./hooks/useShareManagement";
import { Separator } from "../../../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import SocialShareCard from "./components/SocialShareCard";

export default function EventSharePage() {
  const { eventId } = useParams();

  const {
    event,
    organization,
    loading,
    error,
    shareUrl,
    referrals,
    coupons,
    referral,
    coupon,
    copyToClipboard,
    copied,
    clearSelections,
    selectCoupon,
    selectReferral
  } = useShareManagement(eventId);

  const hasReferral = Array.isArray(referral) && referral.length > 0;
  const hasCoupon = Array.isArray(coupon) && coupon.length > 0;

  return (
    <div className="container max-w-6xl mx-auto px-2 pt-2 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Share Event</h1>
        <p className="text-muted-foreground">
          Share your event with participants using various methods
        </p>
      </div>

      <Separator />

      {/* Event Information */}
      <EventInfo event={event} loading={loading} error={error} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Basic Share Link */}
          <ShareLink
            url={shareUrl}
            onCopy={() => copyToClipboard(shareUrl)}
            copied={copied}
            label="Basic Share Link"
          />

          {/* Referral and Coupon Management */}
          <Tabs defaultValue="referral" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="referral">Referral</TabsTrigger>
              <TabsTrigger value="coupon">Coupon</TabsTrigger>
            </TabsList>

            <TabsContent value="referral" className="space-y-4">
              <ReferralManagement
                referrals={referrals}
                referral={referral}
                onSelect={selectReferral}
                onClear={clearSelections}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="coupon" className="space-y-4">
              <CouponManagement
                coupons={coupons}
                coupon={coupon}
                onSelect={selectCoupon}
                onClear={clearSelections}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* QR Code */}
          {/* <ShareQRCode value={qrCodeValue} /> */}

          <SocialShareCard organization={organization} event={event} referral={referral} coupon={coupon} shareUrl={shareUrl} />

        </div>
      </div>
    </div>
  );
}

