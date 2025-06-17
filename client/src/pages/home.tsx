import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import UploadSection from "@/components/upload-section";
import InspirationGallery from "@/components/inspiration-gallery";
import DesignBoards from "@/components/design-boards";
import ComparisonTool from "@/components/comparison-tool";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <UploadSection />
      <InspirationGallery />
      <DesignBoards />
      <ComparisonTool />
      <Footer />
    </div>
  );
}
