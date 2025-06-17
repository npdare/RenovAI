import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Architectural Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source 
            src="https://player.vimeo.com/external/342571828.hd.mp4?s=54d3f8c7c9bbda03b1b6e28b48c0f9ab3bfb9def&profile_id=175"
            type="video/mp4"
          />
          {/* Fallback architectural image */}
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200"
            alt="Modern architectural interior"
            className="w-full h-full object-cover"
          />
        </video>
        
        {/* Sophisticated overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        <div className="text-center">
          <div className="mb-8">
            <span className="text-xs tracking-widest text-white/80 uppercase luxury-text">
              Artificial Intelligence • Interior Design
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-light text-white mb-12 leading-tight luxury-title">
            Transform
            <span className="block font-normal">
              Your Space
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-white/90 mb-16 max-w-2xl mx-auto leading-relaxed luxury-text">
            Turn your imagination into architectural reality. Upload your space and watch as AI transforms 
            your vision into sophisticated design concepts with professional precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => scrollToSection('studio')}
              size="lg" 
              className="bg-white hover:bg-gray-100 text-black px-12 py-4 text-sm tracking-wide luxury-text border border-white/20"
            >
              ENTER STUDIO
              <ArrowRight className="w-4 h-4 ml-3" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/40 text-white hover:bg-white/10 px-12 py-4 text-sm tracking-wide luxury-text backdrop-blur-sm"
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