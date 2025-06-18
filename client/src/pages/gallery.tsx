import InspirationGallery from "@/components/inspiration-gallery";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Gallery() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <InspirationGallery />
      </main>
      <Footer />
    </div>
  );
}