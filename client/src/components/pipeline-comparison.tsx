import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Layers, Zap, Eye, Settings, Palette, Wand2 } from 'lucide-react';

export default function PipelineComparison() {
  const features = [
    {
      feature: "Image Analysis",
      v1: "Basic room detection",
      v2: "Advanced segmentation with SAM",
      icon: <Eye className="w-4 h-4" />
    },
    {
      feature: "Element Control",
      v1: "Single ControlNet (Canny)",
      v2: "Multi-ControlNet (Canny + Depth + Segmentation)",
      icon: <Layers className="w-4 h-4" />
    },
    {
      feature: "Precision",
      v1: "General area transformation",
      v2: "Pixel-perfect mask editing",
      icon: <Settings className="w-4 h-4" />
    },
    {
      feature: "Quality",
      v1: "GFPGAN enhancement",
      v2: "Real-ESRGAN + IoU validation",
      icon: <Palette className="w-4 h-4" />
    },
    {
      feature: "Model",
      v1: "Stable Diffusion 1.5",
      v2: "Stable Diffusion XL",
      icon: <Wand2 className="w-4 h-4" />
    },
    {
      feature: "Processing",
      v1: "Standard pipeline",
      v2: "Advanced preprocessing + tiled diffusion",
      icon: <Zap className="w-4 h-4" />
    }
  ];

  return (
    <Card className="max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-center">
          Pipeline Comparison
        </CardTitle>
        <p className="text-center text-gray-600 text-sm">
          Choose the right workflow for your design transformation needs
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Column */}
          <div className="space-y-4">
            <div className="font-medium text-gray-900 text-center pb-2 border-b">
              Features
            </div>
            {features.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                {item.icon}
                <span className="font-medium text-sm">{item.feature}</span>
              </div>
            ))}
          </div>

          {/* V1 Standard Column */}
          <div className="space-y-4">
            <div className="text-center pb-2 border-b">
              <Badge variant="outline" className="bg-gray-50">V1 Standard</Badge>
            </div>
            {features.map((item, index) => (
              <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">{item.v1}</span>
              </div>
            ))}
          </div>

          {/* V2 Advanced Column */}
          <div className="space-y-4">
            <div className="text-center pb-2 border-b">
              <Badge className="bg-blue-600 text-white">V2 Advanced</Badge>
            </div>
            {features.map((item, index) => (
              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{item.v2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="text-center">
            <h4 className="font-medium text-blue-900 mb-2">When to use V2 Advanced?</h4>
            <p className="text-sm text-blue-700">
              For precise element control, professional quality results, and when you need to transform specific architectural features while preserving the overall structure.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}