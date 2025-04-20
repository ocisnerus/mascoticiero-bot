import sharp from "sharp";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function optimizeImage(buffer) {
  const filename = `${uuidv4()}.webp`;
  const outputPath = path.resolve(`/tmp/${filename}`);

  await sharp(buffer)
    .webp({ quality: 80 })
    .toFile(outputPath);

  return {
    path: outputPath,
    filename,
  };
}