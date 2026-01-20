import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateAILogic(role: string, experience: string, goals: string) {
  const prompt = `Create a professional 5-step career roadmap for a ${experience} ${role} with these goals: ${goals}. 
  For each step, provide:
  1. A specific, descriptive "title" (not generic like "Topic A").
  2. A detailed "description" of what to learn.
  3. A "youtubeLink" which is a search URL for a high-quality tutorial on that specific topic (e.g., https://www.youtube.com/results?search_query=topic+name+tutorial).
  
  Return ONLY a JSON array of objects with "title", "description", and "youtubeLink" keys. No other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "[]";
    const data = JSON.parse(content);
    
    let steps = [];
    if (Array.isArray(data)) steps = data;
    else if (data.roadmap && Array.isArray(data.roadmap)) steps = data.roadmap;
    else if (data.steps && Array.isArray(data.steps)) steps = data.steps;
    
    return steps;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return [
      { 
        title: "Mastering " + role + " Fundamentals", 
        description: "Focus on the core pillars including syntax, design patterns, and best practices.",
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(role + " fundamentals")}`
      },
      { 
        title: "Advanced Specialization", 
        description: "Deep dive into " + goals + " to distinguish yourself in the market.",
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(goals + " tutorial")}`
      }
    ];
  }
}
