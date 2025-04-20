import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generarContenido(noticia) {
  const prompt = `
Redacta una noticia para el sitio web Mascoticiero.com en español de México 🇲🇽. Usa estilo humano y natural, tono amigable, lenguaje claro y fácil de leer. 

✅ Estructura:
- Título con emoji en H1
- Introducción con gancho emocional
- Subtítulos H2 con emojis
- Párrafos cortos y ordenados como bloques (tipo Gutenberg)
- Incluye una mención natural a Firulais, Gurrumino, Kiko o Perico
- Menciona "Oscar Cisneros" y "Mascoticiero"
- Añade enlaces internos como: 
  /category/noticias-de-animales, 
  /category/perros, 
  /category/gatos, 
  /category/mascotas-asombrosas
- Que tenga al menos 500 palabras reales
- Incluye una sección de "Comparte esta noticia" al final con CTA para redes sociales
- Agrega una línea final con "Tiempo estimado de lectura: X minutos"
- Usa emojis naturales 🐾 en títulos o donde encaje

📌 Tema base de la noticia:
"${noticia}"

🎯 Recuerda: SEO monstruoso, natural, nada de tono robótico.

Genera solo el HTML listo para publicar en WordPress, sin explicaciones.
`;

  try {
    const respuesta = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return respuesta.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error al generar contenido con GPT:", error.message);
    throw error;
  }
}