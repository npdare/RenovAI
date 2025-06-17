import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  type: text("type").notNull(), // 'home' | 'floorplan' | 'inspiration'
  category: text("category"), // room type like 'kitchen', 'bedroom', etc.
  url: text("url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const designBoards = pgTable("design_boards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const boardPhotos = pgTable("board_photos", {
  id: serial("id").primaryKey(),
  boardId: integer("board_id").notNull(),
  photoId: integer("photo_id").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const comparisons = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  beforePhotoId: integer("before_photo_id").notNull(),
  afterPhotoId: integer("after_photo_id"),
  designOptions: text("design_options"), // JSON string for applied design options
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  uploadedAt: true,
});

export const insertDesignBoardSchema = createInsertSchema(designBoards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBoardPhotoSchema = createInsertSchema(boardPhotos).omit({
  id: true,
  addedAt: true,
});

export const insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  createdAt: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  photos: many(photos),
  designBoards: many(designBoards),
  comparisons: many(comparisons),
}));

export const photosRelations = relations(photos, ({ one, many }) => ({
  user: one(users, { fields: [photos.userId], references: [users.id] }),
  boardPhotos: many(boardPhotos),
}));

export const designBoardsRelations = relations(designBoards, ({ one, many }) => ({
  user: one(users, { fields: [designBoards.userId], references: [users.id] }),
  boardPhotos: many(boardPhotos),
}));

export const boardPhotosRelations = relations(boardPhotos, ({ one }) => ({
  designBoard: one(designBoards, { fields: [boardPhotos.boardId], references: [designBoards.id] }),
  photo: one(photos, { fields: [boardPhotos.photoId], references: [photos.id] }),
}));

export const comparisonsRelations = relations(comparisons, ({ one }) => ({
  user: one(users, { fields: [comparisons.userId], references: [users.id] }),
  beforePhoto: one(photos, { fields: [comparisons.beforePhotoId], references: [photos.id] }),
  afterPhoto: one(photos, { fields: [comparisons.afterPhotoId], references: [photos.id] }),
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertDesignBoard = z.infer<typeof insertDesignBoardSchema>;
export type DesignBoard = typeof designBoards.$inferSelect;
export type InsertBoardPhoto = z.infer<typeof insertBoardPhotoSchema>;
export type BoardPhoto = typeof boardPhotos.$inferSelect;
export type InsertComparison = z.infer<typeof insertComparisonSchema>;
export type Comparison = typeof comparisons.$inferSelect;
