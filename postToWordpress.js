import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function postToWordPress(title, content, imageUrl) {
  const siteUrl = process.env.WP_SITE;
  const username = process.env.WP_USERNAME;
  const appPassword = process.env.WP_APP_PASS;
  const categoryId = parseInt(process.env.CATEGORIA_ID);

  const token = Buffer.from(`${username}:${appPassword}`).toString("base64");

  try {
    // Descargar imagen desde URL
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const fileName = `mascoticiero-${Date.now()}.webp`;

    const uploadResponse = await axios.post(
      `${siteUrl}/wp-json/wp/v2/media`,
      imageResponse.data,
      {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": "image/webp",
        },
      }
    );

    const imageId = uploadResponse.data.id;

    console.log("✅ Imagen subida correctamente, ID:", imageId);

    const postResponse = await axios.post(
      `${siteUrl}/wp-json/wp/v2/posts`,
      {
        title,
        content,
        status: "publish",
        categories: [categoryId],
        featured_media: imageId,
      },
      {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Post publicado en WordPress:", postResponse.data.link);
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}