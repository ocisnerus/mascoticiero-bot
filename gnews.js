import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function getNews() {
  try {
    const response = await axios.get(`https://gnews.io/api/v4/search?q=animales&lang=es&max=5&token=${process.env.GNEWS_API_KEY}`);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      throw new Error("No news articles found.");
    }

    const first = articles[0];
    return {
      title: first.title,
      description: first.description,
      url: first.url,
      content: first.content,
    };
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    throw error;
  }
}
