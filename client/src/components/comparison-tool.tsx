import { useState } from "react";
import { Upload, Wand2, ArrowLeftRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/utils";
import type { Photo } from "@shared/schema";

export default function ComparisonTool() {
  const [selectedBefore, setSelectedBefore] = useState<Photo | null>(null);
  const [selectedAfter, setSelectedAfter] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay'>('side-by-side');

  const { data: homePhotos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos', { type: 'home' }],
    queryFn: () => fetch('/api/photos?type=home').then(res => res.json()),
  });

  // Sample after images for demonstration
  const sampleAfterImages = [
    {
      id: 'after-1',
      url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Modern Renovation'
    },
    {
      id: 'after-2', 
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      title: 'Contemporary Kitchen'
    }
  ];

  // Use the first available photo as default before image
  const defaultBefore = homePhotos[0] || null;
  const defaultAfter = sampleAfterImages[0];

  const beforeImage = selectedBefore || defaultBefore;
  const afterImage = selectedAfter || defaultAfter;

  return (
    <section id="compare" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-primary mb-4">Design Comparison</h3>
          <p className="text-lg text-secondary">See your transformations side by side</p>
        </div>

        {/* Comparison Interface */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Before Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-primary">Before</h4>
                <Button variant="ghost" className="text-accent hover:text-accent/80">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
              </div>
              <div className="relative group">
                {beforeImage ? (
                  <img
                    src={getImageUrl(beforeImage.url)}
                    alt="Original room before renovation"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Upload a photo to get started</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg"></div>
              </div>
              <p className="text-sm text-secondary mt-2">
                {beforeImage ? `${beforeImage.originalName} • Uploaded ${new Date(beforeImage.uploadedAt).toLocaleDateString()}` : 'No photo selected'}
              </p>
            </div>

            {/* After Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-primary">After</h4>
                <Button variant="ghost" className="text-accent hover:text-accent/80">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Apply Design
                </Button>
              </div>
              <div className="relative group">
                <img
                  src={afterImage.url}
                  alt="Renovated room after design"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg"></div>
              </div>
              <p className="text-sm text-secondary mt-2">
                {afterImage.title} • Design applied
              </p>
            </div>
          </div>

          {/* Comparison Controls */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={() => setViewMode('side-by-side')}
              variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
              className={viewMode === 'side-by-side' ? 'bg-accent text-white hover:bg-accent/90' : 'border-accent text-accent hover:bg-accent hover:text-white'}
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Split View
            </Button>
            <Button
              onClick={() => setViewMode('overlay')}
              variant={viewMode === 'overlay' ? 'default' : 'outline'}
              className={viewMode === 'overlay' ? 'bg-accent text-white hover:bg-accent/90' : 'border-accent text-accent hover:bg-accent hover:text-white'}
            >
              <Eye className="mr-2 h-4 w-4" />
              Overlay Mode
            </Button>
            <Button variant="outline" className="border-gray-300 text-secondary hover:border-accent hover:text-accent">
              <Download className="mr-2 h-4 w-4" />
              Export Comparison
            </Button>
          </div>
        </div>

        {/* Design Options Panel */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-primary mb-4">Design Application Options</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-accent transition-colors cursor-pointer">
              <h5 className="font-medium text-primary mb-2">Color Scheme</h5>
              <p className="text-sm text-secondary">Apply new colors to walls and furniture</p>
              <div className="flex space-x-2 mt-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-accent rounded-full"></div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-accent transition-colors cursor-pointer">
              <h5 className="font-medium text-primary mb-2">Furniture Style</h5>
              <p className="text-sm text-secondary">Replace with modern furniture pieces</p>
              <div className="text-xs text-accent mt-2 font-medium">Modern • Minimalist</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-accent transition-colors cursor-pointer">
              <h5 className="font-medium text-primary mb-2">Lighting</h5>
              <p className="text-sm text-secondary">Enhance natural and artificial lighting</p>
              <div className="text-xs text-accent mt-2 font-medium">Bright • Warm</div>
            </div>
          </div>
        </div>

        {/* Photo Selection Grid */}
        {homePhotos.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-primary mb-4">Select Before Photo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {homePhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedBefore(photo)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedBefore?.id === photo.id || (photo.id === defaultBefore?.id && !selectedBefore)
                      ? 'border-accent scale-105' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={getImageUrl(photo.url)}
                    alt={photo.originalName}
                    className="w-full h-20 object-cover"
                  />
                  {(selectedBefore?.id === photo.id || (photo.id === defaultBefore?.id && !selectedBefore)) && (
                    <div className="absolute inset-0 bg-accent bg-opacity-20 flex items-center justify-center">
                      <div className="w-4 h-4 bg-accent rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
