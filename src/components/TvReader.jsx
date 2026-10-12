import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ChevronLeft, ChevronRight, FastForward, Languages,
  Music2, Pause, Play, Underline, UserRound, Volume2, X,
} from "lucide-react";
import { useSpeech } from "../lib/useSpeech.js";
import { useMusic, MUSIC_STYLES, MUSIC_TRACKS } from "../lib/useMusic.js";
import { sentenceImage } from "../data/storyImages.js";
import "../tv.css";

// ÍNDICE DE CREACIÓN
// 01 12/10/2026 creación del lector para TV con control remoto e imágenes por frase.
// ÍNDICE DE MODIFICACIONES

const MENU = [
  { id: "word", label: "Elegir palabra", icon: Underline },
  { id: "voice", label: "Voz y acento", icon: UserRound },
  { id: "translation", label: "Traducción", icon: Languages },
  { id: "speed", label: "Velocidad", icon: FastForward },
  { id: "music", label: "Música", icon: Music2 },
];

function WordText({ text, tokenize, upper, activeWord, onWord, readingIndex }) {
  let wordNumber = -1;
  return tokenize(text).map((token, i) => {
    if (!token.w) return <span key={i}>{upper ? token.s.toLocaleUpperCase() : token.s}</span>;
    wordNumber++;
    const current = wordNumber;
    return (
      <button
        key={i}
        type="button"
        className={`tv-word ${activeWord === current ? "tv-word-selected" : ""} ${readingIndex === i ? "tv-word-reading" : ""}`}
        onClick={(event) => { event.stopPropagation(); onWord(token); }}
        aria-label={`Consultar ${token.s}`}
      >
        {upper ? token.s.toLocaleUpperCase() : token.s}
      </button>
    );
  });
}

function Sentence({ item, tokenize, upper, showWritten, selectedWord, onWord, readingIndex }) {
  return (
    <>
      {showWritten && <p className="tv-translation">{upper ? item[1].toLocaleUpperCase() : item[1]}</p>}
      <p className="tv-target">
        <WordText text={item[0]} tokenize={tokenize} upper={upper} activeWord={selectedWord} onWord={onWord} readingIndex={readingIndex} />
      </p>
    </>
  );
}

function WordDialog({ entry, surface, lemma, lang, onClose, onSpeak }) {
  return (
    <div className="tv-overlay" onClick={onClose}>
      <section className="tv-dialog" data-word-dialog role="dialog" aria-modal="true" aria-label={`Palabra ${surface}`} onClick={(e) => e.stopPropagation()}>
        <button className="tv-close" onClick={onClose} aria-label="Cerrar ficha"><X /></button>
        <p className="tv-eyebrow">Palabra seleccionada</p>
        <h2>{surface}</h2>
        {surface.toLowerCase() !== lemma && <p className="tv-muted">Forma de «{lemma}»</p>}
        {entry ? (
          <>
            <div className="tv-dictionary-pronunciation">
              <button onClick={() => onSpeak(lemma)} aria-label="Escuchar palabra"><Volume2 /></button>
              <div><strong>{entry.ipa || "Pronunciación"}</strong><span>{entry.pos}</span></div>
            </div>
            <p className="tv-dictionary-meaning">{entry.t}</p>
            {entry.resp && <p className="tv-muted">Suena como: {entry.resp}</p>}
            <h3>Ejemplos de uso</h3>
            <ul className="tv-examples">
              {(entry.ex || []).map(([target, es], i) => <li key={i}>
                <button onClick={() => onSpeak(target)} aria-label={`Escuchar ejemplo ${i + 1}`}><Volume2 size={18} /></button>
                <div><p>{target}</p><em>{es}</em></div>
              </li>)}
            </ul>
          </>
        ) : <p className="tv-muted">Esta palabra todavía no está en el diccionario de {lang.label}.</p>}
      </section>
    </div>
  );
}

