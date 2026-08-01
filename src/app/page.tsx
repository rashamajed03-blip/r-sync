import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Screenshots } from "@/components/landing/Screenshots";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Screenshots />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
