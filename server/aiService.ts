import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateAILogic(role: string, experience: string, goals: string) {
  // Enhanced prompt with strict formatting and explicit instructions to avoid placeholders
  const prompt = `Act as an expert career coach. Create a highly specific technical learning roadmap for a ${experience} ${role} who wants to achieve: "${goals}".
  
  CRITICAL INSTRUCTIONS:
  - Do NOT use generic titles like "Topic A", "Step 1", or "Foundations". Use specific technical names (e.g., "React Hooks & State Management", "Advanced System Design").
  - For each step, provide a detailed description and a direct YouTube search link.
  
  Return ONLY a JSON object with a "steps" key containing an array of exactly 5 objects.
  Each object must have:
  - "title": A specific technical topic name.
  - "description": 2-3 sentences of what to learn.
  - "youtubeLink": A URL formatted as: https://www.youtube.com/results?search_query=[encoded+topic+name]+tutorial
  
  Example structure:
  {
    "steps": [
      {
        "title": "Mastering TypeScript Generics",
        "description": "Learn how to build reusable components and utility functions using advanced TS types.",
        "youtubeLink": "https://www.youtube.com/results?search_query=typescript+generics+tutorial"
      }
    ]
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    const data = JSON.parse(content);
    
    let steps = [];
    if (Array.isArray(data)) steps = data;
    else if (data.steps && Array.isArray(data.steps)) steps = data.steps;
    else if (data.roadmap && Array.isArray(data.roadmap)) steps = data.roadmap;
    
    if (steps.length === 0) {
        throw new Error("No steps generated");
    }

    return steps;
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Dynamic fallback that actually uses the role
    return [
      { 
        title: `Core ${role} Skills`, 
        description: `Master the essential tools and frameworks required for a ${role} role.`,
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(role + " full course")}`
      },
      { 
        title: `Professional ${role} Projects`, 
        description: `Build and deploy real-world projects to demonstrate your ${experience} proficiency.`,
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(role + " project tutorial")}`
      }
    ];
  }
}
