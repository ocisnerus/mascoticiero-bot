import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

// ✅ SUBIR IMAGEN A WORDPRESS
export async function uploadImageToWordpress(imageBuffer, filename = "imagen.webp") {
  try {
    const response = await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/media`,
      imageBuffer,
      {
        headers: {
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Type": "image/webp",
          Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`).toString("base64")}`,
        },
      }
    );
    console.log("🖼️ Imagen subida. ID:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("❌ Error al subir la imagen a WordPress:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ PUBLICAR POST EN WORDPRESS
export async function postToWordpress({ title, content, mediaId, categoryId }) {
  try {
    const response = await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`,
      {
        title,
        content,
        status: "publish",
        categories: [categoryId],
        featured_media: mediaId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`).toString("base64")}`,
        },
      }
    );
    console.log("✅ Post publicado en WordPress:", response.data.link);
    return response.data;
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}