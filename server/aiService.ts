import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.AI_INTEGRATIONS_GEMINI_API_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});



function extractJSON(text: string): any {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
  } catch {
    return {};
  }
}


export async function evaluateAnswer(
  question: string,
  answer: string,
  context?: { role?: string; experience?: string }
): Promise<{ score: number; feedback: string; referenceAnswer: string }> {
  if (!answer || answer.trim().length < 5) {
    return { 
      score: 0, 
      feedback: "Answer is too short to evaluate. Please provide more detail.",
      referenceAnswer: "A good answer should typically explain the 'what', 'why', and 'how' of the concept."
    };
  }

  const prompt = `
Act as a senior technical interviewer. Evaluate the following candidate response.
Role Context: ${context?.experience || "General"} ${context?.role || "Developer"}

Question: "${question}"
Candidate's Answer: "${answer}"

### Evaluation Rubric:
1. **Technical Depth (40%)**: Does the answer demonstrate deep understanding?
2. **Communication & Structure (30%)**: Is it clear, professional, and well-structured (e.g., STAR method for behavioral)?
3. **Problem Solving Approach (20%)**: Does it show logical thinking?
4. **Accuracy (10%)**: Are the technical facts correct?

### Requirements:
- Provide a score from 0 to 100.
- Provide constructive, actionable feedback (max 2 sentences).
- Generate a "Perfect Answer" (the referenceAnswer) that addresses the question comprehensively.

Return ONLY a JSON object with:
{
  "score": number,
  "feedback": "string",
  "referenceAnswer": "string"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text() || "{}";
    const parsed = extractJSON(text);

    return {
      score: typeof parsed.score === "number" ? parsed.score : 50,
      feedback: parsed.feedback || "Good effort. Focus on adding more technical specifics.",
      referenceAnswer: parsed.referenceAnswer || "The standard approach involves explaining the core mechanism and its trade-offs."
    };
  } catch (error) {
    console.error("Evaluation Error:", error);
    return {
      score: 50,
      feedback: "Rule-based evaluation applied due to system error.",
      referenceAnswer: "Consider researching the official documentation for this topic."
    };
  }
}


export async function generateAILogic(
  role: string,
  experience: string,
  goals: string
) {
  const prompt = `
Act as an expert career coach. Create a weekly structured technical learning roadmap for a ${experience} ${role} who wants to achieve: "${goals}".

CRITICAL INSTRUCTIONS:
- Organize the roadmap by WEEKS (e.g., "Week 1", "Week 2").
- Do NOT use generic titles like "Topic A" or "Foundations". Use specific technical names.
- For each week, provide a detailed description and a direct YouTube search link.

Return ONLY a JSON object with a "steps" key containing an array of exactly 5 objects.
Each object must have:
- "title"
- "description"
- "youtubeLink"
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text() || "{}";
    console.log("RAW GEMINI RESPONSE:", text);
    const data = extractJSON(text);
    console.log("PARSED JSON:", data);

    let steps: any[] = [];
    if (Array.isArray(data)) steps = data;
    else if (data.steps && Array.isArray(data.steps)) steps = data.steps;
    else if (data.roadmap && Array.isArray(data.roadmap))
      steps = data.roadmap;

    if (steps.length === 0) throw new Error("No steps generated");
    return steps;
  } catch (error) {
    console.error("AI Generation Error:", error);

    // Fallback roadmap (UNCHANGED)
    return [
      {
        title: "Week 1: Core Fundamentals",
        description: `Establish a strong foundation in ${role} principles and core syntax.`,
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          role + " fundamentals"
        )}`,
      },
      {
        title: "Week 2: Intermediate Concepts",
        description: `Deep dive into advanced topics related to ${goals}.`,
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          goals + " intermediate tutorial"
        )}`,
      },
    ];
  }
}