// bot.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GNEWS_API = process.env.GNEWS_API;
const OPENAI_API = process.env.OPENAI_API;
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_PASS = process.env.WORDPRESS_PASS;
const CATEGORIA_ID = process.env.CATEGORIA_ID;

const AUTH_TOKEN = `Basic ${Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASS}`).toString('base64')}`;

const getNews = async () => {
  const url = `https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=1&token=${GNEWS_API}`;
  const res = await axios.get(url);
  return res.data.articles[0];
};

const generatePost = async (noticia) => {
  const prompt = `Redacta una noticia con estilo natural y humano sobre esta nota:
Título: ${noticia.title}
Descripción: ${noticia.description}
Contenido: ${noticia.content || noticia.description}

Que tenga mínimo 500 palabras reales. Incluye backlinks internos a https://mascoticiero.com en al menos 2 partes del texto. Menciona de forma natural "Oscar Cisneros", "Firulais" y "Gurrumino" de vez en cuando. Aplica SEO monstruoso y usa español de México.`;

  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2048
  }, {
    headers: {
      Authorization: `Bearer ${OPENAI_API}`,
      'Content-Type': 'application/json'
    }
  });

  return {
    title: noticia.title,
    content: res.data.choices[0].message.content
  };
};

const publishPost = async (post) => {
  const res = await axios.post('https://mascoticiero.com/wp-json/wp/v2/posts', {
    title: post.title,
    content: post.content,
    status: 'publish',
    categories: [parseInt(CATEGORIA_ID)]
  }, {
    headers: {
      Authorization: AUTH_TOKEN,
      'Content-Type': 'application/json'
    }
  });

  return res.data;
};

const run = async () => {
  try {
    console.log('🚀 Buscando noticia...');
    const noticia = await getNews();
    console.log('🧠 Generando contenido...');
    const post = await generatePost(noticia);
    console.log('📤 Publicando en WordPress...');
    const publicado = await publishPost(post);
    console.log('✅ Publicado:', publicado.link);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

run();
