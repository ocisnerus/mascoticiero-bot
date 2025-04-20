// generateImagePrompt.js
import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImagePrompt(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that creates realistic and specific image prompts. Based on the input text, generate a short and clear image prompt for a horizontal photo-style image using DALL·E 3. Focus on animal news. Avoid artistic styles or vague terms.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error generating image prompt:", error.message);
    throw error;
  }
}