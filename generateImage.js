import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1200x628",
      response_format: "url",
    });

    const imageUrl = response.data.data[0].url;
    return imageUrl;
  } catch (error) {
    console.error("❌ Error al generar la imagen:", error.message);
    throw error;
  }
}