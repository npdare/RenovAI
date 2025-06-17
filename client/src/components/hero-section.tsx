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
            Turn your imagination into architectural reality. Upload your space and watch as AI transforms 
            your vision into sophisticated design concepts with professional precision.
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

        {/* Feature Grid with Color Examples */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-blue-600 mx-auto mb-6"></div>
            <h3 className="text-sm tracking-wide text-black mb-4 luxury-title">IMAGINE</h3>
            <p className="text-gray-600 luxury-text leading-relaxed">
              Envision your dream space. Our AI analyzes your current room and understands your architectural vision.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-1 h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 mx-auto mb-6"></div>
            <h3 className="text-sm tracking-wide text-black mb-4 luxury-title">CREATE</h3>
            <p className="text-gray-600 luxury-text leading-relaxed">
              Transform imagination into architectural reality with photorealistic AI-generated design concepts.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-1 h-16 bg-gradient-to-b from-amber-500 to-amber-600 mx-auto mb-6"></div>
            <h3 className="text-sm tracking-wide text-black mb-4 luxury-title">REALIZE</h3>
            <p className="text-gray-600 luxury-text leading-relaxed">
              Bring your vision to life with curated product recommendations and professional architectural guidance.
            </p>
          </div>
        </div>

        {/* Colorful Design Examples */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <span className="text-xs tracking-widest text-gray-500 uppercase luxury-text">
              Transform Your Vision
            </span>
            <h3 className="text-2xl font-light text-black mt-4 luxury-title">
              From Imagination to Architecture
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs tracking-wide luxury-text">MODERN</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs tracking-wide luxury-text">NATURAL</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-amber-400 to-amber-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs tracking-wide luxury-text">WARM</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs tracking-wide luxury-text">LUXURY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}