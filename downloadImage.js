import axios from "axios";

export async function downloadImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("❌ Error al descargar la imagen:", error.message);
    throw error;
  }
}