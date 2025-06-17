import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Link, Heart, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getImageUrl } from "@/lib/utils";
import type { Photo } from "@shared/schema";

const SAMPLE_INSPIRATIONS = [
  {
    id: 'sample-1',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    title: 'Modern Kitchen Design',
    description: 'Marble countertops with pendant lighting',
    category: 'Kitchen'
  },
  {
    id: 'sample-2',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    title: 'Scandinavian Bedroom',
    description: 'Natural wood with neutral tones',
    category: 'Bedroom'
  },
  {
    id: 'sample-3',
    url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    title: 'Minimalist Bathroom',
    description: 'Stone tiles with modern fixtures',
    category: 'Bathroom'
  },
  {
    id: 'sample-4',
    url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    title: 'Contemporary Living',
    description: 'Sectional with accent lighting',
    category: 'Living Room'
  },
  {
    id: 'sample-5',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    title: 'Industrial Dining',
    description: 'Exposed brick with pendant lights',
    category: 'Dining'
  },
  {
    id: 'sample-6',
    url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    title: 'Rustic Home Office',
    description: 'Wooden desk with vintage accents',
    category: 'Office'
  }
];

export default function InspirationGallery() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUrlOpen, setIsUrlOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inspirationPhotos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos', { type: 'inspiration' }],
    queryFn: () => fetch('/api/photos?type=inspiration').then(res => res.json()),
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('photos', file));
      formData.append('type', 'inspiration');
      formData.append('userId', '1');

      const response = await apiRequest('POST', '/api/photos/upload', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      toast({
        title: "Inspiration uploaded",
        description: "Your inspiration images have been added successfully.",
      });
      setIsUploadOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadMutation.mutate(acceptedFiles);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    // TODO: Implement URL-based inspiration saving
    toast({
      title: "URL saved",
      description: "The inspiration URL has been saved to your collection.",
    });
    setUrlInput('');
    setIsUrlOpen(false);
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <section id="inspiration" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-primary mb-4">Design Inspiration</h3>
          <p className="text-lg text-secondary">Discover and save design ideas for your project</p>
        </div>

        {/* Upload Inspiration Section */}
        <div className="mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-primary mb-2">Add Your Inspiration</h4>
                <p className="text-secondary">Upload images or paste Pinterest/design URLs</p>
              </div>
              <div className="flex gap-3">
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent text-white hover:bg-accent/90">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Inspiration Images</DialogTitle>
                    </DialogHeader>
                    <div
                      {...getRootProps()}
                      className={`upload-area ${isDragActive ? 'dragover' : ''} min-h-[200px] flex flex-col items-center justify-center`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      {isDragActive ? (
                        <p className="text-accent font-medium">Drop the files here...</p>
                      ) : (
                        <div className="text-center">
                          <p className="text-secondary mb-2">Drag & drop images here, or click to select</p>
                          <p className="text-sm text-gray-500">JPG, PNG, WebP up to 10MB each</p>
                        </div>
                      )}
                    </div>
                    {uploadMutation.isPending && (
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                          <span className="text-secondary">Uploading...</span>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog open={isUrlOpen} onOpenChange={setIsUrlOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                      <Link className="mr-2 h-4 w-4" />
                      Add URL
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Inspiration URL</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Paste Pinterest or design URL here..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUrlSubmit}
                          className="flex-1 bg-accent text-white hover:bg-accent/90"
                          disabled={!urlInput.trim()}
                        >
                          Save URL
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsUrlOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Inspiration Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* User uploaded inspirations */}
          {inspirationPhotos.map((photo) => (
            <div key={photo.id} className="gallery-item">
              <div className="relative">
                <img
                  src={getImageUrl(photo.url)}
                  alt={photo.originalName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                    onClick={() => toggleFavorite(`photo-${photo.id}`)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.has(`photo-${photo.id}`) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {photo.category || 'Custom'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h5 className="font-semibold text-primary mb-1">{photo.originalName}</h5>
                <p className="text-sm text-secondary">Uploaded inspiration</p>
              </div>
            </div>
          ))}

          {/* Sample inspirations */}
          {SAMPLE_INSPIRATIONS.map((item) => (
            <div key={item.id} className="gallery-item">
              <div className="relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                    onClick={() => toggleFavorite(item.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.has(item.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h5 className="font-semibold text-primary mb-1">{item.title}</h5>
                <p className="text-sm text-secondary">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-gray-300 text-secondary hover:border-accent hover:text-accent">
            <Plus className="mr-2 h-4 w-4" />
            Load More Inspiration
          </Button>
        </div>
      </div>
    </section>
  );
}
