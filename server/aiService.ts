import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateAILogic(role: string, experience: string, goals: string) {
  const prompt = `Act as an expert career coach. Create a weekly structured technical learning roadmap for a ${experience} ${role} who wants to achieve: "${goals}".
  
  CRITICAL INSTRUCTIONS:
  - Organize the roadmap by WEEKS (e.g., "Week 1", "Week 2").
  - Do NOT use generic titles like "Topic A" or "Foundations". Use specific technical names.
  - For each week, provide a detailed description and a direct YouTube search link.
  
  Return ONLY a JSON object with a "steps" key containing an array of exactly 5 objects.
  Each object must have:
  - "title": The week name and specific technical focus (e.g., "Week 1: Mastering TypeScript Fundamentals").
  - "description": 2-3 sentences of what to learn this week.
  - "youtubeLink": A URL formatted as: https://www.youtube.com/results?search_query=[encoded+topic+name]+tutorial`;

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
    
    if (steps.length === 0) throw new Error("No steps generated");
    return steps;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return [
      { 
        title: "Week 1: Core Fundamentals", 
        description: `Establish a strong foundation in ${role} principles and core syntax.`,
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(role + " fundamentals")}`
      },
      { 
        title: "Week 2: Intermediate Concepts", 
        description: `Deep dive into advanced topics related to ${goals}.`,
        youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(goals + " intermediate tutorial")}`
      }
    ];
  }
}
