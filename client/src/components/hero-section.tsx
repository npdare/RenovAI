import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white py-32 lg:py-40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <span className="text-xs tracking-widest text-gray-500 uppercase luxury-text">
              Artificial Intelligence • Interior Design
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-light text-black mb-12 leading-tight luxury-title">
            Transform
            <span className="block font-normal">
              Your Space
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed luxury-text">
            Professional AI-powered room visualization. Upload your photos, select your style, 
            and watch as our technology reimagines your space with sophisticated design precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => scrollToSection('studio')}
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-sm tracking-wide luxury-text"
            >
              ENTER STUDIO
              <ArrowRight className="w-4 h-4 ml-3" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-4 text-sm tracking-wide luxury-text"
            >
              VIEW GALLERY
            </Button>
          </div>
        </div>

        {/* Minimalist Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="w-1 h-16 bg-black mx-auto mb-6"></div>
            <h3 className="text-sm tracking-wide text-black mb-4 luxury-title">ANALYZE</h3>
            <p className="text-gray-600 luxury-text leading-relaxed">
              Our AI analyzes your space, identifying room type, current style, and optimization opportunities.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-1 h-16 bg-black mx-auto mb-6"></div>
            <h3 className="text-sm tracking-wide text-black mb-4 luxury-title">VISUALIZE</h3>
            <p className="text-gray-600 luxury-text leading-relaxed">
              Generate photorealistic redesigns in seconds using advanced DALL-E 3 technology.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-1 h-16 bg-black mx-auto mb-6"></div>
            <h3 className="text-sm tracking-wide text-black mb-4 luxury-title">TRANSFORM</h3>
            <p className="text-gray-600 luxury-text leading-relaxed">
              Receive curated product recommendations and professional design guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}