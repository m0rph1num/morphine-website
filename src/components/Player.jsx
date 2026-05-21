// src/components/Player.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tracks } from "../data/tracks";
import { showToast } from "./Toast";
import useHotkeys from "../hooks/useHotkeys";

export default function Player({ autoPlay = false }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);
  const progressContainerRef = useRef(null);
  const progressFilledRef = useRef(null);
  const progressHandleRef = useRef(null);
  const isDraggingRef = useRef(false);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!isDraggingRef.current) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent || 0);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  useEffect(() => {
    if (progressFilledRef.current) {
      progressFilledRef.current.style.width = `${progress}%`;
    }
    if (progressHandleRef.current) {
      progressHandleRef.current.style.left = `${progress}%`;
    }
  }, [progress]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (autoPlay && !hasAutoPlayed && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasAutoPlayed(true);
          })
          .catch((error) => {
            console.log("Auto-play prevented:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay, hasAutoPlayed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!hasAutoPlayed) return;

    setProgress(0);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log("Play after track change prevented:", error);
          setIsPlaying(false);
        });
    }
  }, [currentTrackIndex, hasAutoPlayed]);

  const seek = useCallback((clientX) => {
    if (!progressContainerRef.current || !audioRef.current) return;

    const rect = progressContainerRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.min(Math.max(x, 0), rect.width);
    const percent = x / rect.width;
    const newTime = percent * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    const newPercent = percent * 100;
    setProgress(newPercent);

    if (progressFilledRef.current) {
      progressFilledRef.current.style.width = `${newPercent}%`;
    }
    if (progressHandleRef.current) {
      progressHandleRef.current.style.left = `${newPercent}%`;
    }
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      seek(e.clientX);

      const handleMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        seek(moveEvent.clientX);
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [seek],
  );

  const handleProgressClick = useCallback(
    (e) => {
      seek(e.clientX);
    },
    [seek],
  );

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Play prevented:", error);
          });
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  useHotkeys({
    onPlayPause: togglePlay,
    onNext: nextTrack,
    onPrev: prevTrack,
    onMute: toggleMute,
    onCopyTrack: () => {
      const trackText = `${currentTrack.artist} — ${currentTrack.title}`;
      navigator.clipboard.writeText(trackText);
      showToast("Скопировано", trackText);
    },
  });

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={nextTrack}
        onError={(e) => console.error("Audio error:", e)}
      />

      <motion.div
        className="player"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="player-progress-section">
          <div
            className="player-progress-container"
            ref={progressContainerRef}
            onClick={handleProgressClick}
            onMouseDown={handleMouseDown}
          >
            <div className="player-progress-track">
              <div className="player-progress-filled" ref={progressFilledRef} style={{ width: `${progress}%` }} />
              <div className="player-progress-handle" ref={progressHandleRef} style={{ left: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="player-main">
          <motion.div
            className="player-track-info"
            key={currentTrack.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="player-cover"
              style={{ backgroundImage: `url(${currentTrack.cover})` }}
              onClick={(e) => {
                e.stopPropagation();
                const trackText = `${currentTrack.artist} — ${currentTrack.title}`;
                navigator.clipboard.writeText(trackText);
                showToast("Скопировано", `${currentTrack.artist} — ${currentTrack.title}`);
              }}
            />
            <div className="player-track-details">
              <motion.div
                className="player-track-name"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {currentTrack.title}
              </motion.div>
              <motion.div
                className="player-artist"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {currentTrack.artist}
              </motion.div>
            </div>
          </motion.div>

          <div className="player-controls">
            <motion.button
              className="player-btn player-btn-prev"
              onClick={prevTrack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/icons/prev.svg" alt="Previous" />
            </motion.button>

            <motion.button
              className="player-btn player-btn-play"
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={isPlaying ? "/icons/pause.svg" : "/icons/play.svg"} alt={isPlaying ? "Pause" : "Play"} />
            </motion.button>

            <motion.button
              className="player-btn player-btn-next"
              onClick={nextTrack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/icons/next.svg" alt="Next" />
            </motion.button>
          </div>

          <div className="player-volume">
            <motion.button
              className="player-btn-volume"
              onClick={toggleMute}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <img src={isMuted ? "/icons/sound-off.svg" : "/icons/sound-on.svg"} alt="Volume" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
