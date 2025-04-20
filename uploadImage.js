import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export async function uploadImageToWordPress(imageUrl) {
  try {
    const imageName = `imagen-${Date.now()}.webp`;

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const uploadResponse = await axios.post(
      `${process.env.WP_URL}/wp-json/wp/v2/media`,
      imageResponse.data,
      {
        headers: {
          "Content-Type": "image/webp",
          "Content-Disposition": `attachment; filename="${imageName}"`,
          Authorization: `Basic ${Buffer.from(
            `${process.env.WP_USER}:${process.env.WP_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );

    const imageId = uploadResponse.data.id;
    console.log("📸 Image uploaded. ID:", imageId);
    return imageId;
  } catch (error) {
    console.error("❌ Error uploading image:", error.message);
    throw error;
  }
}
