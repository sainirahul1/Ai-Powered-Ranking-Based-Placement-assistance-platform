import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// We use OpenAI (GPT-5) via Replit AI Integrations as it's more reliable within this environment
// than the Hugging Face free tier which is throwing 403/Permission errors.

export async function generateAILogic(role: string, experience: string, goals: string) {
  const prompt = `Create a professional 5-step career roadmap for a ${experience} ${role} with these goals: ${goals}. 
  Return ONLY a JSON array of objects with "title" and "description" keys. No other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // Use the latest model
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    const data = JSON.parse(content);
    
    // Handle different possible JSON structures from the LLM
    if (Array.isArray(data)) return data;
    if (data.roadmap && Array.isArray(data.roadmap)) return data.roadmap;
    if (data.steps && Array.isArray(data.steps)) return data.steps;
    
    return [];
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback to dummy data so the user sees something if the API fails
    return [
      { title: "Foundations", description: "Master the core principles of " + role },
      { title: "Specialization", description: "Focus on " + goals },
      { title: "Practical Application", description: "Build real-world projects." }
    ];
  }
}
