import { Sparkles, ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-b from-neutral-50 to-white py-24 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/30 to-orange-50/30"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 font-medium">
            <Sparkles className="w-3 h-3 mr-2" />
            AI-POWERED DESIGN VISUALIZATION
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 mb-8 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            Reimagine Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Living Space
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Transform any room instantly with professional-grade AI visualization. 
            Upload your photos and discover endless design possibilities curated by interior design experts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={scrollToUpload}
              className="bg-neutral-900 text-white hover:bg-neutral-800 px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 group"
              size="lg"
            >
              <Camera className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Your Transformation
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="text-center sm:text-left">
              <p className="text-sm text-neutral-500 font-medium">FREE TRIAL INCLUDES</p>
              <p className="text-neutral-700 font-medium">3 Room Visualizations</p>
            </div>
          </div>
        </div>

        {/* Featured Projects Preview */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Modern living room transformation"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-semibold">Modern Minimalist</p>
                <p className="text-sm text-white/80">Living Room Redesign</p>
              </div>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Luxury kitchen design"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-semibold">Contemporary Luxury</p>
                <p className="text-sm text-white/80">Kitchen Transformation</p>
              </div>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img 
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Scandinavian bedroom design"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-semibold">Scandinavian Chic</p>
                <p className="text-sm text-white/80">Bedroom Sanctuary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
