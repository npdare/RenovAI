import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertPhotoSchema, 
  insertDesignBoardSchema, 
  insertBoardPhotoSchema,
  insertComparisonSchema 
} from "@shared/schema";
import { 
  analyzeRoomPhoto, 
  generateRoomRedesign, 
  generateDesignInspiration,
  getDesignRecommendations,
  generateProductRecommendations,
  transformImageWithParameters,
  analyzeReferenceImages,
  analyzePinterestBoard,
  analyzeTextPrompt,
  analyzeArchitecturalElements
} from "./ai-service";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static('uploads'));

  // Photo management endpoints
  app.get('/api/photos', async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user for now
      const photos = await storage.getPhotosByUser(userId);
      res.json(photos);
    } catch (error) {
      console.error('Get photos error:', error);
      res.status(500).json({ error: 'Failed to get photos' });
    }
  });

  app.get('/api/photos/type/:type', async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user for now
      const type = req.params.type;
      const photos = await storage.getPhotosByType(userId, type);
      res.json(photos);
    } catch (error) {
      console.error('Get photos by type error:', error);
      res.status(500).json({ error: 'Failed to get photos by type' });
    }
  });

  app.post('/api/photos/upload', upload.array('photos', 10), async (req: any, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const userId = 1; // Mock user for now
      const uploadedPhotos = [];

      for (const file of files) {
        const photoData = {
          userId,
          filename: file.filename,
          originalName: file.originalname,
          url: `/uploads/${file.filename}`,
          type: req.body.type || 'original',
          category: req.body.category || 'uncategorized'
        };

        const photo = await storage.createPhoto(photoData);
        uploadedPhotos.push(photo);
      }

      res.json({ 
        success: true, 
        photos: uploadedPhotos,
        message: `Successfully uploaded ${uploadedPhotos.length} photo(s)`
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload photos' });
    }
  });

  // AI endpoints
  app.post('/api/ai/analyze', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Photo file is required' });
      }

      const analysis = await analyzeRoomPhoto(req.file.path);
      res.json(analysis);
    } catch (error) {
      console.error('AI analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze photo' });
    }
  });

  // Architectural Elements Analysis - Separate from design inspiration
  app.post('/api/ai/analyze-architecture', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Photo file is required for architectural analysis' });
      }

      const analysis = await analyzeArchitecturalElements(req.file.path);
      res.json(analysis);
    } catch (error) {
      console.error('Architectural analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze architectural elements' });
    }
  });

  // AI Design Studio - Extract Parameters endpoint
  app.post('/api/ai/extract-parameters', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'referenceImage0', maxCount: 1 },
    { name: 'referenceImage1', maxCount: 1 },
    { name: 'referenceImage2', maxCount: 1 },
    { name: 'referenceImage3', maxCount: 1 },
    { name: 'referenceImage4', maxCount: 1 }
  ]), async (req: any, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { textPrompt, pinterestUrl } = req.body;

      if (!files.photo || files.photo.length === 0) {
        return res.status(400).json({ error: 'Original photo is required' });
      }

      const photoPath = files.photo[0].path;
      
      // Extract precise architectural parameters using OpenAI Vision with natural categorization
      const imageBuffer = fs.readFileSync(photoPath);
      const base64Image = imageBuffer.toString('base64');

      // Get the user's selected architectural elements first
      let architecturalContext = '';
      if (req.body.architecturalElements) {
        const elements = JSON.parse(req.body.architecturalElements);
        const transformElements = elements.filter((el: any) => el.action === 'inspiration' || el.action === 'select');
        architecturalContext = transformElements.map((el: any) => `${el.category}: ${el.specificType}`).join(', ');
      }

      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert design consultant. Extract inspiration elements that align with specific architectural elements from the original photo. Create dynamic categories based on what's being transformed."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `CONTEXT: User wants to transform these architectural elements: ${architecturalContext || 'User will specify elements to transform'}

Analyze this original photo and the inspiration content to extract design parameters that align with the architectural elements being transformed.

Create dynamic categories based on the architectural elements detected. For example:
- If transforming windows → create "Window Treatments" category
- If transforming exterior cladding → create "Exterior Materials" category  
- If transforming flooring → create "Flooring Materials" category
- If transforming walls → create "Wall Treatments" category

Return JSON:
{
  "roomType": "detected space type",
  "style": "overall design style from inspiration",
  "spaceType": "interior or exterior",
  "dynamicCategories": [
    {
      "name": "Category aligned with architectural element",
      "alignedElement": "which architectural element this relates to",
      "items": ["specific material/style options from inspiration"],
      "visualExamples": ["description of visual elements for mini design board"],
      "confidence": 0.9
    }
  ]
}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high"
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
      });

      const analysisResult = JSON.parse(analysisResponse.choices[0].message.content || '{}');
      
      // Create dynamic parameters structure aligned with architectural elements
      const dynamicCategories = analysisResult.dynamicCategories || [];
      
      // Build the dynamic parameters response
      const dynamicParameters = {
        roomType: analysisResult.roomType || 'Living Space',
        style: analysisResult.style || 'Contemporary',
        spaceType: analysisResult.spaceType || 'interior' as 'interior' | 'exterior',
        detectedCategories: dynamicCategories.map((cat: any) => ({
          name: cat.name,
          alignedElement: cat.alignedElement,
          items: cat.items || [],
          visualExamples: cat.visualExamples || [],
          confidence: cat.confidence || 0.8
        })),
        // Legacy support - these will be deprecated
        materials: [],
        colorPalette: [],
        furnitureTypes: [],
        wallCladding: [],
        flooringMaterial: [],
        ceilingDetails: [],
        lightingFixtures: [],
        architecturalFeatures: []
      };

      res.json(dynamicParameters);
    } catch (error) {
      console.error('Parameter extraction error:', error);
      res.status(500).json({ error: 'Failed to extract design parameters' });
    }
  });

  // V2 Preprocessing endpoint
  app.post('/api/v2/preprocess', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Photo file is required for preprocessing' });
      }

      const { preprocessImageV2 } = await import('./ai-service-v2');
      const result = await preprocessImageV2(req.file.path);
      res.json(result);
    } catch (error) {
      console.error('V2 preprocessing error:', error);
      res.status(500).json({ error: 'Failed to preprocess image' });
    }
  });

  // V2 Architectural analysis endpoint
  app.post('/api/v2/architectural-analysis', async (req: Request, res: Response) => {
    try {
      const { jobId, maskURIs } = req.body;
      
      if (!jobId || !maskURIs) {
        return res.status(400).json({ error: 'Job ID and mask URIs are required' });
      }

      const { analyzeArchitecturalElementsV2 } = await import('./ai-service-v2');
      const analysis = await analyzeArchitecturalElementsV2(jobId, maskURIs);
      res.json(analysis);
    } catch (error) {
      console.error('V2 architectural analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze architectural elements' });
    }
  });

  // V2 Transform image endpoint
  app.post('/api/v2/transform-image', async (req: Request, res: Response) => {
    try {
      const { transformImageV2, saveJobMetadata } = await import('./ai-service-v2');
      
      const result = await transformImageV2(req.body);
      
      // Save metadata for tracking
      saveJobMetadata(req.body.jobId, {
        request: req.body,
        result: result
      });
      
      res.json(result);
    } catch (error) {
      console.error('V2 image transformation error:', error);
      res.status(500).json({ error: 'Failed to transform image' });
    }
  });

  // Transform image endpoint (legacy v1)
  app.post('/api/ai/transform-image', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Photo file is required' });
      }

      const { parameters: paramString, transformationStrength = 75 } = req.body;
      
      let parsedParameters;
      try {
        parsedParameters = JSON.parse(paramString);
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid parameters format' });
      }

      const result = await transformImageWithParameters(
        req.file.path,
        parsedParameters,
        transformationStrength
      );

      res.json(result);
    } catch (error) {
      console.error('Image transformation error:', error);
      res.status(500).json({ error: 'Failed to transform image' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}