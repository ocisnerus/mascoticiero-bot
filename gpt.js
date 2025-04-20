const prompt = `
Redacta una noticia en español mexicano, estilo humano, basada en este titular y resumen:
Título: "${title}"
Resumen: "${summary}"

✅ Incluye:
- Título en <h1> con emoji
- Subtítulos <h2> con emojis cada 2 párrafos
- Párrafos en <p>
- Un bloque que diga: "Es Mascoticiero con Oscar Cisneros"
- Un bloque que diga: "El Mascoticiero con Oscar Cisneros, el noticiero del reino animal"
- Tiempo estimado de lectura
- Backlinks internos reales como: /category/noticias-de-animales
- Emojis naturales (no exageres)
- Formato listo para blog en bloques tipo Gutenberg
- Mínimo 500 palabras reales
- Nada de ## ni Markdown

Escribe como humano, no como robot.
`;