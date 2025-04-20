import axios from "axios";
import FormData from "form-data";

export async function postToWordPress(title, content, imageUrl) {
  const siteUrl = process.env.WP_SITE; // SIN SLASH FINAL
  const username = process.env.WP_USERNAME;
  const appPassword = process.env.WP_APP_PASS;
  const categoryId = parseInt(process.env.CATEGORIA_ID); // DEBE SER INT

  try {
    console.log("🧠 Descargando imagen desde DALL·E...");
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const imageBuffer = imageResponse.data;
    const imageName = `mascoticiero-${Date.now()}.webp`;

    const form = new FormData();
    form.append("file", imageBuffer, {
      filename: imageName,
      contentType: "image/webp",
    });

    console.log("🔗 URL de media:", `${siteUrl}/wp-json/wp/v2/media`);

    const mediaUpload = await axios.post(
      `${siteUrl}/wp-json/wp/v2/media`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        auth: {
          username,
          password: appPassword,
        },
      }
    );

    const imageId = mediaUpload.data.id;
    console.log("✅ Imagen subida. ID:", imageId);

    console.log("