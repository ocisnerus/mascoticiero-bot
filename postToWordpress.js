import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function postToWordpress({ title, content, imageUrl }) {
  try {
    // Upload the image
    const imageResponse = await axios({
      method: "post",
      url: `${process.env.WP_URL}/wp-json/wp/v2/media`,
      headers: {
        "Content-Disposition": `attachment; filename=mascoticiero-image.webp`,
        "Content-Type": "image/webp",
        Authorization: `Basic ${Buffer.from(
          `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
        ).toString("base64")}`,
      },
      data: await (await fetch(imageUrl)).arrayBuffer(),
    });

    const featuredMediaId = imageResponse.data.id;

    // Post the article
    const postResponse = await axios({
      method: "post",
      url: `${process.env.WP_URL}/wp-json/wp/v2/posts`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
        ).toString("base64")}`,
      },
      data: {
        title,
        content,
        status: "publish",
        categories: [parseInt(process.env.CATEGORY_ID)],
        featured_media: featuredMediaId,
      },
    });

    console.log("✅ Post published:", postResponse.data.link);
    return postResponse.data.link;
  } catch (error) {
    console.error("❌ Error publishing to WordPress:", error.response?.data || error.message);
    throw error;
  }
}