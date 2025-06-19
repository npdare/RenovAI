import AIVisualization from "@/components/ai-visualization";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Studio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-800">
      <Header />
      <main className="pt-16">
        {/* Subtle architectural pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <AIVisualization />
      </main>
      <Footer />
    </div>
  );
}