export interface ReferralLink {
  _id: string;
  eventId: string;
  createdBy: string; // User ID of the organizer
  referralCode: string;
  slug: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralStats {
  _id: string;
  eventId: string;
  referralCode: string;
  totalViews: number;
  totalRegistrations: number;
  totalConversions: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralTracking {
  _id: string;
  referralCode: string;
  eventId: string;
  userId?: string; // User who clicked the referral link
  viewedAt: string;
  registered: boolean;
  registrationId?: string;
}

export interface ShareData {
  referralLink: ReferralLink;
  stats: ReferralStats;
  shareUrl: string;
  eventSlug: string;
  couponCode?: string;
}
