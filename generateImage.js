import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API,
});
const openai = new OpenAIApi(configuration);

export async function generateImage(prompt) {
  const response = await openai.createImage({
    prompt: `Imagen horizontal realista de: ${prompt}. Fondo claro, estilo natural, sin texto, ideal para SEO.`,
    n: 1,
    size: "1024x1024", // luego recortamos a 1200x628 si deseas
    response_format: "url",
  });

  return response.data.data[0].url;
}