import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

export async function generateImage(texto) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Imagen horizontal para acompañar esta noticia de animales en un blog mexicano llamado Mascoticiero. Estilo realista. Inspiración: ${texto}`,
    size: "1024x1024",
    quality: "standard",
    n: 1,
  });

  return response.data[0].url;
}