import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import StoriesPage from "./pages/StoriesPage.jsx";
import StoryPage from "./pages/StoryPage.jsx";
import ReaderPage from "./pages/ReaderPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Historial anterior a la separación de páginas, conservado para auditoría.
// ÍNDICE DE CREACIÓN
// -- fecha de creación no registrada.
// ÍNDICE DE MODIFICACIONES
// ¿Qué querés aprender?
// 01 12/10/2026 navegación por control remoto en selección de idioma.
// 02 12/10/2026 instrucciones de reproducción y consulta de palabras acordes al lector.
// 03 12/10/2026 presentación de las tres funciones principales en tarjetas horizontales.
// 04 12/10/2026 tarjetas de idioma con colores de bandera.
// Elegí un cuento
// 01 12/10/2026 navegación por control remoto y elección de lectura en selección de cuento.
// 02 12/10/2026 portadas con la primera ilustración de cada cuento.

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/cuentos/:langCode" element={<StoriesPage />} />
    <Route path="/cuentos/:langCode/:storyId" element={<StoryPage />} />
    <Route path="/cuentos/:langCode/:storyId/leer/:readingMode" element={<ReaderPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
