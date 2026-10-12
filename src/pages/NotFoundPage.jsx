import { Link } from "react-router";
import { usePageTitle } from "../lib/usePageTitle.js";

// ÍNDICE DE CREACIÓN
// 01 12/10/2026 página de error para rutas e identificadores de cuento desconocidos.
// ÍNDICE DE MODIFICACIONES
// 01 12/10/2026 botón Volver de Android TV conectado al historial de páginas.

export default function NotFoundPage() {
  usePageTitle("Página no encontrada");
  return <main className="mx-auto max-w-2xl px-5 py-20 text-center">
    <h1 className="font-serif text-4xl text-slate-900">No encontramos esta página</h1>
    <p className="mt-4 text-slate-600">Puede que el enlace al cuento haya cambiado.</p>
    <Link to="/" autoFocus className="mt-8 inline-block rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Volver al inicio</Link>
  </main>;
}
