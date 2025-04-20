import dotenv from 'dotenv'
import axios from 'axios'
import FormData from 'form-data'

dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API
const GNEWS_API_KEY = process.env.GNEWS_API
const WORDPRESS_USER = process.env.WORDPRESS_USER
const WORDPRESS_PASS = process.env.WORDPRESS_PASS
const CATEGORIA_ID = process.env.CATEGORIA_ID

const auth = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASS}`).toString('base64')

const getNoticias = async () => {
  const res = await axios.get(`https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=1&token=${GNEWS_API_KEY}`)
  return res.data.articles[0]
}

const generarContenido = async (noticia) => {
  const prompt = `Redacta una noticia en español de México con un mínimo de 500 palabras basada en esta nota real: "${noticia.title}". Incluye de manera natural menciones a "Mascoticiero", "Oscar Cisneros", "Firulais" y "Gurrumino". Usa estilo humano, amigable, con SEO monstruoso y enlaces internos como /category/noticias-de-animales o /category/perros cuando aplique.`
  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048
  }, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`
    }
  })
  return res.data.choices[0].message.content
}

const generarImagen = async (descripcion) => {
  const prompt = `Imagen realista, horizontal, de alta calidad que ilustre esta noticia sobre animales: ${descripcion}`
  const res = await axios.post('https://api.openai.com/v1/images/generations', {
    model: 'dall-e-3',
    prompt,
    size: '1024x1024',
    style: 'vivid',
    response_format: 'url'
  }, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`
    }
  })
  return res.data.data[0].url
}

const subirImagen = async (url, tituloSeo) => {
  const image = await axios.get(url, { responseType: 'arraybuffer' })
  const form = new FormData()
  form.append('file', image.data, {
    filename: `${tituloSeo}.webp`,
    contentType: 'image/webp'
  })

  const res = await axios.post('https://mascoticiero.com/wp-json/wp/v2/media', form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Basic ${auth}`
    }
  })
  return res.data.id
}

const publicarPost = async (titulo, contenido, imagenId) => {
  const post = await axios.post('https://mascoticiero.com/wp-json/wp/v2/posts', {
    title: titulo,
    content: contenido,
    status: 'publish',
    categories: [parseInt(CATEGORIA_ID)],
    featured_media: imagenId
  }, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  })

  console.log('✅ Publicado:', post.data.link)
}

const ejecutar = async () => {
  try {
    const noticia = await getNoticias()
    const contenido = await generarContenido(noticia)
    const imagenUrl = await generarImagen(noticia.title)
    const imagenId = await subirImagen(imagenUrl, noticia.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''))
    await publicarPost(noticia.title, contenido, imagenId)
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

ejecutar()