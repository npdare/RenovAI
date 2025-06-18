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
  transformImageWithParameters
} from "./ai-service";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) and PDF files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // Photo routes
  app.post('/api/photos/upload', upload.array('photos', 10), async (req: any, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const { type = 'home', category, userId = 1 } = req.body;

      const photos = [];
      for (const file of req.files) {
        const photoData = {
          userId: parseInt(userId),
          filename: file.filename,
          originalName: file.originalname,
          type,
          category: category || null,
          url: `/uploads/${file.filename}`
        };

        const validatedData = insertPhotoSchema.parse(photoData);
        const photo = await storage.createPhoto(validatedData);
        photos.push(photo);
      }

      res.json(photos);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Upload failed' });
    }
  });

  app.get('/api/photos', async (req, res) => {
    try {
      const { userId = 1, type } = req.query;
      
      let photos;
      if (type && typeof type === 'string') {
        photos = await storage.getPhotosByType(parseInt(userId as string), type);
      } else {
        photos = await storage.getPhotosByUser(parseInt(userId as string));
      }
      
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch photos' });
    }
  });

  app.delete('/api/photos/:id', async (req, res) => {
    try {
      const photoId = parseInt(req.params.id);
      const photo = await storage.getPhoto(photoId);
      
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      // Delete file from disk
      const filePath = path.join(uploadsDir, photo.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await storage.deletePhoto(photoId);
      res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to delete photo' });
    }
  });

  // Design board routes
  app.get('/api/boards', async (req, res) => {
    try {
      const { userId = 1 } = req.query;
      const boards = await storage.getDesignBoardsByUser(parseInt(userId as string));
      res.json(boards);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch boards' });
    }
  });

  app.post('/api/boards', async (req, res) => {
    try {
      const boardData = { ...req.body, userId: req.body.userId || 1 };
      const validatedData = insertDesignBoardSchema.parse(boardData);
      const board = await storage.createDesignBoard(validatedData);
      res.json(board);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create board' });
    }
  });

  app.put('/api/boards/:id', async (req, res) => {
    try {
      const boardId = parseInt(req.params.id);
      const updates = insertDesignBoardSchema.partial().parse(req.body);
      const board = await storage.updateDesignBoard(boardId, updates);
      
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
      
      res.json(board);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update board' });
    }
  });

  app.delete('/api/boards/:id', async (req, res) => {
    try {
      const boardId = parseInt(req.params.id);
      await storage.deleteDesignBoard(boardId);
      res.json({ message: 'Board deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to delete board' });
    }
  });

  // Board photo routes
  app.get('/api/boards/:id/photos', async (req, res) => {
    try {
      const boardId = parseInt(req.params.id);
      const photos = await storage.getBoardPhotos(boardId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch board photos' });
    }
  });

  app.post('/api/boards/:id/photos', async (req, res) => {
    try {
      const boardId = parseInt(req.params.id);
      const { photoId } = req.body;
      
      const boardPhotoData = { boardId, photoId };
      const validatedData = insertBoardPhotoSchema.parse(boardPhotoData);
      const boardPhoto = await storage.addPhotoToBoard(validatedData);
      
      res.json(boardPhoto);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to add photo to board' });
    }
  });

  app.delete('/api/boards/:boardId/photos/:photoId', async (req, res) => {
    try {
      const boardId = parseInt(req.params.boardId);
      const photoId = parseInt(req.params.photoId);
      
      await storage.removePhotoFromBoard(boardId, photoId);
      res.json({ message: 'Photo removed from board successfully' });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to remove photo from board' });
    }
  });

  // Comparison routes
  app.get('/api/comparisons', async (req, res) => {
    try {
      const { userId = 1 } = req.query;
      const comparisons = await storage.getComparisonsByUser(parseInt(userId as string));
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch comparisons' });
    }
  });

  app.post('/api/comparisons', async (req, res) => {
    try {
      const comparisonData = { ...req.body, userId: req.body.userId || 1 };
      const validatedData = insertComparisonSchema.parse(comparisonData);
      const comparison = await storage.createComparison(validatedData);
      res.json(comparison);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create comparison' });
    }
  });

  app.put('/api/comparisons/:id', async (req, res) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const updates = insertComparisonSchema.partial().parse(req.body);
      const comparison = await storage.updateComparison(comparisonId, updates);
      
      if (!comparison) {
        return res.status(404).json({ message: 'Comparison not found' });
      }
      
      res.json(comparison);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update comparison' });
    }
  });

  app.delete('/api/comparisons/:id', async (req, res) => {
    try {
      const comparisonId = parseInt(req.params.id);
      await storage.deleteComparison(comparisonId);
      res.json({ message: 'Comparison deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to delete comparison' });
    }
  });

  // Product image proxy endpoint
  app.get('/api/proxy-image', async (req: Request, res: Response) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL required' });
      }

      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        return res.status(404).json({ error: 'Image not found' });
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const imageBuffer = await response.arrayBuffer();

      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      });

      res.send(Buffer.from(imageBuffer));
    } catch (error) {
      console.error('Image proxy error:', error);
      res.status(500).json({ error: 'Failed to proxy image' });
    }
  });

  // AI Analysis endpoint - analyze uploaded room photo
  app.post('/api/ai/analyze', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No photo provided' });
      }

      const analysis = await analyzeRoomPhoto(req.file.path);
      res.json(analysis);
    } catch (error) {
      console.error('AI analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze photo' });
    }
  });

  // AI Redesign endpoint - generate room redesign using DALL-E
  app.post('/api/ai/redesign', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No photo provided' });
      }

      const { designStyle = 'modern', roomType = 'living room' } = req.body;
      const result = await generateRoomRedesign(req.file.path, designStyle, roomType);
      res.json(result);
    } catch (error) {
      console.error('AI redesign error:', error);
      res.status(500).json({ error: 'Failed to generate redesign' });
    }
  });

  // AI Inspiration endpoint - generate design inspiration
  app.post('/api/ai/inspiration', async (req: Request, res: Response) => {
    try {
      const { style = 'modern', roomType = 'living room', colorPreferences } = req.body;
      const result = await generateDesignInspiration(style, roomType, colorPreferences);
      res.json(result);
    } catch (error) {
      console.error('AI inspiration error:', error);
      res.status(500).json({ error: 'Failed to generate inspiration' });
    }
  });

  // AI Recommendations endpoint - get personalized design recommendations
  app.post('/api/ai/recommendations', upload.array('photos', 5), async (req: any, res: Response) => {
    try {
      const photoPaths = req.files?.map((file: any) => file.path) || [];
      const { preferredStyles = ['modern'], budget } = req.body;
      
      if (photoPaths.length === 0) {
        return res.status(400).json({ error: 'No photos provided' });
      }

      const recommendations = await getDesignRecommendations(photoPaths, preferredStyles, budget);
      res.json(recommendations);
    } catch (error) {
      console.error('AI recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  });

  // AI Products endpoint - get product recommendations
  app.post('/api/ai/products', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No photo provided' });
      }

      const { budget } = req.body;
      const products = await generateProductRecommendations(req.file.path, budget);
      res.json(products);
    } catch (error) {
      console.error('AI products error:', error);
      res.status(500).json({ error: 'Failed to get product recommendations' });
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
      
      // Extract precise architectural parameters using OpenAI Vision
      const imageBuffer = fs.readFileSync(photoPath);
      const base64Image = imageBuffer.toString('base64');

      // Efficient parameter extraction with reduced token usage
      const analysisResponse = await new OpenAI({ apiKey: process.env.OPENAI_API_KEY }).chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Extract key design elements in minimal JSON format. Focus only on changeable materials."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract: {"roomType":"","style":"","wallCladding":[""],"flooringMaterial":[""],"materials":[""],"colorPalette":[""],"furnitureTypes":[""]}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "low" // Use low detail to reduce token usage
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 300, // Reduced token limit
      });

      const analysisResult = JSON.parse(analysisResponse.choices[0].message.content || '{}');
      
      // Helper function to extract style from text prompt
      const extractStyleFromText = (text: string): string => {
        const styles = ['modern', 'contemporary', 'traditional', 'minimalist', 'industrial', 'scandinavian', 'bohemian', 'farmhouse'];
        const lowerText = text.toLowerCase();
        return styles.find(style => lowerText.includes(style)) || 'Modern';
      };

      // Enhanced parameter processing with text prompt integration
      let enhancedParameters = { ...analysisResult };

      // If text prompt is provided, enhance parameters without additional API calls
      if (textPrompt) {
        const extractedStyle = extractStyleFromText(textPrompt);
        enhancedParameters.style = extractedStyle;
        
        // Extract materials from text prompt using pattern matching
        const materialKeywords = {
          'stone': 'Natural Stone',
          'wood': 'Wood Paneling', 
          'marble': 'Marble',
          'concrete': 'Concrete',
          'brick': 'Brick',
          'metal': 'Metal',
          'glass': 'Glass'
        };
        
        const colorKeywords = {
          'white': 'White',
          'black': 'Black',
          'gray': 'Gray',
          'blue': 'Blue',
          'green': 'Green',
          'neutral': 'Neutral',
          'warm': 'Warm Tones',
          'cool': 'Cool Tones'
        };

        const lowerPrompt = textPrompt.toLowerCase();
        
        // Extract materials from text
        const extractedMaterials = Object.entries(materialKeywords)
          .filter(([keyword]) => lowerPrompt.includes(keyword))
          .map(([, material]) => material);
        
        if (extractedMaterials.length > 0) {
          enhancedParameters.materials = [...(enhancedParameters.materials || []), ...extractedMaterials];
        }

        // Extract colors from text
        const extractedColors = Object.entries(colorKeywords)
          .filter(([keyword]) => lowerPrompt.includes(keyword))
          .map(([, color]) => color);
        
        if (extractedColors.length > 0) {
          enhancedParameters.colorPalette = [...(enhancedParameters.colorPalette || []), ...extractedColors];
        }
      }
      
      // Process reference images efficiently (analyze only the first one to save tokens)
      if (files.referenceImage0) {
        const refImageBuffer = fs.readFileSync(files.referenceImage0[0].path);
        const refBase64 = refImageBuffer.toString('base64');
        
        // Quick style detection from reference image
        const refAnalysis = await new OpenAI({ apiKey: process.env.OPENAI_API_KEY }).chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Style and 3 materials only: {\"style\":\"\",\"materials\":[\"\",\"\",\"\"]}"
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${refBase64}`,
                    detail: "low"
                  }
                }
              ],
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 100,
        });

        const refResult = JSON.parse(refAnalysis.choices[0].message.content || '{}');
        if (refResult.style) enhancedParameters.style = refResult.style;
        if (refResult.materials) {
          enhancedParameters.materials = [...(enhancedParameters.materials || []), ...refResult.materials];
        }
      }
      
      // Final parameter structure with defaults
      const parameters = {
        roomType: enhancedParameters.roomType || 'Living Room',
        style: enhancedParameters.style || 'Modern',
        spaceType: 'interior' as const,
        wallCladding: enhancedParameters.wallCladding || ['Painted Walls'],
        flooringMaterial: enhancedParameters.flooringMaterial || ['Hardwood'],
        ceilingDetails: enhancedParameters.ceilingDetails || ['Standard Ceiling'],
        materials: [...new Set(enhancedParameters.materials || ['Wood', 'Glass', 'Metal'])], // Remove duplicates
        colorPalette: [...new Set(enhancedParameters.colorPalette || ['Neutral', 'White', 'Gray'])],
        furnitureTypes: enhancedParameters.furnitureTypes || ['Seating', 'Tables'],
        lightingFixtures: enhancedParameters.lightingFixtures || ['Ambient Lighting'],
        architecturalFeatures: enhancedParameters.architecturalFeatures || []
      };

      res.json(parameters);
    } catch (error) {
      console.error('Parameter extraction error:', error);
      res.status(500).json({ error: 'Failed to extract design parameters' });
    }
  });

  // AI Design Studio - Transform Image endpoint
  app.post('/api/ai/transform-image', upload.single('photo'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Photo is required' });
      }

      const { parameters, strength } = req.body;
      const parsedParameters = JSON.parse(parameters);
      const transformationStrength = parseInt(strength);

      // Use the proper AI transformation function
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
