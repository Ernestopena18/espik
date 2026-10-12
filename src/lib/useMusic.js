import { useCallback, useEffect, useRef, useState } from "react";

// Música instrumental original, sintetizada en el navegador. Cada estilo tiene
// tres variaciones de su propia progresión; no se cargan grabaciones externas.
export const MUSIC_STYLES = [
  { id: "study", name: "Lofi de estudio", tempo: 76, wave: "sine", notes: [48, 55, 52, 57] },
  { id: "calm", name: "Música tranqui", tempo: 62, wave: "triangle", notes: [45, 52, 48, 55] },
  { id: "jazz", name: "Jazz", tempo: 92, wave: "triangle", notes: [50, 57, 53, 60] },
  { id: "medieval", name: "Lofi medieval", tempo: 72, wave: "sine", notes: [43, 50, 46, 53] },
];

export const MUSIC_TRACKS = ["Atardecer", "Caminata", "Noche serena"];

function frequency(midi) { return 440 * 2 ** ((midi - 69) / 12); }

export function useMusic() {
  const [styleId, setStyleId] = useState("study");
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.16);
  const [available, setAvailable] = useState(true);
  const ctxRef = useRef(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const masterRef = useRef(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
    masterRef.current = null;
    setPlaying(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(async () => {
    stop();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { setAvailable(false); return; }
    try {
      const ctx = new AudioContext();
      await ctx.resume();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      masterRef.current = master;
      const style = MUSIC_STYLES.find((item) => item.id === styleId);
      const beatMs = 60000 / style.tempo;
      stepRef.current = 0;
      const note = (midi, duration, gain, delay = 0) => {
        const osc = ctx.createOscillator();
        const envelope = ctx.createGain();
        const startAt = ctx.currentTime + delay;
        osc.type = style.wave;
        osc.frequency.value = frequency(midi);
        envelope.gain.setValueAtTime(0.0001, startAt);
        envelope.gain.exponentialRampToValueAtTime(gain, startAt + 0.04);
        envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
        osc.connect(envelope).connect(master);
        osc.start(startAt);
        osc.stop(startAt + duration + 0.02);
      };
      const tick = () => {
        const step = stepRef.current++;
        const root = style.notes[(Math.floor(step / 4) + track) % style.notes.length];
        if (step % 4 === 0) {
          note(root, Math.min(2.4, beatMs / 1000 * 3.7), 0.12);
          note(root + (style.id === "jazz" ? 10 : 7), beatMs / 1000 * 2.8, 0.065);
          note(root + 12, beatMs / 1000 * 2.5, 0.045);
        }
        if (style.id === "jazz" || step % 2 === 0) {
          const melody = [12, 14, 15, 19, 17, 14, 12, 10][(step + track * 2) % 8];
          note(root + melody, beatMs / 1000 * 0.75, style.id === "calm" ? 0.035 : 0.055);
        }
      };
      tick();
      timerRef.current = setInterval(tick, beatMs);
      setPlaying(true);
    } catch {
      setAvailable(false);
      stop();
    }
  }, [styleId, track, volume, stop]);

  useEffect(() => { if (masterRef.current) masterRef.current.gain.value = volume; }, [volume]);
  const choose = (nextStyle, nextTrack) => {
    const wasPlaying = playing;
    stop();
    setStyleId(nextStyle);
    setTrack(nextTrack);
    return wasPlaying;
  };

  return { styleId, track, playing, volume, setVolume, available, start, stop, choose };
}
