import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

export async function getNews() {
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
  const url = `https://gnews.io/api/v4/search?q=animals&lang=es&max=1&sortby=relevance&token=${GNEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      throw new Error("No news articles found.");
    }

    const article = data.articles[0];

    return {
      title: article.title,
      description: article.description,
      url: article.url,
      content: article.content || article.description,
    };
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    throw error;
  }
}