const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API });

const generateImage = async (prompt) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Imagen realista, horizontal, de alta calidad que ilustre esta noticia sobre animales: ${prompt}`,
    size: "1024x1024",
    response_format: "url"
  });
  return response.data[0].url;
};

module.exports = generateImage;
