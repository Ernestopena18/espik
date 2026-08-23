import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Volume2, Play, Pause, SkipBack, SkipForward, SlidersHorizontal,
  ChevronLeft, ChevronRight, X, Sparkles, Mic,
} from "lucide-react";
import { useSpeech } from "../lib/useSpeech.js";

const GAP_TITLE = 850;
const GAP_PAGE = 900;

const DEFAULTS = {
  speed: 0.85,     // velocidad del idioma que se aprende
  gapStep: 0.4,    // segundos entre el español y el idioma
  gapRepeat: 0.6,  // segundos después de cada lectura
  autoGap: false,  // pausa = lo que duró la frase
  repeats: 1,      // veces que se lee cada línea
};

/* La página 1 empieza por el título; el resto, por su primera oración. */
function buildPlaylist(story, pageIndex) {
  const items = [];
  if (pageIndex === 0) items.push({ kind: "title", target: story.title, es: story.title_es });
  story.pages[pageIndex].sentences.forEach(([target, es], i) => {
    items.push({ kind: "line", sentence: i, target, es });
  });
  return items;
}

const paper = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 39px, rgba(2,132,199,0.20) 39px, rgba(2,132,199,0.20) 40px), repeating-linear-gradient(to bottom, transparent 0px, transparent 19px, rgba(2,132,199,0.09) 19px, rgba(2,132,199,0.09) 20px)",
  backgroundPosition: "0 6px, 0 6px",
};

function TokenizedText({ tokenize, text, tappable, onWord, selected, activeIndex, className }) {
  const tokens = tokenize(text);
  return (
    <p className={className}>
      {tokens.map((tk, i) => {
        if (!tk.w) return <span key={i}>{tk.s}</span>;
        const reading = activeIndex === i;
        /* El punteado suave va SIEMPRE, en los dos modos de lectura:
           es la señal de que la palabra se puede tocar. */
        const cls = [
          "rounded px-0.5 transition-colors",
          tappable ? "underline decoration-dotted decoration-1 underline-offset-[6px]" : "",
          reading
            ? "bg-sky-100 text-sky-900 decoration-sky-500 decoration-2"
            : selected === tk.lemma
            ? "bg-amber-200 decoration-amber-400"
            : tappable
            ? "decoration-sky-300 hover:bg-amber-100"
            : "",
        ].join(" ");

        return tappable ? (
          <button
            key={i}
            onClick={() => onWord(tk.lemma, tk.s)}
            className={`${cls} focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500`}
          >
            {tk.s}
          </button>
        ) : (
          <span key={i} className={cls}>{tk.s}</span>
        );
      })}
    </p>
  );
}

function RepeatCue({ pct }) {
  return (
    <div className="ml-9 mt-2 flex items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-widest text-white">
        <Mic size={11} /> Tu turno
      </span>
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-rose-100">
        <span className="block h-full bg-rose-400" style={{ width: `${Math.round(pct * 100)}%` }} />
      </span>
    </div>
  );
}

