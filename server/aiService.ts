import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Free tier models (commonly available on Inference API)
const MODEL_1 = "mistralai/Mistral-7B-Instruct-v0.2";
const MODEL_2 = "google/gemma-7b-it";

export async function generateAILogic(role: string, experience: string, goals: string) {
  const prompt = `Create a 3-step technical roadmap for a ${experience} ${role} with these goals: ${goals}. Return as a simple JSON array of objects with "title" and "description".`;

  try {
    // 1. Call 2 models in parallel
    const [res1, res2] = await Promise.all([
      hf.chatCompletion({
        model: MODEL_1,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
      hf.chatCompletion({
        model: MODEL_2,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      })
    ]);

    const content1 = res1.choices[0].message.content || "";
    const content2 = res2.choices[0].message.content || "";

    // 2. Simple Keyword Overlap & Merge Logic
    // We parse the responses and merge them. If parsing fails, we fallback to a simple merge.
    let roadmap1 = parseJSON(content1);
    let roadmap2 = parseJSON(content2);

    // Filter and merge based on unique titles (keyword overlap simulation)
    const seen = new Set();
    const merged = [...roadmap1, ...roadmap2].filter(item => {
      const title = item.title?.toLowerCase().trim();
      if (!title || seen.has(title)) return false;
      seen.add(title);
      return true;
    }).slice(0, 5); // Keep top 5 unique steps

    return merged.length > 0 ? merged : roadmap1;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

function parseJSON(text: string) {
  try {
    // Clean text to find JSON array
    const match = text.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    return [];
  } catch {
    return [];
  }
}
