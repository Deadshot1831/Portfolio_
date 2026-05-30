"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

// --- Realistic placeholder content. Swap with your real details. -------
const LEAD = [
  "I treat the browser",
  "like a film set —",
  "lighting, motion and pace",
  "in service of one feeling.",
];

const SKILLS = [
  "React",
  "Next.js",
  "Three.js",
  "WebGL / GLSL",
  "GSAP",
  "TypeScript",
  "Motion Design",
  "Node.js",
  "CSS Architecture",
  "Design Systems",
];

const DETAILS = [
  { label: "Based in", value: "India · Remote" },
  { label: "Focus", value: "Frontend · Motion · 3D" },
  { label: "Currently", value: "Open to select work" },
];

export default function About({
  portrait = "/about-portrait.jpg",
  name = "Yashwant",
}) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context((self) => {
      const q = self.selector;

      if (reduced) {
        gsap.set(q(`.${styles.leadLine}`), { yPercent: 0, opacity: 1 });
        gsap.set(
          q(`[data-reveal]`),
          { opacity: 1, y: 0 }
        );
        return;
      }

      // Lead statement — line-by-line rise as the block enters view.
      gsap.from(q(`.${styles.leadLine}`), {
        yPercent: 115,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: q(`.${styles.lead}`)[0],
          start: "top 78%",
        },
      });

      // Supporting blocks — gentle fade-up, staggered.
      q(`[data-reveal]`).forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 34,
          duration: 1.1,
          ease: "power3.out",
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Portrait — clip-reveal + slow parallax drift.
      const frame = q(`.${styles.portrait}`)[0];
      if (frame) {
        gsap.from(frame, {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: frame, start: "top 85%" },
        });
        gsap.to(q(`.${styles.portraitImg}`)[0], {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className={styles.about}
      aria-label="About"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow} data-reveal>
          <span className={styles.eyebrowDot} />
          About
        </p>

        <h2 className={styles.lead}>
          {LEAD.map((line, i) => (
            <span key={i} className={styles.leadMask}>
              <span
                className={`${styles.leadLine}${
                  i === LEAD.length - 1 ? ` ${styles.leadAccent}` : ""
                }`}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        <div className={styles.grid}>
          {/* Portrait — replace /about-portrait.jpg in /public */}
          <figure className={styles.portrait}>
            {/* Optional asset with graceful onError fallback to the gradient
                placeholder — intentionally a plain <img>, not next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portrait}
              alt={`Portrait of ${name}`}
              className={styles.portraitImg}
              loading="lazy"
              onError={(e) => {
                // Graceful fallback to the gradient placeholder beneath.
                e.currentTarget.style.opacity = "0";
              }}
            />
            <figcaption className={styles.portraitTag}>{name}</figcaption>
          </figure>

          <div className={styles.copy}>
            <p className={styles.body} data-reveal>
              I&rsquo;m a frontend engineer drawn to the seam between design and
              code — where a well-timed transition stops feeling like an
              interface and starts feeling like a moment. I build for the web
              with React and Next.js, and reach for Three.js and GSAP when a
              screen needs depth, atmosphere and rhythm.
            </p>
            <p className={styles.body} data-reveal>
              My work lives in the details most people only feel: easing curves,
              type that breathes, motion that earns its place. The goal is never
              decoration — it&rsquo;s an experience someone remembers a day
              later.
            </p>

            <dl className={styles.details}>
              {DETAILS.map((d) => (
                <div key={d.label} className={styles.detail} data-reveal>
                  <dt className={styles.detailLabel}>{d.label}</dt>
                  <dd className={styles.detailValue}>{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Skill marquee — continuous, pauses on hover */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <span key={i} className={styles.marqueeItem}>
              {skill}
              <span className={styles.marqueeSep}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
