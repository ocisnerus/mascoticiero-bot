import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(news) {
  const prompt = `
Redacta una noticia real con estilo humano, natural, mexicano, divertida y legible, como si fuera escrita en bloques de Gutenberg. 

✅ Estructura:
- Comienza con un H1 llamativo que incluya emojis y palabras clave.
- Agrega un párrafo inicial con gancho emocional o curioso.
- Usa subtítulos H2 para dividir el contenido en secciones claras.
- Añade emojis de forma natural en el texto.
- Incluye menciones ocasionales a “Oscar Cisneros”, “Firulais”, “Gurrumino” y “Kiko”, como si fueran parte del equipo del sitio (sin exagerar).
- Al final, incluye la frase: “El Mascoticiero con Oscar Cisneros, el noticiero del reino animal”.
- Añade también un bloque con tiempo de lectura estimado como: “⏱️ Tiempo estimado de lectura: 3 minutos”.
- Termina con un CTA que diga:

“🐾 Síguenos en nuestras redes sociales para más noticias del reino animal”
Facebook: https://facebook.com/mascoticiero
Instagram: https://instagram.com/mascoticiero
YouTube: https://youtube.com/oscarcisneros
X (Twitter): https://x.com/mascoticiero

🔗 SEO monstruoso:
- Incluye al menos 2 backlinks internos del sitio (por ejemplo: /category/noticias-de-animales y /perro-salva-familia-incendio).
- Incluye 1 backlink externo real a una fuente confiable de noticias si aplica.
- Usa lenguaje SEO optimizado con palabras clave.
- Evita repeticiones forzadas o redacción de robot.
- Siempre debe tener mínimo 500 palabras reales.

Recuerda: debe parecer escrito por un humano, estilo blog moderno y legible para lectores curiosos.

📰 Noticia original:
${news}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error al generar el contenido:", error.message);
    throw error;
  }
}