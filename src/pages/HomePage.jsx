import { BookOpen, MousePointerClick, Mic, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { LANGUAGES } from "../data/index.js";
import { useTvListNavigation } from "../lib/useTvListNavigation.js";
import { usePageTitle } from "../lib/usePageTitle.js";

// ÍNDICE DE CREACIÓN
// -- fecha de creación no registrada.
// ÍNDICE DE MODIFICACIONES
// 01 12/10/2026 navegación por control remoto en selección de idioma.
// 02 12/10/2026 instrucciones de reproducción y consulta de palabras acordes al lector.
// 03 12/10/2026 presentación de las tres funciones principales en tarjetas horizontales.
// 04 12/10/2026 tarjetas de idioma con colores de bandera.
// 05 12/10/2026 inicio separado en una ruta propia con enlaces a catálogos por idioma.
// 06 12/10/2026 salida con el botón Volver del control remoto en Android TV.

function LanguageFlag({ code }) {
  if (code === "fr") return <svg viewBox="0 0 60 40" width="54" height="36" aria-hidden="true">
    <rect width="20" height="40" fill="#0055a4" /><rect x="20" width="20" height="40" fill="#fff" /><rect x="40" width="20" height="40" fill="#ef4135" />
  </svg>;
  return <svg viewBox="0 0 60 40" width="54" height="36" aria-hidden="true">
    <rect width="60" height="40" fill="#012169" />
    <path d="M0 0 60 40 M60 0 0 40" stroke="#fff" strokeWidth="10" />
    <path d="M0 0 60 40 M60 0 0 40" stroke="#c8102e" strokeWidth="4" />
    <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="14" />
    <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="7" />
  </svg>;
}

function Feature({ icon: Icon, title, children }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><Icon size={20} aria-hidden="true" /></div>
    <h2 className="font-serif text-lg font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
  </div>;
}

export default function HomePage() {
  usePageTitle("Cuentos para aprender idiomas");
  useTvListNavigation();
  return <main className="mx-auto max-w-5xl px-5 py-14">
    <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-rose-400">Cuentos para aprender idiomas</p>
    <h1 className="font-serif text-4xl leading-tight text-slate-900 sm:text-5xl">¿Qué querés aprender?</h1>
    <p className="mt-3 max-w-md text-slate-600">Vas a leer cuentos cortos en el idioma que elijas. Tocá el texto para escuchar una frase; desde Opciones podés elegir una palabra y conocerla mejor.</p>
    <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
      {Object.values(LANGUAGES).map((lang, index) => <Link
        key={lang.code} to={`/cuentos/${lang.code}`} data-tv-pick autoFocus={index === 0}
        className={`language-card language-card--${lang.code} group rounded-2xl border p-6 text-left transition hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
      >
        <div className="flex items-center justify-between"><div>
          <p className="font-serif text-2xl font-semibold text-[color:var(--flag-primary)]">{lang.native}</p>
          <p className="mt-0.5 text-sm font-semibold text-[color:var(--flag-accent)]">{lang.label}</p>
        </div><span className="overflow-hidden rounded-md shadow-sm ring-1 ring-slate-200"><LanguageFlag code={lang.code} /></span></div>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">{lang.pitch}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--flag-primary)]">Elegir idioma <ChevronRight size={17} className="transition group-hover:translate-x-0.5" /></span>
      </Link>)}
    </div>
    <div className="mt-12 grid gap-4 border-t border-slate-200 pt-8 md:grid-cols-3">
      <Feature icon={MousePointerClick} title="Elegí una palabra">Desde Opciones, consultá su significado, pronunciación y ejemplos de uso.</Feature>
      <Feature icon={BookOpen} title="Dos formas de leer">Por frase o toda la página, con la traducción en español arriba si la querés ver.</Feature>
      <Feature icon={Mic} title="Escuchá y repetí">Reproducí la frase elegida y ajustá la pausa, la velocidad y las repeticiones.</Feature>
    </div>
  </main>;
}
