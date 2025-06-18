import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Camera, Sparkles, ArrowRight, Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIAnalysis {
  roomType: string;
  currentStyle: string;
  suggestions: string[];
  colorPalette: string[];
  furnitureRecommendations: string[];
}

interface AIVisualizationResult {
  imageUrl: string;
  description: string;
  styleApplied: string;
  designNotes: string[];
}

export default function AIVisualization() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [designStyle, setDesignStyle] = useState("modern");
  const [roomType, setRoomType] = useState("living room");
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [visualization, setVisualization] = useState<AIVisualizationResult | null>(null);
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setAnalysis(null);
        setVisualization(null);
      }
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
    onSuccess: (data: AIAnalysis) => {
      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: `Detected ${data.roomType} with ${data.currentStyle} style`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    }
  });

  const redesignMutation = useMutation({
    mutationFn: async ({ file, style, room }: { file: File; style: string; room: string }) => {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('designStyle', style);
      formData.append('roomType', room);
      const response = await fetch('/api/ai/redesign', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Redesign failed');
      return response.json();
    },
    onSuccess: (data: AIVisualizationResult) => {
      setVisualization(data);
      toast({
        title: "Redesign Generated",
        description: `Created ${data.styleApplied} visualization`,
      });
    },
    onError: (error) => {
      toast({
        title: "Redesign Failed",
        description: "Could not generate redesign. Please try again.",
        variant: "destructive",
      });
    }
  });

  const inspirationMutation = useMutation({
    mutationFn: async ({ style, room }: { style: string; room: string }) => {
      const response = await fetch('/api/ai/inspiration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style, roomType: room }),
      });
      if (!response.ok) throw new Error('Inspiration failed');
      return response.json();
    },
    onSuccess: (data: AIVisualizationResult) => {
      setVisualization(data);
      toast({
        title: "Inspiration Generated",
        description: `Created ${data.styleApplied} inspiration`,
      });
    },
    onError: (error) => {
      toast({
        title: "Inspiration Failed",
        description: "Could not generate inspiration. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeMutation.mutate(selectedFile);
    }
  };

  const handleRedesign = () => {
    if (selectedFile) {
      redesignMutation.mutate({
        file: selectedFile,
        style: designStyle,
        room: roomType
      });
    }
  };

  const handleGenerateInspiration = () => {
    inspirationMutation.mutate({
      style: designStyle,
      room: roomType
    });
  };

  const designStyles = [
    "modern", "contemporary", "scandinavian", "minimalist", "industrial", 
    "bohemian", "traditional", "transitional", "farmhouse", "mid-century"
  ];

  const roomTypes = [
    "living room", "bedroom", "kitchen", "bathroom", "dining room", 
    "home office", "nursery", "basement", "attic", "patio"
  ];

  return (
    <section id="studio" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="mb-6">
            <span className="text-xs tracking-widest text-gray-500 uppercase luxury-text">
              AI Design Studio
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light text-black mb-8 luxury-title">
            Visualization Studio
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed luxury-text">
            Transform your imagination into architectural reality. Upload your space and watch 
            as AI brings your design vision to life with professional precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload and Controls */}
          <div className="space-y-8">
            {/* File Upload */}
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="luxury-title text-black text-sm tracking-wide">
                  UPLOAD ROOM PHOTO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`upload-area ${isDragActive ? 'dragover' : ''}`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-neutral-700 mb-2">
                    {isDragActive ? 'Drop your photo here' : 'Drop or click to upload'}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Supports JPEG, PNG, WebP up to 10MB
                  </p>
                </div>
                
                {previewUrl && (
                  <div className="mt-6">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Style and Room Controls */}
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="luxury-title text-black text-sm tracking-wide">
                  DESIGN PREFERENCES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Design Style
                  </label>
                  <Select value={designStyle} onValueChange={setDesignStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {designStyles.map(style => (
                        <SelectItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Room Type
                  </label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(room => (
                        <SelectItem key={room} value={room}>
                          {room.charAt(0).toUpperCase() + room.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzeMutation.isPending}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white border-2 border-black luxury-text text-xs tracking-widest font-medium transition-all duration-300 hover:scale-105"
              >
                <span className="text-white">
                  {analyzeMutation.isPending ? 'ANALYZING...' : 'ANALYZE ROOM'}
                </span>
                <ArrowRight className="w-4 h-4 ml-3 text-white" />
              </Button>

              <Button 
                onClick={handleRedesign}
                disabled={!selectedFile || redesignMutation.isPending}
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 text-black hover:bg-gray-50 luxury-text text-xs tracking-widest font-medium transition-all duration-300 hover:scale-105"
              >
                <span className="text-black">
                  {redesignMutation.isPending ? 'GENERATING...' : 'GENERATE REDESIGN'}
                </span>
                <Wand2 className="w-4 h-4 ml-3 text-black" />
              </Button>

              <Button 
                onClick={handleGenerateInspiration}
                disabled={inspirationMutation.isPending}
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 text-black hover:bg-gray-50 luxury-text text-xs tracking-widest font-medium transition-all duration-300 hover:scale-105"
              >
                <span className="text-black">
                  {inspirationMutation.isPending ? 'CREATING...' : 'GENERATE INSPIRATION'}
                </span>
                <Sparkles className="w-4 h-4 ml-3 text-black" />
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6">
                {analysis ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Room Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-neutral-700">Room Type</h4>
                        <p className="text-neutral-600">{analysis.roomType}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-neutral-700">Current Style</h4>
                        <p className="text-neutral-600">{analysis.currentStyle}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-neutral-700">Color Palette</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {analysis.colorPalette.map((color, index) => (
                            <Badge key={index} variant="outline">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-neutral-700">Suggestions</h4>
                        <ul className="list-disc list-inside space-y-1 text-neutral-600 mt-2">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-neutral-700">Furniture Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1 text-neutral-600 mt-2">
                          {analysis.furnitureRecommendations.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Camera className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">Upload a photo and click Analyze to see AI insights</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="visualization" className="space-y-6">
                {visualization ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{visualization.description}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <img 
                        src={visualization.imageUrl} 
                        alt={visualization.description}
                        className="w-full rounded-lg shadow-lg"
                      />
                      
                      <div>
                        <h4 className="font-medium text-neutral-700">Style Applied</h4>
                        <p className="text-neutral-600">{visualization.styleApplied}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-neutral-700">Design Notes</h4>
                        <ul className="list-disc list-inside space-y-1 text-neutral-600 mt-2">
                          {visualization.designNotes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Wand2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">Generate a redesign or inspiration to see AI visualizations</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}