import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoadmapSchema, insertInterviewSchema } from "@shared/schema";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { api } from "@shared/routes";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { generateAILogic, evaluateAnswer } from "./aiService";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback_secret_123";

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

  // Mock Interview Session Endpoints
  app.post("/api/interview/session/start", async (req, res) => {
    try {
      const { name, domains, duration } = req.body;
      
      if (!name || !domains || !duration) {
        return res.status(400).json({ message: "Missing required session data" });
      }

      // Create a JWT token for the session
      const token = jwt.sign(
        { 
          name, 
          domains, 
          duration,
          startTime: Date.now() 
        }, 
        JWT_SECRET,
        { expiresIn: `${duration}m` }
      );

      res.json({ 
        token, 
        message: "Interview session locked and started",
        session: { name, domains, duration }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create interview session" });
    }
  });

  app.get("/api/interview/session/timer", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No session token" });

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const elapsed = Math.floor((Date.now() - decoded.startTime) / 1000);
      const totalSeconds = decoded.duration * 60;
      const remaining = Math.max(0, totalSeconds - elapsed);

      res.json({ 
        remaining,
        total: totalSeconds,
        isExpired: remaining === 0
      });
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired session" });
    }
  });

  // Start Interview (Original)
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
    try {
      const { question, answer } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ message: "Missing question or answer" });
      }
      
      const evaluation = await evaluateAnswer(question, answer);
      res.json({ status: "success", message: "Answer recorded", ...evaluation });
    } catch (error) {
      res.status(500).json({ message: "Failed to evaluate answer" });
    }
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
