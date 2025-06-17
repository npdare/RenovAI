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
            src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
          <source 
            src="https://videos.pexels.com/video-files/6010/6010-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200)'
            }}
          ></div>
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
              className="bg-white/95 hover:bg-white text-black px-16 py-6 text-xs tracking-widest luxury-text font-medium border-2 border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              ENTER STUDIO
              <svg className="w-5 h-5 ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/60 text-white hover:bg-white/15 px-16 py-6 text-xs tracking-widest luxury-text font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              VIEW GALLERY
              <svg className="w-5 h-5 ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Feature Grid with Clean Icons */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9"/>
                <path d="M16 8l-8 8"/>
                <path d="M8 8l8 8"/>
              </svg>
            </div>
            <h3 className="text-sm tracking-widest text-white/95 mb-4 luxury-title font-medium">IMAGINE</h3>
            <p className="text-white/80 luxury-text leading-relaxed text-sm">
              Envision your dream space. Our AI analyzes your current room and understands your architectural vision.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 className="text-sm tracking-widest text-white/95 mb-4 luxury-title font-medium">CREATE</h3>
            <p className="text-white/80 luxury-text leading-relaxed text-sm">
              Transform imagination into architectural reality with photorealistic AI-generated design concepts.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <h3 className="text-sm tracking-widest text-white/95 mb-4 luxury-title font-medium">REALIZE</h3>
            <p className="text-white/80 luxury-text leading-relaxed text-sm">
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