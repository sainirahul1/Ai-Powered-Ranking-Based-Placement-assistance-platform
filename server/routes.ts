import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoadmapSchema, insertInterviewSchema } from "@shared/schema";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register AI Integration Routes
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerAudioRoutes(app);

  // Application Routes using shared/routes.ts definitions
  
  // Roadmap Generation
  app.post(api.roadmap.generate.path, async (req, res) => {
    try {
      const data = api.roadmap.generate.input.parse(req.body);
      const roadmap = await storage.createRoadmap(data);
      // In a real app, this would trigger the AI generation
      res.json(roadmap);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid input data" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
  });

  // Start Interview
  app.post(api.interview.start.path, async (req, res) => {
    try {
      const data = api.interview.start.input.parse(req.body);
      const interview = await storage.createInterview(data);
      res.status(201).json(interview);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid input data" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
  });

  // List Interviews
  app.get(api.interview.list.path, async (req, res) => {
    const interviews = await storage.getInterviews();
    res.json(interviews);
  });

  // MongoDB Atlas Routes
  app.post("/api/roadmap", async (req, res) => {
    res.json({
      role: req.body.role || "Developer",
      steps: [
        { id: 1, title: "Learn Basics", description: "Master the fundamentals." },
        { id: 2, title: "Build Projects", description: "Apply your knowledge." }
      ]
    });
  });

  app.post("/api/interview/answer", async (req, res) => {
    res.json({ status: "success", message: "Answer recorded" });
  });

  app.get("/api/interview/report", async (req, res) => {
    res.json({
      score: 85,
      summary: "Great performance! Focus on system design.",
      details: []
    });
  });

  return httpServer;
}
