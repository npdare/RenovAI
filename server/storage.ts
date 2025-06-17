import { 
  users, 
  photos, 
  designBoards, 
  boardPhotos, 
  comparisons,
  type User, 
  type InsertUser,
  type Photo,
  type InsertPhoto,
  type DesignBoard,
  type InsertDesignBoard,
  type BoardPhoto,
  type InsertBoardPhoto,
  type Comparison,
  type InsertComparison
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Photo methods
  getPhoto(id: number): Promise<Photo | undefined>;
  getPhotosByUser(userId: number): Promise<Photo[]>;
  getPhotosByType(userId: number, type: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
  
  // Design board methods
  getDesignBoard(id: number): Promise<DesignBoard | undefined>;
  getDesignBoardsByUser(userId: number): Promise<DesignBoard[]>;
  createDesignBoard(board: InsertDesignBoard): Promise<DesignBoard>;
  updateDesignBoard(id: number, updates: Partial<InsertDesignBoard>): Promise<DesignBoard | undefined>;
  deleteDesignBoard(id: number): Promise<void>;
  
  // Board photo methods
  getBoardPhotos(boardId: number): Promise<Photo[]>;
  addPhotoToBoard(boardPhoto: InsertBoardPhoto): Promise<BoardPhoto>;
  removePhotoFromBoard(boardId: number, photoId: number): Promise<void>;
  
  // Comparison methods
  getComparison(id: number): Promise<Comparison | undefined>;
  getComparisonsByUser(userId: number): Promise<Comparison[]>;
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  updateComparison(id: number, updates: Partial<InsertComparison>): Promise<Comparison | undefined>;
  deleteComparison(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private photos: Map<number, Photo>;
  private designBoards: Map<number, DesignBoard>;
  private boardPhotos: Map<number, BoardPhoto>;
  private comparisons: Map<number, Comparison>;
  private currentUserId: number;
  private currentPhotoId: number;
  private currentBoardId: number;
  private currentBoardPhotoId: number;
  private currentComparisonId: number;

  constructor() {
    this.users = new Map();
    this.photos = new Map();
    this.designBoards = new Map();
    this.boardPhotos = new Map();
    this.comparisons = new Map();
    this.currentUserId = 1;
    this.currentPhotoId = 1;
    this.currentBoardId = 1;
    this.currentBoardPhotoId = 1;
    this.currentComparisonId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Photo methods
  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async getPhotosByUser(userId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(photo => photo.userId === userId);
  }

  async getPhotosByType(userId: number, type: string): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      photo => photo.userId === userId && photo.type === type
    );
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.currentPhotoId++;
    const photo: Photo = { 
      ...insertPhoto, 
      id, 
      uploadedAt: new Date() 
    };
    this.photos.set(id, photo);
    return photo;
  }

  async deletePhoto(id: number): Promise<void> {
    this.photos.delete(id);
    // Also remove from board photos
    for (const [key, boardPhoto] of this.boardPhotos.entries()) {
      if (boardPhoto.photoId === id) {
        this.boardPhotos.delete(key);
      }
    }
  }

  // Design board methods
  async getDesignBoard(id: number): Promise<DesignBoard | undefined> {
    return this.designBoards.get(id);
  }

  async getDesignBoardsByUser(userId: number): Promise<DesignBoard[]> {
    return Array.from(this.designBoards.values()).filter(board => board.userId === userId);
  }

  async createDesignBoard(insertBoard: InsertDesignBoard): Promise<DesignBoard> {
    const id = this.currentBoardId++;
    const now = new Date();
    const board: DesignBoard = { 
      ...insertBoard, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.designBoards.set(id, board);
    return board;
  }

  async updateDesignBoard(id: number, updates: Partial<InsertDesignBoard>): Promise<DesignBoard | undefined> {
    const board = this.designBoards.get(id);
    if (!board) return undefined;
    
    const updatedBoard: DesignBoard = {
      ...board,
      ...updates,
      updatedAt: new Date()
    };
    this.designBoards.set(id, updatedBoard);
    return updatedBoard;
  }

  async deleteDesignBoard(id: number): Promise<void> {
    this.designBoards.delete(id);
    // Also remove associated board photos
    for (const [key, boardPhoto] of this.boardPhotos.entries()) {
      if (boardPhoto.boardId === id) {
        this.boardPhotos.delete(key);
      }
    }
  }

  // Board photo methods
  async getBoardPhotos(boardId: number): Promise<Photo[]> {
    const boardPhotoEntries = Array.from(this.boardPhotos.values()).filter(
      bp => bp.boardId === boardId
    );
    const photoIds = boardPhotoEntries.map(bp => bp.photoId);
    return photoIds.map(id => this.photos.get(id)).filter(Boolean) as Photo[];
  }

  async addPhotoToBoard(insertBoardPhoto: InsertBoardPhoto): Promise<BoardPhoto> {
    const id = this.currentBoardPhotoId++;
    const boardPhoto: BoardPhoto = {
      ...insertBoardPhoto,
      id,
      addedAt: new Date()
    };
    this.boardPhotos.set(id, boardPhoto);
    return boardPhoto;
  }

  async removePhotoFromBoard(boardId: number, photoId: number): Promise<void> {
    for (const [key, boardPhoto] of this.boardPhotos.entries()) {
      if (boardPhoto.boardId === boardId && boardPhoto.photoId === photoId) {
        this.boardPhotos.delete(key);
        break;
      }
    }
  }

  // Comparison methods
  async getComparison(id: number): Promise<Comparison | undefined> {
    return this.comparisons.get(id);
  }

  async getComparisonsByUser(userId: number): Promise<Comparison[]> {
    return Array.from(this.comparisons.values()).filter(comp => comp.userId === userId);
  }

  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const id = this.currentComparisonId++;
    const comparison: Comparison = {
      ...insertComparison,
      id,
      createdAt: new Date()
    };
    this.comparisons.set(id, comparison);
    return comparison;
  }

  async updateComparison(id: number, updates: Partial<InsertComparison>): Promise<Comparison | undefined> {
    const comparison = this.comparisons.get(id);
    if (!comparison) return undefined;
    
    const updatedComparison: Comparison = {
      ...comparison,
      ...updates
    };
    this.comparisons.set(id, updatedComparison);
    return updatedComparison;
  }

  async deleteComparison(id: number): Promise<void> {
    this.comparisons.delete(id);
  }
}

export const storage = new MemStorage();
