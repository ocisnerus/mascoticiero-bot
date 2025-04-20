import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateImagePrompt(title, summary) {
  const promptBase = `
  Redacta un prompt visual para una imagen hiperrealista, horizontal, en alta calidad, relacionada con una noticia de animales.
  Título: "${title}"
  Descripción: "${summary}"
  La imagen debe parecer realista y tener sentido para un blog de noticias de animales.
  Solo responde con el prompt, sin comillas, sin explicación.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: promptBase }],
  });

  return response.choices[0].message.content.trim();
}