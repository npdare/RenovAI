import PricingSection from "@/components/pricing-section";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}