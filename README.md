# Cuentos para aprender idiomas

App de lectura para hispanohablantes. Elegís un idioma (inglés o francés),
elegís un cuento y lo leés tocando cualquier palabra para ver su
traducción, su pronunciación y ejemplos de uso. Un reproductor narra el
cuento de corrido y podés dejar un silencio después de cada frase para
repetirla en voz alta.

## Correr en local

```bash
npm install
npm run dev
```

## Subir a Vercel

Vercel detecta Vite solo. No hace falta configurar nada.

**Opción A — desde la web:** subí el proyecto a un repo de GitHub, entrá a
vercel.com, "Add New… → Project", elegí el repo y dale Deploy.

**Opción B — desde la terminal:**

```bash
npm i -g vercel
vercel          # primera vez, hace preguntas
vercel --prod   # publica
```

## Cómo agregar contenido

Todo el contenido vive en `src/data/`. El código no se toca.

```
src/data/
  index.js          registro de idiomas
  en/stories.js     los cuentos en inglés
  en/words.js       el diccionario inglés → español
  fr/stories.js     los cuentos en francés
  fr/words.js       el diccionario francés → español
```

### Un cuento nuevo

Agregá un objeto al array `STORIES` del idioma:

```js
{
  id: "mi-cuento",              // único dentro del idioma
  title: "My New Story",
  title_es: "Mi cuento nuevo",
  blurb: "Una línea que se muestra en el listado.",
  level: "Fácil",               // Fácil | Intermedio | Avanzado
  cefr: "A1",
  pages: [
    {
      illustration: "Qué se ve en el dibujo de esta página",
      sentences: [
        ["Sentence in the language.", "La oración en español."],
      ],
    },
  ],
}
```

Cada oración es un par ya alineado. **Nunca traduzcas la página entera y
la vuelvas a cortar**: si la cantidad de oraciones no coincide, la
traducción queda corrida y no te enterás hasta que alguien se queja.

### Palabras nuevas

Si una palabra no está en `words.js`, la app no se rompe: la ficha muestra
"todavía no está en el diccionario". Ese es el comportamiento previsto —
en producción ahí va la llamada al modelo, que devuelve la entrada y la
guarda para la próxima vez que alguien la toque.

Para cargarla a mano:

```js
palabra: {
  t: "traducción",
  ipa: "/aɪ.pi.eɪ/",
  resp: "cómo suena escrito a la española",  // opcional
  pos: "sustantivo",
  ex: [["Ejemplo.", "Traducción."], ["…", "…"], ["…", "…"]],
},
```

Y si es una forma conjugada o un plural, sumala a `LEMMAS` apuntando al
lema: `lives: "live"`.

### Un idioma nuevo

Creá `src/data/xx/` con sus dos archivos y sumá la entrada en
`src/data/index.js`. Ahí se define también cómo tokenizar: el francés
separa elisiones (`l'oiseau`), el inglés recorta el posesivo (`cat's`).
Cada idioma trata el apóstrofo a su manera, así que esa regla es parte de
los datos del idioma, no del componente.

## Estructura del código

```
src/
  App.jsx              elegir idioma → elegir cuento → leer
  components/Reader.jsx  el lector, el reproductor, los ajustes y la ficha
  lib/tokenize.js      corta oraciones en palabras y les asigna lema
  lib/useSpeech.js     voces, lectura y subrayado palabra por palabra
```

## Límites conocidos

- **El subrayado depende de `onboundary`.** Chrome y Edge de escritorio lo
  emiten bien; varios Android e iOS no lo emiten nunca. Para esos hay un
  plan B que reparte el tiempo estimado entre las palabras: se ve fluido
  pero es una aproximación.
- **El género de la voz se deduce del nombre** (David, Zira, Thomas,
  Amélie…). Si el dispositivo no tiene voz del género elegido, se imita
  bajando o subiendo el tono, y la app lo dice explícitamente.
- **Las voces del sistema no suenan a narrador.** El salto de calidad real
  es audio pregenerado con TTS neuronal, que además devuelve marcas de
  tiempo por palabra y resuelve el subrayado en todos los dispositivos.
- **Las ilustraciones no están hechas.** Cada página reserva su lugar y
  describe qué debería mostrar.
