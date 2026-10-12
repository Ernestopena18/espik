import { useEffect } from "react";

export function useTvListNavigation(onBack) {
  useEffect(() => { document.querySelector("[data-tv-pick]")?.focus(); }, []);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" || event.key === "Backspace") {
        if (onBack) { event.preventDefault(); onBack(); }
        return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const choices = [...document.querySelectorAll("[data-tv-pick]")];
      if (!choices.length) return;
      event.preventDefault();
      const index = choices.indexOf(document.activeElement);
      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      choices[Math.max(0, Math.min(choices.length - 1, index + direction))]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);
}
