import { ReferralLink, ReferralStats, ShareData } from '@/types/referral';
import { EventCoupon } from '@/types/event';

class ReferralService {
  /**
   * Generate unique referral code
   */
  private static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Get all referral links for an event (dummy data)
   */
  static async getReferralLinks(eventId: string): Promise<ReferralLink[]> {
    return [
      {
        _id: '1',
        eventId,
        createdBy: 'user123',
        referralCode: 'REF001ABC',
        slug: 'ref-001-abc',
        couponCode: undefined,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '2',
        eventId,
        createdBy: 'user123',
        referralCode: 'REF002XYZ',
        slug: 'ref-002-xyz',
        couponCode: 'SUMMER20',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  /**
   * Get referral statistics for an event (dummy data)
   */
  static async getReferralStats(eventId: string): Promise<ReferralStats[]> {
    return [
      {
        _id: '1',
        eventId,
        referralCode: 'REF001ABC',
        totalViews: 45,
        totalRegistrations: 12,
        totalConversions: 12,
        createdBy: 'user123',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        eventId,
        referralCode: 'REF002XYZ',
        totalViews: 32,
        totalRegistrations: 8,
        totalConversions: 8,
        createdBy: 'user123',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Get referral stats for a specific referral code (dummy data)
   */
  static async getReferralCodeStats(
    eventId: string,
    referralCode: string
  ): Promise<ReferralStats | null> {
    return {
      _id: Date.now().toString(),
      eventId,
      referralCode,
      totalViews: 0,
      totalRegistrations: 0,
      totalConversions: 0,
      createdBy: 'user123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get tracking data for a referral code (dummy data)
   */
  static async getReferralTracking(
    eventId: string,
    referralCode: string
  ): Promise<any[]> {
    return [
      {
        _id: '1',
        referralCode,
        eventId,
        userId: 'user456',
        viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        registered: true,
        registrationId: 'reg123',
      },
      {
        _id: '2',
        referralCode,
        eventId,
        userId: 'user789',
        viewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        registered: false,
      },
      {
        _id: '3',
        referralCode,
        eventId,
        userId: undefined,
        viewedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        registered: false,
      },
    ];
  }

  /**
   * Delete a referral link (dummy implementation)
   */
  static async deleteReferralLink(
    eventId: string,
    referralCode: string
  ): Promise<boolean> {
    return true;
  }

  /**
   * Create a new referral link (dummy implementation)
   */
  static async createReferralLink(
    eventId: string,
    couponCode?: string
  ): Promise<ReferralLink> {
    const referralCode = this.generateReferralCode();
    return {
      _id: Date.now().toString(),
      eventId,
      createdBy: 'user123',
      referralCode,
      slug: referralCode.toLowerCase(),
      couponCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get available coupons for an event (dummy data)
   */
  static async getEventCoupons(eventId: string): Promise<EventCoupon[]> {
    return [
      {
        _id: '1',
        code: 'SUMMER20',
        discountType: 'percentage',
        discountValue: 20,
        maxUses: 100,
        usedCount: 15,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        code: 'SAVE50',
        discountType: 'fixed',
        discountValue: 50,
        maxUses: 50,
        usedCount: 8,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Generate share URL with referral and coupon parameters
   */
  static generateShareUrl(
    eventSlug: string,
    referralCode: string,
    couponCode?: string,
    domain: string = 'orgatick.in'
  ): string {
    const baseUrl = `https://${domain}/events/${eventSlug}`;
    const params = new URLSearchParams();
    params.append('ref', referralCode);
    if (couponCode) {
      params.append('coupon', couponCode);
    }
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate share data for sharing
   */
  static async generateShareData(
    eventId: string,
    eventSlug: string,
    couponCode?: string,
    domain?: string
  ): Promise<ShareData> {
    const referralCode = this.generateReferralCode();
    const referralLink: ReferralLink = {
      _id: Date.now().toString(),
      eventId,
      createdBy: 'user123',
      referralCode,
      slug: referralCode.toLowerCase(),
      couponCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const stats: ReferralStats = {
      _id: Date.now().toString(),
      eventId,
      referralCode,
      totalViews: 0,
      totalRegistrations: 0,
      totalConversions: 0,
      createdBy: 'user123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const shareUrl = this.generateShareUrl(
      eventSlug,
      referralCode,
      couponCode,
      domain
    );

    return {
      referralLink,
      stats,
      shareUrl,
      eventSlug,
      couponCode,
    };
  }
}

export default ReferralService;
