/* ============================================================
   TOKENIZADOR
   Corta una oración en piezas y le asigna a cada palabra su lema.

   Las reglas NO son universales: cada idioma trata el apóstrofo
   de una manera distinta.
     · francés  → elisión:  l'oiseau  = "l'" + "oiseau"
     · inglés   → contracción: it's, can't son palabras propias
                  posesivo:    cat's  → cat
   Por eso el tokenizador se construye con las reglas del idioma.
   ============================================================ */

const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g;

/**
 * @param {object} opts
 * @param {object} opts.words     diccionario, indexado por lema
 * @param {object} opts.lemmas    formas flexionadas → lema
 * @param {string[]} [opts.elisions]   prefijos que se separan (francés)
 * @param {boolean} [opts.possessive]  recortar el 's del posesivo (inglés)
 */
export function makeTokenizer({ words, lemmas, elisions = [], possessive = false }) {
  const elisionSet = new Set(elisions);

  function lemmaOf(raw) {
    const w = raw.toLowerCase().replace(/’/g, "'");
    if (lemmas[w]) return lemmas[w];
    if (words[w]) return w;
    if (possessive && w.endsWith("'s")) {
      const base = w.slice(0, -2);
      if (lemmas[base]) return lemmas[base];
      if (words[base]) return base;
    }
    return w;
  }

  function pushWord(tokens, raw) {
    if (elisionSet.size) {
      const m = raw.match(/^([A-Za-zÀ-ÖØ-öø-ÿ]{1,2})(['’])(.+)$/);
      if (m && elisionSet.has(m[1].toLowerCase())) {
        tokens.push({ s: m[1] + m[2], w: false });
        pushWord(tokens, m[3]);
        return;
      }
    }
    tokens.push({ s: raw, w: true, lemma: lemmaOf(raw) });
  }

  return function tokenize(text) {
    const tokens = [];
    let last = 0;
    for (const m of text.matchAll(WORD_RE)) {
      if (m.index > last) tokens.push({ s: text.slice(last, m.index), w: false });
      pushWord(tokens, m[0]);
      last = m.index + m[0].length;
    }
    if (last < text.length) tokens.push({ s: text.slice(last), w: false });
    return tokens;
  };
}

/* Posición inicial de cada token dentro del texto original.
   Es lo que permite mapear el charIndex del sintetizador a la
   palabra que hay que subrayar. */
export function offsetsOf(tokens) {
  const starts = [];
  let off = 0;
  for (const t of tokens) {
    starts.push(off);
    off += t.s.length;
  }
  return starts;
}

export function tokenAtChar(tokens, starts, charIndex) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].w && charIndex >= starts[i] && charIndex < starts[i] + tokens[i].s.length) return i;
  }
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].w && starts[i] >= charIndex) return i;
  }
  return null;
}
