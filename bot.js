import axios from "axios";
import * as dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Obtener noticia desde GNews
async function getNews() {
  const url = `https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=1&token=${process.env.GNEWS_API}`;
  const response = await axios.get(url);
  return response.data.articles[0].description;
}

// 2. Crear artículo con OpenAI
async function createArticle(newsSummary) {
  const prompt = `Redacta una noticia en español de México con un mínimo de 500 palabras, estilo humano natural. Incluye de forma natural las palabras: Mascoticiero, Oscar Cisneros, Firulais y Gurrumino. Aplica SEO monstruoso y agrega backlinks internos a categorías como /category/perros, /category/gatos, y /category/noticias-de-animales. Tema: ${newsSummary}`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API}`,
      },
    }
  );

  return response.data.choices[0].message.content;
}

// 3. Generar imagen con DALL·E
async function generateImage(summary) {
  const dallePrompt = `Imagen realista, horizontal, de alta calidad que ilustre esta noticia sobre animales: ${summary}`;
  const response = await axios.post(
    "https://api.openai.com/v1/images/generations",
    {
      model: "dall-e-3",
      prompt: dallePrompt,
      size: "1024x1024",
      response_format: "url",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API}`,
      },
    }
  );
  return response.data.data[0].url;
}

// 4. Descargar imagen
async function downloadImage(url, filename = "image.png") {
  const response = await axios.get(url, { responseType: "stream" });
  const pathFile = path.join(__dirname, filename);
  const writer = fs.createWriteStream(pathFile);
  response.data.pipe(writer);
  return new Promise((resolve) => {
    writer.on("finish", () => resolve(pathFile));
  });
}

// 5. Subir imagen a WordPress
async function uploadImageToWordPress(imagePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(imagePath), {
    filename: "imagen.webp",
    contentType: "image/webp",
  });

  const response = await axios.post(
    "https://mascoticiero.com/wp-json/wp/v2/media",
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`
          ).toString("base64"),
      },
    }
  );

  return response.data.id;
}

// 6. Publicar artículo en WordPress
async function publishPost(title, content, featuredMediaId) {
  const response = await axios.post(
    "https://mascoticiero.com/wp-json/wp/v2/posts",
    {
      title,
      content,
      status: "publish",
      categories: [process.env.CATEGORIA_ID],
      featured_media: featuredMediaId,
    },
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`
          ).toString("base64"),
      },
    }
  );

  return response.data.link;
}

// FLUJO PRINCIPAL
(async () => {
  try {
    const resumen = await getNews();
    const articulo = await createArticle(resumen);
    const imagenURL = await generateImage(resumen);
    const pathImagen = await downloadImage(imagenURL);
    const mediaId = await uploadImageToWordPress(pathImagen);
    const link = await publishPost("Noticia del día 🐾", articulo, mediaId);
    console.log("Publicado en:", link);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
