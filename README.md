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

## Páginas y rutas

La app usa URLs directas que se pueden guardar y compartir:

| Ruta | Página |
| --- | --- |
| `/` | Inicio y elección de idioma |
| `/cuentos/en` o `/cuentos/fr` | Catálogo por idioma |
| `/cuentos/:idioma/:cuento` | Portada y elección de modo de lectura |
| `/cuentos/:idioma/:cuento/leer/phrase` | Lectura por frase |
| `/cuentos/:idioma/:cuento/leer/page` | Lectura de toda la página |

Las rutas y los identificadores desconocidos muestran una página para volver al inicio. Esta primera versión es pública y guarda el contenido en el repositorio; no necesita cuentas ni servicios de datos. `vercel.json` permite abrir o recargar enlaces internos directamente en producción.

## Subir a Vercel

Vercel detecta Vite. El archivo `vercel.json` reescribe las rutas de la app a `index.html` para que funcionen al recargar.

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
  App.jsx                    tabla de rutas
  pages/HomePage.jsx         inicio y elección de idioma
  pages/StoriesPage.jsx      catálogo por idioma
  pages/StoryPage.jsx        portada y elección del modo
  pages/ReaderPage.jsx       ruta de lectura y validación
  pages/NotFoundPage.jsx     página de enlace desconocido
  components/TvReader.jsx    lector para TV, frases, menú y ficha de palabra
  data/storyImages.js        imágenes por frase disponibles
  lib/useTvListNavigation.js flechas del control remoto en listas
  lib/useMusic.js            música instrumental generada en el navegador
  lib/tokenize.js      corta oraciones en palabras y les asigna lema
  lib/useSpeech.js     voces, lectura y subrayado palabra por palabra
```

## Lectura en TV

Abrí la app en el navegador del televisor y elegí el modo **Por frase** o
**Toda la página**. La imagen ocupa la izquierda y el texto la derecha; en
pantallas angostas, la imagen queda arriba. Cada cuento muestra en su portada
la misma ilustración de su primera frase. Las imágenes se comparten entre
las versiones en francés e inglés.

- **Izquierda/Derecha:** página anterior o siguiente.
- **Abajo/Arriba:** frase siguiente o anterior. Desde la primera frase de
  una página, Arriba vuelve a la última frase de la página anterior. En el modo
  Toda la página, la lista se desplaza para mantener visible la frase elegida.
- **Botón central o toque en el texto:** reproduce o detiene la frase seleccionada.
- **Flechas en pantalla:** las de los lados cambian de página; en modo Por frase,
  las de arriba y abajo del texto cambian de frase. No hay barra inferior.
- **Mantener el botón central 2 segundos:** abre el menú de palabra, voz,
  traducción, velocidad y música. Arriba vuelve a la frase anterior sin espera.
- **Velocidad:** el botón Probar ajustes reproduce la frase actual con la
  velocidad, la pausa y las repeticiones elegidas sin cerrar el menú. En las
  barras, Izquierda/Derecha cambia el valor y Arriba/Abajo pasa a otro control.
- **Elegir palabra:** Izquierda/Derecha recorre las palabras; el botón central
  abre la ficha con pronunciación y ejemplos.
- **Escape/Volver:** cierra la ficha o el menú, o vuelve a elegir modo.

La traducción disponible es español. Puede ocultarse o mostrarse antes del
texto extranjero. La música instrumental se sintetiza localmente: los cuatro
estilos ofrecen tres variaciones cada uno y no necesitan archivos ni
servicios externos.

## APK para Android TV / Google TV

La carpeta `android/` contiene la app nativa creada con Capacitor. La APK lleva el
contenido web y las ilustraciones incorporados. La voz usa el motor de texto a voz
de Android, porque el WebView de algunas TV no expone Web Speech. El botón Volver
del control cierra el menú o regresa una página; en el inicio sale de la app.

La APK permite leer los cuentos, ver sus imágenes, consultar el diccionario y
escuchar la música sin conexión. La narración también puede funcionar sin conexión
si el televisor tiene instaladas voces locales de español y del idioma elegido;
algunos motores de voz necesitan descargar esas voces primero o usar una voz de red.
Las tipografías web se cargan desde Google Fonts cuando hay conexión; sin ella se
usan las tipografías de respaldo del sistema. Las actualizaciones de cuentos e
imágenes requieren instalar una APK nueva. El sitio alojado en Vercel sí requiere
conexión para abrirse.

La app aparece en el inicio de Android TV gracias a su banner y a la categoría
`LEANBACK_LAUNCHER`. Requiere Android 7 o posterior y voces instaladas para los
idiomas que se quieran escuchar. El audio y la navegación deben probarse en el
modelo de TV concreto antes de distribuir la APK a otras personas.

Para actualizar el contenido incluido en la APK:

```bash
npm ci
npm run android:sync
cd android
./gradlew assembleDebug  # En Windows: .\gradlew.bat assembleDebug
```

El APK de prueba queda en `android/app/build/outputs/apk/debug/app-debug.apk`.
GitHub Actions también lo genera en cada cambio de `main` como artefacto
`espiktrainer-android-tv-debug`. Esta APK de prueba se puede instalar manualmente;
para distribuirla formalmente hará falta firmar una versión de publicación.

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
- **Ilustraciones incompletas.** Mimi tiene imágenes para sus primeras cinco
  frases; los otros cuentos tienen imagen en la primera frase. Las demás
  escenas conservan una descripción.
- **Audio del televisor.** La narración depende de las voces que exponga el
  navegador del dispositivo mediante Web Speech; algunos televisores no
  ofrecen voces para todos los acentos.
