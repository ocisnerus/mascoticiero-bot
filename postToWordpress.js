import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function postToWordPress({ title, content, featuredMedia, categoryId }) {
  const postData = {
    title,
    content,
    status: "publish",
    categories: [categoryId],
    featured_media: featuredMedia,
  };

  const response = await axios.post(
    `${process.env.WP_SITE}/wp-json/wp/v2/posts`,
    postData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASS}`).toString("base64")}`,
      },
    }
  );

  return response.data;
}