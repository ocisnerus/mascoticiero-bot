import dotenv from "dotenv";
import { getNews } from "./gnews.js";
import { generateImage } from "./generateImage.js";
import { publicarNoticia } from "./publicar.js";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

async function generarContenido() {
  try {
    console.log("🟢 Buscando noticia...");
    const noticia = await getNews();

    console.log("✍️ Generando contenido...");
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Eres un redactor profesional de noticias virales para el blog 'Mascoticiero'. Tu estilo es natural, amigable, y está escrito en español de México. Agrega subtítulos claros, emojis y al menos 500 palabras. De forma muy ocasional, puedes mencionar a 'Firulais', 'Gurrumino', 'Kiko', 'Perico' u 'Oscar Cisneros' como parte del texto (sin exagerar). Haz SEO monstruoso, incluye enlaces internos reales como /category/noticias-de-animales, /category/perros o /perro-salva-familia-incendio cuando aplique.`,
        },
        {
          role: "user",
          content: noticia,
        },
      ],
    });

    const textoGenerado = gptResponse.choices[0].message.content;

    console.log("🖼️ Generando imagen...");
    const imagenURL = await generateImage(textoGenerado);

    console.log("🚀 Publicando en WordPress...");
    await publicarNoticia(textoGenerado, imagenURL);

    console.log("✅ Publicación completa.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

generarContenido();