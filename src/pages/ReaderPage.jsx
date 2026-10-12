import { useNavigate, useParams } from "react-router";
import { LANGUAGES } from "../data/index.js";
import TvReader from "../components/TvReader.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { usePageTitle } from "../lib/usePageTitle.js";

// ÍNDICE DE CREACIÓN
// 01 12/10/2026 ruta directa de lectura por frase o por página con validación del cuento.
// ÍNDICE DE MODIFICACIONES

export default function ReaderPage() {
  const { langCode, storyId, readingMode } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langCode];
  const story = lang?.stories.find((item) => item.id === storyId);
  usePageTitle(story && ["phrase", "page"].includes(readingMode) ? `Leer ${story.title}` : null);
  if (!story || !["phrase", "page"].includes(readingMode)) return <NotFoundPage />;
  return <TvReader key={`${langCode}-${storyId}-${readingMode}`} lang={lang} story={story} readingMode={readingMode} onExit={() => navigate(`/cuentos/${langCode}/${storyId}`)} />;
}
