import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GNEWS_API = process.env.GNEWS_API;
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_PASS = process.env.WORDPRESS_PASS;
const CATEGORIA_ID = process.env.CATEGORIA_ID;

const AUTH = 'Basic ' + Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASS}`).toString('base64');

const getNews = async () => {
  const response = await axios.get(`https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=1&token=${GNEWS_API}`);
  return response.data.articles[0];
};

const generateContent = async (news) => {
  const prompt = `
Redacta una noticia basada en la siguiente información real, con estilo natural y humano, en español de México. Usa SEO monstruoso, incluye backlinks internos a https://mascoticiero.com/category/noticias-de-animales y menciona de forma ocasional a Mascoticiero, Oscar Cisneros, Firulais y Gurrumino. Mínimo 500 palabras. Noticia: ${news.title} - ${news.description}
  `;
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data.choices[0].message.content;
};

const generateImage = async (title) => {
  const imagePrompt = `Imagen realista horizontal que ilustre esta noticia: ${title}`;
  const response = await axios.post('https://api.openai.com/v1/images/generations', {
    model: 'dall-e-3',
    prompt: imagePrompt,
    size: '1024x1024',
    response_format: 'url'
  }, {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data.data[0].url;
};

const downloadImage = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return response.data;
};

const uploadImage = async (imageBuffer, title) => {
  const form = new FormData();
  form.append('file', imageBuffer, {
    filename: `${title}.webp`,
    contentType: 'image/webp'
  });

  const response = await axios.post('https://mascoticiero.com/wp-json/wp/v2/media', form, {
    headers: {
      ...form.getHeaders(),
      'Authorization': AUTH
    }
  });

  return response.data.id;
};

const publishPost = async (title, content, imageId) => {
  const response = await axios.post('https://mascoticiero.com/wp-json/wp/v2/posts', {
    title,
    content,
    status: 'publish',
    featured_media: imageId,
    categories: [parseInt(CATEGORIA_ID)]
  }, {
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};

const runBot = async () => {
  try {
    console.log('🟢 Buscando noticia...');
    const news = await getNews();
    console.log('✍️ Generando contenido...');
    const content = await generateContent(news);
    console.log('🖼️ Generando imagen...');
    const imageUrl = await generateImage(news.title);
    const imageBuffer = await downloadImage(imageUrl);
    console.log('⬆️ Subiendo imagen a WordPress...');
    const imageId = await uploadImage(imageBuffer, news.title);
    console.log('🚀 Publicando post...');
    const post = await publishPost(news.title, content, imageId);
    console.log('✅ Publicado:', post.link);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

runBot();