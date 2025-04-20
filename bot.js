import { getNews } from "./gnews.js";
import { generateContent } from "./gpt.js";
import { generateImage } from "./generateImage.js";
import { postToWordpress, uploadImageToWordpress } from "./postToWordpress.js";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

console.log("🟢 Buscando noticia...");
const noticia = await getNews();

console.log("✍️ Generando contenido...");
const contenido = await generateContent(noticia);

console.log("🖼️ Generando imagen...");
const imageUrl = await generateImage(noticia.title);

// Descargar imagen
console.log("⬇️ Descargando imagen...");
const imageResponse = await axios.get(imageUrl, {
  responseType: "arraybuffer",
  headers: { "Accept": "image/webp" }
});
const imageBuffer = Buffer.from(imageResponse.data, "binary");

// Subir imagen y obtener ID
console.log("📤 Subiendo imagen a WordPress...");
const imageId = await uploadImageToWordpress(imageBuffer, "imagen-generada.webp");

// Publicar post con imagen
console.log("📦 Enviando a WordPress...");
await postToWordpress({
  title: noticia.title,
  content: contenido,
  mediaId: imageId,
  categoryId: parseInt(process.env.CATEGORIA_ID), // asegúrate que sea número
});

console.log("✅ Todo publicado con éxito.");