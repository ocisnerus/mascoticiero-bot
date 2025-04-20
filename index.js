import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("Mascoticiero Bot activo 🐾");
});

app.listen(port, () => {
  console.log(`✅ Mascoticiero Bot corriendo en puerto ${port}`);
});
