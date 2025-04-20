import fs from "fs";
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function downloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const filePath = `${tmpdir()}/temp_image_${Date.now()}.png`;
    const file = fs.createWriteStream(filePath);
    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Error al descargar imagen. Código: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve(filePath));
      });
    }).on("error", reject);
  });
}