import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function postToWordpress({ titulo, contenido, imagenID, categoriaID }) {
  const auth = Buffer.from(`${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`).toString("base64");

  try {
    const response = await axios.post(
      "https://mascoticiero.com/wp-json/wp/v2/posts",
      {
        title: titulo,
        content: contenido,
        status: "publish",
        categories: [categoriaID],
        featured_media: imagenID
      },
      {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Publicado en WordPress:", response.data.link);
    return response.data;
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}