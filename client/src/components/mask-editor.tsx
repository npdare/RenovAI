import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brush, Eraser, RotateCcw, Download, Eye, EyeOff } from 'lucide-react';

interface MaskEditorProps {
  originalImage: string;
  masks: string[];
  onMaskUpdate: (maskIndex: number, updatedMask: string) => void;
  onSelectionChange: (selectedMasks: number[]) => void;
  selectedMasks: number[];
}

export default function MaskEditor({ 
  originalImage, 
  masks, 
  onMaskUpdate, 
  onSelectionChange,
  selectedMasks 
}: MaskEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState([10]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [activeMask, setActiveMask] = useState(0);
  const [maskVisibility, setMaskVisibility] = useState<boolean[]>(masks.map(() => true));

  useEffect(() => {
    redrawCanvas();
  }, [originalImage, masks, activeMask, maskVisibility]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw original image
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw visible masks with different colors
      masks.forEach((maskSrc, index) => {
        if (!maskVisibility[index]) return;

        const maskImg = new Image();
        maskImg.onload = () => {
          ctx.globalAlpha = 0.5;
          ctx.globalCompositeOperation = 'multiply';
          
          // Use different colors for different masks
          const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
          ctx.fillStyle = colors[index % colors.length];
          
          // Create colored overlay for mask
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'destination-in';
          ctx.drawImage(maskImg, 0, 0);
          
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
        };
        maskImg.src = maskSrc;
      });
    };
    img.src = originalImage;
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getMousePos(e);
    
    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize[0], 0, 2 * Math.PI);
    ctx.fill();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Convert canvas to data URL and trigger update
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      onMaskUpdate(activeMask, dataURL);
    }
  };

  const toggleMaskVisibility = (index: number) => {
    const newVisibility = [...maskVisibility];
    newVisibility[index] = !newVisibility[index];
    setMaskVisibility(newVisibility);
  };

  const toggleMaskSelection = (index: number) => {
    const newSelection = selectedMasks.includes(index)
      ? selectedMasks.filter(i => i !== index)
      : [...selectedMasks, index];
    onSelectionChange(newSelection);
  };

  const resetMask = () => {
    // Reset current mask to original
    redrawCanvas();
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mask Editor - Advanced Element Selection</span>
          <Badge variant="outline" className="bg-blue-50 border-blue-200">
            V2 Pipeline
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-auto cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ maxHeight: '600px' }}
              />
            </div>
            
            {/* Canvas Controls */}
            <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Button
                  variant={tool === 'brush' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTool('brush')}
                >
                  <Brush className="w-4 h-4 mr-2" />
                  Paint
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTool('eraser')}
                >
                  <Eraser className="w-4 h-4 mr-2" />
                  Erase
                </Button>
                <Button variant="outline" size="sm" onClick={resetMask}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Label className="text-sm">Brush Size:</Label>
                <Slider
                  value={brushSize}
                  onValueChange={setBrushSize}
                  max={50}
                  min={1}
                  step={1}
                  className="w-24"
                />
                <span className="text-sm font-medium w-8">{brushSize[0]}</span>
              </div>
            </div>
          </div>

          {/* Mask List and Controls */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Segmentation Masks
              </Label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {masks.map((mask, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      activeMask === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveMask(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded border-2"
                          style={{
                            backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'][index % 6],
                            opacity: maskVisibility[index] ? 0.7 : 0.3
                          }}
                        />
                        <span className="text-sm font-medium">
                          Mask {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMaskVisibility(index);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {maskVisibility[index] ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMasks.includes(index)}
                          onChange={() => toggleMaskSelection(index)}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-600">
                          Use for transformation
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">
                Selected for Transformation
              </Label>
              <div className="text-sm text-gray-600">
                {selectedMasks.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedMasks.map(index => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        Mask {index + 1}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span>No masks selected</span>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <Button className="w-full" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Masks
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}