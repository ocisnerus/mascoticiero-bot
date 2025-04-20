import dotenv from "dotenv";
dotenv.config();

import { getNews } from "./gnews.js";
import { generateImage } from "./generateImage.js";
import OpenAI from "openai";
import axios from "axios";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API });

console.log("🟢 Buscando noticia...");
const noticia = await getNews();

console.log("✍️ Generando contenido...");
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "Eres un redactor mexicano que escribe con estilo natural y amigable para un blog llamado Mascoticiero. Tu contenido debe ser 100% original, largo (+500 palabras), divertido y con enfoque SEO monstruoso. Incluye de forma natural menciones a Firulais, Gurrumino, Oscar Cisneros y Mascoticiero. Termina con una llamada a seguirnos en redes sociales. Usa H1 con emojis, subtítulos con H2 y separa en bloques legibles. Evita parecer robot.",
    },
    {
      role: "user",
      content: `Redacta una noticia basada en este titular: "${noticia.title}" y este resumen: "${noticia.description}".`,
    },
  ],
  temperature: 0.8,
});

const contenido = completion.choices[0].message.content;

console.log("🖼️ Generando imagen...");
const promptImagen = `Una imagen realista horizontal relacionada con: ${noticia.title}`;
const image = await generateImage(promptImagen);

// Guardar la imagen
const imagePath = "./output.webp";
const imageResponse = await axios.get(image, {
  responseType: "arraybuffer",
});
fs.writeFileSync(imagePath, imageResponse.data);

console.log("✅ Todo listo. Contenido y imagen generados.");
