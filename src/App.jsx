// src/App.jsx
import { useState, useRef, useEffect } from "react";
import "./styles/globals.css";
import LineWaves from "./components/LineWaves";
import LogoLoop from "./components/LogoLoop";
import NameDecrypt from "./components/NameDecrypt";
import TimeDecrypt from "./components/TimeDecrypt";
import Player from "./components/Player";
import IntroPage from "./components/IntroPage";
import MagneticScroll from "./components/MagneticScroll";
import TextType from "./components/TextType";
import ToastProvider, { showToast } from "./components/Toast";
import useHotkeys from "./hooks/useHotkeys";
import { SiDiscord, SiTelegram, SiSteam, SiSpotify } from "react-icons/si";

const socialLogos = [
  { node: <SiDiscord size={32} />, title: "Discord", href: "https://discord.com/users/879420360347488266" },
  { node: <SiTelegram size={32} />, title: "Telegram", href: "https://t.me/morphine63" },
  { node: <SiSteam size={32} />, title: "Steam", href: "https://steamcommunity.com/id/morphinum_IV21/" },
  {
    node: <SiSpotify size={32} />,
    title: "Spotify",
    href: "https://open.spotify.com/user/31doeyjkmp6vcf4w773zx6us6aba?si=30c2a2b1eb9e4e32",
  },
];