function Line({ tokenize, itemIndex, isTitle, number, target, es, showTranslation, onWord, selected, speech, player, rowRef }) {
  const isCurrent = player.cursor === itemIndex;
  const readingTarget = speech.playing?.id === `it${itemIndex}-t`;
  const readingEs = isCurrent && player.phase === "es";
  const waiting = isCurrent && player.waiting;

  return (
    <div
      ref={rowRef}
      className={`-ml-2 rounded-xl px-2 transition-colors ${isTitle ? "mb-7 pb-3 pt-1" : "mb-4 py-1"} ${isCurrent ? "bg-slate-50" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={() => player.playFrom(itemIndex)}
          aria-label={isTitle ? "Leer desde el título" : `Leer desde la línea ${number}`}
          className={`${isTitle ? "mt-2" : "mt-1"} flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            isCurrent ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-400 hover:border-sky-500 hover:text-sky-600"
          }`}
        >
          {isTitle ? <Play size={12} fill="currentColor" /> : number}
        </button>
        <TokenizedText
          tokenize={tokenize}
          text={target}
          tappable
          onWord={onWord}
          selected={selected}
          activeIndex={readingTarget ? speech.playing.index : null}
          className={isTitle ? "font-serif text-3xl leading-tight text-slate-900" : "font-serif text-[1.35rem] leading-10 text-slate-800"}
        />
      </div>

      {showTranslation && (
        <p className={`ml-9 mt-1 inline-block rounded-lg font-sans italic leading-6 transition-colors ${isTitle ? "text-base" : "text-[0.95rem]"} ${readingEs ? "bg-rose-50 px-2 py-0.5 not-italic text-rose-700" : "text-sky-500"}`}>
          {es}
        </p>
      )}

      {waiting && <RepeatCue pct={player.waitPct} />}
    </div>
  );
}

function PlayerBar({ player, mode, total, speed, langLabel, onOpenSettings }) {
  const playing = player.status === "playing";
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-3">
        <div className="w-20 text-left">
          <p className="text-[0.7rem] uppercase tracking-widest text-slate-400">
            {player.cursor === null ? "Listo" : `${player.cursor + 1} / ${total}`}
          </p>
          {player.waiting ? (
            <p className="text-xs font-medium text-rose-500">Repetí</p>
          ) : mode === "translate" && player.phase ? (
            <p className={`text-xs font-medium ${player.phase === "es" ? "text-rose-500" : "text-sky-600"}`}>
              {player.phase === "es" ? "Español" : langLabel}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={player.prev} aria-label="Línea anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-400 hover:text-slate-900">
            <SkipBack size={18} />
          </button>
          <button
            onClick={player.toggle}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={player.next} aria-label="Línea siguiente" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-400 hover:text-slate-900">
            <SkipForward size={18} />
          </button>
        </div>

        <button onClick={onOpenSettings} aria-label="Ritmo de lectura" className="flex w-20 flex-col items-end text-slate-500 transition hover:text-sky-600">
          <SlidersHorizontal size={18} />
          <span className="mt-0.5 text-[0.7rem] tracking-wide">{speed.toFixed(2).replace(".", ",")}×</span>
        </button>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, format, disabled }) {
  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="mb-1 flex items-baseline justify-between">
        <label className="text-sm text-slate-700">{label}</label>
        <span className="font-mono text-sm text-sky-600">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-sky-600"
      />
    </div>
  );
}

function Sheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 sm:items-center sm:p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-xl sm:rounded-3xl">
        {children}
      </div>
    </div>
  );
}

function SettingsSheet({ settings, set, onClose, mode, langLabel }) {
  return (
    <Sheet onClose={onClose}>
      <div className="mb-1 flex items-start justify-between">
        <h3 className="font-serif text-2xl text-slate-900">Ritmo de lectura</h3>
        <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <X size={20} />
        </button>
      </div>
      <p className="mb-6 text-sm text-slate-500">
        Dejá un silencio después de cada frase y repetila en voz alta mientras la
        tenés fresca. Es la forma más rápida de soltar la pronunciación.
      </p>

      <div className="space-y-6">
        <Slider
          label={`Velocidad del ${langLabel.toLowerCase()}`}
          value={settings.speed} min={0.5} max={1.2} step={0.05}
          onChange={(v) => set("speed", v)}
          format={(v) => `${v.toFixed(2).replace(".", ",")}×`}
        />

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-sm text-slate-700">Pausa para repetir</label>
            <button
              onClick={() => set("autoGap", !settings.autoGap)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${settings.autoGap ? "bg-sky-600 text-white" : "border border-slate-200 text-slate-500 hover:text-slate-900"}`}
            >
              Automática
            </button>
          </div>
          <Slider
            label="" value={settings.gapRepeat} min={0} max={6} step={0.25}
            disabled={settings.autoGap}
            onChange={(v) => set("gapRepeat", v)}
            format={(v) => `${v.toFixed(2).replace(".", ",")} s`}
          />
          <p className="mt-1 text-xs text-slate-400">
            {settings.autoGap
              ? "El silencio dura lo mismo que tardó la frase: siempre te alcanza justo para repetirla."
              : "Silencio fijo después de cada lectura."}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-700">Veces que se lee cada frase</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => set("repeats", n)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${settings.repeats === n ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 text-slate-600 hover:border-sky-400"}`}
              >
                {n}×
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-400">Con la pausa después de cada una.</p>
        </div>

        <Slider
          label={`Pausa entre español y ${langLabel.toLowerCase()}`}
          value={settings.gapStep} min={0} max={3} step={0.1}
          onChange={(v) => set("gapStep", v)}
          format={(v) => `${v.toFixed(1).replace(".", ",")} s`}
        />
        {mode !== "translate" && (
          <p className="-mt-4 text-xs text-slate-400">Se usa solo en el modo «Traducción debajo».</p>
        )}
      </div>

      <button onClick={onClose} className="mt-8 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
        Listo
      </button>
    </Sheet>
  );
}

function WordSheet({ lang, tokenize, lemma, surface, onClose, speech, speakOne }) {
  const [showEx, setShowEx] = useState(false);
  const entry = lang.words[lemma];
  useEffect(() => { setShowEx(false); }, [lemma]);
  const close = () => { speech.stop(); onClose(); };

  return (
    <Sheet onClose={close}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-400">
            {surface.toLowerCase() !== lemma ? `${surface} → forma de` : "palabra"}
          </p>
          <h3 className="font-serif text-3xl text-slate-900">{lemma}</h3>
        </div>
        <button onClick={close} aria-label="Cerrar" className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <X size={20} />
        </button>
      </div>

      {entry ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => speakOne(lemma, "word", 0.7)} aria-label="Escuchar la palabra" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-600 transition hover:bg-sky-600 hover:text-white">
              <Volume2 size={20} />
            </button>
            <div>
              <p className="font-mono text-sm text-sky-600">{entry.ipa}</p>
              <p className="text-[0.7rem] uppercase tracking-widest text-slate-400">{entry.pos}</p>
            </div>
          </div>

          {entry.resp && (
            <p className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">
              <span className="uppercase tracking-widest text-rose-400">Suena como </span>{entry.resp}
            </p>
          )}

          <p className="mb-5 border-l-2 border-sky-300 pl-3 text-lg text-slate-800">{entry.t}</p>

          {!showEx ? (
            <button onClick={() => setShowEx(true)} className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700">
              Ver {entry.ex.length} ejemplos de uso
            </button>
          ) : (
            <ul className="space-y-3">
              {entry.ex.map(([t, es], i) => {
                const id = `ex-${i}`;
                const active = speech.playing?.id === id;
                return (
                  <li key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3">
                    <button onClick={() => speakOne(t, id)} aria-label="Escuchar el ejemplo" className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-600 transition hover:bg-sky-600 hover:text-white">
                      <Volume2 size={14} />
                    </button>
                    <div>
                      <TokenizedText tokenize={tokenize} text={t} tappable={false} activeIndex={active ? speech.playing.index : null} className="font-serif text-base leading-7 text-slate-800" />
                      <p className="mt-0.5 text-sm italic text-sky-500">{es}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Esta palabra todavía no está en el diccionario. Acá es donde la app
          se la pide al modelo y guarda la entrada para la próxima vez que
          alguien la toque.
        </p>
      )}
    </Sheet>
  );
}

function Pills({ label, value, options, onChange, activeClass }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[0.65rem] uppercase tracking-widest text-slate-400">{label}</span>
      <div className="flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-medium">
        {options.map(([v, l]) => (
          <button key={v} onClick={() => onChange(v)} className={`rounded-full px-2.5 py-1.5 transition ${value === v ? activeClass : "text-slate-500 hover:text-slate-900"}`}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Reader({ lang, story, onExit }) {
  const tokenize = lang.tokenize;
  const speech = useSpeech(lang, tokenize);

  const [mode, setMode] = useState("tap");
  const [page, setPage] = useState(0);
  const [word, setWord] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(DEFAULTS);
  const [done, setDone] = useState(false);

  const [cursor, setCursor] = useState(null);
  const [status, setStatus] = useState("idle");
  const [phase, setPhase] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [waitPct, setWaitPct] = useState(0);

  const cursorRef = useRef(0);
  const stepRef = useRef(0);
  const runRef = useRef(0);
  const gapTimer = useRef(null);
  const waitTimer = useRef(null);
  const modeRef = useRef(mode);
  const pageRef = useRef(page);
  const setRef = useRef(settings);
  const autoContinue = useRef(false);
  const rowRefs = useRef([]);
  modeRef.current = mode;
  pageRef.current = page;
  setRef.current = settings;

  const items = useMemo(() => buildPlaylist(story, page), [story, page]);
  const total = items.length;
  const isLastPage = page === story.pages.length - 1;
  const totalSentences = story.pages.reduce((n, p) => n + p.sentences.length, 0);

  const stopWait = useCallback(() => {
    if (waitTimer.current) clearInterval(waitTimer.current);
    waitTimer.current = null;
    setWaiting(false);
    setWaitPct(0);
  }, []);

  const startWait = useCallback((ms) => {
    stopWait();
    if (ms < 600) return; // silencios cortos no muestran cartel
    setWaiting(true);
    setWaitPct(0);
    const t0 = performance.now();
    waitTimer.current = setInterval(() => {
      const r = Math.min(1, (performance.now() - t0) / ms);
      setWaitPct(r);
      if (r >= 1 && waitTimer.current) { clearInterval(waitTimer.current); waitTimer.current = null; }
    }, 60);
  }, [stopWait]);

  const clearGap = useCallback(() => {
    if (gapTimer.current) clearTimeout(gapTimer.current);
    gapTimer.current = null;
  }, []);

  /* Silencio entre tramos. Si algo cortó la lectura, el callback no corre. */
  const schedule = useCallback((ms, fn) => {
    clearGap();
    const my = runRef.current;
    gapTimer.current = setTimeout(() => { if (my === runRef.current) fn(); }, Math.max(0, ms));
  }, [clearGap]);

  const haltAudio = useCallback(() => {
    runRef.current++;
    clearGap();
    stopWait();
    speech.stop();
  }, [speech, clearGap, stopWait]);

  const stopPlayer = useCallback(() => { haltAudio(); setStatus("idle"); setPhase(null); }, [haltAudio]);

  useEffect(() => () => { if (waitTimer.current) clearInterval(waitTimer.current); }, []);

  const goto = useCallback((n, keepPlaying = false) => {
    if (keepPlaying) { clearGap(); stopWait(); speech.stop(); }
    else { haltAudio(); setStatus("idle"); setCursor(null); setPhase(null); }
    setPage(n);
    setWord(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [haltAudio, speech, clearGap, stopWait]);

  const playFrom = useCallback((idx, step = 0) => {
    const list = buildPlaylist(story, pageRef.current);

    if (idx >= list.length) {
      if (pageRef.current < story.pages.length - 1) {
        autoContinue.current = true;
        goto(pageRef.current + 1, true);
      } else {
        stopPlayer();
        setCursor(null);
      }
      return;
    }
    if (idx < 0) idx = 0;

    const cfg = setRef.current;
    const item = list[idx];

    /* Tramos de la línea: [español] + [idioma × repeticiones] */
    const steps = [];
    if (modeRef.current === "translate") steps.push({ lang: "es", text: item.es, gap: "step" });
    const times = item.kind === "title" ? 1 : cfg.repeats;
    for (let k = 0; k < times; k++) steps.push({ lang: "t", text: item.target, gap: "repeat" });

    const realStep = Math.min(step, steps.length - 1);
    const st = steps[realStep];

    cursorRef.current = idx;
    stepRef.current = realStep;
    setCursor(idx);
    setPhase(st.lang === "es" ? "es" : "target");
    setStatus("playing");
    stopWait();

    speech.speak(st.text, {
      id: `it${idx}-${st.lang}`,
      langTag: st.lang === "es" ? "es-ES" : speech.accent,
      rate: st.lang === "es" ? Math.min(1.2, cfg.speed + 0.15) : cfg.speed,
      onEnd: (elapsed) => {
        const c = setRef.current;
        let ms;
        if (st.gap === "step") ms = c.gapStep * 1000;
        else if (item.kind === "title") ms = GAP_TITLE;
        else ms = c.autoGap ? Math.min(9000, Math.max(500, elapsed)) : c.gapRepeat * 1000;

        if (st.lang === "t" && item.kind !== "title") startWait(ms);

        if (realStep + 1 < steps.length) schedule(ms, () => playFrom(idx, realStep + 1));
        else schedule(ms, () => playFrom(idx + 1, 0));
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech, goto, stopPlayer, schedule, startWait, stopWait, story]);

  useEffect(() => {
    if (!autoContinue.current) return;
    autoContinue.current = false;
    schedule(GAP_PAGE, () => playFrom(0, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (cursor === null) return;
    rowRefs.current[cursor]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [cursor, page]);

  /* Cambiar de modo o de voz corta la narración: los tramos ya no son los mismos. */
  useEffect(() => { stopPlayer(); /* eslint-disable-next-line */ }, [mode, speech.gender, speech.accent]);

  const player = {
    cursor, status, phase: phase === "target" ? "target" : phase, waiting, waitPct,
    playFrom: (i) => playFrom(i, 0),
    toggle: () => {
      if (status === "playing") { haltAudio(); setStatus("paused"); }
      else playFrom(cursor === null ? 0 : cursorRef.current, status === "paused" ? stepRef.current : 0);
    },
    prev: () => playFrom(Math.max(0, (cursor === null ? 0 : cursorRef.current) - 1), 0),
    next: () => playFrom((cursor === null ? -1 : cursorRef.current) + 1, 0),
  };

  const setSetting = (key, value) => {
    const next = { ...setRef.current, [key]: value };
    setRef.current = next;
    setSettings(next);
    if ((key === "speed" || key === "repeats") && status === "playing") {
      playFrom(cursorRef.current, key === "repeats" ? 0 : stepRef.current);
    }
  };

  const speakOne = (text, id, rate) => {
    stopPlayer();
    speech.speak(text, { id, langTag: speech.accent, rate: rate ?? settings.speed });
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <Sparkles className="mx-auto mb-4 text-rose-400" size={28} />
          <p className="font-serif text-4xl text-slate-900">{lang.theEnd}</p>
          <p className="mt-3 text-slate-600">
            Leíste {story.pages.length} páginas y {totalSentences} oraciones en {lang.label.toLowerCase()}.
          </p>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button onClick={() => { setDone(false); setPage(0); setCursor(null); }} className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Leerlo de nuevo
            </button>
            <button onClick={onExit} className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
              Elegir otro cuento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 pt-3">
          <button onClick={() => { stopPlayer(); onExit(); }} className="text-sm text-slate-500 transition hover:text-slate-900">
            ← Cuentos
          </button>
          <div className="flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-medium">
            <button onClick={() => setMode("tap")} className={`rounded-full px-3 py-1.5 transition ${mode === "tap" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}>
              Tocar palabras
            </button>
            <button onClick={() => setMode("translate")} className={`rounded-full px-3 py-1.5 transition ${mode === "translate" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}>
              Traducción debajo
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 py-2.5">
          <Pills label="Voz" value={speech.gender} onChange={(v) => { stopPlayer(); speech.setGender(v); }} options={[["f", "Femenina"], ["m", "Masculina"]]} activeClass="bg-rose-500 text-white" />
          <Pills label="Acento" value={speech.accent} onChange={(v) => { stopPlayer(); speech.setAccent(v); }} options={lang.accents} activeClass="bg-sky-600 text-white" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pb-36 pt-6">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h1 className="truncate font-serif text-lg text-slate-500">{story.title}</h1>
          <span className="shrink-0 text-[0.7rem] uppercase tracking-widest text-slate-400">
            Página {page + 1} de {story.pages.length}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-y-0 left-10 w-px bg-rose-200" aria-hidden="true" />
          <div className="py-8 pl-14 pr-6" style={paper}>
            {items.map((item, idx) => (
              <Line
                key={`${page}-${idx}`}
                tokenize={tokenize}
                itemIndex={idx}
                isTitle={item.kind === "title"}
                number={item.kind === "line" ? item.sentence + 1 : null}
                target={item.target}
                es={item.es}
                showTranslation={mode === "translate"}
                onWord={(lemma, surface) => { stopPlayer(); setWord({ lemma, surface }); }}
                selected={word?.lemma}
                speech={speech}
                player={player}
                rowRef={(el) => { rowRefs.current[idx] = el; }}
              />
            ))}

            <div className="mt-6 rounded-xl border border-dashed border-sky-200 bg-sky-50 px-4 py-5 text-center">
              <p className="text-[0.7rem] uppercase tracking-widest text-sky-400">Ilustración de la página</p>
              <p className="mt-1 text-sm text-sky-500">{story.pages[page].illustration}</p>
            </div>
          </div>
        </div>

        {speech.accentMissing && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Tu dispositivo no tiene voces de ese acento instaladas, así que se usa la
            voz que sí tiene para este idioma.
          </p>
        )}
        {mode === "translate" && !speech.esVoice && speech.hasVoices && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No hay ninguna voz en español instalada, así que las líneas traducidas
            van a sonar raras.
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => goto(page - 1)} disabled={page === 0} className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft size={16} /> Anterior
          </button>

          <div className="flex gap-1.5">
            {story.pages.map((_, i) => (
              <button key={i} onClick={() => goto(i)} aria-label={`Ir a la página ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === page ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300 hover:bg-slate-400"}`} />
            ))}
          </div>

          <button onClick={() => (isLastPage ? (stopPlayer(), setDone(true)) : goto(page + 1))} className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700">
            {isLastPage ? "Terminar" : "Siguiente"} <ChevronRight size={16} />
          </button>
        </div>
      </main>

      <PlayerBar player={player} mode={mode} total={total} speed={settings.speed} langLabel={lang.native} onOpenSettings={() => setShowSettings(true)} />

      {showSettings && (
        <SettingsSheet settings={settings} set={setSetting} mode={mode} langLabel={lang.label} onClose={() => setShowSettings(false)} />
      )}

      {word && (
        <WordSheet lang={lang} tokenize={tokenize} lemma={word.lemma} surface={word.surface} onClose={() => setWord(null)} speech={speech} speakOne={speakOne} />
      )}
    </div>
  );
}
