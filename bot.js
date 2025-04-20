import { getNews } from "./gnews.js";
import { generateContent } from "./gpt.js";
import { generateImagePrompt } from "./generateImagePrompt.js";
import { generateImage } from "./generateImage.js";
import { postToWordPress } from "./postToWordpress.js";

console.log("🟢 Buscando noticia...");

try {
  const news = await getNews();
  if (!news) throw new Error("No se encontró ninguna noticia válida.");

  console.log("✍️ Generando contenido...");
  const content = await generateContent(news);
  if (!content || !content.title || !content.body) {
    throw new Error("El contenido generado está incompleto.");
  }

  console.log("🖼️ Generando imagen...");
  const imagePrompt = await generateImagePrompt(content.body);
  console.log("🎯 Prompt para imagen:", imagePrompt);

  const imageUrl = await generateImage(imagePrompt);
  console.log("🌄 Imagen generada:", imageUrl);

  console.log("📦 Enviando a WordPress...");
  await postToWordPress(content.title, content.body, imageUrl);

  console.log("✅ Publicación exitosa.");
} catch (error) {
  console.error("❌ Error general:", error.message);
}