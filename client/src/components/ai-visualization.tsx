import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Wand2, Camera, Sparkles, ArrowRight, Upload, Image, 
  Link, Download, Share2, RefreshCw, Eye, Settings, 
  Palette, Home, TreePine, CheckCircle, Info, ShoppingBag, DollarSign,
  Square, FrameIcon, Layers, Paintbrush, Lightbulb, Grid3X3, 
  Building, Columns, Hammer, Zap, PaintBucket
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MaskEditor from "./mask-editor";

// Step 1: Photo Upload
interface UploadedPhoto {
  file: File;
  preview: string;
  type: 'interior' | 'exterior' | 'auto-detected';
}

// Step 2: Design Inspiration Types
interface DesignInspiration {
  type: 'text' | 'images' | 'pinterest';
  textPrompt?: string;
  referenceImages?: File[];
  pinterestUrl?: string;
}

// Step 3: Content-Aware Dynamic Parameters
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
  // Legacy arrays for compatibility
  materials: string[];
  colorPalette: string[];
  furnitureTypes: string[];
  wallCladding: string[];
  flooringMaterial: string[];
  ceilingDetails: string[];
  lightingFixtures: string[];
  architecturalFeatures: string[];
}

// Step 4: Transformation Result
interface TransformationResult {
  originalImage: string;
  transformedImage: string;
  transformationStrength: number;
  appliedParameters: DesignParameters;
  interactiveElements?: InteractiveElement[];
}

interface InteractiveElement {
  id: string;
  x: number; // percentage position from left
  y: number; // percentage position from top
  type: 'furniture' | 'material' | 'lighting' | 'decor';
  name: string;
  description: string;
  estimatedCost: number;
  material?: string;
  brand?: string;
  comparableProducts: ComparableProduct[];
}

interface ComparableProduct {
  name: string;
  brand: string;
  price: number;
  image: string;
  retailer: string;
  url: string;
  rating: number;
  features: string[];
}

// Step 3a: Architectural Elements from Original Photo
interface ArchitecturalElement {
  category: string; // 'windows', 'doors', 'roofing', 'cladding', etc.
  specificType: string; // 'Double-hung windows with white trim'
  quantity?: string; // 'how many if countable'
  currentCondition: string; // brief assessment of current state
  alternatives: string[]; // alternative options
  action: 'retain' | 'inspiration' | 'select'; // user's choice
  selectedStyle: string; // selected alternative
}

interface ArchitecturalAnalysis {
  elements: ArchitecturalElement[];
  roomStructure: string;
  detectedFeatures: string[];
}

// Workflow Steps
type WorkflowStep = 'upload' | 'architecture' | 'inspiration' | 'parameters' | 'transform' | 'review' | 'export';

