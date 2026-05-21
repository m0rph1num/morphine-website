// src/components/NameDecrypt.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function NameDecrypt({ originalText = "Morphine", targetText = "Марсель", speed = 50, className = "" }) {
  const [displayText, setDisplayText] = useState(originalText);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  const iterationRef = useRef(0);
  const maxIterations = 15;

  const shuffleText = (text, progress) => {
    const originalChars = originalText.split("");
    const targetChars = targetText.split("");
    const maxLen = Math.max(originalChars.length, targetChars.length);

    let result = "";
    for (let i = 0; i < maxLen; i++) {
      const originalChar = originalChars[i] || "";
      const targetChar = targetChars[i] || "";

      if (Math.random() > progress) {
        result += characters[Math.floor(Math.random() * characters.length)];
      } else {
        result += targetChar || originalChar;
      }
    }
    return result;
  };

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    iterationRef.current = 0;

    intervalRef.current = setInterval(() => {
      iterationRef.current++;
      const progress = Math.min(iterationRef.current / maxIterations, 1);

      if (progress >= 1) {
        setDisplayText(targetText);
        clearInterval(intervalRef.current);
        setIsAnimating(false);
      } else {
        let intermediate = "";
        for (let i = 0; i < targetText.length; i++) {
          if (Math.random() > progress) {
            intermediate += characters[Math.floor(Math.random() * characters.length)];
          } else {
            intermediate += targetText[i] || "";
          }
        }
        setDisplayText(intermediate);
      }
    }, speed);
  };

  const resetAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDisplayText(originalText);
    setIsAnimating(false);
    iterationRef.current = 0;
  };

  return (
    <motion.h1
      className={className}
      onMouseEnter={startAnimation}
      onMouseLeave={resetAnimation}
      style={{
        fontSize: "80px",
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: "#F5F5F5",
        margin: 0,
        cursor: "default",
        fontFamily: "inherit",
      }}
    >
      {displayText}
    </motion.h1>
  );
}
