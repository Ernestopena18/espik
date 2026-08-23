import { makeTokenizer } from "../lib/tokenize.js";
import { WORDS as EN_WORDS, LEMMAS as EN_LEMMAS } from "./en/words.js";
import { STORIES as EN_STORIES } from "./en/stories.js";
import { WORDS as FR_WORDS, LEMMAS as FR_LEMMAS } from "./fr/words.js";
import { STORIES as FR_STORIES } from "./fr/stories.js";

/* Para agregar un idioma: creá su carpeta con words.js y stories.js
   y sumá una entrada acá. El resto de la app no cambia. */
export const LANGUAGES = {
  en: {
    code: "en",
    label: "Inglés",
    native: "English",
    pitch: "Saludos, direcciones, lugares y conversaciones del día a día.",
    theEnd: "The End",
    accents: [["en-US", "EE.UU."], ["en-GB", "Británico"]],
    words: EN_WORDS,
    stories: EN_STORIES,
    /* En inglés el apóstrofo es contracción (it's) o posesivo (cat's). */
    tokenize: makeTokenizer({ words: EN_WORDS, lemmas: EN_LEMMAS, possessive: true }),
  },
  fr: {
    code: "fr",
    label: "Francés",
    native: "Français",
    pitch: "Los mismos temas, con la pronunciación francesa desde el principio.",
    theEnd: "Fin",
    accents: [["fr-FR", "Francia"], ["fr-CA", "Canadá"]],
    words: FR_WORDS,
    stories: FR_STORIES,
    /* En francés el apóstrofo es elisión: l'oiseau = "l'" + "oiseau". */
    tokenize: makeTokenizer({
      words: FR_WORDS,
      lemmas: FR_LEMMAS,
      elisions: ["l", "d", "s", "n", "j", "c", "m", "t", "qu", "y"],
    }),
  },
};
