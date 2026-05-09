import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { BestSellerSection } from '../components/BestSellerSection';
import { OfferBanner } from '../components/OfferBanner';
import { TrustBadges } from '../components/TrustBadges';
import { LifestyleSection } from '../components/LifestyleSection';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { SocialSection } from '../components/SocialSection';
import { Newsletter } from '../components/Newsletter';
import { useEffect } from 'react';



export function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <BestSellerSection />
      <OfferBanner />
      <TrustBadges />
      <LifestyleSection />
      <TestimonialSlider />
      <SocialSection />
      <Newsletter />
    </main>
  );
}
