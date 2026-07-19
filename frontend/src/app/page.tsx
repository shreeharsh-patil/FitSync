import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeatureCarousel } from "@/components/flavor-carousel"
import { BentoGrid } from "@/components/bento-grid"
import { ActivationsSection } from "@/components/activations-section"
import { LifestyleSection } from "@/components/lifestyle-section"
import { SocialSection } from "@/components/social-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeatureCarousel />
      <BentoGrid />
      <ActivationsSection />
      <LifestyleSection />
      <SocialSection />
      <Footer />
    </main>
  )
}
