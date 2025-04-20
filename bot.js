require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Variables de entorno
const {
  OPENAI_API,
  GNEWS_API,
  WORDPRESS_USER,
  WORDPRESS_PASS,
  CATEGORIA_ID
} = process.env;

// 1. Obtener noticia
async function obtenerNoticia() {
  const res = await axios.get(`https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=1&token=${GNEWS_API}`);
  return res.data.articles[0];
}

// 2. Generar contenido con GPT
async function generarContenido(noticia) {
  const prompt = `
Redacta una noticia viral en español de México basada en este resumen: "${noticia.title} - ${noticia.description}". 
Debe tener mínimo 500 palabras, aplicar SEO monstruoso, mencionar "Mascoticiero", "Oscar Cisneros", "Firulais" y "Gurrumino" de forma natural.
Incluye subtítulos con emojis, bloques separados, y estilo humano y natural.
  `;
  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048
  }, {
    headers: { Authorization: `Bearer ${OPENAI_API}` }
  });

  return res.data.choices[0].message.content;
}

// 3. Generar imagen con DALL·E
async function generarImagen(titulo) {
  const res = await axios.post('https://api.openai.com/v1/images/generations', {
    model: 'dall-e-3',
    prompt: `Imagen horizontal, realista, en alta calidad, que ilustre esta noticia: ${titulo}`,
    size: '1024x1024',
    response_format: 'url'
  }, {
    headers: { Authorization: `Bearer ${OPENAI_API}` }
  });

  const imageUrl = res.data.data[0].url;
  const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const imagePath = path.join(__dirname, 'imagen.webp');
  fs.writeFileSync(imagePath, imageResponse.data);
  return imagePath;
}

// 4. Subir imagen a WordPress
async function subirImagen(imagenPath, nombreArchivo) {
  const image = fs.readFileSync(imagenPath);
  const res = await axios.post('https://mascoticiero.com/wp-json/wp/v2/media', image, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASS}`).toString('base64'),
      'Content-Disposition': `attachment; filename=${nombreArchivo}`,
      'Content-Type': 'image/webp'
    }
  });
  return res.data.id;
}

// 5. Publicar post en WordPress
async function publicarPost(titulo, contenido, imagenId) {
  const res = await axios.post('https://mascoticiero.com/wp-json/wp/v2/posts', {
    title: titulo,
    content: contenido,
    status: 'publish',
    categories: [parseInt(CATEGORIA_ID)],
    featured_media: imagenId
  }, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASS}`).toString('base64'),
      'Content-Type': 'application/json'
    }
  });
  return res.data.link;
}

// EJECUCIÓN PRINCIPAL
(async () => {
  try {
    const noticia = await obtenerNoticia();
    const titulo = noticia.title;
    const contenido = await generarContenido(noticia);
    const imagenPath = await generarImagen(titulo);
    const imagenId = await subirImagen(imagenPath, 'imagen.webp');
    const link = await publicarPost(titulo, contenido, imagenId);
    console.log('✅ Publicado en:', link);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
