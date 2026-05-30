export interface EventData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  bannerImage?: string;
  category: string;
  organizationId: string;
  mode: 'online' | 'offline' | 'hybrid';
  visibility: 'public' | 'private';
  status: 'draft' | 'published' | 'archived' | 'cancelled';
  isPublished: boolean;
  isPrivate: boolean;
  isRegistrationOpen: boolean;
  isBlocked: boolean;
  registrationStart: string;
  registrationEnd: string;
  allowMultipleSessions: boolean;
  allowCoupons: boolean;
  allowReferrals: boolean;
  autoApproveParticipants: boolean;
  enableEmailNotifications: boolean;
  enableWhatsappNotifications: boolean;
  tags: string[];
  sessions: EventSession[];
  tickets: EventTicket[];
  customFields: EventCustomField[];
  coupons: EventCoupon[];
  metrics: {
    view: number;
    paidRegistrations: number;
    freeRegistrations: number;
  };
  governance: {
    flagged: boolean;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  __v: number;
}

export interface EventSession {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  allowCheckIn: boolean;
  checkInStartTime?: string;
  checkInEndTime?: string;
  speakers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventTicket {
  _id: string;
  type: string;
  price: number;
  capacity: number;
  sold: number;
  salesStartTime: string;
  salesEndTime: string;
  isActive: boolean;
  isGroupTicket: boolean;
  groupSettings: {
    minParticipants: number;
    maxParticipants: number;
    groupLeaderRequired: boolean;
  };
}

export interface EventCustomField {
  _id: string;
  name: string;
  type: string;
  required: boolean;
}

export interface EventCoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
