// src/components/IntroPage.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function IntroPage({ visible, onComplete }) {
  const handleClick = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-page"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={handleClick}
        >
          <motion.div
            className="intro-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="intro-title">morphine</h1>
            <p className="intro-subtitle">кликните в любом месте</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
