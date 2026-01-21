import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

/**
 * Evaluates an interview answer using a rule-based approach combined with AI analysis.
 * Returns a numeric score between 0 and 100.
 */
export async function evaluateAnswer(question: string, answer: string): Promise<{ score: number; feedback: string }> {
  if (!answer || answer.trim().length < 5) {
    return { score: 0, feedback: "Answer is too short to evaluate." };
  }

  const prompt = `
    Evaluate the following interview answer for the question: "${question}"
    Candidate's Answer: "${answer}"
    
    Provide a score from 0 to 100 based on:
    - Relevance to the question
    - Technical accuracy
    - Clarity and professionalism
    
    Return ONLY a JSON object with:
    - "score": number
    - "feedback": short sentence
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o as gpt-5 is not available/specified correctly in some contexts
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    
    return {
      score: typeof result.score === 'number' ? result.score : 50,
      feedback: result.feedback || "Evaluated."
    };
  } catch (error) {
    console.error("Evaluation Error:", error);
    // Rule-based fallback
    const wordCount = answer.split(/\s+/).length;
    let baseScore = Math.min(wordCount * 2, 60); // Max 60 for length
    if (answer.toLowerCase().includes("because") || answer.toLowerCase().includes("example")) baseScore += 20;
    
    return { 
      score: baseScore, 
      feedback: "Rule-based evaluation applied due to system error." 
    };
  }
}

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
      model: "gpt-4o",
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
