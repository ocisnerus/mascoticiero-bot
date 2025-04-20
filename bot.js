import { getNews } from "./gnews.js";
import { generateContent } from "./gpt.js";
import { generateImage } from "./generateImage.js";
import { uploadImageToWordPress } from "./uploadImage.js";
import { postToWordPress } from "./postToWordpress.js";
import * as dotenv from "dotenv";
dotenv.config();

async function runBot() {
  try {
    console.log("🟢 Buscando noticia...");
    const news = await getNews();

    console.log("✍️ Generando contenido...");
    const { title, content, seoTitle, excerpt } = await generateContent(news);

    console.log("🖼️ Generando imagen...");
    const imageUrl = await generateImage(title);

    console.log("☁️ Subiendo imagen a WordPress...");
    const imageId = await uploadImageToWordPress(imageUrl);

    console.log("📦 Enviando a WordPress...");
    await postToWordPress({
      title: seoTitle,
      content,
      imageId,
      excerpt,
    });

    console.log("✅ Publicación completa.");
  } catch (error) {
    console.error("❌ Error general:", error.message);
  }
}

runBot();