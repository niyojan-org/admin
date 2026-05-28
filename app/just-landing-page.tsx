import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Capabilities } from '@/components/landing/Capabilities';
import { Security } from '@/components/landing/Security';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { Philosophy } from '@/components/landing/Philosophy';
import { Footer } from '@/components/landing/Footer';

export default function JustLandingPage() {
  return (
    <div className="h-full">
      <Header />
      <main>
        <Hero />
        <Capabilities />
        <Security />
        <DashboardPreview />
        <Philosophy />
      </main>
      <Footer />
    </div>
  );
}
