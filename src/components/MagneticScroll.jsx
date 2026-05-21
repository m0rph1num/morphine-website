// src/components/MagneticScroll.jsx
import { useEffect, useRef } from "react";

export default function MagneticScroll({ children, sectionsRef }) {
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const currentIndexRef = useRef(0);
  const sections = sectionsRef.current || [];

  useEffect(() => {
    const container = document.querySelector(".app");
    if (!container) return;

    const scrollToSection = (index) => {
      if (index < 0 || index >= sections.length) return;
      if (isScrollingRef.current) return;

      isScrollingRef.current = true;
      currentIndexRef.current = index;

      sections[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    };

    // Обработчик колеса мыши (десктоп)
    const handleWheel = (e) => {
      if (isScrollingRef.current) return;

      const delta = e.deltaY;
      let newIndex = currentIndexRef.current;

      if (delta > 0 && currentIndexRef.current < sections.length - 1) {
        newIndex = currentIndexRef.current + 1;
      } else if (delta < 0 && currentIndexRef.current > 0) {
        newIndex = currentIndexRef.current - 1;
      } else {
        return;
      }

      e.preventDefault();
      scrollToSection(newIndex);
    };

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isScrollingRef.current) return;

      touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;

      let newIndex = currentIndexRef.current;

      if (Math.abs(delta) > 30) {
        if (delta > 0 && currentIndexRef.current < sections.length - 1) {
          newIndex = currentIndexRef.current + 1;
        } else if (delta < 0 && currentIndexRef.current > 0) {
          newIndex = currentIndexRef.current - 1;
        } else {
          return;
        }
        e.preventDefault();
        scrollToSection(newIndex);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            const index = sections.findIndex((s) => s === entry.target);
            if (index !== -1) {
              currentIndexRef.current = index;
            }
          }
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach((section) => observer.observe(section));

    // Отключаем стандартный скролл и вешаем события
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.style.overflow = "hidden";
    container.style.height = "100vh";
    container.style.position = "relative";

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.style.overflow = "";
      container.style.height = "";
      observer.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [sections]);

  return <>{children}</>;
}
