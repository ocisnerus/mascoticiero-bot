import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generarContenido(titulo, descripcion) {
  const prompt = `
Redacta una noticia viral en español mexicano con estilo humano, natural y optimizado para SEO monstruoso. 
Debe estar basada en este título: "${titulo}" y esta descripción: "${descripcion}".

Requisitos:
- Mínimo 500 palabras reales.
- Usa un H1 llamativo con emojis.
- Incluye subtítulos H2 que dividan el contenido en bloques claros.
- Usa emojis de forma natural, nunca forzados.
- Inserta un bloque visible al principio que diga: 🕒 Tiempo estimado de lectura: X minutos (calcula con base en cantidad de palabras).
- Inserta menciones naturales a Oscar Cisneros, Mascoticiero, Firulais y Gurrumino, sin exagerar.
- Incluye enlaces internos reales como:
  - https://mascoticiero.com/category/noticias-de-animales
  - https://mascoticiero.com/category/perros
  - https://mascoticiero.com/category/gatos
- No uses frases robóticas. Hazlo estilo real, fluido, como si fuera redactado por un periodista humano.
- NO digas "en este artículo te contaremos…" ni nada genérico.
- No repitas ideas ni hagas relleno.
- Asegúrate de cerrar con una reflexión simple o dato curioso animal.

Devuelve solo el contenido HTML, sin explicaciones. Empieza directo con el bloque del tiempo estimado de lectura.
`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.data.choices[0].message.content.trim();
}