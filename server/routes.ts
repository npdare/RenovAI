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

  const httpServer = createServer(app);
  return httpServer;
}
