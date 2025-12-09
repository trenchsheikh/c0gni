'use client';

import ScrollNavigation from '@/components/ScrollNavigation';
import HeroSection from '@/components/HeroSection';
import PartnerLogos from '@/components/PartnerLogos';
import { MacbookScrollDemo } from '@/components/MacbookScrollDemo';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen transition-colors duration-500">
      <ScrollNavigation />
      <HeroSection />
      <PartnerLogos />
      <MacbookScrollDemo />
      <ProcessSection />
      <ServicesSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
