// src/components/TimeDecrypt.jsx
import { useState, useEffect, useRef } from "react";

const characters = "0123456789:";

export default function TimeDecrypt({ className = "" }) {
  const [displayText, setDisplayText] = useState("UTC+3 / MSK");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const intervalRef = useRef(null);
  const iterationRef = useRef(0);
  const maxIterations = 10;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const mskTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
      const hours = mskTime.getHours().toString().padStart(2, "0");
      const minutes = mskTime.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes} MSK`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  const shuffleText = (progress) => {
    const targetChars = currentTime.split("");
    const maxLen = targetChars.length;
    let result = "";

    for (let i = 0; i < maxLen; i++) {
      const targetChar = targetChars[i] || "";

      if (Math.random() > progress) {
        result += characters[Math.floor(Math.random() * characters.length)];
      } else {
        result += targetChar;
      }
    }
    return result;
  };

  const startAnimation = () => {
    if (isAnimating || !currentTime) return;

    setIsAnimating(true);
    iterationRef.current = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      iterationRef.current++;
      const progress = Math.min(iterationRef.current / maxIterations, 1);

      if (progress >= 1) {
        setDisplayText(currentTime);
        clearInterval(intervalRef.current);
        setIsAnimating(false);
      } else {
        setDisplayText(shuffleText(progress));
      }
    }, 50);
  };

  const resetAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDisplayText("UTC+3 / MSK");
    setIsAnimating(false);
    iterationRef.current = 0;
  };

  return (
    <span
      className={className}
      onMouseEnter={startAnimation}
      onMouseLeave={resetAnimation}
      style={{ cursor: "default" }}
    >
      {displayText}
    </span>
  );
}