function Choice({ story, onChoose, onExit }) {
  const onKeyDown = (event) => {
    if (event.key === "Escape" || event.key === "Backspace") { event.preventDefault(); onExit(); }
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...document.querySelectorAll("[data-tv-choice]")];
    const index = buttons.indexOf(document.activeElement);
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    buttons[Math.max(0, Math.min(buttons.length - 1, index + direction))]?.focus();
  };
  return (
    <main className="tv-choice" onKeyDown={onKeyDown}>
      <button className="tv-back" onClick={onExit}><ArrowLeft size={20} /> Cuentos</button>
      <div className="tv-choice-content">
        <p className="tv-eyebrow">{story.title_es}</p>
        <h1>{story.title}</h1>
        <p>¿Cómo querés leer este cuento?</p>
        <div className="tv-choice-grid">
          <button autoFocus data-tv-choice onClick={() => onChoose("phrase")}>
            <strong>Por frase</strong><span>Una imagen y una frase por vez.</span>
          </button>
          <button data-tv-choice onClick={() => onChoose("page")}>
            <strong>Toda la página</strong><span>Todas las frases a la derecha; la imagen cambia con la frase seleccionada.</span>
          </button>
        </div>
        <small>En TV: izquierda/derecha cambia de página; arriba/abajo cambia de frase; botón central reproduce o detiene.</small>
      </div>
    </main>
  );
}

