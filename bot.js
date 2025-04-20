import { getNews } from "./gnews.js";
import { generateContent } from "./gpt.js";
import { generateImagePrompt } from "./generateImagePrompt.js";
import { generateImage } from "./generateImage.js";
import { optimizeImage } from "./optimizeImage.js";
import { uploadImage, postToWordPress } from "./postToWordpress.js";
import * as dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    console.log("🟢 Buscando noticia...");
    const noticia = await getNews();
    if (!noticia) throw new Error("No se encontró ninguna noticia relevante.");

    const { title, description } = noticia;

    console.log("✍️ Generando contenido...");
    const contenido = await generateContent(title, description);
    if (!contenido || contenido.length < 100) throw new Error("El contenido generado está incompleto.");

    console.log("🖼️ Generando prompt para imagen...");
    const imagePrompt = await generateImagePrompt(title, description);

    console.log("🎨 Generando imagen realista...");
    const imageUrl = await generateImage(imagePrompt);

    console.log("🔧 Optimizando imagen...");
    const optimizedBuffer = await optimizeImage(imageUrl);

    console.log("🧠 Subiendo imagen optimizada a WordPress...");
    const imageId = await uploadImage(optimizedBuffer, title);

    console.log("🚀 Publicando en WordPress...");
    const postResponse = await postToWordPress({
      title,
      content: contenido,
      imageId,
      categoryId: 4, // Noticias de Animales
    });

    if (postResponse) {
      console.log("✅ Publicado exitosamente en WordPress.");
    } else {
      console.log("❌ Error al publicar en WordPress.");
    }
  } catch (error) {
    console.error("❌ Error general:", error.message);
  }
})();