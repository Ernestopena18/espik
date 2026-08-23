import { useState, useEffect, useRef, useCallback } from "react";
import { offsetsOf, tokenAtChar } from "./tokenize.js";

/* La Web Speech API no expone el género de la voz, así que se deduce
   del nombre. Si no hay voz del género pedido, se imita con el tono. */
const MALE = ["david", "mark", "guy", "ryan", "alex", "daniel", "tom", "eric", "christopher", "brian", "james", "fred", "aaron", "oliver", "arthur", "george", "william", "thomas", "paul", "henri", "nicolas", "claude", "jacques", "guillaume", "yves", "antoine", "mathieu", "sylvain", "jean", "pablo", "jorge", "diego", "raul", "raúl", "alvaro", "álvaro", "juan", "carlos", "miguel", "male"];
const FEMALE = ["zira", "aria", "jenny", "michelle", "samantha", "susan", "karen", "moira", "tessa", "fiona", "victoria", "allison", "ava", "serena", "emily", "sonia", "libby", "amber", "ashley", "nancy", "jane", "sara", "hortense", "julie", "denise", "amélie", "amelie", "aurélie", "aurelie", "audrey", "marie", "chantal", "virginie", "céline", "celine", "vivienne", "juliette", "louise", "charlotte", "helena", "laura", "sabina", "monica", "mónica", "paulina", "elvira", "dalia", "ximena", "lupe", "female"];

function genderOf(voice) {
  const n = (voice.name || "").toLowerCase();
  if (MALE.some((x) => n.includes(x))) return "m";
  if (FEMALE.some((x) => n.includes(x))) return "f";
  return null;
}

/**
 * @param {object} lang        configuración del idioma (ver src/data)
 * @param {function} tokenize  tokenizador del idioma, para el subrayado
 */
export function useSpeech(lang, tokenize) {
  const [voices, setVoices] = useState([]);
  const [gender, setGender] = useState("f");
  const [accent, setAccent] = useState(lang.accents[0][0]);
  const [playing, setPlaying] = useState(null); // { id, index }
  const timers = useRef([]);
  const session = useRef(0);
  const gotBoundary = useRef(false);

  useEffect(() => { setAccent(lang.accents[0][0]); }, [lang]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const chooseVoice = useCallback((langTag) => {
    const pre = langTag.slice(0, 2).toLowerCase();
    const all = voices.filter((v) => v.lang?.toLowerCase().startsWith(pre));
    const exact = all.filter((v) => v.lang.toLowerCase().replace("_", "-") === langTag.toLowerCase());
    const pool = exact.length ? exact : all;
    const m = pool.find((v) => genderOf(v) === gender);
    return { voice: m || pool[0] || null, matched: !!m, anyForLang: all.length > 0, exactAccent: exact.length > 0 };
  }, [voices, gender]);

  const targetPick = chooseVoice(accent);
  const esPick = chooseVoice("es-ES");

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  /* stop() invalida la sesión. Chrome dispara onend al cancelar un
     utterance: sin este contador, cada pausa saltaría una línea. */
  const stop = useCallback(() => {
    session.current++;
    clearTimers();
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setPlaying(null);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const speak = useCallback((text, { id, langTag, rate = 0.9, onEnd } = {}) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    stop();
    const mySession = session.current;
    const t0 = performance.now();

    const tokens = tokenize(text);
    const starts = offsetsOf(tokens);
    const pick = chooseVoice(langTag);

    const u = new SpeechSynthesisUtterance(text);
    u.lang = pick.voice?.lang || langTag;
    u.rate = rate;
    if (pick.voice) u.voice = pick.voice;
    u.pitch = pick.matched ? 1 : gender === "m" ? 0.7 : 1.35;

    gotBoundary.current = false;

    u.onboundary = (e) => {
      if (mySession !== session.current) return;
      if (e.name && e.name !== "word") return;
      gotBoundary.current = true;
      clearTimers();
      const i = tokenAtChar(tokens, starts, e.charIndex);
      if (i !== null) setPlaying({ id, index: i });
    };
    const finish = () => {
      if (mySession !== session.current) return;
      clearTimers();
      setPlaying(null);
      onEnd?.(performance.now() - t0);
    };
    u.onend = finish;
    u.onerror = finish;

    setPlaying({ id, index: null });
    window.speechSynthesis.speak(u);

    /* Plan B: varios Android e iOS no emiten onboundary nunca.
       Si a los 400 ms no llegó ninguno, se reparte el tiempo estimado. */
    timers.current.push(
      setTimeout(() => {
        if (gotBoundary.current || mySession !== session.current) return;
        let acc = 0;
        tokens.forEach((t, i) => {
          if (!t.w) return;
          timers.current.push(setTimeout(() => setPlaying({ id, index: i }), acc));
          acc += (95 + 62 * t.s.length) / rate;
        });
      }, 400)
    );
  }, [chooseVoice, gender, stop, tokenize]);

  return {
    speak, stop, playing,
    gender, setGender, accent, setAccent,
    targetVoice: targetPick.voice,
    targetSimulated: !targetPick.matched && !!targetPick.voice,
    accentMissing: targetPick.anyForLang && !targetPick.exactAccent,
    esVoice: esPick.voice,
    hasVoices: voices.length > 0,
  };
}
