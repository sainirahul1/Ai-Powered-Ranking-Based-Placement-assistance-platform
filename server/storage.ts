import { users, roadmaps, interviews, type User, type InsertRoadmap, type Roadmap, type InsertInterview, type Interview } from "@shared/schema";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";

const PostgresStore = connectPg(session);
const MyMemoryStore = MemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: typeof users.$inferInsert): Promise<User>;
  
  createRoadmap(userId: number, roadmap: InsertRoadmap & { generatedContent?: any }): Promise<Roadmap>;
  getRoadmapsByUserId(userId: number): Promise<Roadmap[]>;
  
  createInterview(userId: number, interview: InsertInterview): Promise<Interview>;
  getInterviewsByUserId(userId: number): Promise<Interview[]>;
  updateInterviewAnswers(id: number, answers: any): Promise<Interview | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: typeof users.$inferInsert): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createRoadmap(userId: number, insertRoadmap: InsertRoadmap & { generatedContent?: any }): Promise<Roadmap> {
    const [roadmap] = await db.insert(roadmaps).values({
      ...insertRoadmap,
      userId,
      generatedContent: insertRoadmap.generatedContent || null,
    }).returning();
    return roadmap;
  }

  async getRoadmapsByUserId(userId: number): Promise<Roadmap[]> {
    return await db.select().from(roadmaps).where(eq(roadmaps.userId, userId));
  }

  async createInterview(userId: number, insertInterview: InsertInterview): Promise<Interview> {
    const [interview] = await db.insert(interviews).values({
      ...insertInterview,
      userId,
      status: "pending",
    }).returning();
    return interview;
  }

  async getInterviewsByUserId(userId: number): Promise<Interview[]> {
    return await db.select().from(interviews).where(eq(interviews.userId, userId));
  }

  async updateInterviewAnswers(id: number, answers: any): Promise<Interview | undefined> {
    const [interview] = await db
      .update(interviews)
      .set({ answers, status: "completed" })
      .where(eq(interviews.id, id))
      .returning();
    return interview;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roadmaps: Map<number, Roadmap>;
  private interviews: Map<number, Interview>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.roadmaps = new Map();
    this.interviews = new Map();
    this.currentId = 1;
    this.sessionStore = new MyMemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: typeof users.$inferInsert): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRoadmap(userId: number, insertRoadmap: InsertRoadmap & { generatedContent?: any }): Promise<Roadmap> {
    const id = this.currentId++;
    const roadmap: Roadmap = { 
      ...insertRoadmap, 
      id, 
      userId,
      generatedContent: insertRoadmap.generatedContent || null,
      createdAt: new Date() 
    };
    this.roadmaps.set(id, roadmap);
    return roadmap;
  }

  async getRoadmapsByUserId(userId: number): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values()).filter(r => r.userId === userId);
  }

  async createInterview(userId: number, insertInterview: InsertInterview): Promise<Interview> {
    const id = this.currentId++;
    const interview: Interview = {
      ...insertInterview,
      id,
      userId,
      status: "pending",
      feedback: null,
      answers: null,
      createdAt: new Date()
    };
    this.interviews.set(id, interview);
    return interview;
  }

  async getInterviewsByUserId(userId: number): Promise<Interview[]> {
    return Array.from(this.interviews.values()).filter(i => i.userId === userId);
  }

  async updateInterviewAnswers(id: number, answers: any): Promise<Interview | undefined> {
    const interview = this.interviews.get(id);
    if (interview) {
      interview.answers = answers;
      interview.status = "completed";
      this.interviews.set(id, interview);
      return interview;
    }
    return undefined;
  }
}

export const storage = new DatabaseStorage();


