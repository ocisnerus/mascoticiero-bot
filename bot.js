import dotenv from "dotenv";
import { getNews } from "./gnews.js";
import { generateImage } from "./generateImage.js";
import { postToWordpress } from "./postToWordpress.js";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

const CATEGORIA_ID = process.env.CATEGORIA_ID;

async function main() {
  try {
    console.log("🟢 Buscando noticia...");
    const noticia = await getNews();

    if (!noticia || !noticia.title || !noticia.description) {
      console.error("❌ No se encontró una noticia válida.");
      return;
    }

    console.log("✍️ Generando contenido...");

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Eres un redactor profesional para el blog Mascoticiero, escribe en español mexicano, estilo humano, con mínimo 500 palabras, y con estructura SEO monstruosa. Usa H1, H2, emojis y bloques legibles. Agrega backlinks internos a categorías como /category/perros, /category/gatos y /category/mascotas-asombrosas cuando sea relevante. Menciona de forma natural nombres como Firulais, Gurrumino, Oscar Cisneros o Kiko de vez en cuando. Termina con un CTA para seguir leyendo más noticias de animales.`,
        },
        {
          role: "user",
          content: `Título: ${noticia.title}\nResumen: ${noticia.description}`,
        },
      ],
      temperature: 0.7,
    });

    const generatedText = gptResponse.choices[0].message.content;

    console.log("🖼️ Generando imagen...");

    const imagePrompt = `Fotografía horizontal hiperrealista sobre: ${noticia.title}, animales, estilo profesional, 1200x628`;
    const imageUrl = await generateImage(imagePrompt);

    console.log("📦 Enviando a WordPress...");

    await postToWordpress({
      title: noticia.title,
      content: generatedText,
      imageUrl: imageUrl,
      categoryId: CATEGORIA_ID,
    });

    console.log("✅ Publicación completa en Mascoticiero.");
  } catch (error) {
    console.error("❌ Error:", error.message || error);
  }
}

main();