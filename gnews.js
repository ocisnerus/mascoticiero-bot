const axios = require("axios");

const getNews = async () => {
  const apiKey = process.env.GNEWS_API;
  const url = `https://gnews.io/api/v4/search?q=perros+OR+gatos+OR+mascotas&lang=es&country=mx&max=5&token=${apiKey}`;
  const response = await axios.get(url);
  const articles = response.data.articles;
  return articles[0]; // Solo devuelve una noticia
};

module.exports = getNews;
