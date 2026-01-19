import { users, roadmaps, interviews, type User, type InsertRoadmap, type Roadmap, type InsertInterview, type Interview } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: typeof users.$inferInsert): Promise<User>;
  
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  getRoadmaps(): Promise<Roadmap[]>;
  
  createInterview(interview: InsertInterview): Promise<Interview>;
  getInterviews(): Promise<Interview[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roadmaps: Map<number, Roadmap>;
  private interviews: Map<number, Interview>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.roadmaps = new Map();
    this.interviews = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: typeof users.$inferInsert): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const id = this.currentId++;
    const roadmap: Roadmap = { 
      ...insertRoadmap, 
      id, 
      generatedContent: null,
      createdAt: new Date() 
    };
    this.roadmaps.set(id, roadmap);
    return roadmap;
  }

  async getRoadmaps(): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values());
  }

  async createInterview(insertInterview: InsertInterview): Promise<Interview> {
    const id = this.currentId++;
    const interview: Interview = {
      ...insertInterview,
      id,
      status: "pending",
      feedback: null,
      createdAt: new Date()
    };
    this.interviews.set(id, interview);
    return interview;
  }

  async getInterviews(): Promise<Interview[]> {
    return Array.from(this.interviews.values());
  }
}

export const storage = new MemStorage();
