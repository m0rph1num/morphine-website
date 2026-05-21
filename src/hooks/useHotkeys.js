// src/hooks/useHotkeys.js
import { useEffect } from "react";

const keyMap = {
  к: "r",
  с: "c",
  ь: "m",
};

export function useHotkeys(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const target = e.target.tagName;

      if (target === "INPUT" || target === "TEXTAREA") return;

      let actualKey = key;

      if (key.length === 1 && /[a-zA-Zа-яА-Я]/.test(key)) {
        const code = e.code;
        if (code === "KeyR") actualKey = "r";
        else if (code === "KeyC") actualKey = "c";
        else if (code === "KeyM") actualKey = "m";
        else actualKey = key.toLowerCase();
      } else {
        actualKey = key.toLowerCase();
      }

      const mappedKey = keyMap[actualKey] || actualKey;

      switch (mappedKey) {
        case " ":
        case "space":
          e.preventDefault();
          handlers.onPlayPause?.();
          break;
        case "arrowright":
          e.preventDefault();
          handlers.onNext?.();
          break;
        case "arrowleft":
          e.preventDefault();
          handlers.onPrev?.();
          break;
        case "r":
          e.preventDefault();
          handlers.onRandomQuote?.();
          break;
        case "c":
          e.preventDefault();
          handlers.onCopyTrack?.();
          break;
        case "m":
          e.preventDefault();
          handlers.onMute?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}

export default useHotkeys;
