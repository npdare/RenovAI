import AIVisualizationV1 from "@/components/ai-visualization-v1";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Studio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-neutral-200 relative overflow-hidden">
      <Header />
      
      {/* Architectural Blueprint Background */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-width='0.5'%3E%3C!-- Floor plan grid --%3E%3Cpath d='M0 50h200M0 100h200M0 150h200M50 0v200M100 0v200M150 0v200'/%3E%3C!-- Room outlines --%3E%3Crect x='25' y='25' width='75' height='50' fill='none'/%3E%3Crect x='100' y='25' width='75' height='75' fill='none'/%3E%3Crect x='25' y='100' width='50' height='75' fill='none'/%3E%3Crect x='100' y='125' width='75' height='50' fill='none'/%3E%3C!-- Door openings --%3E%3Cpath d='M100 50h10M25 125h10M125 100v10'/%3E%3C!-- Windows --%3E%3Cpath d='M25 40h20M25 60h20M160 25v20M180 25v20'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px'
        }} />
      </div>

      {/* Geometric architectural elements */}
      <div className="absolute top-20 right-10 opacity-[0.03] pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <g stroke="#000000" strokeWidth="1" fill="none">
            <circle cx="150" cy="150" r="100" />
            <circle cx="150" cy="150" r="75" />
            <circle cx="150" cy="150" r="50" />
            <path d="M50 150h200M150 50v200M75 75l150 150M225 75L75 225" />
          </g>
        </svg>
      </div>

      {/* Modern architectural lines */}
      <div className="absolute bottom-10 left-10 opacity-[0.04] pointer-events-none">
        <svg width="250" height="200" viewBox="0 0 250 200">
          <g stroke="#000000" strokeWidth="0.8" fill="none">
            <path d="M0 100L125 20L250 100L125 180z" />
            <path d="M62.5 60L125 20L187.5 60L125 100z" />
            <path d="M31.25 80L125 20L218.75 80" />
            <path d="M0 100h250M50 120h150M75 140h100" />
          </g>
        </svg>
      </div>

      {/* Subtle material texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-gradient-to-br from-transparent via-stone-300 to-transparent"></div>

      <main className="pt-16 relative z-10">
        <AIVisualizationV1 />
      </main>
      <Footer />
    </div>
  );
}