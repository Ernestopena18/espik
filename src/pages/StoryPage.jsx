import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { LANGUAGES } from "../data/index.js";
import { sentenceImage } from "../data/storyImages.js";
import { useTvListNavigation } from "../lib/useTvListNavigation.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import NotFoundPage from "./NotFoundPage.jsx";
import "../tv.css";

// ÍNDICE DE CREACIÓN
// 01 12/10/2026 presentación del cuento con URL propia y elección del modo de lectura.
// ÍNDICE DE MODIFICACIONES

export default function StoryPage() {
  const { langCode, storyId } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langCode];
  const story = lang?.stories.find((item) => item.id === storyId);
  usePageTitle(story?.title);
  useTvListNavigation(() => navigate(`/cuentos/${langCode}`));
  if (!story) return <NotFoundPage />;
  const cover = sentenceImage(story.id, 0, 0);
  return <main className="tv-choice">
    <Link className="tv-back" to={`/cuentos/${langCode}`}><ArrowLeft size={20} /> Cuentos</Link>
    <div className="tv-choice-content">
      <p className="tv-eyebrow">{story.title_es}</p>
      <h1>{story.title}</h1>
      {cover && <img className="tv-story-cover" src={cover} alt={story.pages[0].illustration} />}
      <p>¿Cómo querés leer este cuento?</p>
      <div className="tv-choice-grid">
        <Link data-tv-pick autoFocus to={`/cuentos/${langCode}/${storyId}/leer/phrase`}><strong>Por frase</strong><span>Una imagen y una frase por vez.</span></Link>
        <Link data-tv-pick to={`/cuentos/${langCode}/${storyId}/leer/page`}><strong>Toda la página</strong><span>Todas las frases a la derecha; la imagen cambia con la frase seleccionada.</span></Link>
      </div>
      <small>En TV: izquierda/derecha cambia de página; arriba/abajo cambia de frase; botón central reproduce o detiene.</small>
    </div>
  </main>;
}
