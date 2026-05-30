'use server';

import ReferralService from '@/services/referral.service';

export async function getReferralData(eventId: string) {
  try {
    const [referrals, stats, coupons] = await Promise.all([
      ReferralService.getReferralLinks(eventId),
      ReferralService.getReferralStats(eventId),
      ReferralService.getEventCoupons(eventId),
    ]);

    return {
      referrals: referrals || [],
      stats: stats || [],
      coupons: coupons || [],
    };
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return {
      referrals: [],
      stats: [],
      coupons: [],
    };
  }
}
