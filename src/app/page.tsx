import { Hero } from "@/components/sections/hero";
import { LogoCarousel } from "@/components/sections/logo-carousel";
import { Stats } from "@/components/sections/stats";
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
      <Services />
      {/* Future sections:
          <Services />
          <Process />
          <Testimonials />
          <CTA />
          <Footer />
      */}
    </>
  );
}
