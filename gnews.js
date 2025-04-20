import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getNews() {
  const apiKey = process.env.GNEWS_API;
  const response = await axios.get(
    `https://gnews.io/api/v4/search?q=mascotas OR animales&lang=es&country=mx&max=1&token=${apiKey}`
  );
  return response.data.articles[0];
}
