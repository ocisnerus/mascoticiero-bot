import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function postToWordpress({ titulo, contenido, imagenId, categoriaId }) {
  const url = "https://mascoticiero.com/wp-json/wp/v2/posts";
  const auth = Buffer.from(`${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`).toString("base64");

  try {
    const response = await axios.post(
      url,
      {
        title: titulo,
        content: contenido,
        status: "publish",
        featured_media: imagenId,
        categories: [categoriaId]
      },
      {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Post publicado con éxito:", response.data.link);
    return response.data;
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}