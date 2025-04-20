import dotenv from "dotenv";
dotenv.config();

import { getNews } from "./gnews.js";
import { generateImage } from "./generateImage.js";
import { postToWordpress } from "./postToWordpress.js";
import { writeFile } from "fs/promises";
import axios from "axios";

const CATEGORIA_ID = Number(process.env.CATEGORIA_ID);

async function main() {
  console.log("🟢 Buscando noticia...");

  const noticia = await getNews();
  if (!noticia) {
    console.error("❌ No se encontró ninguna noticia.");
    return;
  }

  console.log("✍️ Generando contenido...");

  const prompt = `Redacta una noticia real estilo Mascoticiero en español de México basada en este titular: "${noticia.title}" con mínimo 500 palabras, estilo natural y SEO monstruoso. Incluye menciones a Firulais, Gurrumino, Oscar Cisneros y el sitio Mascoticiero sin exagerar. Separa en párrafos.`;

  const gptResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API}`,
        "Content-Type": "application/json",
      },
    }
  );

  const contenido = gptResponse.data.choices[0].message.content;

  console.log("🖼️ Generando imagen...");

  const imagePrompt = `Una imagen horizontal realista,
