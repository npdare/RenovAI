import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import ProductShowcase from "@/components/product-showcase";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductShowcase />
      <Footer />
    </div>
  );
}
