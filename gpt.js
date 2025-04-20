import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(title, summary) {
  const prompt = `
Eres un redactor profesional experto en SEO y marketing digital. Vas a redactar una noticia con formato de blog para el sitio web “El Mascoticiero con Oscar Cisneros, el noticiero del reino animal”. El contenido debe estar escrito en español de México, con estilo natural, humano, directo y amigable. Usa bloques de contenido como en Gutenberg.

✅ Estructura:
- Título principal en H1 con emoji.
- Subtítulos en H2 amigables para separar bloques.
- Que incluya backlinks internos como:
  - /category/noticias-de-animales
  - /category/mascotas
  - /category/perros
- Que tenga 1 enlace externo real con referencia confiable.
- Que el contenido tenga más de 500 palabras reales.
- Que incluya nombres como “Firulais”, “Gurrumino” y “Oscar Cisneros” de forma natural.
- Que mencione que “es Mascoticiero con Oscar Cisneros”.
- Que incluya tiempo estimado de lectura: Ej. “⏱️ Tiempo estimado de lectura: 3 minutos”
- Que se vea como bloques de texto bien separados (no texto plano).
- Que se usen emojis pero de forma natural.
- Cierra siempre con CTA que diga:
“Síguenos en nuestras redes sociales para más noticias del reino animal 🐾”
- Luego agrega:
Facebook: https://facebook.com/mascoticiero  
Instagram: https://instagram.com/mascoticiero  
YouTube: https://youtube.com/oscarcisneros  
Twitter (X): https://x.com/mascoticiero

El título de esta noticia es: "${title}"
El resumen de esta noticia es: "${summary}"

Redáctalo ahora sin inventar, con hechos reales, formato optimizado y sin dejar nada fuera.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un redactor SEO profesional para el sitio Mascoticiero." },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content || content.length < 100) {
      throw new Error("El contenido generado está incompleto.");
    }

    return content;
  } catch (error) {
    console.error("❌ Error al generar contenido:", error.message);
    throw error;
  }
}