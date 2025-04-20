import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { generateImage } from "./generateImage.js";
import { getLatestAnimalNews } from "./gnews.js";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API,
});
const openai = new OpenAIApi(configuration);

async function crearPost() {
  try {
    console.log("🟢 Buscando noticia...");

    const noticia = await getLatestAnimalNews();
    if (!noticia || !noticia.title || !noticia.description) {
      throw new Error("No se encontró una noticia válida");
    }

    console.log("✍️ Generando contenido...");

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `
Eres un redactor profesional de Mascoticiero. Genera una noticia en español de México basada en este contenido real:

Título original: ${noticia.title}
Resumen: ${noticia.description}

Redáctala con mínimo 500 palabras reales, bloques legibles y optimizados para SEO.
Incluye al menos un backlink interno a /category/noticias-de-animales y menciona ocasionalmente a "Oscar Cisneros", "Firulais", "Gurrumino" o "Kiko" como parte del universo de la web.

Haz que se sienta humano, realista, informativo y amigable.

Incluye también un bloque visible que diga: "⏱ Tiempo estimado de lectura: X minutos" al inicio del texto, calculado según el largo.

No agregues encabezados tipo H1, ni HTML, ni markdown. Solo texto plano limpio.
          `,
        },
      ],
    });

    const contenido = completion.data.choices[0].message.content;

    console.log("🖼️ Generando imagen...");

    const promptImagen = `Fotografía realista horizontal que ilustre la noticia: ${noticia.title}`;
    const imageUrl = await generateImage(promptImagen);

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const fileName = "imagen.webp";
    fs.writeFileSync(fileName, imageResponse.data);

    const form = new FormData();
    form.append("file", fs.createReadStream(fileName), fileName);
    form.append("title", noticia.title);

    const mediaUpload = await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/media`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`
          ).toString("base64")}`,
        },
      }
    );

    const imageId = mediaUpload.data.id;

    console.log("📰 Publicando en WordPress...");

    await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`,
      {
        title: noticia.title,
        content: contenido,
        status: "publish",
        categories: [parseInt(process.env.CATEGORIA_ID)],
        featured_media: imageId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`
          ).toString("base64")}`,
        },
      }
    );

    console.log("✅ Noticia publicada correctamente.");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

crearPost();