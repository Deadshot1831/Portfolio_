"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import CinematicLayer from "../CinematicLayer/CinematicLayer";
import styles from "./VideoIntro.module.css";

const HINT_TIMEOUT = 6500;

export default function VideoIntro({
  videoSrc = "/hero.mp4",
  poster = "/hero-poster.jpg",
  firstName = "Yashwant",
  lastName = "Yadav",
  tagline = "AI & Software Engineer · ML · Computer Vision",
  subtitle = "I build machine learning and computer vision systems that turn complex data into reliable, real-world decisions — from detection pipelines to cloud-scale deployment.",
  scrollTargetId = "about",
}) {
  const foregroundRef = useRef(null);
  const ambientRef = useRef(null);
  const contentRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ---- GSAP cinematic entrance --------------------------------------
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        gsap.set(`.${styles.reveal}`, { opacity: 1, y: 0 });
        gsap.set(`.${styles.line}`, { yPercent: 0, opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "expo.out", duration: 1.3 },
      });

      tl.from(`.${styles.tagline}`, { opacity: 0, y: 18, duration: 1 })
        .from(
          `.${styles.line}`,
          { yPercent: 118, opacity: 0, stagger: 0.12, duration: 1.4 },
          "-=0.6"
        )
        .from(
          `.${styles.subtitle}`,
          { opacity: 0, y: 22, duration: 1.1 },
          "-=0.95"
        )
        .from(
          `.${styles.controls}`,
          { opacity: 0, y: 14, duration: 0.9 },
          "-=0.8"
        )
        .from(
          `.${styles.scrollCue}`,
          { opacity: 0, y: 14, duration: 0.9 },
          "-=0.7"
        );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  // ---- Reveal once the foreground video can paint -------------------
  useEffect(() => {
    const v = foregroundRef.current;
    if (!v) return;
    if (v.readyState >= 2) setIsReady(true);

    // Safety net: if the asset is missing/slow, reveal anyway.
    const fallback = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(fallback);
  }, []);

  // ---- Try to autoplay with sound; fall back to muted if blocked ----
  // Browsers only allow unmuted autoplay after user engagement, so we
  // attempt sound first and gracefully degrade to muted + the hint.
  useEffect(() => {
    const fg = foregroundRef.current;
    const bg = ambientRef.current;
    if (!fg) return;

    fg.muted = false;
    const attempt = fg.play();
    if (attempt && typeof attempt.then === "function") {
      attempt
        .then(() => {
          bg?.play().catch(() => {});
        })
        .catch(() => {
          // Unmuted autoplay refused — play muted and invite a tap.
          fg.muted = true;
          setIsMuted(true);
          setShowHint(true);
          fg.play().catch(() => {});
          bg?.play().catch(() => {});
        });
    }
  }, []);

  // ---- Auto-hide the "tap for sound" hint ---------------------------
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), HINT_TIMEOUT);
    return () => clearTimeout(t);
  }, [showHint]);

  // ---- Controls -----------------------------------------------------
  const togglePlay = () => {
    const fg = foregroundRef.current;
    const bg = ambientRef.current;
    if (!fg) return;

    if (fg.paused) {
      // If it already finished, replay from the very start.
      if (fg.ended) {
        fg.currentTime = 0;
        if (bg) bg.currentTime = 0;
      }
      fg.play();
      bg?.play();
      setIsPlaying(true);
    } else {
      fg.pause();
      bg?.pause();
      setIsPlaying(false);
    }
  };

  // Plays once on load — when it finishes, stop and reset the controls.
  const handleEnded = () => {
    ambientRef.current?.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const fg = foregroundRef.current;
    if (!fg) return;
    const next = !fg.muted;
    fg.muted = next;
    if (!next) {
      // Unmuting may require an explicit play() in some browsers.
      fg.play().catch(() => {});
      setShowHint(false);
    }
    setIsMuted(next);
  };

  const scrollToNext = () => {
    const next = document.getElementById(scrollTargetId);
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className={styles.hero}
      data-ready={isReady ? "true" : "false"}
      aria-label="Intro"
    >
      {/* ---- Media stack: ambient blur backplate + sharp foreground ---- */}
      <div className={styles.media}>
        <video
          ref={ambientRef}
          className={styles.ambient}
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        <video
          ref={foregroundRef}
          className={styles.foreground}
          src={videoSrc}
          poster={poster}
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          onCanPlay={() => setIsReady(true)}
          onEnded={handleEnded}
        />
        <div className={styles.grade} aria-hidden="true" />
      </div>

      {/* ---- Floating cinematic bokeh ---------------------------------- */}
      <CinematicLayer className={styles.particles} />

      {/* ---- Landing content ------------------------------------------- */}
      <div className={styles.content} ref={contentRef}>
        <p className={styles.tagline}>{tagline}</p>

        <h1 className={styles.title}>
          <span className={styles.lineMask}>
            <span className={styles.line}>{firstName}</span>
          </span>
          <span className={styles.lineMask}>
            <span className={`${styles.line} ${styles.lineAccent}`}>
              {lastName}
            </span>
          </span>
        </h1>

        <p className={`${styles.subtitle} ${styles.reveal}`}>{subtitle}</p>
      </div>

      {/* ---- Glass controls -------------------------------------------- */}
      <div className={styles.controls}>
        <div className={styles.hintWrap}>
          <span
            className={styles.hint}
            data-show={showHint && isMuted ? "true" : "false"}
            aria-hidden="true"
          >
            <span className={styles.hintDot} />
            Tap for sound
          </span>
        </div>

        <button
          type="button"
          className={styles.glassBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          type="button"
          className={styles.glassBtn}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          data-active={!isMuted ? "true" : "false"}
        >
          {isMuted ? <MutedIcon /> : <SoundIcon />}
        </button>
      </div>

      {/* ---- Scroll indicator ------------------------------------------ */}
      <button
        type="button"
        className={styles.scrollCue}
        onClick={scrollToNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollTrack}>
          <span className={styles.scrollPulse} />
        </span>
      </button>
    </section>
  );
}

/* ---- Inline icons (no extra deps, inherit currentColor) ------------- */
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        fill="currentColor"
      />
      <path
        d="M16.5 8.5a4 4 0 0 1 0 7M18.8 6a7 7 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path
        d="M16 9.5l5 5m0-5l-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
