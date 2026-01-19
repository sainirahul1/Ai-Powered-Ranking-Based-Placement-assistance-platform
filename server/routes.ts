import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoadmapSchema, insertInterviewSchema } from "@shared/schema";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { api } from "@shared/routes";
import { z } from "zod";

import { generateAILogic } from "./aiService";

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
      
      // AI Roadmap logic
      const steps = await generateAILogic(data.role, data.experienceLevel, data.goals);
      
      const roadmap = await storage.createRoadmap({
        ...data,
        generatedContent: steps
      } as any);
      
      res.json(roadmap);
    } catch (error) {
      console.error("Roadmap error:", error);
      res.status(500).json({ message: "Failed to generate AI roadmap" });
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
    try {
      const { role, experienceLevel, goals } = req.body;
      const steps = await generateAILogic(role || "Developer", experienceLevel || "Beginner", goals || "Career growth");
      res.json({
        role: role || "Developer",
        steps: steps
      });
    } catch (error) {
      res.status(500).json({ message: "AI Generation failed" });
    }
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
