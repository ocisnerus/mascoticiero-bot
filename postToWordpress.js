import axios from "axios";
import FormData from "form-data";
import * as dotenv from "dotenv";
dotenv.config();

export async function postToWordPress(title, content, imageUrl) {
  try {
    // Debug: muestra las variables para confirmar que están bien cargadas
    console.log("✅ WP_SITE:", process.env.WP_SITE);
    console.log("✅ WP_USERNAME:", process.env.WP_USERNAME);
    console.log("✅ WP_APP_PASS:", process.env.WP_APP_PASS);

    const siteUrl = process.env.WP_SITE;
    const username = process.env.WP_USERNAME;
    const appPassword = process.env.WP_APP_PASS;

    const mediaName = `mascoticiero-${Date.now()}.webp`;
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const form = new FormData();
    form.append("file", imageResponse.data, {
      filename: mediaName,
      contentType: "image/webp",
    });

    const mediaUpload = await axios.post(`${siteUrl}/wp-json/wp/v2/media`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`,
      },
    });

    const featuredImageId = mediaUpload.data.id;
    console.log("🖼️ Imagen subida. ID:", featuredImageId);

    const postResponse = await axios.post(
      `${siteUrl}/wp-json/wp/v2/posts`,
      {
        title: title,
        content: content,
        status: "publish",
        featured_media: featuredImageId,
        categories: [parseInt(process.env.CATEGORIA_ID)],
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Post publicado:", postResponse.data.link);
    return postResponse.data.link;
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}