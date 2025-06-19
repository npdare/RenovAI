import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Camera, 
  Wand2, 
  ArrowRight, 
  CheckCircle,
  Eye,
  Home,
  Palette
} from 'lucide-react';

// Production-ready interfaces
interface UploadedPhoto {
  file: File;
  preview: string;
  type: 'interior' | 'exterior' | 'auto-detected';
}

interface DesignInspiration {
  type: 'text' | 'images';
  textPrompt?: string;
  referenceImages?: File[];
}

interface DetectedCategory {
  name: string;
  alignedElement: string;
  items: string[];
  visualExamples: string[];
  confidence: number;
}

interface DesignParameters {
  style: string;
  roomType: string;
  spaceType: 'interior' | 'exterior';
  detectedCategories: DetectedCategory[];
  materials: string[];
  colorPalette: string[];
  furnitureTypes: string[];
  wallCladding: string[];
  flooringMaterial: string[];
  ceilingDetails: string[];
  lightingFixtures: string[];
  architecturalFeatures: string[];
}

interface ArchitecturalElement {
  category: string;
  specificType: string;
  quantity?: string;
  currentCondition: string;
  alternatives: string[];
  action: 'retain' | 'inspiration' | 'select';
  selectedStyle: string;
}

interface ArchitecturalAnalysis {
  elements: ArchitecturalElement[];
  roomStructure: string;
  detectedFeatures: string[];
}

interface TransformationResult {
  originalImage: string;
  transformedImage: string;
  transformationStrength: number;
  appliedParameters: DesignParameters;
}

type WorkflowStep = 'upload' | 'architecture' | 'inspiration' | 'parameters' | 'transform' | 'review';

