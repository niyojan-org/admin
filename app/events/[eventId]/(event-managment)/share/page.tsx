import SharePageClient from './share-page';
import { getReferralData } from './get-referral-data';

interface SharePageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { eventId } = await params;
  const { referrals, stats, coupons } = await getReferralData(eventId);

  return <SharePageClient initialReferrals={referrals} initialStats={stats} initialCoupons={coupons} />;
}
