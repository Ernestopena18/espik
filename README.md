# Cuentos para aprender idiomas

App de lectura para hispanohablantes. Elegís un idioma (inglés o francés),
elegís un cuento y después decidís si leer por frase o ver toda la página.
Podés seleccionar cualquier palabra para ver su traducción, pronunciación y
ejemplos de uso. El botón de reproducción lee la frase seleccionada.

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
  App.jsx                    elegir idioma y cuento
  components/TvReader.jsx    lector para TV, frases, menú y ficha de palabra
  data/storyImages.js        imágenes por frase disponibles
  lib/useMusic.js            música instrumental generada en el navegador
  lib/tokenize.js      corta oraciones en palabras y les asigna lema
  lib/useSpeech.js     voces, lectura y subrayado palabra por palabra
```

## Lectura en TV

Abrí la app en el navegador del televisor y elegí el modo **Por frase** o
**Toda la página**. La imagen ocupa la izquierda y el texto la derecha; en
pantallas angostas, la imagen queda arriba. Las primeras cinco frases de
«El gatito gris» tienen ilustración; se comparte entre francés e inglés.

- **Izquierda/Derecha:** página anterior o siguiente.
- **Abajo/Arriba:** frase siguiente o anterior. Desde la primera frase de
  una página, Arriba vuelve a la última frase de la página anterior.
- **Botón central o toque en el texto:** reproduce o detiene la frase seleccionada.
- **Flechas en pantalla:** las de los lados cambian de página; en modo Por frase,
  las de arriba y abajo del texto cambian de frase. No hay barra inferior.
- **Doble Arriba:** abre el menú de palabra, voz, traducción, velocidad y música.
- **Velocidad:** el botón Probar ajustes reproduce la frase actual con la
  velocidad, la pausa y las repeticiones elegidas sin cerrar el menú.
- **Elegir palabra:** Izquierda/Derecha recorre las palabras; el botón central
  abre la ficha con pronunciación y ejemplos.
- **Escape/Volver:** cierra la ficha o el menú, o vuelve a elegir modo.

La traducción disponible es español. Puede ocultarse o mostrarse antes del
texto extranjero. La música instrumental se sintetiza localmente: los cuatro
estilos ofrecen tres variaciones cada uno y no necesitan archivos ni
servicios externos.

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
- **Ilustraciones incompletas.** Solo las primeras cinco frases del cuento
  de Mimi tienen imágenes; las demás escenas conservan una descripción.
- **Audio del televisor.** La narración depende de las voces que exponga el
  navegador del dispositivo mediante Web Speech; algunos televisores no
  ofrecen voces para todos los acentos.
