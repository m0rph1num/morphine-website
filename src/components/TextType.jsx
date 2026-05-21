// src/components/TextType.jsx
import { useEffect, useRef, useState } from "react";
import "./TextType.css";

const TextType = ({
  text,
  typingSpeed = 50,
  initialDelay = 300,
  pauseDuration = 400,
  className = "",
  startOnVisible = true,
  resetOnExit = false,
  resetTrigger = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const fullText = Array.isArray(text) ? text.join("\n") : text;

  const resetTyping = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayedText("");
    setIsComplete(false);
    setIsVisible(!startOnVisible);
    setHasStarted(false);
    lineIndexRef.current = 0;
    charIndexRef.current = 0;
  };

  useEffect(() => {
    if (resetTrigger) {
      resetTyping();
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (!startOnVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasStarted && !isComplete) {
            setIsVisible(true);
            setHasStarted(true);
          }
        } else {
          if (resetOnExit) {
            resetTyping();
          }
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [startOnVisible, resetOnExit, hasStarted, isComplete]);

  useEffect(() => {
    if (!isVisible) return;
    if (isComplete) return;

    const lines = fullText.split("\n");
    const currentLine = lines[lineIndexRef.current];

    if (!currentLine) {
      setIsComplete(true);
      return;
    }

    if (charIndexRef.current >= currentLine.length) {
      if (lineIndexRef.current + 1 < lines.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText((prev) => prev + "\n");
          lineIndexRef.current++;
          charIndexRef.current = 0;
        }, pauseDuration);
        return;
      } else {
        setIsComplete(true);
        return;
      }
    }

    timeoutRef.current = setTimeout(() => {
      const nextChar = currentLine[charIndexRef.current];
      setDisplayedText((prev) => prev + nextChar);
      charIndexRef.current++;
    }, typingSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, isComplete, fullText, typingSpeed, pauseDuration, displayedText]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`text-type ${className}`} {...props}>
      <div className="text-type__content">
        {displayedText.split("\n").map((line, idx) => (
          <div key={idx} className="text-type__line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextType;
