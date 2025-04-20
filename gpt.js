import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateContent(news) {
  const prompt = `
Redacta una publicación estilo Mascoticiero con estas condiciones:

- Escribe en español mexicano 🇲🇽.
- Mínimo 500 palabras reales.
- Estilo humano, natural, amigable.
- Separa por bloques como si fuera Gutenberg.
- Usa títulos H1 y H2.
- Incluye un bloque de tiempo estimado de lectura.
- Usa emojis en subtítulos y párrafos de forma natural.
- Agrega backlinks internos a https://mascoticiero.com/category/noticias-de-animales, https://mascoticiero.com/category/mascotas-asombrosas y otras URLs del sitio que encajen.
- Menciona a Oscar Cisneros, Firulais, Gurrumino o Kiko como parte de la narrativa si aplica.
- Cierra con un CTA que invite a seguir a Mascoticiero en redes sociales (Facebook, Instagram, X y YouTube).
- Haz SEO monstruoso.

Resumen de la noticia: ${news}

Devuélvelo en formato HTML limpio, sin CSS, listo para pegar en WordPress.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}