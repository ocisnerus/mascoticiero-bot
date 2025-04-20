import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function obtenerNoticia() {
  try {
    const response = await axios.get(`https://gnews.io/api/v4/search?q=animals&lang=es&country=mx&max=1&token=${process.env.GNEWS_API}`);
    return response.data.articles[0];
  } catch (error) {
    throw new Error(`❌ Error al obtener noticia: ${error.message}`);
  }
}