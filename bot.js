import dotenv from 'dotenv';
import { fetchNews } from './gnews.js';
import { generateImage } from './generateImage.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function main() {
  try {
    const news = await fetchNews();
    const { title, description, content } = news;
    const fullPrompt = `Imagen realista, horizontal, de alta calidad que ilustre esta noticia sobre animales: ${title}`;
    const imageURL = await generateImage(fullPrompt);

    const imageBuffer = (await axios.get(imageURL, { responseType: 'arraybuffer' })).data;
    const imagePath = path.join('/tmp', 'imagen.webp');
    fs.writeFileSync(imagePath, imageBuffer);

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath), {
      filename: 'imagen.webp',
      contentType: 'image/webp'
    });

    const mediaRes = await axios.post('https://mascoticiero.com/wp-json/wp/v2/media', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: 'Basic ' + Buffer.from(`${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`).toString('base64'),
      }
    });

    const mediaID = mediaRes.data.id;

    const postBody = {
      title: title,
      content: content,
      featured_media: mediaID,
      categories: [parseInt(process.env.CATEGORIA_ID)],
      status: 'publish'
    };

    await axios.post('https://mascoticiero.com/wp-json/wp/v2/posts', postBody, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${process.env.WORDPRESS_USER}:${process.env.WORDPRESS_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Publicación exitosa en Mascoticiero');
  } catch (error) {
    console.error('❌ Error en el proceso:', error.message);
  }
}

main();
