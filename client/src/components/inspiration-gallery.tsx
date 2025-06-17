import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function InspirationGallery() {
  // Sample inspiration images with vibrant color palettes
  const inspirationImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Modern Minimalist Living',
      style: 'Contemporary',
      colors: ['#3B82F6', '#EF4444', '#10B981'],
      colorName: 'Bold & Dynamic'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Scandinavian Elegance',
      style: 'Scandinavian',
      colors: ['#10B981', '#F59E0B', '#8B5CF6'],
      colorName: 'Natural Harmony'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Industrial Chic',
      style: 'Industrial',
      colors: ['#F59E0B', '#EF4444', '#6366F1'],
      colorName: 'Warm & Rich'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Bohemian Comfort',
      style: 'Bohemian',
      colors: ['#8B5CF6', '#EC4899', '#F59E0B'],
      colorName: 'Vibrant Spirit'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Classic Traditional',
      style: 'Traditional',
      colors: ['#EF4444', '#F59E0B', '#10B981'],
      colorName: 'Timeless Elegance'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Contemporary Luxury',
      style: 'Luxury',
      colors: ['#6366F1', '#EC4899', '#3B82F6'],
      colorName: 'Sophisticated Blues'
    }
  ];

  return (
    <section id="inspiration" className="relative overflow-hidden">
      {/* Architectural Video Background for Inspiration Section */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source 
            src="https://player.vimeo.com/external/434045526.hd.mp4?s=c27edd39c0fd62c0138129d93db85c8b1a20c398&profile_id=175"
            type="video/mp4"
          />
          {/* Fallback architectural image */}
        </video>
        
        {/* Subtle overlay to maintain readability */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="mb-6">
              <span className="text-xs tracking-widest text-gray-700 uppercase luxury-text">
                Design Gallery
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-light text-black mb-8 luxury-title">
              Inspiration Gallery
            </h2>
            
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed luxury-text">
              Explore curated design concepts that transform imagination into architectural reality. 
              Each style showcases how color and form create distinctive living experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inspirationImages.map((image) => (
              <Card key={image.id} className="minimal-card overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Color Palette Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2 mb-3">
                      {image.colors.map((color, index) => (
                        <div 
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded">
                      <span className="text-xs tracking-wide text-black luxury-text">
                        {image.colorName}
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-wide text-gray-500 uppercase luxury-text">
                      {image.style}
                    </span>
                    <Palette className="w-4 h-4 text-gray-400" />
                  </div>
                  <h3 className="text-sm text-black luxury-title tracking-wide">
                    {image.title.toUpperCase()}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Color Inspiration Section */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h3 className="text-2xl font-light text-black mb-4 luxury-title">
                Color Your Vision
              </h3>
              <p className="text-gray-600 luxury-text max-w-xl mx-auto">
                Transform your imagination with bold color palettes that bring architectural concepts to life.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm flex items-end justify-center p-4">
                <span className="text-white text-xs tracking-wide luxury-text">OCEAN</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-sm flex items-end justify-center p-4">
                <span className="text-white text-xs tracking-wide luxury-text">NATURE</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-400 to-amber-600 rounded-sm flex items-end justify-center p-4">
                <span className="text-white text-xs tracking-wide luxury-text">SUNSET</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-600 rounded-sm flex items-end justify-center p-4">
                <span className="text-white text-xs tracking-wide luxury-text">LUXURY</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-red-400 to-red-600 rounded-sm flex items-end justify-center p-4">
                <span className="text-white text-xs tracking-wide luxury-text">PASSION</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-sm flex items-end justify-center p-4">
                <span className="text-white text-xs tracking-wide luxury-text">DEPTH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}