export default function TvReader({ lang, story, onExit }) {
  const [readingMode, setReadingMode] = useState(null);
  const [page, setPage] = useState(0);
  const [sentence, setSentence] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const [panel, setPanel] = useState(null);
  const [wordSelection, setWordSelection] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [word, setWord] = useState(null);
  const [upper, setUpper] = useState(false);
  const [translationLang, setTranslationLang] = useState("es");
  const [showWritten, setShowWritten] = useState(true);
  const [speed, setSpeed] = useState(0.85);
  const [gap, setGap] = useState(0.4);
  const [repeats, setRepeats] = useState(1);
  const [playing, setPlaying] = useState(false);
  const speech = useSpeech(lang, lang.tokenize);
  const music = useMusic();
  const speechRef = useRef(speech);
  const rootRef = useRef(null);
  const audioRun = useRef(0);
  const audioTimer = useRef(null);
  const upTimer = useRef(null);
  speechRef.current = speech;

  const pageData = story.pages[page];
  const item = pageData.sentences[sentence];
  const image = sentenceImage(story.id, page, sentence);
  const words = lang.tokenize(item[0]).filter((token) => token.w);
  const readingIndex = speech.playing?.id === "tv-target" ? speech.playing.index : null;

  const stopAudio = () => {
    audioRun.current++;
    if (audioTimer.current) clearTimeout(audioTimer.current);
    audioTimer.current = null;
    speechRef.current.stop();
    setPlaying(false);
  };

  useEffect(() => () => {
    audioRun.current++;
    if (audioTimer.current) clearTimeout(audioTimer.current);
    if (upTimer.current) clearTimeout(upTimer.current);
    speechRef.current.stop();
  }, []);

  const select = (nextPage, nextSentence) => {
    stopAudio();
    setPage(nextPage);
    setSentence(nextSentence);
    setWordIndex(0);
    setWordSelection(false);
    rootRef.current?.focus();
  };

  const movePage = (delta) => {
    const nextPage = Math.max(0, Math.min(story.pages.length - 1, page + delta));
    if (nextPage !== page) select(nextPage, 0);
  };

  const moveSentence = (delta) => {
    const next = sentence + delta;
    if (next >= 0 && next < pageData.sentences.length) select(page, next);
    else if (next < 0 && page > 0) select(page - 1, story.pages[page - 1].sentences.length - 1);
    else if (next >= pageData.sentences.length && page < story.pages.length - 1) select(page + 1, 0);
  };

  const playCurrent = () => {
    if (playing) { stopAudio(); return; }
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    stopAudio();
    const run = audioRun.current;
    const segments = [];
    if (translationLang === "es") segments.push({ text: item[1], langTag: "es-ES", id: "tv-es" });
    for (let i = 0; i < repeats; i++) segments.push({ text: item[0], langTag: speech.accent, id: "tv-target" });
    setPlaying(true);
    const speakSegment = (index) => {
      if (audioRun.current !== run) return;
      const segment = segments[index];
      speechRef.current.speak(segment.text, {
        id: segment.id,
        langTag: segment.langTag,
        rate: segment.langTag === "es-ES" ? Math.min(1.2, speed + 0.15) : speed,
        onEnd: () => {
          if (audioRun.current !== run) return;
          if (index + 1 < segments.length) audioTimer.current = setTimeout(() => speakSegment(index + 1), index === 0 && translationLang === "es" ? gap * 1000 : 450);
          else setPlaying(false);
        },
      });
    };
    speakSegment(0);
  };

  const showWord = (token) => {
    stopAudio();
    setWord({ lemma: token.lemma, surface: token.s });
  };

  const openMenuPanel = (id) => {
    setMenuOpen(true);
    setPanel(id);
    if (id === "word") {
      setMenuOpen(false);
      setPanel(null);
      setWordSelection(true);
      setWordIndex(0);
      rootRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (!readingMode) return;
      const key = event.key;
      if (word) {
        if (key === "Escape" || key === "Backspace") { event.preventDefault(); setWord(null); }
        return;
      }
      if (panel) {
        if (key === "Escape" || key === "Backspace") { event.preventDefault(); setPanel(null); }
        else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
          if (event.target instanceof HTMLInputElement && event.target.type === "range") return;
          event.preventDefault();
          const controls = [...document.querySelectorAll(".tv-settings-panel button, .tv-settings-panel input")].filter((control) => !control.disabled);
          const current = controls.indexOf(document.activeElement);
          const direction = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
          controls[(current + direction + controls.length) % controls.length]?.focus();
        }
        return;
      }
      if (menuOpen) {
        if (key === "Escape" || key === "Backspace") { event.preventDefault(); setMenuOpen(false); }
        else if (key === "ArrowLeft" || key === "ArrowRight") {
          event.preventDefault();
          setMenuIndex((index) => (index + (key === "ArrowRight" ? 1 : MENU.length - 1)) % MENU.length);
        } else if (key === "Enter" || key === " " || key === "Select") {
          event.preventDefault(); openMenuPanel(MENU[menuIndex].id);
        }
        return;
      }
      if (key === "ArrowUp") {
        event.preventDefault();
        if (event.repeat) return;
        if (upTimer.current) {
          clearTimeout(upTimer.current);
          upTimer.current = null;
          setMenuOpen(true);
        } else {
          upTimer.current = setTimeout(() => {
            upTimer.current = null;
            moveSentence(-1);
          }, 320);
        }
      } else if (key === "ArrowDown") {
        event.preventDefault();
        if (upTimer.current) { clearTimeout(upTimer.current); upTimer.current = null; }
        moveSentence(1);
      } else if (key === "ArrowLeft" || key === "ArrowRight") {
        event.preventDefault();
        if (wordSelection) { setWordIndex((index) => Math.max(0, Math.min(words.length - 1, index + (key === "ArrowRight" ? 1 : -1)))); rootRef.current?.focus(); }
        else movePage(key === "ArrowRight" ? 1 : -1);
      } else if (key === "Enter" || key === " " || key === "Select") {
        if (event.target instanceof HTMLElement && event.target.closest("button, input, select") && event.target !== document.body) return;
        event.preventDefault();
        if (wordSelection && words[wordIndex]) showWord(words[wordIndex]);
        else playCurrent();
      } else if (key === "Escape" || key === "Backspace") {
        event.preventDefault();
        if (wordSelection) setWordSelection(false);
        else { stopAudio(); music.stop(); setReadingMode(null); }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    if (word) document.querySelector("[data-word-dialog] button")?.focus();
  }, [word]);

  useEffect(() => { if (readingMode && !menuOpen && !word) rootRef.current?.focus(); }, [readingMode]);
  useEffect(() => { if (panel) document.querySelector(".tv-settings-panel button")?.focus(); }, [panel]);

  if (!readingMode) return <Choice story={story} onChoose={setReadingMode} onExit={onExit} />;

  return (
    <div className="tv-reader" ref={rootRef} tabIndex={-1}>
      <header className="tv-header">
        <button className="tv-back" onClick={() => { stopAudio(); music.stop(); setReadingMode(null); }}><ArrowLeft size={20} /> Cuentos</button>
        <div><strong>{story.title}</strong><span>Página {page + 1} de {story.pages.length} · {readingMode === "phrase" ? "Por frase" : "Toda la página"}</span></div>
        <button className="tv-menu-trigger" onClick={() => setMenuOpen(true)}>Opciones ↑ ↑</button>
      </header>

      <main className="tv-stage">
        <div className="tv-image-wrap">
          {image ? <><div className="tv-image-backdrop" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" /><img src={image} alt={`Ilustración de: ${item[1]}`} /></> : <div className="tv-image-pending"><span>Ilustración en preparación</span><p>{pageData.illustration}</p></div>}
          <span className="tv-scene-count">Frase {sentence + 1} de {pageData.sentences.length}</span>
        </div>
        <section className={`tv-text-panel ${readingMode === "page" ? "tv-page-mode" : ""}`} aria-label="Texto del cuento">
          {readingMode === "phrase" ? (
            <Sentence item={item} tokenize={lang.tokenize} upper={upper} showWritten={translationLang === "es" && showWritten} selectedWord={wordSelection ? wordIndex : null} onWord={showWord} readingIndex={readingIndex} />
          ) : pageData.sentences.map((line, i) => (
            <div key={i} className={`tv-page-line ${i === sentence ? "tv-page-line-active" : ""}`} onClick={() => select(page, i)}>
              <span className="tv-line-number">{i + 1}</span>
              <div><Sentence item={line} tokenize={lang.tokenize} upper={upper} showWritten={translationLang === "es" && showWritten} selectedWord={wordSelection && i === sentence ? wordIndex : null} onWord={showWord} readingIndex={i === sentence ? readingIndex : null} /></div>
            </div>
          ))}
          {wordSelection && <p className="tv-word-hint">Elegí una palabra con ← → y presioná el botón central. Esc para salir.</p>}
        </section>
      </main>

      <footer className="tv-footer">
        <button onClick={() => movePage(-1)} disabled={page === 0}><ChevronLeft /> Página anterior</button>
        <div className="tv-play-controls">
          <button onClick={() => moveSentence(-1)} aria-label="Frase anterior">↑</button>
          <button className="tv-play" onClick={playCurrent} aria-label={playing ? "Detener frase" : "Reproducir frase"}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
          <button onClick={() => moveSentence(1)} aria-label="Frase siguiente">↓</button>
        </div>
        <button onClick={() => movePage(1)} disabled={page === story.pages.length - 1}>Página siguiente <ChevronRight /></button>
      </footer>

      {menuOpen && <div className="tv-menu-backdrop" onClick={() => { setMenuOpen(false); setPanel(null); }}>
        <nav className="tv-menu" aria-label="Opciones de lectura" onClick={(e) => e.stopPropagation()}>
          {MENU.map(({ id, label, icon: Icon }, index) => <button key={id} className={menuIndex === index ? "tv-menu-selected" : ""} onClick={() => { setMenuIndex(index); openMenuPanel(id); }}><Icon size={25} /><span>{label}</span></button>)}
        </nav>
        {panel && <section className="tv-settings-panel" onClick={(e) => e.stopPropagation()}>
          <button className="tv-close" onClick={() => setPanel(null)} aria-label="Cerrar opciones"><X /></button>
          <h2>{MENU.find((entry) => entry.id === panel)?.label}</h2>
          {panel === "voice" && <>
            <h3>Voz</h3><div className="tv-option-row">
              {[["f", "Femenina"], ["m", "Masculina"]].map(([value, label]) => <button key={value} className={speech.gender === value ? "selected" : ""} onClick={() => { stopAudio(); speech.setGender(value); }}>{label}</button>)}
            </div>
            <h3>Acento</h3><div className="tv-option-row">
              {lang.accents.map(([value, label]) => <button key={value} className={speech.accent === value ? "selected" : ""} onClick={() => { stopAudio(); speech.setAccent(value); }}>{label}</button>)}
            </div>
            {speech.accentMissing && <p className="tv-muted">Este dispositivo no tiene ese acento instalado; se usará otra voz del idioma.</p>}
          </>}
          {panel === "translation" && <>
            <label className="tv-setting-line"><span>TODO MAYÚSCULA</span><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /></label>
            <h3>Idioma de traducción</h3><div className="tv-option-row">
              <button className={translationLang === "es" ? "selected" : ""} onClick={() => setTranslationLang("es")}>Español</button>
              <button className={translationLang === "none" ? "selected" : ""} onClick={() => setTranslationLang("none")}>Sin traducción</button>
            </div>
            <label className="tv-setting-line"><span>Mostrar traducción escrita primero</span><input type="checkbox" checked={showWritten} disabled={translationLang === "none"} onChange={(e) => setShowWritten(e.target.checked)} /></label>
          </>}
          {panel === "speed" && <>
            <label className="tv-setting-line"><span>Velocidad de lectura: {speed.toFixed(2)}×</span><input type="range" min="0.5" max="1.2" step="0.05" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
            <label className="tv-setting-line"><span>Pausa entre español y {lang.label.toLowerCase()}: {gap.toFixed(1)} s</span><input type="range" min="0" max="3" step="0.1" value={gap} onChange={(e) => setGap(Number(e.target.value))} /></label>
            <h3>Veces que se repite cada frase</h3><div className="tv-option-row">{[1, 2, 3].map((n) => <button key={n} className={repeats === n ? "selected" : ""} onClick={() => setRepeats(n)}>{n}×</button>)}</div>
          </>}
          {panel === "music" && <>
            <p className="tv-muted">Si querés poner música, elegí la que te guste para leer y aprender a tu gusto.</p>
            <h3>Estilos</h3><div className="tv-option-row">{MUSIC_STYLES.map((style) => <button key={style.id} className={music.styleId === style.id ? "selected" : ""} onClick={() => music.choose(style.id, 0)}>{style.name}</button>)}</div>
            <h3>Playlist</h3><div className="tv-option-row">{MUSIC_TRACKS.map((title, i) => <button key={title} className={music.track === i ? "selected" : ""} onClick={() => music.choose(music.styleId, i)}>{title}</button>)}</div>
            <div className="tv-music-controls"><button onClick={music.playing ? music.stop : music.start}>{music.playing ? "Detener música" : "Reproducir música"}</button><label>Volumen <input type="range" min="0" max="0.35" step="0.01" value={music.volume} onChange={(e) => music.setVolume(Number(e.target.value))} /></label></div>
            {!music.available && <p className="tv-muted">La música no está disponible en este navegador.</p>}
          </>}
        </section>}
      </div>}

      {word && <WordDialog lang={lang} lemma={word.lemma} surface={word.surface} entry={lang.words[word.lemma]} onClose={() => { speech.stop(); setWord(null); rootRef.current?.focus(); }} onSpeak={(text) => { speech.speak(text, { id: "dictionary", langTag: speech.accent, rate: 0.8 }); }} />}
    </div>
  );
}
