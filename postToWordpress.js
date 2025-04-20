// postToWordpress.js
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function postToWordPress(title, content, imageUrl) {
  try {
    // 🔐 Autenticación con usuario y contraseña de aplicación
    const auth = Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASS}`).toString("base64");

    // 🧠 Subir imagen destacada
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(imageResponse.data, "binary");

    const uploadResponse = await axios.post(
      `${process.env.WP_SITE}/wp-json/wp/v2/media`,
      imageBuffer,
      {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Disposition": 'attachment; filename="imagen.webp"',
          "Content-Type": "image/webp",
        },
      }
    );

    const mediaId = uploadResponse.data.id;

    // 📝 Publicar el post con imagen destacada
    const response = await axios.post(
      `${process.env.WP_SITE}/wp-json/wp/v2/posts`,
      {
        title,
        content,
        status: "publish",
        categories: [parseInt(process.env.CATEGORIA_ID)], // Asegúrate que esto sea un número
        featured_media: mediaId,
      },
      {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Publicado en WordPress:", response.data.link);
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}