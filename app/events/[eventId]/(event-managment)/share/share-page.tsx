'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import ClientReferralService from '@/services/client-referral.service';
import { CreateReferralForm, ReferralList, ReferralTrackingModal } from './components';
import { ReferralLink, ReferralStats } from '@/types/referral';
import { EventCoupon } from '@/types/event';
import { EventStore } from '../../event-store';

interface SharePageClientProps {
  initialReferrals: ReferralLink[];
  initialStats: ReferralStats[];
  initialCoupons: EventCoupon[];
}

export default function SharePageClient({ initialReferrals, initialStats, initialCoupons }: SharePageClientProps) {
  const { event } = EventStore();
  const [referrals, setReferrals] = useState(initialReferrals);
  const [stats, setStats] = useState(initialStats);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<string | null>(null);
  const [tracking, setTracking] = useState<any[]>([]);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);

  const handleCreateReferral = useCallback(
    async (couponCode?: string) => {
      if (!event) return;
      setIsLoadingReferrals(true);
      try {
        const newReferral = await ClientReferralService.createReferralLink(event._id, couponCode);

        // Fetch updated stats
        const newStats = await ClientReferralService.getReferralCodeStats(event._id, newReferral.referralCode);

        setReferrals((prev) => [...prev, newReferral]);
        if (newStats) {
          setStats((prev) => [...prev, newStats]);
        }

        toast.success('Referral link created successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to create referral link');
        throw error;
      } finally {
        setIsLoadingReferrals(false);
      }
    },
    [event?._id],
  );

  const handleDeleteReferral = useCallback(
    async (referralCode: string) => {
      if (!event) return;
      try {
        await ClientReferralService.deleteReferralLink(event._id, referralCode);

        setReferrals((prev) => prev.filter((r) => r.referralCode !== referralCode));
        setStats((prev) => prev.filter((s) => s.referralCode !== referralCode));

        toast.success('Referral link deleted successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete referral link');
        throw error;
      }
    },
    [event?._id],
  );

  const handleViewTracking = useCallback(
    async (referralCode: string) => {
      if (!event) return;
      setSelectedReferral(referralCode);
      setIsLoadingTracking(true);
      try {
        const trackingData = await ClientReferralService.getReferralTracking(event._id, referralCode);
        setTracking(trackingData);
      } catch (error) {
        console.error('Failed to load tracking data:', error);
        toast.error('Failed to load tracking data');
      } finally {
        setIsLoadingTracking(false);
      }
    },
    [event?._id],
  );

  const handleCloseTracking = useCallback(() => {
    setSelectedReferral(null);
    setTracking([]);
  }, []);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 pt-2 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Share & Referrals</h1>
        <p className="text-muted-foreground">
          Create and manage referral links to track event shares and registrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateReferralForm onSubmit={handleCreateReferral} coupons={coupons} isLoading={isLoadingReferrals} />
        </div>

        <div className="lg:col-span-2">
          <ReferralList
            referrals={referrals}
            stats={stats}
            eventSlug={event.slug}
            coupons={coupons}
            onDelete={handleDeleteReferral}
            onViewTracking={handleViewTracking}
          />
        </div>
      </div>

      {selectedReferral && (
        <ReferralTrackingModal
          referralCode={selectedReferral}
          isOpen={!!selectedReferral}
          onClose={handleCloseTracking}
          tracking={tracking}
          isLoading={isLoadingTracking}
        />
      )}
    </div>
  );
}