export default function AIVisualizationProduction() {
  // Core workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [progress, setProgress] = useState(0);
  
  // Step 1: Photo Upload
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedPhoto | null>(null);
  
  // Step 2: Architectural Analysis
  const [architecturalAnalysis, setArchitecturalAnalysis] = useState<ArchitecturalAnalysis | null>(null);
  const [editableArchitecture, setEditableArchitecture] = useState<ArchitecturalAnalysis | null>(null);
  
  // Step 3: Design Inspiration
  const [inspiration, setInspiration] = useState<DesignInspiration>({ type: 'text' });
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  
  // Step 4: Design Parameters
  const [extractedParameters, setExtractedParameters] = useState<DesignParameters | null>(null);
  const [editableParameters, setEditableParameters] = useState<DesignParameters | null>(null);
  const [parametersConfirmed, setParametersConfirmed] = useState(false);
  
  // Step 5: Transformation
  const [transformationResult, setTransformationResult] = useState<TransformationResult | null>(null);
  const [transformationStrength, setTransformationStrength] = useState([75]);
  
  const uploadedPhotoRef = useRef<HTMLDivElement>(null);
  const architecturalStepRef = useRef<HTMLDivElement>(null);
  const inspirationStepRef = useRef<HTMLDivElement>(null);
  const parametersStepRef = useRef<HTMLDivElement>(null);
  const transformStepRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Photo Upload Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setUploadedPhoto({
          file,
          preview,
          type: 'auto-detected'
        });
        setProgress(10);
        
        setTimeout(() => {
          uploadedPhotoRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
      }
    },
    onDropRejected: () => {
      toast({
        title: "Upload Error",
        description: "Please upload a valid image file under 10MB",
        variant: "destructive"
      });
    }
  });

  // Reference Images Dropzone
  const referenceDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setReferenceImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  // Architectural Analysis Mutation
  const architecturalAnalysisMutation = useMutation({
    mutationFn: async (): Promise<ArchitecturalAnalysis> => {
      const formData = new FormData();
      if (uploadedPhoto) {
        formData.append('photo', uploadedPhoto.file);
      }

      const response = await fetch('/api/ai/analyze-architecture', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze architecture');
      }
      
      return response.json();
    },
    onSuccess: (data: ArchitecturalAnalysis) => {
      setArchitecturalAnalysis(data);
      setEditableArchitecture(data);
      setCurrentStep('architecture');
      setProgress(20);
      
      setTimeout(() => {
        architecturalStepRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 500);
      
      toast({
        title: "Architecture Analyzed",
        description: "Review detected structural elements and choose modifications"
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze architectural elements",
        variant: "destructive"
      });
    }
  });

  // Extract Design Parameters Mutation
  const extractParametersMutation = useMutation({
    mutationFn: async (): Promise<DesignParameters> => {
      const formData = new FormData();
      if (uploadedPhoto) {
        formData.append('photo', uploadedPhoto.file);
      }
      
      if (editableArchitecture) {
        formData.append('architecturalElements', JSON.stringify(editableArchitecture.elements));
      }
      
      if (inspiration.type === 'text' && inspiration.textPrompt) {
        formData.append('textPrompt', inspiration.textPrompt);
      }
      
      if (inspiration.type === 'images' && referenceImages.length > 0) {
        referenceImages.forEach((img, index) => {
          formData.append(`referenceImage${index}`, img);
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      try {
        const response = await fetch('/api/ai/extract-parameters', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to extract parameters');
        }
        
        return response.json();
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error?.name === 'AbortError') {
          throw new Error('Request timed out - please try again');
        }
        throw error;
      }
    },
    onSuccess: (data: DesignParameters) => {
      setExtractedParameters(data);
      setEditableParameters(data);
      setCurrentStep('parameters');
      setProgress(50);
      
      setTimeout(() => {
        parametersStepRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      toast({
        title: "Analysis Complete",
        description: "Design parameters extracted successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Issue",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  // Transform Image Mutation (Production V1 Pipeline)
  const transformImageMutation = useMutation({
    mutationFn: async (): Promise<TransformationResult> => {
      const formData = new FormData();
      if (uploadedPhoto && editableParameters) {
        formData.append('photo', uploadedPhoto.file);
        formData.append('parameters', JSON.stringify(editableParameters));
        formData.append('strength', transformationStrength[0].toString());
      }

      const response = await fetch('/api/ai/transform-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to transform image');
      }
      
      return response.json();
    },
    onSuccess: (data: TransformationResult) => {
      setTransformationResult(data);
      setCurrentStep('review');
      setProgress(100);
      
      setTimeout(() => {
        transformStepRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      toast({
        title: "Transformation Complete",
        description: "Your design visualization is ready"
      });
    },
    onError: () => {
      toast({
        title: "Transformation Failed",
        description: "Unable to generate design visualization",
        variant: "destructive"
      });
    }
  });

  const handleContinueToInspiration = () => {
    setCurrentStep('inspiration');
    setTimeout(() => {
      inspirationStepRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleConfirmParameters = () => {
    setParametersConfirmed(true);
    setCurrentStep('transform');
    setTimeout(() => {
      transformStepRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderUploadStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-black luxury-title">Upload Photo</h2>
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
            Production Ready
          </Badge>
        </div>
        <p className="text-gray-600">
          Upload an interior or exterior photo to begin your AI-powered design transformation
        </p>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your photo here' : 'Drag & drop your photo here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse • JPEG, PNG, WEBP, HEIC up to 10MB
              </p>
            </div>
          </div>
        </div>

        {uploadedPhoto && (
          <div ref={uploadedPhotoRef} className="mt-8 space-y-4 slide-in">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Photo uploaded successfully</span>
              </div>
              
              <img 
                src={uploadedPhoto.preview}
                alt="Uploaded"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              
              <Button 
                onClick={() => architecturalAnalysisMutation.mutate()}
                disabled={architecturalAnalysisMutation.isPending}
                className="w-full"
              >
                {architecturalAnalysisMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Architecture...
                  </>
                ) : (
                  <>
                    Analyze Architecture <Eye className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Upload</span>
            <span>Architecture</span>
            <span>Inspiration</span>
            <span>Parameters</span>
            <span>Transform</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Steps */}
        {currentStep === 'upload' && renderUploadStep()}
        
        {/* Add other steps here when needed */}
        
      </div>
    </div>
  );
}