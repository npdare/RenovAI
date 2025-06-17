import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, FileImage, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getImageUrl, formatFileSize } from "@/lib/utils";
import type { Photo } from "@shared/schema";

export default function UploadSection() {
  const [activeType, setActiveType] = useState<'photos' | 'plans' | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ files, type }: { files: File[], type: string }) => {
      const formData = new FormData();
      files.forEach(file => formData.append('photos', file));
      formData.append('type', type);
      formData.append('userId', '1');

      const response = await apiRequest('POST', '/api/photos/upload', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      toast({
        title: "Upload successful",
        description: "Your photos have been uploaded successfully.",
      });
      setActiveType(null);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (photoId: number) => {
      await apiRequest('DELETE', `/api/photos/${photoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      toast({
        title: "Photo deleted",
        description: "The photo has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], type: 'photos' | 'plans') => {
    if (acceptedFiles.length > 0) {
      uploadMutation.mutate({ 
        files: acceptedFiles, 
        type: type === 'photos' ? 'home' : 'floorplan' 
      });
    }
  }, [uploadMutation]);

  const photoDropzone = useDropzone({
    onDrop: (files) => onDrop(files, 'photos'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const planDropzone = useDropzone({
    onDrop: (files) => onDrop(files, 'plans'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 15 * 1024 * 1024, // 15MB
  });

  const homePhotos = photos.filter(p => p.type === 'home');
  const floorPlans = photos.filter(p => p.type === 'floorplan');

  return (
    <section id="upload" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-6 inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-sm font-medium">
            <Camera className="w-3 h-3 mr-2" />
            AI VISUALIZATION STUDIO
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6" style={{ fontFamily: 'Playfair Display' }}>
            Transform Your Space
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Upload photos of your rooms and floor plans to begin your AI-powered design transformation journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Home Photos Upload */}
          <div
            {...photoDropzone.getRootProps()}
            className={`upload-area ${photoDropzone.isDragActive ? 'dragover' : ''}`}
          >
            <input {...photoDropzone.getInputProps()} />
            <Camera className="text-4xl text-gray-400 mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-primary mb-2">Room Photos</h4>
            <p className="text-secondary mb-4">Upload photos of your rooms and spaces</p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <Plus className="text-accent mr-2 inline" />
              <span className="text-accent font-medium">Choose Files</span>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG, WebP up to 10MB each</p>
            </div>
          </div>

          {/* Floor Plans Upload */}
          <div
            {...planDropzone.getRootProps()}
            className={`upload-area ${planDropzone.isDragActive ? 'dragover' : ''}`}
          >
            <input {...planDropzone.getInputProps()} />
            <FileImage className="text-4xl text-gray-400 mb-4 mx-auto" />
            <h4 className="text-xl font-semibold text-primary mb-2">Floor Plans</h4>
            <p className="text-secondary mb-4">Upload architectural plans and blueprints</p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <Plus className="text-accent mr-2 inline" />
              <span className="text-accent font-medium">Choose Files</span>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG, PDF up to 15MB each</p>
            </div>
          </div>
        </div>

        {/* Uploaded Images Preview */}
        {(homePhotos.length > 0 || floorPlans.length > 0) && (
          <div className="mt-12">
            <h4 className="text-xl font-semibold text-primary mb-6">Your Uploaded Photos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {homePhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={getImageUrl(photo.url)}
                    alt={photo.originalName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full w-6 h-6 p-0"
                      onClick={() => deleteMutation.mutate(photo.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {photo.type === 'home' ? 'Room' : 'Plan'}
                    </span>
                  </div>
                </div>
              ))}
              {floorPlans.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={getImageUrl(photo.url)}
                    alt={photo.originalName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full w-6 h-6 p-0"
                      onClick={() => deleteMutation.mutate(photo.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      Plan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadMutation.isPending && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
              <span className="text-secondary">Uploading photos...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
