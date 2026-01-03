import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { DemoSection } from "@/components/landing/demo-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FAQSection } from "@/components/landing/faq-section"
import { Footer } from "@/components/landing/footer"
import { StickyCTA } from "@/components/landing/sticky-cta"
import { WebhookInitializer } from "@/components/webhook-initializer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <WebhookInitializer />
      <Header />
      <HeroSection />
      <section id="features">
        <FeaturesSection />
      </section>
      <DemoSection />
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="faq">
        <FAQSection />
      </section>
      <div className="pb-24 md:pb-0">
        <Footer />
      </div>
      <StickyCTA />
    </main>
  )
}
