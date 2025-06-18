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
  analyzeTextPrompt
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

      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert architectural analyst. Analyze images and identify all visible elements naturally, creating categories based on what you observe rather than predefined structures."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this architectural image and identify all visible elements. Organize your findings by the natural categories you observe. Return JSON format:
                {
                  "spaceType": "what type of space this is",
                  "architecturalStyle": "design style observed",
                  "surfaceMaterials": {
                    "category1": ["detailed descriptions"],
                    "category2": ["detailed descriptions"]
                  },
                  "colorScheme": ["color observations"],
                  "notableFeatures": ["architectural elements you identify"]
                }
                
                Let the image guide what categories you create - don't force predefined categories. Describe materials with specific details like texture, color, and finish.`
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
        max_tokens: 500,
      });

      const analysisResult = JSON.parse(analysisResponse.choices[0].message.content || '{}');
      
      // Transform AI's natural categorization into our parameter structure
      const transformNaturalAnalysis = (aiResult: any) => {
        const surfaceMaterials = aiResult.surfaceMaterials || {};
        
        const allMaterials = [];
        const wallMaterials = [];
        const floorMaterials = [];
        
        // Intelligently map AI's natural categories
        for (const [category, materials] of Object.entries(surfaceMaterials)) {
          const categoryLower = category.toLowerCase();
          const materialList = materials as string[];
          
          allMaterials.push(...materialList);
          
          if (categoryLower.includes('wall') || categoryLower.includes('cladding') || categoryLower.includes('siding') || categoryLower.includes('facade')) {
            wallMaterials.push(...materialList);
          } else if (categoryLower.includes('floor') || categoryLower.includes('ground') || categoryLower.includes('deck') || categoryLower.includes('surface')) {
            floorMaterials.push(...materialList);
          }
        }
        
        return {
          roomType: aiResult.spaceType || 'Living Space',
          style: aiResult.architecturalStyle || 'Contemporary',
          wallCladding: wallMaterials.length > 0 ? wallMaterials : ['Natural wall finish'],
          flooringMaterial: floorMaterials.length > 0 ? floorMaterials : ['Natural flooring'],
          materials: allMaterials.length > 0 ? allMaterials : ['Natural materials'],
          colorPalette: aiResult.colorScheme || ['Neutral tones'],
          architecturalFeatures: aiResult.notableFeatures || [],
          naturalCategories: surfaceMaterials
        };
      };

      let enhancedParameters = transformNaturalAnalysis(analysisResult);

      // Process reference images
      const referenceImages = [];
      for (let i = 0; i < 5; i++) {
        if (files[`referenceImage${i}`]) {
          referenceImages.push(files[`referenceImage${i}`][0]);
        }
      }

      if (referenceImages.length > 0) {
        const refAnalysis = await analyzeReferenceImages(referenceImages);
        
        if (refAnalysis.style) enhancedParameters.style = refAnalysis.style;
        if (refAnalysis.materials?.length) {
          enhancedParameters.materials = [...enhancedParameters.materials, ...refAnalysis.materials];
        }
        if (refAnalysis.colors?.length) {
          enhancedParameters.colorPalette = [...enhancedParameters.colorPalette, ...refAnalysis.colors];
        }
        if (refAnalysis.wallCladding?.length) {
          enhancedParameters.wallCladding = [...enhancedParameters.wallCladding, ...refAnalysis.wallCladding];
        }
        if (refAnalysis.flooringMaterial?.length) {
          enhancedParameters.flooringMaterial = [...enhancedParameters.flooringMaterial, ...refAnalysis.flooringMaterial];
        }
        if (refAnalysis.architecturalFeatures?.length) {
          enhancedParameters.architecturalFeatures = [...enhancedParameters.architecturalFeatures, ...refAnalysis.architecturalFeatures];
        }
      }

      // Process Pinterest URL
      if (pinterestUrl) {
        const pinterestAnalysis = await analyzePinterestBoard(pinterestUrl);
        
        if (pinterestAnalysis.style) enhancedParameters.style = pinterestAnalysis.style;
        if (pinterestAnalysis.materials?.length) {
          enhancedParameters.materials = [...enhancedParameters.materials, ...pinterestAnalysis.materials];
        }
        if (pinterestAnalysis.colors?.length) {
          enhancedParameters.colorPalette = [...enhancedParameters.colorPalette, ...pinterestAnalysis.colors];
        }
      }

      // Process text prompt
      if (textPrompt) {
        const textAnalysis = await analyzeTextPrompt(textPrompt);
        
        if (textAnalysis.style) enhancedParameters.style = textAnalysis.style;
        if (textAnalysis.materials?.length) {
          enhancedParameters.materials = [...enhancedParameters.materials, ...textAnalysis.materials];
        }
        if (textAnalysis.colors?.length) {
          enhancedParameters.colorPalette = [...enhancedParameters.colorPalette, ...textAnalysis.colors];
        }
        if (textAnalysis.architecturalFeatures?.length) {
          enhancedParameters.architecturalFeatures = [...enhancedParameters.architecturalFeatures, ...textAnalysis.architecturalFeatures];
        }
      }
      
      // Remove duplicates
      const removeDuplicates = (arr: any[]) => {
        if (!Array.isArray(arr)) return [];
        return arr.filter((item, index, self) => self.indexOf(item) === index);
      };

      const parameters = {
        roomType: enhancedParameters.roomType || 'Living Space',
        style: enhancedParameters.style || 'Contemporary',
        spaceType: 'interior' as const,
        wallCladding: removeDuplicates(enhancedParameters.wallCladding || ['Natural wall finish']),
        flooringMaterial: removeDuplicates(enhancedParameters.flooringMaterial || ['Natural flooring']),
        materials: removeDuplicates(enhancedParameters.materials || ['Natural materials']),
        colorPalette: removeDuplicates(enhancedParameters.colorPalette || ['Neutral tones']),
        architecturalFeatures: enhancedParameters.architecturalFeatures || [],
        naturalCategories: enhancedParameters.naturalCategories || {}
      };

      res.json(parameters);
    } catch (error) {
      console.error('Parameter extraction error:', error);
      res.status(500).json({ error: 'Failed to extract design parameters' });
    }
  });

  // Transform image endpoint
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