export default function AIVisualization() {
  // Workflow State
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [progress, setProgress] = useState(0);
  
  // Step 1: Photo Upload
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedPhoto | null>(null);
  
  // Step 2: Architectural Analysis
  const [architecturalAnalysis, setArchitecturalAnalysis] = useState<ArchitecturalAnalysis | null>(null);
  const [editableArchitecture, setEditableArchitecture] = useState<ArchitecturalAnalysis | null>(null);
  const [manualElements, setManualElements] = useState<ArchitecturalElement[]>([]);
  const [showAddElement, setShowAddElement] = useState(false);
  const [newElement, setNewElement] = useState({
    category: '',
    specificType: '',
    quantity: '',
    currentCondition: '',
    alternatives: [] as string[],
    action: 'retain' as 'retain' | 'inspiration' | 'select',
    selectedStyle: ''
  });
  
  // Step 3: Design Inspiration
  const [inspiration, setInspiration] = useState<DesignInspiration>({
    type: 'text',
    textPrompt: ''
  });
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  
  // Step 4: Design Parameters
  const [extractedParameters, setExtractedParameters] = useState<DesignParameters | null>(null);
  const [editableParameters, setEditableParameters] = useState<DesignParameters | null>(null);
  const [parametersConfirmed, setParametersConfirmed] = useState(false);
  const [isEditingParameters, setIsEditingParameters] = useState(false);
  
  // Step 4: Transformation
  const [transformationResult, setTransformationResult] = useState<TransformationResult | null>(null);
  const [transformationStrength, setTransformationStrength] = useState([75]);
  const [selectedElement, setSelectedElement] = useState<InteractiveElement | null>(null);
  const [showProductPanel, setShowProductPanel] = useState(false);
  
  // V2 Pipeline State
  const [useV2Pipeline, setUseV2Pipeline] = useState(false);
  const [v2JobId, setV2JobId] = useState<string | null>(null);
  const [v2Masks, setV2Masks] = useState<string[]>([]);
  const [selectedMasks, setSelectedMasks] = useState<number[]>([]);
  const [v2PreprocessingResult, setV2PreprocessingResult] = useState<any>(null);
  const [showMaskEditor, setShowMaskEditor] = useState(false);
  
  const uploadedPhotoRef = useRef<HTMLDivElement>(null);
  const architecturalStepRef = useRef<HTMLDivElement>(null);
  const inspirationStepRef = useRef<HTMLDivElement>(null);
  const parametersStepRef = useRef<HTMLDivElement>(null);
  const transformStepRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Step 1: Photo Upload Dropzone
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
          type: 'auto-detected' // Will be detected by AI
        });
        setProgress(10);
        
        // Smooth scroll to uploaded photo after a brief delay
        setTimeout(() => {
          uploadedPhotoRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
      }
    },
    onDropRejected: (fileRejections) => {
      toast({
        title: "Upload Error",
        description: "Please upload a valid image file under 10MB",
        variant: "destructive"
      });
    }
  });

  // Step 2: Reference Images Dropzone
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
      
      // Auto-scroll to architectural step
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

  // V2 Preprocessing Mutation
  const v2PreprocessMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      if (!uploadedPhoto) throw new Error('No photo uploaded');
      
      const formData = new FormData();
      formData.append('photo', uploadedPhoto.file);
      
      const response = await fetch('/api/v2/preprocess', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to preprocess image');
      }
      
      return await response.json();
      
      return response;
    },
    onSuccess: (data) => {
      setV2PreprocessingResult(data);
      setV2JobId(data.jobId);
      setV2Masks(data.maskURIs);
      toast({
        title: "V2 Preprocessing Complete",
        description: "Masks and control images generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Preprocessing Failed", 
        description: "Failed to generate masks and control images",
        variant: "destructive"
      });
    }
  });

  // V2 Architectural Analysis Mutation
  const v2ArchitecturalAnalysisMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      if (!v2JobId || !v2Masks.length) throw new Error('No preprocessing data available');
      
      const response = await fetch('/api/v2/architectural-analysis', {
        method: 'POST',
        body: JSON.stringify({
          jobId: v2JobId,
          maskURIs: v2Masks
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze architectural elements');
      }
      
      return await response.json();
      
      return response;
    },
    onSuccess: (data) => {
      const transformedData = {
        elements: data.elements || [],
        roomStructure: data.roomStructure || '',
        detectedFeatures: data.detectedFeatures || []
      };
      setArchitecturalAnalysis(transformedData);
      setEditableArchitecture(transformedData);
      setCurrentStep('architecture');
      
      setTimeout(() => {
        architecturalStepRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  });

  // V2 Transform Mutation
  const v2TransformMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      if (!v2JobId) throw new Error('No preprocessing job available');
      
      const selectedMaskPaths = selectedMasks.map(index => v2Masks[index]);
      
      const prompt = `Professional architectural interior photography, ${editableParameters?.style || 'modern'} design style, featuring ${editableParameters?.detectedCategories?.map(cat => cat.items.join(' and ')).join(', ')} design elements, photorealistic, 8K resolution, professional lighting, architectural magazine quality, sharp focus, natural shadows`;
      
      const response = await fetch('/api/v2/transform-image', {
        method: 'POST',
        body: JSON.stringify({
          jobId: v2JobId,
          selectedMasks: selectedMaskPaths,
          positivePrompt: prompt,
          negativePrompt: "cartoon, illustration, painting, drawing, art, sketch, anime, low quality, blurry, distorted, unrealistic, fake, artificial, stylized",
          seed: Math.floor(Math.random() * 1000000),
          controlnetWeights: [1.2, 1.1, 1.0]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to transform image');
      }
      
      return await response.json();
      
      return response;
    },
    onSuccess: (data) => {
      const result = {
        originalImage: v2PreprocessingResult?.originalImage || '',
        transformedImage: data.resultURI,
        transformationStrength: transformationStrength[0],
        appliedParameters: editableParameters || {} as DesignParameters,
        interactiveElements: []
      };
      
      setTransformationResult(result);
      setCurrentStep('review');
      
      setTimeout(() => {
        transformStepRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      toast({
        title: "V2 Transformation Complete",
        description: `Image transformed in ${data.processingTime}ms with ${Math.round(data.quality.iouScore * 100)}% geometry preservation`,
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
      
      // Pass architectural elements context for dynamic parameter alignment
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
      
      if (inspiration.type === 'pinterest' && inspiration.pinterestUrl) {
        formData.append('pinterestUrl', inspiration.pinterestUrl);
      }

      const response = await fetch('/api/ai/extract-parameters', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract parameters');
      }
      
      return response.json();
    },
    onSuccess: (data: DesignParameters) => {
      setExtractedParameters(data);
      setEditableParameters(data);
      setCurrentStep('parameters');
      setProgress(50);
      toast({
        title: "Analysis Complete",
        description: "Design parameters extracted using natural AI categorization"
      });
    },
    onError: () => {
      toast({
        title: "Extraction Failed",
        description: "Unable to extract design parameters",
        variant: "destructive"
      });
    }
  });

  // Transform Image Mutation
  const transformImageMutation = useMutation({
    mutationFn: async (): Promise<TransformationResult> => {
      const formData = new FormData();
      if (uploadedPhoto && extractedParameters) {
        formData.append('photo', uploadedPhoto.file);
        formData.append('parameters', JSON.stringify(extractedParameters));
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
      // Mock interactive elements for demonstration
      const mockInteractiveElements: InteractiveElement[] = [
        {
          id: 'sofa-1',
          x: 25,
          y: 65,
          type: 'furniture',
          name: 'Modern Sectional Sofa',
          description: 'Performance fabric sectional with modular design',
          estimatedCost: 1299,
          material: 'Performance Velvet',
          brand: 'West Elm',
          comparableProducts: [
            {
              name: 'Andes Sectional Sofa',
              brand: 'West Elm',
              price: 1299,
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=300&q=80',
              retailer: 'West Elm',
              url: 'https://www.westelm.com/products/andes-sectional-sofa-h2835/',
              rating: 4.8,
              features: ['Modular design', 'Performance fabric', 'Deep seating']
            },
            {
              name: 'Haven Sectional',
              brand: 'West Elm',
              price: 1599,
              image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=300&q=80',
              retailer: 'West Elm',
              url: 'https://www.westelm.com/products/haven-sectional-h1499/',
              rating: 4.6,
              features: ['Down-filled cushions', 'Kiln-dried frame', 'Stain-resistant']
            },
            {
              name: 'Harmony Sectional',
              brand: 'CB2',
              price: 999,
              image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&h=300&q=80',
              retailer: 'CB2',
              url: 'https://www.cb2.com/harmony-sectional/s266610',
              rating: 4.4,
              features: ['Contemporary design', 'Easy assembly', 'Pet-friendly fabric']
            }
          ]
        },
        {
          id: 'table-1',
          x: 45,
          y: 75,
          type: 'furniture',
          name: 'Live Edge Coffee Table',
          description: 'Solid wood coffee table with natural edge',
          estimatedCost: 899,
          material: 'Reclaimed Oak',
          brand: 'CB2',
          comparableProducts: [
            {
              name: 'Slab Large Coffee Table',
              brand: 'CB2',
              price: 899,
              image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&h=300&q=80',
              retailer: 'CB2',
              url: 'https://www.cb2.com/slab-large-coffee-table/s266609',
              rating: 4.6,
              features: ['Carrara marble top', 'Steel base', 'Handcrafted']
            },
            {
              name: 'Parsons Coffee Table',
              brand: 'West Elm',
              price: 649,
              image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&h=300&q=80',
              retailer: 'West Elm',
              url: 'https://www.westelm.com/products/parsons-coffee-table-h1847/',
              rating: 4.3,
              features: ['Reclaimed wood', 'Simple design', 'Sustainable materials']
            }
          ]
        },
        {
          id: 'lighting-1',
          x: 75,
          y: 25,
          type: 'lighting',
          name: 'Pendant Light Fixture',
          description: 'Modern brass pendant with glass shade',
          estimatedCost: 549,
          material: 'Brass & Glass',
          brand: 'Design Within Reach',
          comparableProducts: [
            {
              name: 'IC F1 Floor Lamp',
              brand: 'FLOS',
              price: 549,
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=300&q=80',
              retailer: 'Design Within Reach',
              url: 'https://www.dwr.com/lighting-floor-lamps/ic-f1-floor-lamp/2544206.html',
              rating: 4.9,
              features: ['Brass orb design', 'Dimmer compatible', 'Designer piece']
            },
            {
              name: 'Globe Pendant',
              brand: 'West Elm',
              price: 299,
              image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&h=300&q=80',
              retailer: 'West Elm',
              url: 'https://www.westelm.com/products/globe-pendant-h2156/',
              rating: 4.5,
              features: ['Glass globe shade', 'Adjustable height', 'Easy installation']
            }
          ]
        }
      ];

      const enhancedResult = {
        ...data,
        interactiveElements: mockInteractiveElements
      };
      
      setTransformationResult(enhancedResult);
      setCurrentStep('review');
      setProgress(80);
      toast({
        title: "Transformation Complete",
        description: "Your design has been applied successfully. Click on items to explore products!"
      });
    },
    onError: () => {
      toast({
        title: "Transformation Failed",
        description: "Unable to apply design transformation",
        variant: "destructive"
      });
    }
  });

  const handleAnalyzeArchitecture = () => {
    setProgress(15);
    architecturalAnalysisMutation.mutate();
  };

  const handleArchitecturalElementChange = (elementIndex: number, field: 'action' | 'selectedStyle', value: string) => {
    if (!editableArchitecture) return;
    
    const updatedElements = [...editableArchitecture.elements];
    if (field === 'action') {
      updatedElements[elementIndex].action = value as 'retain' | 'inspiration' | 'select';
      // If switching to select action, set first alternative as default
      if (value === 'select' && !updatedElements[elementIndex].selectedStyle) {
        updatedElements[elementIndex].selectedStyle = updatedElements[elementIndex].alternatives[0] || '';
      }
    } else if (field === 'selectedStyle') {
      updatedElements[elementIndex].selectedStyle = value;
    }
    
    setEditableArchitecture({
      ...editableArchitecture,
      elements: updatedElements
    });
  };

  const handleAddManualElement = () => {
    if (newElement.category && newElement.specificType) {
      const element: ArchitecturalElement = {
        ...newElement,
        alternatives: ['Custom Option 1', 'Custom Option 2', 'Custom Option 3', 'Custom Option 4', 'Custom Option 5']
      };
      setManualElements([...manualElements, element]);
      setNewElement({
        category: '',
        specificType: '',
        quantity: '',
        currentCondition: '',
        alternatives: [],
        action: 'retain',
        selectedStyle: ''
      });
      setShowAddElement(false);
    }
  };;

  const handleConfirmArchitecture = () => {
    setCurrentStep('inspiration');
    setProgress(25);
    
    // Auto-scroll to inspiration step
    setTimeout(() => {
      inspirationStepRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 300);
  };

  const handleExtractParameters = () => {
    setProgress(50);
    extractParametersMutation.mutate();
  };

  const handleConfirmParameters = () => {
    setParametersConfirmed(true);
    setCurrentStep('transform');
    setProgress(60);
  };

  const handleEditParameters = () => {
    setIsEditingParameters(true);
  };

  const handleSaveParameters = () => {
    setExtractedParameters(editableParameters);
    setIsEditingParameters(false);
    toast({
      title: "Parameters Updated",
      description: "Design parameters have been saved"
    });
  };

  const updateParameterArray = (key: keyof DesignParameters, index: number, value: string) => {
    if (!editableParameters) return;
    const updatedParams = { ...editableParameters };
    const currentArray = updatedParams[key] as string[];
    currentArray[index] = value;
    setEditableParameters(updatedParams);
  };

  const addParameterItem = (key: keyof DesignParameters, value: string) => {
    if (!editableParameters || !value.trim()) return;
    const updatedParams = { ...editableParameters };
    const currentArray = updatedParams[key] as string[];
    if (!currentArray.includes(value.trim())) {
      currentArray.push(value.trim());
      setEditableParameters(updatedParams);
    }
  };

  const removeParameterItem = (key: keyof DesignParameters, index: number) => {
    if (!editableParameters) return;
    const updatedParams = { ...editableParameters };
    const currentArray = updatedParams[key] as string[];
    currentArray.splice(index, 1);
    setEditableParameters(updatedParams);
  };

  const handleTransformImage = () => {
    transformImageMutation.mutate();
  };

  const handleDownload = () => {
    if (transformationResult) {
      const link = document.createElement('a');
      link.href = transformationResult.transformedImage;
      link.download = 'renovai-transformation.jpg';
      link.click();
      
      setProgress(100);
      toast({
        title: "Download Started",
        description: "Your transformed image is being downloaded"
      });
    }
  };

  const resetWorkflow = () => {
    setCurrentStep('upload');
    setProgress(0);
    setUploadedPhoto(null);
    setInspiration({ type: 'text', textPrompt: '' });
    setReferenceImages([]);
    setExtractedParameters(null);
    setParametersConfirmed(false);
    setTransformationResult(null);
    setTransformationStrength([75]);
  };

  // Studio Navigation
  const renderStudioNavigation = () => (
    <div className="text-center mb-12 sm:mb-16">
      <div className="mb-8">
        <span className="text-xs tracking-widest text-gray-500 uppercase luxury-text">
          Professional Design Platform
        </span>
      </div>
      
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-black mb-8 leading-tight luxury-title">
        Studio
      </h1>
      
      <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed luxury-text">
        Transform your space with professional AI-powered design visualization
      </p>
    </div>
  );

  const renderUploadStep = () => (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-light text-black mb-8 luxury-title">
          Upload Your Space
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed luxury-text">
          Begin your design transformation by sharing your space with our AI design team
        </p>
      </div>
      
      <Card className="border border-gray-200/60 shadow-2xl bg-white/80 backdrop-blur-md">
        <CardContent className="p-8 sm:p-16">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-16 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-black/40 bg-gray-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 text-gray-400" />
            <p className="text-xl sm:text-2xl font-light text-black mb-3 luxury-title">
              {isDragActive ? 'Drop your photo here' : 'Drag & drop your photo'}
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-6 luxury-text">
              or tap to browse files
            </p>
            <Badge variant="outline" className="text-sm border-gray-300 text-gray-700 bg-white/50">
              JPG, PNG, HEIC up to 10MB
            </Badge>
          </div>
          
          {uploadedPhoto && (
            <div 
              ref={uploadedPhotoRef}
              className="mt-8 animate-in slide-in-from-bottom-4 duration-500"
            >
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
                <img 
                  src={uploadedPhoto.preview} 
                  alt="Uploaded preview"
                  className="w-full h-64 sm:h-80 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black/80 text-white border-0 backdrop-blur-sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black luxury-title">Photo Uploaded Successfully</h3>
                      <p className="text-sm text-gray-600 luxury-text">Ready for AI architectural analysis</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    {/* Pipeline Selection */}
                    <div className="flex items-center justify-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <Label className="text-sm font-medium text-gray-700">Pipeline:</Label>
                      <button
                        onClick={() => setUseV2Pipeline(false)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          !useV2Pipeline 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        V1 Standard
                      </button>
                      <button
                        onClick={() => setUseV2Pipeline(true)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          useV2Pipeline 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        V2 Advanced
                      </button>
                    </div>
                    
                    {useV2Pipeline ? (
                      <div className="space-y-2">
                        <Button 
                          onClick={() => v2PreprocessMutation.mutate()} 
                          disabled={v2PreprocessMutation.isPending || v2ArchitecturalAnalysisMutation.isPending}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all"
                        >
                          {v2PreprocessMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating Masks...
                            </>
                          ) : v2ArchitecturalAnalysisMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Analyzing Elements...
                            </>
                          ) : v2JobId ? (
                            <>
                              Continue to Mask Editor <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          ) : (
                            <>
                              Begin V2 Analysis <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                        
                        {v2JobId && (
                          <Button 
                            onClick={() => {
                              setShowMaskEditor(true);
                              v2ArchitecturalAnalysisMutation.mutate();
                            }}
                            variant="outline"
                            className="w-full"
                          >
                            Open Mask Editor
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button 
                        onClick={handleAnalyzeArchitecture} 
                        disabled={architecturalAnalysisMutation.isPending}
                        className="w-full bg-black text-white hover:bg-gray-800 font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all"
                      >
                        {architecturalAnalysisMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing Design...
                          </>
                        ) : (
                          <>
                            Begin AI Analysis <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderProcessGuide = () => (
    <div className="max-w-6xl mx-auto px-4 mt-24">
      <div className="text-center mb-16">
        <h3 className="text-3xl sm:text-4xl font-light text-black mb-6 luxury-title">
          How It Works
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed luxury-text">
          Professional AI-powered design transformation in four simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        {/* Step 1: Upload */}
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">Upload Space</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Share photos of your interior or exterior space for AI analysis
          </p>
        </div>

        {/* Step 2: Analyze */}
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">AI Analysis</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Advanced computer vision identifies architectural elements and style
          </p>
        </div>

        {/* Step 3: Design */}
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">Style Selection</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Choose your design inspiration through text, images, or Pinterest boards
          </p>
        </div>

        {/* Step 4: Transform */}
        <div className="text-center group">
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
          </div>
          <h4 className="text-lg sm:text-xl font-medium text-black mb-3 luxury-title">AI Transform</h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed luxury-text">
            Generate photorealistic visualizations of your redesigned space
          </p>
        </div>
      </div>

      {/* Process Flow Visualization */}
      <div className="mt-20">
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-12">
            <h4 className="text-2xl sm:text-3xl font-light text-black mb-4 luxury-title">
              Professional Design Workflow
            </h4>
            <p className="text-gray-600 luxury-text">
              From concept to visualization in minutes, not weeks
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between space-y-8 sm:space-y-0 sm:space-x-8">
            {/* Before */}
            <div className="text-center flex-1">
              <div className="w-32 h-24 sm:w-40 sm:h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-700 luxury-text">Original Space</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <ArrowRight className="w-6 h-6 text-black ml-2" />
              </div>
              <div className="sm:hidden">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="text-center flex-1">
              <div className="w-32 h-24 sm:w-40 sm:h-32 mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-gray-200 flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" />
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-700 luxury-text">AI-Transformed Design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getElementIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      'windows': FrameIcon,
      'doors': Square,
      'flooring': Grid3X3,
      'floors': Grid3X3,
      'roofing': Building,
      'roof': Building,
      'cladding': Layers,
      'walls': Paintbrush,
      'wall treatments': Paintbrush,
      'ceilings': Building,
      'ceiling': Building,
      'lighting': Lightbulb,
      'lighting fixtures': Lightbulb,
      'trim': PaintBucket,
      'moldings': PaintBucket,
      'features': Zap,
      'architectural features': Zap,
      'landscaping': TreePine,
      'fixtures': Hammer
    };
    
    const IconComponent = iconMap[category.toLowerCase()] || Settings;
    return <IconComponent className="w-6 h-6 text-gray-700" />;
  };

  const renderArchitecturalStep = () => (
    <div ref={architecturalStepRef} className="max-w-6xl mx-auto px-4 scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-light text-black mb-6 luxury-title">
          Design Elements Analysis
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed luxury-text">
          Review the detailed analysis of your space and choose how to transform each element
        </p>
      </div>

      {editableArchitecture && (
        <div className="space-y-8">
          {/* Enhanced Space Analysis */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2">
                <div className="relative">
                  <img 
                    src={uploadedPhoto?.preview} 
                    alt="Space under analysis"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/80 text-white border-0 backdrop-blur-sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Analyzed
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <h3 className="text-xl font-semibold text-black mb-4 luxury-title">
                  Space Analysis
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 luxury-text leading-relaxed text-base">
                    {editableArchitecture.roomStructure}
                  </p>
                </div>
                
                {editableArchitecture?.detectedFeatures && editableArchitecture.detectedFeatures.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                      Notable Features Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {editableArchitecture.detectedFeatures.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-800">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Element List */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-black mb-3 luxury-title">
                Design Element Preferences
              </h3>
              <p className="text-gray-600 luxury-text max-w-2xl mx-auto">
                For each detected element, choose to retain the current design, transform it, or specify custom changes
              </p>
            </div>

            <div className="space-y-4">
              {/* Detected Elements */}
              {editableArchitecture.elements.map((element, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Element Info */}
                      <div className="lg:col-span-4">
                        <div className="flex items-start space-x-4">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold capitalize text-black luxury-title text-lg mb-1">
                              {element.category.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-sm text-gray-600 luxury-text mb-1">
                              <strong>Detected:</strong> {element.specificType}
                            </p>
                            {element.quantity && (
                              <p className="text-xs text-gray-500 luxury-text">
                                Quantity: {element.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Selection */}
                      <div className="lg:col-span-3">
                        <Label className="text-sm font-medium text-gray-900 mb-3 block">Action</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`retain-${index}`}
                              name={`action-${index}`}
                              checked={element.action === 'retain'}
                              onChange={() => handleArchitecturalElementChange(index, 'action', 'retain')}
                              className="w-4 h-4 text-black focus:ring-black border-gray-300"
                            />
                            <label htmlFor={`retain-${index}`} className="text-sm font-medium text-black cursor-pointer">
                              Retain Original
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`inspiration-${index}`}
                              name={`action-${index}`}
                              checked={element.action === 'inspiration'}
                              onChange={() => handleArchitecturalElementChange(index, 'action', 'inspiration')}
                              className="w-4 h-4 text-black focus:ring-black border-gray-300"
                            />
                            <label htmlFor={`inspiration-${index}`} className="text-sm font-medium text-black cursor-pointer">
                              Use Inspiration
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`select-${index}`}
                              name={`action-${index}`}
                              checked={element.action === 'select'}
                              onChange={() => handleArchitecturalElementChange(index, 'action', 'select')}
                              className="w-4 h-4 text-black focus:ring-black border-gray-300"
                            />
                            <label htmlFor={`select-${index}`} className="text-sm font-medium text-black cursor-pointer">
                              Select Design Update
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Style Selection */}
                      <div className="lg:col-span-5">
                        {element.action === 'select' && (
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-900">Select New Style</Label>
                            <Select 
                              value={element.selectedStyle} 
                              onValueChange={(value) => handleArchitecturalElementChange(index, 'selectedStyle', value)}
                            >
                              <SelectTrigger className="w-full h-11">
                                <SelectValue placeholder={`Choose ${element.category} style...`} />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                {element.alternatives.map((alt, altIndex) => (
                                  <SelectItem key={altIndex} value={alt} className="py-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">{alt}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {element.selectedStyle && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>Selected:</strong> {element.selectedStyle}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        {element.action === 'retain' && (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Original design will be preserved</span>
                          </div>
                        )}
                        {element.action === 'inspiration' && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm">Will use inspiration images for styling</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Manual Elements */}
              {manualElements.map((element, index) => (
                <div key={`manual-${index}`} className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      <div className="lg:col-span-4">
                        <div className="flex items-start space-x-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold capitalize text-black luxury-title text-lg">
                                {element.category}
                              </h4>
                              <Badge variant="outline" className="text-xs bg-blue-100 border-blue-300">
                                Manual
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 luxury-text">
                              {element.specificType}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-8">
                        <p className="text-sm text-blue-800">
                          This element was manually added and will be included in the transformation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Manual Element */}
            <div className="mt-6">
              {!showAddElement ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddElement(true)}
                  className="w-full border-dashed border-gray-300 py-6"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Add Missing Element
                </Button>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black mb-4">Add Manual Element</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">Category</Label>
                      <Select 
                        value={newElement.category} 
                        onValueChange={(value) => setNewElement(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="windows">Windows</SelectItem>
                          <SelectItem value="doors">Doors</SelectItem>
                          <SelectItem value="roofing">Roofing</SelectItem>
                          <SelectItem value="cladding">Exterior Cladding</SelectItem>
                          <SelectItem value="flooring">Flooring</SelectItem>
                          <SelectItem value="walls">Walls</SelectItem>
                          <SelectItem value="ceilings">Ceilings</SelectItem>
                          <SelectItem value="lighting">Lighting</SelectItem>
                          <SelectItem value="trim">Trim/Molding</SelectItem>
                          <SelectItem value="features">Architectural Features</SelectItem>
                          <SelectItem value="landscaping">Landscaping</SelectItem>
                          <SelectItem value="fixtures">Fixtures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">Specific Type</Label>
                      <input
                        type="text"
                        value={newElement.specificType}
                        onChange={(e) => setNewElement(prev => ({ ...prev, specificType: e.target.value }))}
                        placeholder="e.g., Bay windows with white trim"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddElement(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddManualElement}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      Add Element
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 pb-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('upload')}
              className="luxury-text w-full sm:w-auto border-gray-300 px-6"
            >
              ← Back to Upload
            </Button>
            <Button 
              onClick={handleConfirmArchitecture}
              className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto px-8 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Design Inspiration →
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderInspirationStep = () => {
    const getElementSpecificPrompts = () => {
      if (!editableArchitecture) return [];
      
      const prompts: Array<{
        category: string;
        element: string;
        current: string;
        selected: string;
        suggestions: string[];
      }> = [];
      
      editableArchitecture.elements.forEach(element => {
        if (element.action === 'inspiration' || element.action === 'select') {
          switch (element.category) {
            case 'walls':
            case 'wall treatments':
              prompts.push({
                category: 'Wall Treatments',
                element: element.category,
                current: element.specificType,
                selected: element.selectedStyle,
                suggestions: [
                  'Modern minimalist paint in neutral tones',
                  'Natural wood paneling or shiplap',
                  'Textured wallpaper with geometric patterns',
                  'Exposed brick or stone accent walls',
                  'Contemporary tile feature walls'
                ]
              });
              break;
            case 'flooring':
              prompts.push({
                category: 'Flooring Materials',
                element: element.category,
                current: element.specificType,
                selected: element.selectedStyle,
                suggestions: [
                  'Wide-plank hardwood with natural finish',
                  'Large format porcelain or ceramic tiles',
                  'Luxury vinyl plank with wood grain texture',
                  'Natural stone tiles for elegance',
                  'Polished concrete for industrial style'
                ]
              });
              break;
            case 'windows':
              prompts.push({
                category: 'Window Styles',
                element: element.category,
                current: element.specificType,
                selected: element.selectedStyle,
                suggestions: [
                  'Black steel frame casement windows',
                  'Floor-to-ceiling glass panels',
                  'Traditional double-hung with grids',
                  'Modern sliding glass doors',
                  'Arched windows for character'
                ]
              });
              break;
            case 'doors':
              prompts.push({
                category: 'Door Designs',
                element: element.category,
                current: element.specificType,
                selected: element.selectedStyle,
                suggestions: [
                  'Sleek modern flush doors',
                  'Traditional panel doors with molding',
                  'Glass-paneled French doors',
                  'Barn doors for rustic charm',
                  'Pivot doors for contemporary appeal'
                ]
              });
              break;
            case 'roofing':
              prompts.push({
                category: 'Roofing Styles',
                element: element.category,
                current: element.specificType,
                selected: element.selectedStyle,
                suggestions: [
                  'Modern metal roofing in charcoal',
                  'Classic asphalt shingles',
                  'Clay tile Mediterranean style',
                  'Slate for luxury appeal',
                  'Green roof with vegetation'
                ]
              });
              break;
            case 'cladding':
              prompts.push({
                category: 'Exterior Cladding',
                element: element.category,
                current: element.specificType,
                selected: element.selectedStyle,
                suggestions: [
                  'Modern fiber cement siding',
                  'Natural stone veneer',
                  'Wood cedar shingles',
                  'Contemporary metal panels',
                  'Traditional brick facade'
                ]
              });
              break;
            default:
              prompts.push({
                category: `${element.category.charAt(0).toUpperCase() + element.category.slice(1)} Styles`,
                element: element.category,
                current: element.specificType,
                selected: element.selectedStyle,
                suggestions: [
                  'Modern contemporary style',
                  'Traditional classic approach',
                  'Industrial minimalist design',
                  'Natural organic materials',
                  'Luxury premium finishes'
                ]
              });
          }
        }
      });
      
      // Add manual elements that need transformation
      manualElements.forEach(element => {
        if (element.action === 'inspiration' || element.action === 'select') {
          prompts.push({
            category: `${element.category.charAt(0).toUpperCase() + element.category.slice(1)} Styles`,
            element: element.category,
            current: element.specificType,
            selected: element.selectedStyle,
            suggestions: [
              'Modern contemporary style',
              'Traditional classic approach',
              'Industrial minimalist design',
              'Natural organic materials',
              'Luxury premium finishes'
            ]
          });
        }
      });
      return prompts;
    };

    const elementPrompts = getElementSpecificPrompts();
    const spaceType = editableArchitecture?.roomStructure.toLowerCase().includes('exterior') ? 'exterior' : 'interior';

    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-black mb-6 luxury-title">
            Design Inspiration
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed luxury-text">
            Choose inspiration for the elements you want to transform
          </p>
        </div>

        <div className="space-y-8">
          {/* Current Space Context */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-1">
                <img 
                  src={uploadedPhoto?.preview} 
                  alt="Current space"
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
              </div>
              <div className="md:col-span-3">
                <h3 className="text-lg font-medium text-black mb-2 luxury-title">
                  {spaceType === 'exterior' ? 'Exterior' : 'Interior'} Space Analysis
                </h3>
                <p className="text-gray-700 luxury-text text-sm leading-relaxed">
                  {editableArchitecture?.roomStructure}
                </p>
              </div>
            </div>
          </div>

          {/* Element-Specific Inspiration Categories */}
          {elementPrompts.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-black luxury-title text-center">
                Inspiration for Elements to Transform
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {elementPrompts.map((prompt, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-black luxury-title">
                          {prompt.category}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {prompt.element}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 luxury-text">
                        <span className="font-medium">Current:</span> {prompt.current}
                        {prompt.selected && (
                          <>
                            <br />
                            <span className="font-medium">Selected:</span> {prompt.selected}
                          </>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-black">Style Inspiration</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {prompt.suggestions.map((suggestion: string, suggestionIndex: number) => (
                            <button
                              key={suggestionIndex}
                              onClick={() => {
                                setInspiration(prev => ({
                                  ...prev,
                                  type: 'text',
                                  textPrompt: (prev.textPrompt || '') + 
                                    (prev.textPrompt ? ', ' : '') + 
                                    `${prompt.element}: ${suggestion}`
                                }));
                              }}
                              className="text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              <div className="text-sm font-medium text-black">{suggestion}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Features Integration */}
          {editableArchitecture?.detectedFeatures && editableArchitecture.detectedFeatures.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-black mb-4 luxury-title flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Features to Enhance & Highlight
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editableArchitecture?.detectedFeatures?.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-purple-200">
                    <span className="text-sm font-medium text-black">{feature}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setInspiration(prev => ({
                          ...prev,
                          type: 'text',
                          textPrompt: (prev.textPrompt || '') + 
                            (prev.textPrompt ? ', ' : '') + 
                            `enhance and highlight ${feature}`
                        }));
                      }}
                      className="text-xs h-6 px-2"
                    >
                      Add to Inspiration
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consolidated Inspiration Input */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-black mb-4 luxury-title">
              Your Design Vision
            </h3>
            <Tabs value={inspiration.type} onValueChange={(value) => 
              setInspiration(prev => ({ ...prev, type: value as 'text' | 'images' | 'pinterest' }))
            }>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="text">Style Description</TabsTrigger>
                <TabsTrigger value="images">Reference Images</TabsTrigger>
                <TabsTrigger value="pinterest">Pinterest Board</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Label htmlFor="textPrompt">Describe your complete vision</Label>
                <Textarea
                  id="textPrompt"
                  placeholder={`Describe your ${spaceType} design vision, incorporating the elements you've selected above...`}
                  value={inspiration.textPrompt || ''}
                  onChange={(e) => setInspiration(prev => ({ ...prev, textPrompt: e.target.value }))}
                  className="min-h-32"
                />
                {inspiration.textPrompt && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium mb-1">Current Vision:</p>
                    <p className="text-sm text-blue-700">{inspiration.textPrompt}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4">
                <Label>Upload reference images for your vision</Label>
                <div
                  {...referenceDropzone.getRootProps()}
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center cursor-pointer hover:border-neutral-400"
                >
                  <input {...referenceDropzone.getInputProps()} />
                  <Image className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                  <p className="text-sm text-neutral-600">Add up to 5 reference images</p>
                </div>
                
                {referenceImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {referenceImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={URL.createObjectURL(img)} 
                          alt={`Reference ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setReferenceImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pinterest" className="space-y-4">
                <Label htmlFor="pinterestUrl">Pinterest board URL</Label>
                <Input
                  id="pinterestUrl"
                  placeholder="https://pinterest.com/username/board-name"
                  value={inspiration.pinterestUrl || ''}
                  onChange={(e) => setInspiration(prev => ({ ...prev, pinterestUrl: e.target.value }))}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('architecture')}
              className="luxury-text w-full sm:w-auto border-gray-300"
            >
              ← Back to Elements
            </Button>
            <Button 
              onClick={handleExtractParameters}
              disabled={
                extractParametersMutation.isPending ||
                (inspiration.type === 'text' && !inspiration.textPrompt) ||
                (inspiration.type === 'images' && referenceImages.length === 0) ||
                (inspiration.type === 'pinterest' && !inspiration.pinterestUrl)
              }
              className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto px-8"
            >
              {extractParametersMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                'Generate Design Parameters →'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Design examples and suggestions
  const designExamples = {
    wallCladding: [
      'Natural Stone', 'Wood Paneling', 'Painted Drywall', 'Brick', 'Concrete', 
      'Shiplap', 'Wainscoting', 'Tile', 'Wallpaper', 'Exposed Brick'
    ],
    flooringMaterial: [
      'Hardwood', 'Marble', 'Tile', 'Concrete', 'Carpet', 
      'Laminate', 'Vinyl', 'Bamboo', 'Cork', 'Stone'
    ],
    materials: [
      'Wood', 'Metal', 'Glass', 'Stone', 'Fabric', 
      'Leather', 'Ceramic', 'Concrete', 'Marble', 'Steel'
    ],
    colorPalette: [
      'Warm White', 'Cool Gray', 'Natural Wood', 'Deep Blue', 'Sage Green',
      'Terracotta', 'Charcoal', 'Cream', 'Navy', 'Beige'
    ],
    furnitureTypes: [
      'Sectional Sofa', 'Accent Chair', 'Coffee Table', 'Dining Table', 'Floor Lamp',
      'Ottoman', 'Bookshelf', 'Side Table', 'Pendant Light', 'Area Rug'
    ]
  };

  const EditableParameterSection = ({ 
    title, 
    paramKey, 
    items, 
    examples 
  }: { 
    title: string; 
    paramKey: keyof DesignParameters; 
    items: string[]; 
    examples: string[] 
  }) => {
    const [newItem, setNewItem] = useState('');
    const safeItems = items || []; // Fix undefined array error

    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">{title}</Label>
        <div className="flex flex-wrap gap-2">
          {safeItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {isEditingParameters ? (
                <div className="flex items-center space-x-1">
                  <Input
                    value={item}
                    onChange={(e) => updateParameterArray(paramKey, index, e.target.value)}
                    className="h-8 text-sm px-2 w-24"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeParameterItem(paramKey, index)}
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <Badge variant="secondary">{item}</Badge>
              )}
            </div>
          ))}
        </div>
        
        {isEditingParameters && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                placeholder={`Add ${title.toLowerCase()}`}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  addParameterItem(paramKey, newItem);
                  setNewItem('');
                }}
                disabled={!newItem.trim()}
              >
                Add
              </Button>
            </div>
            <div className="text-xs text-neutral-500">
              <span className="font-medium">Examples: </span>
              {examples.slice(0, 5).map((example, index) => (
                <span key={index}>
                  <button
                    onClick={() => addParameterItem(paramKey, example)}
                    className="text-blue-600 hover:underline"
                  >
                    {example}
                  </button>
                  {index < 4 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderParametersStep = () => (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Design Parameters
          </div>
          {!isEditingParameters && extractedParameters && (
            <Button variant="outline" size="sm" onClick={handleEditParameters}>
              Edit Parameters
            </Button>
          )}
        </CardTitle>
        <p className="text-neutral-600">
          {isEditingParameters 
            ? "Customize the design parameters to match your vision"
            : "Review the extracted design parameters"
          }
        </p>
      </CardHeader>
      <CardContent>
        {extractParametersMutation.isPending ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full mx-auto mb-4"></div>
            <p className="text-neutral-600">Analyzing your design preferences...</p>
          </div>
        ) : editableParameters ? (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Style</Label>
              {isEditingParameters ? (
                <Select
                  value={editableParameters.style}
                  onValueChange={(value) => setEditableParameters(prev => prev ? {...prev, style: value} : null)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Contemporary">Contemporary</SelectItem>
                    <SelectItem value="Traditional">Traditional</SelectItem>
                    <SelectItem value="Minimalist">Minimalist</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Scandinavian">Scandinavian</SelectItem>
                    <SelectItem value="Bohemian">Bohemian</SelectItem>
                    <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className="ml-2">{editableParameters.style}</Badge>
              )}
            </div>
            
            {/* Visual Mini Design Boards - Dynamic Categories */}
            {editableParameters?.detectedCategories?.map((category, index) => (
              <div key={index} className="space-y-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-semibold text-black capitalize luxury-title">
                      {category.name}
                    </Label>
                    <p className="text-sm text-gray-600 luxury-text mt-1">
                      Aligned with {category.alignedElement} from your photo
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-800">
                    {Math.round(category.confidence * 100)}% confidence
                  </Badge>
                </div>
                
                {/* Design Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-xs text-gray-500 text-center px-2">
                          {item}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-black mb-1">{item}</h4>
                      <p className="text-xs text-gray-500">Design option</p>
                    </div>
                  ))}
                </div>
                
                {/* Visual Examples */}
                {category.visualExamples && category.visualExamples.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Visual Inspiration
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {category.visualExamples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center p-2">
                          <span className="text-xs text-gray-600 text-center">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add Custom Option */}
                {isEditingParameters && (
                  <div className="pt-3 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        const newItem = prompt(`Add custom ${category.name.toLowerCase()} option:`);
                        if (newItem && editableParameters) {
                          const updatedCategories = [...editableParameters.detectedCategories];
                          updatedCategories[index] = {
                            ...category,
                            items: [...category.items, newItem]
                          };
                          setEditableParameters({
                            ...editableParameters,
                            detectedCategories: updatedCategories
                          });
                        }
                      }}
                    >
                      + Add Custom Option
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Additional Inspiration Categories */}
            {isEditingParameters && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-lg font-semibold text-black luxury-title">
                      Add Additional Inspiration
                    </Label>
                    <p className="text-sm text-gray-600 luxury-text mt-1">
                      Create inspiration boards for elements not detected in your original photo
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    'Lighting Fixtures', 'Decorative Accessories', 'Artwork & Wall Decor', 
                    'Textiles & Fabrics', 'Outdoor Furniture', 'Landscaping Elements',
                    'Hardware & Finishes', 'Color Accents'
                  ].map((categoryName) => (
                    <Button
                      key={categoryName}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 text-left justify-start bg-white hover:bg-blue-50 border-blue-200"
                      onClick={() => {
                        if (editableParameters) {
                          const newCategory: DetectedCategory = {
                            name: categoryName,
                            alignedElement: 'Additional element',
                            items: [],
                            visualExamples: [],
                            confidence: 1.0
                          };
                          setEditableParameters({
                            ...editableParameters,
                            detectedCategories: [...editableParameters.detectedCategories, newCategory]
                          });
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium text-xs text-black">{categoryName}</div>
                        <div className="text-xs text-gray-500 mt-1">Add inspiration board</div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {/* Custom Category Input */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Create custom inspiration category..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const categoryName = e.currentTarget.value.trim();
                          if (editableParameters) {
                            const newCategory: DetectedCategory = {
                              name: categoryName,
                              alignedElement: 'Custom element',
                              items: [],
                              visualExamples: [],
                              confidence: 1.0
                            };
                            setEditableParameters({
                              ...editableParameters,
                              detectedCategories: [...editableParameters.detectedCategories, newCategory]
                            });
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Create custom inspiration category..."]') as HTMLInputElement;
                        if (input?.value.trim() && editableParameters) {
                          const categoryName = input.value.trim();
                          const newCategory: DetectedCategory = {
                            name: categoryName,
                            alignedElement: 'Custom element',
                            items: [],
                            visualExamples: [],
                            confidence: 1.0
                          };
                          setEditableParameters({
                            ...editableParameters,
                            detectedCategories: [...editableParameters.detectedCategories, newCategory]
                          });
                          input.value = '';
                        }
                      }}
                    >
                      Add Category
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Fallback to Legacy Categories if No Dynamic Detection */}
            {(!editableParameters?.detectedCategories || editableParameters.detectedCategories.length === 0) && (
              <>
                <EditableParameterSection
                  title="Wall Cladding"
                  paramKey="wallCladding"
                  items={editableParameters?.wallCladding || []}
                  examples={designExamples.wallCladding}
                />
                
                <EditableParameterSection
                  title="Flooring Material"
                  paramKey="flooringMaterial"
                  items={editableParameters?.flooringMaterial || []}
                  examples={designExamples.flooringMaterial}
                />
                
                <EditableParameterSection
                  title="Materials"
                  paramKey="materials"
                  items={editableParameters?.materials || []}
                  examples={designExamples.materials}
                />
                
                <EditableParameterSection
                  title="Color Palette"
                  paramKey="colorPalette"
                  items={editableParameters?.colorPalette || []}
                  examples={designExamples.colorPalette}
                />
                
                <EditableParameterSection
                  title="Furniture Types"
                  paramKey="furnitureTypes"
                  items={editableParameters?.furnitureTypes || []}
                  examples={designExamples.furnitureTypes}
                />
              </>
            )}
            
            {editableParameters.architecturalFeatures && editableParameters.architecturalFeatures.length > 0 && (
              <div>
                <Label className="text-base font-medium">Architectural Features</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editableParameters.architecturalFeatures.map((feature, index) => (
                    <Badge key={index} variant="outline">{feature}</Badge>
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-1">These features will be preserved during transformation</p>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('inspiration')}>
                Back
              </Button>
              <div className="flex space-x-2">
                {isEditingParameters ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditingParameters(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveParameters}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleConfirmParameters}>
                    Confirm Parameters <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600">Unable to extract parameters. Please try again.</p>
            <Button className="mt-4" onClick={() => setCurrentStep('inspiration')}>
              Go Back
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTransformStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="w-6 h-6 mr-2" />
          Transform Image
        </CardTitle>
        <p className="text-neutral-600">
          Apply the design parameters to your original photo
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Transformation Strength</Label>
            <div className="mt-4">
              <Slider
                value={transformationStrength}
                onValueChange={setTransformationStrength}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-neutral-600 mt-2">
                <span>Subtle (10%)</span>
                <span className="font-medium">{transformationStrength[0]}%</span>
                <span>Complete (100%)</span>
              </div>
            </div>
          </div>
          
          {uploadedPhoto && (
            <div>
              <Label className="text-base font-medium">Original Photo</Label>
              <img 
                src={uploadedPhoto.preview}
                alt="Original"
                className="w-full h-64 object-cover rounded-lg mt-2"
              />
            </div>
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('parameters')}>
              Back
            </Button>
            <Button 
              onClick={handleTransformImage}
              disabled={transformImageMutation.isPending}
            >
              {transformImageMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Transforming...
                </>
              ) : (
                <>
                  Transform <Wand2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewStep = () => (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-light text-black mb-6 luxury-title">
          Interactive Design Review
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed luxury-text">
          Explore your transformed space. Click on items to see product details and pricing
        </p>
      </div>

      {transformationResult && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Original Image */}
            <div>
              <Label className="text-lg font-medium text-black mb-4 block luxury-title">Original Space</Label>
              <div className="relative">
                <img 
                  src={transformationResult.originalImage}
                  alt="Original"
                  className="w-full h-80 object-cover rounded-xl border border-gray-200"
                />
              </div>
            </div>

            {/* Interactive Transformed Image */}
            <div>
              <Label className="text-lg font-medium text-black mb-4 block luxury-title">AI-Transformed Design</Label>
              <div className="relative">
                <img 
                  src={transformationResult.transformedImage}
                  alt="Transformed"
                  className="w-full h-80 object-cover rounded-xl border border-gray-200"
                />
                
                {/* Interactive Hotspots */}
                {transformationResult.interactiveElements?.map((element) => (
                  <button
                    key={element.id}
                    onClick={() => {
                      setSelectedElement(element);
                      setShowProductPanel(true);
                    }}
                    className="absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                    style={{
                      left: `${element.x}%`,
                      top: `${element.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </button>
                ))}

                {/* Floating Info Badge */}
                <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm luxury-text backdrop-blur-sm">
                  <Info className="w-4 h-4 inline mr-2" />
                  Click items to explore
                </div>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          {transformationResult.interactiveElements && (
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6">
              <h3 className="text-xl font-medium text-black mb-4 luxury-title">Design Cost Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {transformationResult.interactiveElements.map((element) => (
                  <div key={element.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-black text-sm">{element.name}</p>
                      <p className="text-xs text-gray-600">{element.material}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">${element.estimatedCost.toLocaleString()}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1 h-6 px-2 text-xs"
                        onClick={() => {
                          setSelectedElement(element);
                          setShowProductPanel(true);
                        }}
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Shop
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-black luxury-title">Total Estimated Cost:</span>
                  <span className="text-xl font-semibold text-black">
                    ${transformationResult.interactiveElements.reduce((sum, el) => sum + el.estimatedCost, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setCurrentStep('transform')} className="luxury-text">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline" className="luxury-text">
                <Settings className="w-4 h-4 mr-2" />
                Adjust Style
              </Button>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleDownload} className="luxury-text">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Share2 className="w-4 h-4 mr-2" />
                Share Design
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Panel */}
      {showProductPanel && selectedElement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowProductPanel(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-medium text-black luxury-title">{selectedElement.name}</h3>
                  <p className="text-gray-600 luxury-text mt-1">{selectedElement.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <Badge variant="outline" className="text-sm">
                      {selectedElement.type}
                    </Badge>
                    <span className="text-sm text-gray-600">{selectedElement.material}</span>
                    <span className="text-lg font-semibold text-black">${selectedElement.estimatedCost.toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowProductPanel(false)}>
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-medium text-black mb-4 luxury-title">Comparable Products</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedElement.comparableProducts.map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h5 className="font-medium text-black mb-1">{product.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-semibold text-black">${product.price.toLocaleString()}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <p key={idx} className="text-xs text-gray-600">• {feature}</p>
                        ))}
                      </div>
                      <Button 
                        className="w-full bg-black text-white hover:bg-gray-800"
                        onClick={() => window.open(product.url, '_blank')}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Shop at {product.retailer}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {renderStudioNavigation()}

        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'upload' && renderProcessGuide()}
        {currentStep === 'architecture' && renderArchitecturalStep()}
        {currentStep === 'inspiration' && renderInspirationStep()}
        {currentStep === 'parameters' && renderParametersStep()}
        {currentStep === 'transform' && renderTransformStep()}
        {currentStep === 'review' && renderReviewStep()}

        {progress > 0 && currentStep === 'upload' && (
          <div className="text-center mt-16">
            <Button variant="outline" onClick={resetWorkflow} className="luxury-text border-gray-300 text-gray-700 hover:bg-gray-50">
              Start New Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}