function App() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [playAudio, setPlayAudio] = useState(false);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const sectionsRef = useRef([]);

  const quotes = [
    {
      id: 1,
      text: "Я снова пожёван и снова прожжён\nНа кураже или под куражом\nНо мы в итоге остались одни\nХрустальные дни разбивались на пазлы\nНо я продолжал дёргать за волоски",
      track: "архив",
      artist: "вышел покурить",
      cover: "/covers/vyshel-pokurit-arhiv.jpg",
    },
    {
      id: 2,
      text: "Нищета\nВсё бабло въебал на ставки\nНа додеп срочно одолжите бабки\nНе смотрите вы пожалуйста\nСвысока",
      track: "Нищета, всё бабло ушло на ставки",
      artist: "LUDOMUSIC",
      cover: "/covers/nisheta.jpg",
    },
    {
      id: 3,
      text: "Я бегу от тебя, но напрасно,\nв душе навсегда теперь\nпасмурно\nТы по-прежнему так же\nпрекрасна, приближаюсь к\nтебе неуверенно",
      track: "Болею тобой",
      artist: "Кишлак, семьсот семь",
      cover: "/covers/boleyu-toboy-kishlak-semsot-sem.jpg",
    },
    {
      id: 4,
      text: "Монолог с собой в кругу\nчетырёх стен\nРомантика синих колен\nЯ не хочу слышать других\nСледы стёкол на моей шее\nЯ могу стать для тебя другим",
      track: "волосы",
      artist: "elox1m",
      cover: "/covers/volosy-elox1m.jpg",
    },
    {
      id: 5,
      text: "Я стал немного пьян\nЧтоб ты стала покрасивей\nВылез из этой ямы\nБесконечной эйфории",
      track: "ЖИЗНИ НЕТ",
      artist: "PALADIN",
      cover: "/covers/zhizni-net-paladin.jpg",
    },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const currentQuote = quotes[currentQuoteIndex];
  const [isSecondScreenVisible, setIsSecondScreenVisible] = useState(false);
  const [shouldResetText, setShouldResetText] = useState(false);
  const [forceRandomOnReturn, setForceRandomOnReturn] = useState(false);

  const randomQuote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quotes.length);
    } while (randomIndex === currentQuoteIndex && quotes.length > 1);
    setCurrentQuoteIndex(randomIndex);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        if (!isVisible && isSecondScreenVisible) {
          setForceRandomOnReturn(true);
        }

        if (isVisible && forceRandomOnReturn) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * quotes.length);
          } while (randomIndex === currentQuoteIndex && quotes.length > 1);
          setCurrentQuoteIndex(randomIndex);
          setForceRandomOnReturn(false);
          setShouldResetText(true);
          setTimeout(() => setShouldResetText(false), 100);
        }

        setIsSecondScreenVisible(isVisible);
      },
      { threshold: 0.3 },
    );

    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }

    return () => observer.disconnect();
  }, [isSecondScreenVisible, forceRandomOnReturn, currentQuoteIndex, quotes.length]);

  useHotkeys({
    onRandomQuote: randomQuote,
  });

  useEffect(() => {
    sectionsRef.current = [section1Ref.current, section2Ref.current].filter(Boolean);
  }, []);

  const handleIntroComplete = () => {
    setPlayAudio(true);
    setShowOverlay(false);
  };

  return (
    <>
      <div>
        {/* Чёрный фон */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#050505",
            zIndex: 0,
          }}
        />

        {/* LineWaves фон */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <LineWaves
            speed={0.2}
            innerLineCount={24}
            outerLineCount={28}
            warpIntensity={0.6}
            rotation={-30}
            edgeFadeWidth={0.3}
            colorCycleSpeed={0.2}
            brightness={0.12}
            color1="#3a3a3a"
            color2="#2a2a2a"
            color3="#1a1a1a"
            enableMouseInteraction={true}
            mouseInfluence={0.8}
          />
        </div>

        <MagneticScroll sectionsRef={sectionsRef}>
          <div className="app" style={{ position: "relative", zIndex: 2 }}>
            {/* Экран 1 */}
            <section ref={section1Ref} className="section">
              <div className="container">
                <div className="hero">
                  <div className="avatar" />
                  <div className="hero-text">
                    <NameDecrypt originalText="Morphine" targetText="Марсель" speed={50} className="name" />
                    <p className="tagline">Бессознательное роет траншеи</p>
                  </div>
                </div>

                <div className="badges">
                  <div className="badge">
                    <img src="/icons/location.svg" alt="location" />
                    <span>Казань</span>
                  </div>
                  <div className="badge time-badge">
                    <img src="/icons/clock.svg" alt="time" />
                    <TimeDecrypt className="time-text" />
                  </div>
                </div>

                <div className="logo-loop-wrapper">
                  <LogoLoop
                    logos={socialLogos}
                    speed={80}
                    direction="left"
                    logoHeight={64}
                    gap={48}
                    hoverSpeed={20}
                    scaleOnHover={true}
                    fadeOut={true}
                    fadeOutColor="#050505"
                    ariaLabel="Социальные сети"
                  />
                </div>

                <Player autoPlay={playAudio} />
              </div>
            </section>

            {/* Экран 2 */}
            <section ref={section2Ref} className="section verse-section">
              <div className="verse-text-container">
                <TextType
                  key={currentQuoteIndex}
                  text={[currentQuote.text]}
                  typingSpeed={50}
                  initialDelay={300}
                  pauseDuration={400}
                  startOnVisible={true}
                  resetOnExit={true}
                  resetTrigger={shouldResetText}
                  className="verse-text"
                />
              </div>

              <div
                className="verse-mini-player"
                onClick={() => {
                  const trackText = `${currentQuote.artist} — ${currentQuote.track}`;
                  navigator.clipboard.writeText(trackText);
                  showToast("Скопировано", `${currentQuote.artist} — ${currentQuote.track}`);
                }}
              >
                <div className="verse-cover">
                  <img src={currentQuote.cover} alt={currentQuote.track} />
                </div>
                <div className="verse-info">
                  <div className="verse-track">{currentQuote.track}</div>
                  <div className="verse-artist">{currentQuote.artist}</div>
                </div>
              </div>

              <div className="verse-random-btn">
                <button className="verse-random-button" onClick={randomQuote}>
                  <img src="/icons/dice.svg" alt="dice" />
                </button>
              </div>
            </section>
            <div className="hotkeys-hint">
              <div>
                <img src="/icons/space.svg" alt="space" />
                <span>Пауза/Плей</span>
              </div>
              <div>
                <img src="/icons/arrows.svg" alt="prev/next" />
                <span>Назад/Вперёд</span>
              </div>
              <div>
                <img src="/icons/R.svg" alt="R" />
                <span>Случайный куплет</span>
              </div>
              <div>
                <img src="/icons/C.svg" alt="C" />
                <span>Скопировать трек</span>
              </div>
              <div>
                <img src="/icons/M.svg" alt="M" />
                <span>Вкл/Выкл</span>
              </div>
            </div>
          </div>
        </MagneticScroll>
      </div>

      <div
        className="intro-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#050505",
          zIndex: 1000,
          opacity: showOverlay ? 1 : 0,
          visibility: showOverlay ? "visible" : "hidden",
          transition: "opacity 0.8s ease, visibility 0s linear 0.8s",
          pointerEvents: showOverlay ? "auto" : "none",
          cursor: "pointer",
        }}
        onClick={handleIntroComplete}
      >
        <div className="intro-overlay-content">
          <h1 className="intro-title">morphine</h1>
          <p className="intro-subtitle">кликните в любом месте</p>
        </div>
      </div>
      <ToastProvider />
    </>
  );
}

export default App;
