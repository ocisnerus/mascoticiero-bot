import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImagePrompt(newsContent) {
  try {
    const promptInstruction = `
Eres un generador experto de prompts para DALL·E 3. A partir del siguiente contenido redactado para una publicación de blog sobre animales, tu tarea es generar un prompt claro, realista, descriptivo y en inglés para que DALL·E genere una imagen horizontal estilo foto realista. La imagen debe representar visualmente lo más destacado o impactante del contenido. No menciones texto, letras ni marcas.

Contenido:
${newsContent}

Recuerda:
- La imagen debe ser realista, tipo fotografía.
- No debe contener texto.
- El formato debe ser horizontal, ideal para redes y WordPress.
- Usa descripciones visuales, no abstractas.

Prompt (en inglés):
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a prompt generator for DALL·E 3." },
        { role: "user", content: promptInstruction },
      ],
      temperature: 0.7,
    });

    const finalPrompt = response.choices[0].message.content.trim();
    return finalPrompt;
  } catch (error) {
    console.error("❌ Error al generar el prompt para la imagen:", error.message);
    throw error;
  }
}