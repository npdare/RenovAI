import { useState } from "react";
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
  Palette, Home, TreePine, CheckCircle 
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  items: string[];
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
}

// Workflow Steps
type WorkflowStep = 'upload' | 'inspiration' | 'parameters' | 'transform' | 'review' | 'export';

export default function AIVisualization() {
  // Workflow State
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [progress, setProgress] = useState(0);
  
  // Step 1: Photo Upload
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedPhoto | null>(null);
  
  // Step 2: Design Inspiration
  const [inspiration, setInspiration] = useState<DesignInspiration>({
    type: 'text',
    textPrompt: ''
  });
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  
  // Step 3: Design Parameters
  const [extractedParameters, setExtractedParameters] = useState<DesignParameters | null>(null);
  const [editableParameters, setEditableParameters] = useState<DesignParameters | null>(null);
  const [parametersConfirmed, setParametersConfirmed] = useState(false);
  const [isEditingParameters, setIsEditingParameters] = useState(false);
  
  // Step 4: Transformation
  const [transformationResult, setTransformationResult] = useState<TransformationResult | null>(null);
  const [transformationStrength, setTransformationStrength] = useState([75]);
  
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
        setCurrentStep('inspiration');
        setProgress(20);
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

  // Extract Design Parameters Mutation
  const extractParametersMutation = useMutation({
    mutationFn: async (): Promise<DesignParameters> => {
      const formData = new FormData();
      if (uploadedPhoto) {
        formData.append('photo', uploadedPhoto.file);
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
      setTransformationResult(data);
      setCurrentStep('review');
      setProgress(80);
      toast({
        title: "Transformation Complete",
        description: "Your design has been applied successfully"
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

  const handleExtractParameters = () => {
    setProgress(25);
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

  // Step Components
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[
          { step: 'upload', label: 'Upload', icon: Upload },
          { step: 'inspiration', label: 'Inspiration', icon: Sparkles },
          { step: 'parameters', label: 'Parameters', icon: Settings },
          { step: 'transform', label: 'Transform', icon: Wand2 },
          { step: 'review', label: 'Review', icon: Eye },
          { step: 'export', label: 'Export', icon: Download }
        ].map(({ step, label, icon: Icon }, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep === step 
                ? 'bg-black text-white border-black' 
                : progress >= (index + 1) * 16.67
                ? 'bg-green-100 text-green-600 border-green-600'
                : 'bg-neutral-100 text-neutral-400 border-neutral-300'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-neutral-700">{label}</span>
            {index < 5 && <ArrowRight className="w-4 h-4 mx-3 text-neutral-400" />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-6 h-6 mr-2" />
          Upload Original Photo
        </CardTitle>
        <p className="text-neutral-600">
          Upload a photo of your interior or exterior space to get started
        </p>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-black bg-neutral-50' 
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <input {...getInputProps()} />
          <Camera className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <p className="text-lg font-medium text-neutral-900 mb-2">
            {isDragActive ? 'Drop your photo here' : 'Drag & drop your photo'}
          </p>
          <p className="text-neutral-600 mb-4">
            or click to browse files
          </p>
          <Badge variant="outline">JPG, PNG, HEIC up to 10MB</Badge>
        </div>
        
        {uploadedPhoto && (
          <div className="mt-6">
            <img 
              src={uploadedPhoto.preview} 
              alt="Uploaded preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex items-center justify-between mt-4">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Photo uploaded successfully
              </Badge>
              <Button onClick={() => setCurrentStep('inspiration')}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderInspirationStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Design Inspiration
        </CardTitle>
        <p className="text-neutral-600">
          Tell us about the style you want to achieve
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={inspiration.type} onValueChange={(value) => 
          setInspiration(prev => ({ ...prev, type: value as 'text' | 'images' | 'pinterest' }))
        }>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text Prompt</TabsTrigger>
            <TabsTrigger value="images">Reference Images</TabsTrigger>
            <TabsTrigger value="pinterest">Pinterest Board</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <Label htmlFor="textPrompt">Describe your desired style</Label>
            <Textarea
              id="textPrompt"
              placeholder="e.g., modern boho with natural textures and pastel tones"
              value={inspiration.textPrompt || ''}
              onChange={(e) => setInspiration(prev => ({ ...prev, textPrompt: e.target.value }))}
              className="min-h-32"
            />
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <Label>Upload reference images</Label>
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
                  <img 
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
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
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setCurrentStep('upload')}>
            Back
          </Button>
          <Button 
            onClick={handleExtractParameters}
            disabled={
              extractParametersMutation.isPending ||
              (inspiration.type === 'text' && !inspiration.textPrompt) ||
              (inspiration.type === 'images' && referenceImages.length === 0) ||
              (inspiration.type === 'pinterest' && !inspiration.pinterestUrl)
            }
          >
            {extractParametersMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                Extract Parameters <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
            
            {/* Dynamic Categories Based on AI Detection */}
            {editableParameters?.detectedCategories?.map((category, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium capitalize">
                    {category.name}
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(category.confidence * 100)}% confidence
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIndex) => (
                    <Badge key={itemIndex} variant="secondary" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            
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
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-6 h-6 mr-2" />
          Review & Fine-tune
        </CardTitle>
        <p className="text-neutral-600">
          Review your transformation and make adjustments
        </p>
      </CardHeader>
      <CardContent>
        {transformationResult && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">Original</Label>
                <img 
                  src={transformationResult.originalImage}
                  alt="Original"
                  className="w-full h-64 object-cover rounded-lg mt-2"
                />
              </div>
              <div>
                <Label className="text-base font-medium">Transformed</Label>
                <img 
                  src={transformationResult.transformedImage}
                  alt="Transformed"
                  className="w-full h-64 object-cover rounded-lg mt-2"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep('transform')}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Adjust
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          AI Design Studio
        </h1>
        <p className="text-neutral-600">
          Transform your space with AI-powered design visualization
        </p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="w-full" />
      </div>

      {renderStepIndicator()}

      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'inspiration' && renderInspirationStep()}
      {currentStep === 'parameters' && renderParametersStep()}
      {currentStep === 'transform' && renderTransformStep()}
      {currentStep === 'review' && renderReviewStep()}

      {progress > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={resetWorkflow}>
            Start New Project
          </Button>
        </div>
      )}
    </div>
  );
}