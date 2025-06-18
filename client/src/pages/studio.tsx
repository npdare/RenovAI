import AIVisualization from "@/components/ai-visualization";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Studio() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <AIVisualization />
      </main>
      <Footer />
    </div>
  );
}