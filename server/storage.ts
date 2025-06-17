import {
  users,
  photos,
  designBoards,
  boardPhotos,
  comparisons,
  type User,
  type Photo,
  type DesignBoard,
  type BoardPhoto,
  type Comparison,
  type InsertUser,
  type InsertPhoto,
  type InsertDesignBoard,
  type InsertBoardPhoto,
  type InsertComparison,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo || undefined;
  }

  async getPhotosByUser(userId: number): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.userId, userId));
  }

  async getPhotosByType(userId: number, type: string): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .where(and(eq(photos.userId, userId), eq(photos.type, type)));
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const [photo] = await db
      .insert(photos)
      .values(insertPhoto)
      .returning();
    return photo;
  }

  async deletePhoto(id: number): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }

  async getDesignBoard(id: number): Promise<DesignBoard | undefined> {
    const [board] = await db.select().from(designBoards).where(eq(designBoards.id, id));
    return board || undefined;
  }

  async getDesignBoardsByUser(userId: number): Promise<DesignBoard[]> {
    return await db.select().from(designBoards).where(eq(designBoards.userId, userId));
  }

  async createDesignBoard(insertBoard: InsertDesignBoard): Promise<DesignBoard> {
    const [board] = await db
      .insert(designBoards)
      .values(insertBoard)
      .returning();
    return board;
  }

  async updateDesignBoard(id: number, updates: Partial<InsertDesignBoard>): Promise<DesignBoard | undefined> {
    const [board] = await db
      .update(designBoards)
      .set(updates)
      .where(eq(designBoards.id, id))
      .returning();
    return board || undefined;
  }

  async deleteDesignBoard(id: number): Promise<void> {
    await db.delete(designBoards).where(eq(designBoards.id, id));
  }

  async getBoardPhotos(boardId: number): Promise<Photo[]> {
    const result = await db
      .select({ photo: photos })
      .from(boardPhotos)
      .innerJoin(photos, eq(boardPhotos.photoId, photos.id))
      .where(eq(boardPhotos.boardId, boardId));
    
    return result.map(r => r.photo);
  }

  async addPhotoToBoard(insertBoardPhoto: InsertBoardPhoto): Promise<BoardPhoto> {
    const [boardPhoto] = await db
      .insert(boardPhotos)
      .values(insertBoardPhoto)
      .returning();
    return boardPhoto;
  }

  async removePhotoFromBoard(boardId: number, photoId: number): Promise<void> {
    await db
      .delete(boardPhotos)
      .where(and(eq(boardPhotos.boardId, boardId), eq(boardPhotos.photoId, photoId)));
  }

  async getComparison(id: number): Promise<Comparison | undefined> {
    const [comparison] = await db.select().from(comparisons).where(eq(comparisons.id, id));
    return comparison || undefined;
  }

  async getComparisonsByUser(userId: number): Promise<Comparison[]> {
    return await db.select().from(comparisons).where(eq(comparisons.userId, userId));
  }

  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const [comparison] = await db
      .insert(comparisons)
      .values(insertComparison)
      .returning();
    return comparison;
  }

  async updateComparison(id: number, updates: Partial<InsertComparison>): Promise<Comparison | undefined> {
    const [comparison] = await db
      .update(comparisons)
      .set(updates)
      .where(eq(comparisons.id, id))
      .returning();
    return comparison || undefined;
  }

  async deleteComparison(id: number): Promise<void> {
    await db.delete(comparisons).where(eq(comparisons.id, id));
  }
}

export const storage = new DatabaseStorage();