import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import UploadSection from "@/components/upload-section";
import InspirationGallery from "@/components/inspiration-gallery";
import ProductShowcase from "@/components/product-showcase";
import DesignBoards from "@/components/design-boards";
import ComparisonTool from "@/components/comparison-tool";
import PricingSection from "@/components/pricing-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <UploadSection />
      <InspirationGallery />
      <ProductShowcase />
      <DesignBoards />
      <ComparisonTool />
      <PricingSection />
      <Footer />
    </div>
  );
}
