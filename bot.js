import { getNews } from "./gnews.js";
import { generateContent } from "./gpt.js";
import { generateImage } from "./generateImage.js";
import { downloadImage } from "./downloadImage.js";
import { uploadImage } from "./uploadImage.js";
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

    console.log("⬇️ Descargando imagen...");
    const imagePath = await downloadImage(imageUrl);

    console.log("⬆️ Subiendo imagen a WordPress...");
    const mediaId = await uploadImage(imagePath, title);

    console.log("🧠 Publicando entrada en WordPress...");
    const postResponse = await postToWordPress({
      title,
      content: contenido,
      featuredMedia: mediaId,
      categoryId: parseInt(process.env.CATEGORIA_ID),
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