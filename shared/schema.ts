import { pgTable, text, serial, jsonb, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export chat models
export * from "./models/chat";

// Mock User for now
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
});

// Roadmap Request Schema
export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(), // e.g., "Frontend Developer"
  experienceLevel: text("experience_level").notNull(), // e.g., "Beginner"
  goals: text("goals").notNull(),
  generatedContent: jsonb("generated_content"), // The AI response
  createdAt: timestamp("created_at").defaultNow(),
});

// Interview Session Schema
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(), // e.g., "Easy", "Medium", "Hard"
  status: text("status").notNull().default("pending"), // pending, active, completed
  feedback: jsonb("feedback"), // AI feedback
  answers: jsonb("answers"), // Array of {question, answer, score, feedback}
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true 
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({ 
  id: true, 
  userId: true,
  generatedContent: true, 
  createdAt: true 
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({ 
  id: true, 
  userId: true,
  status: true, 
  createdAt: true 
});

export type Roadmap = typeof roadmaps.$inferSelect;
export type Interview = typeof interviews.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
