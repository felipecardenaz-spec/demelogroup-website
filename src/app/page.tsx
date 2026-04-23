import { Hero } from "@/components/sections/hero";
import { LogoCarousel } from "@/components/sections/logo-carousel";
import { Stats } from "@/components/sections/stats";
import { ImpactAreas } from "@/components/sections/impact-areas";
import { Services } from "@/components/sections/services";

/**
 * Home Page — DeMeloApps
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoCarousel />
      <Stats />
      <ImpactAreas />
      <Services />
      {/* Future sections:
          <Process />
          <Testimonials />
          <CTA />
          <Footer />
      */}
    </>
  );
}
