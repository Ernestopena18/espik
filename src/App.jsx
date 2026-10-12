import { useEffect, useState } from "react";
import { BookOpen, MousePointerClick, Mic, ChevronRight, ArrowLeft } from "lucide-react";
import { LANGUAGES } from "./data/index.js";
import TvReader from "./components/TvReader.jsx";

// ÍNDICE DE CREACIÓN
// -- fecha de creación no registrada.
// ÍNDICE DE MODIFICACIONES
// ¿Qué querés aprender?
// 01 12/10/2026 navegación por control remoto en selección de idioma.
// 02 12/10/2026 instrucciones de reproducción y consulta de palabras acordes al lector.
// 03 12/10/2026 presentación de las tres funciones principales en tarjetas horizontales.
// Elegí un cuento
// 01 12/10/2026 navegación por control remoto y elección de lectura en selección de cuento.

/* ---------- 1. ¿Qué querés aprender? ---------- */
function LanguagePick({ onPick }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-rose-400">
        Cuentos para aprender idiomas
      </p>
      <h1 className="font-serif text-4xl leading-tight text-slate-900 sm:text-5xl">
        ¿Qué querés aprender?
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        Vas a leer cuentos cortos en el idioma que elijas. Tocá el texto para
        escuchar una frase; desde Opciones podés elegir una palabra y conocerla mejor.
      </p>

      <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
        {Object.values(LANGUAGES).map((lang, index) => (
          <button
            key={lang.code}
            data-tv-pick
            autoFocus={index === 0}
            onClick={() => onPick(lang.code)}
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:border-sky-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-2xl text-slate-900">{lang.native}</p>
                <p className="mt-0.5 text-sm text-slate-500">{lang.label}</p>
              </div>
              <ChevronRight size={20} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">{lang.pitch}</p>
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-4 border-t border-slate-200 pt-8 md:grid-cols-3">
        <Feature icon={MousePointerClick} title="Elegí una palabra">
          Desde Opciones, consultá su significado, pronunciación y ejemplos de uso.
        </Feature>
        <Feature icon={BookOpen} title="Dos formas de leer">
          Por frase o toda la página, con la traducción en español arriba si la querés ver.
        </Feature>
        <Feature icon={Mic} title="Escuchá y repetí">
          Reproducí la frase elegida y ajustá la pausa, la velocidad y las repeticiones.
        </Feature>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h2 className="font-serif text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

/* ---------- 2. Listado de cuentos ---------- */
const LEVEL_STYLE = {
  Fácil: "bg-emerald-50 text-emerald-700",
  Intermedio: "bg-amber-50 text-amber-700",
  Avanzado: "bg-rose-50 text-rose-700",
};

function StoryList({ lang, onPick, onBack }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-900">
        <ArrowLeft size={15} /> Cambiar de idioma
      </button>

      <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-rose-400">
        Español → {lang.native}
      </p>
      <h1 className="font-serif text-3xl leading-tight text-slate-900 sm:text-4xl">
        Elegí un cuento
      </h1>
      <p className="mt-2 text-slate-600">
        Están ordenados de más simple a más completo. El primero es el más corto.
      </p>

      <ul className="mt-8 space-y-3">
        {lang.stories.map((story, i) => (
          <li key={story.id}>
            <button
              onClick={() => onPick(story.id)}
              data-tv-pick
              autoFocus={i === 0}
              className="group flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-sky-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 font-serif text-sm text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-serif text-xl text-slate-900">{story.title}</span>
                  <span className="text-sm italic text-sky-500">{story.title_es}</span>
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">{story.blurb}</span>
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${LEVEL_STYLE[story.level] || LEVEL_STYLE["Fácil"]}`}>
                    {story.level}
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-widest text-slate-400">
                    {story.cefr} · {story.pages.length} páginas
                  </span>
                </span>
              </span>
              <ChevronRight size={18} className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 3. Máquina de estados ---------- */
export default function App() {
  const [langCode, setLangCode] = useState(null);
  const [storyId, setStoryId] = useState(null);

  const lang = langCode ? LANGUAGES[langCode] : null;
  const story = lang && storyId ? lang.stories.find((s) => s.id === storyId) : null;

  useEffect(() => {
    if (story) return;
    const onKey = (event) => {
      if (event.key === "Escape" || event.key === "Backspace") {
        if (langCode) { event.preventDefault(); setLangCode(null); }
        return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const choices = [...document.querySelectorAll("[data-tv-pick]")];
      if (!choices.length) return;
      event.preventDefault();
      const index = choices.indexOf(document.activeElement);
      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      choices[Math.max(0, Math.min(choices.length - 1, index + direction))]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [langCode, story]);

  if (!lang) return <LanguagePick onPick={setLangCode} />;

  if (!story) {
    return <StoryList lang={lang} onPick={setStoryId} onBack={() => setLangCode(null)} />;
  }

  return <TvReader key={`${lang.code}-${story.id}`} lang={lang} story={story} onExit={() => setStoryId(null)} />;
}
