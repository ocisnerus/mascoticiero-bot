import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

export async function generarImagen(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Imagen realista, horizontal, de alta calidad, en formato webp. Representa visualmente esta noticia sobre animales: ${prompt}`,
      n: 1,
      size: "1024x1024",
      response_format: "url",
      quality: "standard",
      style: "vivid"
    });
    return response.data[0].url;
  } catch (error) {
    throw new Error(`❌ Error al generar imagen: ${error.message}`);
  }
}