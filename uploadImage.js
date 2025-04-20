import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import * as dotenv from "dotenv";
dotenv.config();

export async function uploadImage(imagePath, title) {
  const imageData = fs.readFileSync(imagePath);
  const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/gi, "-")}.webp`;

  const form = new FormData();
  form.append("file", imageData, {
    filename: fileName,
    contentType: "image/webp",
  });

  const response = await axios.post(
    `${process.env.WP_SITE}/wp-json/wp/v2/media`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASS}`).toString("base64")}`,
      },
    }
  );

  return response.data.id;
}