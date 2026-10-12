import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { LANGUAGES } from "../data/index.js";
import { sentenceImage } from "../data/storyImages.js";
import { useTvListNavigation } from "../lib/useTvListNavigation.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import NotFoundPage from "./NotFoundPage.jsx";

// ÍNDICE DE CREACIÓN
// -- fecha de creación no registrada.
// ÍNDICE DE MODIFICACIONES
// 01 12/10/2026 navegación por control remoto y elección de lectura en selección de cuento.
// 02 12/10/2026 portadas con la primera ilustración de cada cuento.
// 03 12/10/2026 catálogo por idioma separado en una ruta propia con enlaces a cada cuento.

const LEVEL_STYLE = {
  Fácil: "bg-emerald-50 text-emerald-700",
  Intermedio: "bg-amber-50 text-amber-700",
  Avanzado: "bg-rose-50 text-rose-700",
};

export default function StoriesPage() {
  const { langCode } = useParams();
  const navigate = useNavigate();
  useTvListNavigation(() => navigate("/"));
  const lang = LANGUAGES[langCode];
  usePageTitle(lang ? `Cuentos en ${lang.label}` : null);
  if (!lang) return <NotFoundPage />;
  return <main className="mx-auto max-w-2xl px-5 py-10">
    <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-900"><ArrowLeft size={15} /> Cambiar de idioma</Link>
    <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-rose-400">Español → {lang.native}</p>
    <h1 className="font-serif text-3xl leading-tight text-slate-900 sm:text-4xl">Elegí un cuento</h1>
    <p className="mt-2 text-slate-600">Están ordenados de más simple a más completo. El primero es el más corto.</p>
    <ul className="mt-8 space-y-3">
      {lang.stories.map((story, i) => {
        const cover = sentenceImage(story.id, 0, 0);
        return <li key={story.id}><Link
          to={`/cuentos/${lang.code}/${story.id}`} data-tv-pick autoFocus={i === 0}
          className="group flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-sky-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
            {cover && <img src={cover} alt={story.pages[0].illustration} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />}
            <span className="absolute bottom-1 left-1 rounded-full bg-slate-900/75 px-2 py-0.5 font-serif text-xs text-white">{i + 1}</span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2"><span className="font-serif text-xl text-slate-900">{story.title}</span><span className="text-sm italic text-sky-500">{story.title_es}</span></span>
            <span className="mt-1 block text-sm leading-relaxed text-slate-600">{story.blurb}</span>
            <span className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${LEVEL_STYLE[story.level] || LEVEL_STYLE.Fácil}`}>{story.level}</span>
              <span className="text-[0.7rem] uppercase tracking-widest text-slate-400">{story.cefr} · {story.pages.length} páginas</span>
            </span>
          </span>
          <ChevronRight size={18} className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
        </Link></li>;
      })}
    </ul>
  </main>;
}
