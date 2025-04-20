import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      prompt,
      model: "dall-e-3",
      n: 1,
      size: "1024x1024"
    });

    const imageUrl = response.data[0].url;
    return imageUrl;
  } catch (error) {
    console.error("Error generando imagen:", error);
    throw error;
  }
}