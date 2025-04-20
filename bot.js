import { getNews } from "./gnews.js";
import { generateContent } from "./gpt.js";
import { generateImage } from "./generateImage.js";
import { postToWordPress } from "./postToWordpress.js";
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

    console.log("🖼️ Generando imagen...");
    const imagePrompt = `noticia sobre: ${title}. estilo hiperrealista, horizontal, bien iluminada, imagen de alta calidad para blog de mascotas`;
    const imageUrl = await generateImage(imagePrompt);

    console.log("🧠 Subiendo imagen a WordPress...");
    const postResponse = await postToWordPress({
      title,
      content: contenido,
      imageUrl,
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