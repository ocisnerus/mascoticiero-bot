import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

async function postToWordPress({ title, content, imageId, excerpt }) {
  try {
    const response = await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`,
      {
        title,
        content,
        status: "publish",
        excerpt,
        featured_media: imageId,
        categories: [parseInt(process.env.CATEGORIA_ID)],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.WORDPRESS_AUTH}`,
        },
      }
    );

    console.log("✅ Publicado en WordPress:", response.data.link);
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}

export { postToWordPress };