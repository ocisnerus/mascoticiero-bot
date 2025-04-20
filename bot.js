import dotenv from 'dotenv';
import axios from 'axios';
import { config } from 'dotenv';
config();

const OPENAI_API_KEY = process.env.OPENAI_API;
const GNEWS_API = process.env.GNEWS_API;
const CATEGORIA_ID = process.env.CATEGORIA_ID;

const authHeader = 'Basic b3NjYXJhZG1pbjpQdFptIEQxZUogU3JrRiBsZDdWIFhNY3Ugd1RX'; // ← base64 correcto

const getNews = async () => {
  const response = await axios.get(`https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=1&token=${GNEWS_API}`);
  return response.data.articles[0];
};

const generateContent = async (title, description) => {
  const completion = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Redacta una noticia en español de México con mínimo 500 palabras, estilo natural, menciona a “Oscar Cisneros”, “Mascoticiero”, “Firulais” y “Gurrumino” de vez en cuando. Incluye SEO monstruoso, backlinks internos como /category/perros y texto dividido en bloques legibles.'
        },
        {
          role: 'user',
          content: `Título: ${title}\nDescripción: ${description}`
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    title,
    content: completion.data.choices[0].message.content
  };
};

const publishPost = async (title, content) => {
  const response = await axios.post(
    'https://mascoticiero.com/wp-json/wp/v2/posts',
    {
      title,
      content,
      status: 'publish',
      categories: [parseInt(CATEGORIA_ID)],
    },
    {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};

const run = async () => {
  try {
    const news = await getNews();
    const { title, content } = await generateContent(news.title, news.description);
    const published = await publishPost(title, content);
    console.log('✅ Publicado:', published.link);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

run();
