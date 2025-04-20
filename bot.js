const dotenv = require('dotenv');
const axios = require('axios');
const FormData = require('form-data');

dotenv.config();

const OPENAI_API = process.env.OPENAI_API;
const GNEWS_API = process.env.GNEWS_API;
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_PASS = process.env.WORDPRESS_PASS;
const CATEGORIA_ID = process.env.CATEGORIA_ID;

async function obtenerNoticia() {
  const url = `https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=1&token=${GNEWS_API}`;
  const res = await axios.get(url);
  return res.data.articles[0];
}

async function generarContenido(noticia) {
  const prompt = `Redacta una noticia en español de México basada en esto: "${noticia.title} - ${noticia.description}". Que tenga mínimo 500 palabras, estilo natural, mencione a "Oscar Cisneros", "Firulais", "Gurrumino" y diga que es de Mascoticiero. Aplica SEO monstruoso y backlinks internos.`;

  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Eres un redactor SEO para un blog de noticias de mascotas llamado Mascoticiero.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  }, {
    headers: {
      Authorization: `Bearer ${OPENAI_API}`
    }
  });

  return res.data.choices[0].message.content;
}

async function generarImagen(titulo) {
  const res = await axios.post('https://api.openai.com/v1/images/generations', {
    model: 'dall-e-3',
    prompt: `Imagen realista, horizontal, de alta calidad que ilustre esta noticia sobre animales: ${titulo}`,
    size: '1024x1024',
    response_format: 'url'
  }, {
    headers: {
      Authorization: `Bearer ${OPENAI_API}`
    }
  });

  return res.data.data[0].url;
}

async function subirImagen(urlImagen, titulo) {
  const imagen = await axios.get(urlImagen, { responseType: 'arraybuffer' });
  const form = new FormData();
  form.append('file', imagen.data, { filename: 'imagen.webp' });

  const res = await axios.post('https://mascoticiero.com/wp-json/wp/v2/media', form, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASS}`).toString('base64'),
      ...form.getHeaders()
    }
  });

  return res.data.id;
}

async function publicar(titulo, contenido, imagenId) {
  const res = await axios.post('https://mascoticiero.com/wp-json/wp/v2/posts', {
    title: titulo,
    content: contenido,
    status: 'publish',
    categories: [CATEGORIA_ID],
    featured_media: imagenId
  }, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASS}`).toString('base64'),
      'Content-Type': 'application/json'
    }
  });

  return res.data.link;
}

(async () => {
  try {
    const noticia = await obtenerNoticia();
    const contenido = await generarContenido(noticia);
    const imagenUrl = await generarImagen(noticia.title);
    const imagenId = await subirImagen(imagenUrl, noticia.title);
    const postUrl = await publicar(noticia.title, contenido, imagenId);
    console.log('✅ Publicado en:', postUrl);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
