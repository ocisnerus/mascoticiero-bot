import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function postToWordPress(title, content, image_url) {
  const WP_SITE = process.env.WP_SITE; // Asegúrate que termina en /
  const WP_USERNAME = process.env.WP_USERNAME;
  const WP_APP_PASS = process.env.WP_APP_PASS;
  const CATEGORIA_ID = process.env.CATEGORIA_ID;

  console.log("✅ WP_SITE:", WP_SITE);
  console.log("✅ WP_USERNAME:", WP_USERNAME);
  console.log("✅ WP_APP_PASS:", WP_APP_PASS);
  console.log("✅ CATEGORIA_ID:", CATEGORIA_ID);
  console.log("🖼️ Image URL:", image_url);

  try {
    // Paso 1: Descargar la imagen
    const imageResponse = await axios.get(image_url, {
      responseType: "arraybuffer",
    });

    const imageBuffer = imageResponse.data;

    // Paso 2: Subir la imagen a WordPress
    const filename = `mascoticiero-${Date.now()}.webp`;
    const uploadResponse = await axios.post(
      `${WP_SITE}wp-json/wp/v2/media`,
      imageBuffer,
      {
        headers: {
          "Content-Type": "image/webp",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
        auth: {
          username: WP_USERNAME,
          password: WP_APP_PASS,
        },
      }
    );

    const media_id = uploadResponse.data.id;
    console.log("📸 Imagen subida con media_id:", media_id);

    // Paso 3: Crear el post
    const postResponse = await axios.post(
      `${WP_SITE}wp-json/wp/v2/posts`,
      {
        title,
        content,
        status: "publish",
        categories: [parseInt(CATEGORIA_ID)],
        featured_media: media_id,
      },
      {
        auth: {
          username: WP_USERNAME,
          password: WP_APP_PASS,
        },
      }
    );

    console.log("✅ Post publicado en WordPress:", postResponse.data.link);
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}