import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function publicarEnWordpress(titulo, contenido, imagenId) {
  try {
    const response = await axios.post(
      'https://mascoticiero.com/wp-json/wp/v2/posts',
      {
        title: titulo,
        content: contenido,
        status: 'publish',
        featured_media: imagenId,
        categories: [parseInt(process.env.CATEGORIA_ID)]
      },
      {
        auth: {
          username: process.env.WORDPRESS_USER,
          password: process.env.WORDPRESS_PASS
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Publicación exitosa:', response.data.link);
    return response.data.link;
  } catch (error) {
    console.error('❌ Error al publicar en WordPress:', error.message);
    throw error;
  }
}