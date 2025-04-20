import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function postToWordpress(titulo, contenido, imagenID) {
  const postBody = {
    title: titulo,
    content: contenido,
    status: "publish",
    categories: [parseInt(process.env.CATEGORIA_ID)], // ← ahora es integer
    featured_media: imagenID,
  };

  try {
    const response = await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`,
      postBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.WORDPRESS_AUTH}`,
        },
      }
    );

    console.log("✅ Publicado en WordPress:", response.data.link);
    return response.data;
  } catch (error) {
    console.error("❌ Error al publicar en WordPress:", error.response?.data || error.message);
    throw error;
  }
}