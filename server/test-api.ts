import "dotenv/config";
import OpenAI from "openai";

console.log("=== Testing OpenAI API Connection ===");
console.log("API Key:", process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.substring(0, 20) + "...");
console.log("Base URL:", process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

async function test() {
  try {
    console.log("\n🔄 Sending test request to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: 'Return this JSON: {"score": 85, "feedback": "test"}',
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log("✅ API Response received!");
    console.log("Content:", response.choices[0].message.content);
  } catch (error) {
    console.log("❌ API Error:");
    if (error instanceof Error) {
      console.log("Message:", error.message);
      console.log("Status:", (error as any).status);
      console.log("Code:", (error as any).code);
      console.log("Error Type:", error.constructor.name);
    } else {
      console.log("Error:", error);
    }
  }
}

test();
