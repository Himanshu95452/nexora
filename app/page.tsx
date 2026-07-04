import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { EmergencyBanner } from "@/components/landing/EmergencyBanner";
import { Services } from "@/components/landing/Services";
import { TrustStats } from "@/components/landing/TrustStats";

// Below-the-fold sections are loaded lazily to keep the initial bundle small
// and improve first-load performance (LCP/TTI).
const FeaturedProfessionals = dynamic(() => import("@/components/landing/FeaturedProfessionals").then(m => m.FeaturedProfessionals));
const BookingFlowPreview = dynamic(() => import("@/components/landing/BookingFlowPreview").then(m => m.BookingFlowPreview));
const WhyChoose = dynamic(() => import("@/components/landing/WhyChoose").then(m => m.WhyChoose));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks").then(m => m.HowItWorks));
const TrustProcess = dynamic(() => import("@/components/landing/TrustProcess").then(m => m.TrustProcess));
const ProfessionalCTA = dynamic(() => import("@/components/landing/ProfessionalCTA").then(m => m.ProfessionalCTA));
const SuccessStories = dynamic(() => import("@/components/landing/SuccessStories").then(m => m.SuccessStories));
const CustomerPromise = dynamic(() => import("@/components/landing/CustomerPromise").then(m => m.CustomerPromise));
const FutureVision = dynamic(() => import("@/components/landing/FutureVision").then(m => m.FutureVision));
const FAQ = dynamic(() => import("@/components/landing/FAQ").then(m => m.FAQ));

export default function HomePage() {
  return (
    <>
      <EmergencyBanner />
      <Navbar />
      <Hero />
      <TrustStats />
      <Services />
      <FeaturedProfessionals />
      <BookingFlowPreview />
      <WhyChoose />
      <HowItWorks />
      <TrustProcess />
      <ProfessionalCTA />
      <SuccessStories />
      <CustomerPromise />
      <FutureVision />
      <FAQ />
      <Footer />
    </>
  );
}
