"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Work.module.css";

gsap.registerPlugin(ScrollTrigger);

// --- Realistic placeholder projects. Swap with your real work. ---------
const PROJECTS = [
  {
    name: "DeceptiTech",
    year: "2025",
    role: "AI · Full-Stack",
    blurb:
      "Audits any website for manipulative dark patterns — fake urgency, scarcity, confirmshaming and more — by crawling it with headless Chromium and pairing rule-based detectors with a local-LLM second pass.",
    tags: ["LLM", "Headless Chromium", "NLP"],
    href: "https://dark-pattern-detector-rouge.vercel.app",
    preview: "/preview-deceptitech.jpg",
    hue: "var(--orange)",
    hue2: "#ff4d6d",
  },
  {
    name: "AI Threat Modeler",
    year: "2025",
    role: "AI · Security",
    blurb:
      "Maps an LLM/GenAI app's architecture and detects threats across OWASP LLM-10, STRIDE and MITRE ATLAS, then generates professional security artifacts — all from a single interface.",
    tags: ["OWASP LLM-10", "STRIDE", "MITRE ATLAS"],
    href: "https://ai-in-cybersecurity-woad.vercel.app",
    preview: "/preview-threat-modeler.jpg",
    hue: "var(--blue)",
    hue2: "#7c5cff",
  },
];

export default function Work() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context((self) => {
      const q = self.selector;

      if (reduced) {
        gsap.set(q("[data-reveal]"), { opacity: 1, y: 0 });
        return;
      }

      q("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      // Slow parallax drift on each project cover.
      q(`.${styles.cover}`).forEach((el) => {
        const media = el.querySelector(`.${styles.coverMedia}`);
        if (!media) return;
        gsap.fromTo(
          media,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={rootRef} className={styles.work} aria-label="Selected work">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            <span className={styles.eyebrowDot} />
            Selected Work
          </p>
          <h2 className={styles.title} data-reveal>
            Things I&rsquo;ve shipped.
          </h2>
        </header>

        <ol className={styles.list}>
          {PROJECTS.map((p, i) => (
            <li key={p.name} className={styles.item} data-reveal>
              <a
                className={styles.card}
                href={p.href}
                aria-label={`${p.name} — ${p.role}`}
                {...(p.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <div
                  className={styles.cover}
                  style={{
                    "--hue": p.hue,
                    "--hue2": p.hue2,
                  }}
                >
                  {p.preview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className={`${styles.coverImg} ${styles.coverMedia}`}
                      src={p.preview}
                      alt={`${p.name} homepage preview`}
                      loading="lazy"
                    />
                  ) : (
                    <div className={`${styles.coverInner} ${styles.coverMedia}`}>
                      <span className={styles.monogram}>{p.name[0]}</span>
                    </div>
                  )}
                  <span className={styles.index}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.coverShade} aria-hidden="true" />
                </div>

                <div className={styles.body}>
                  <div className={styles.metaTop}>
                    <span className={styles.role}>{p.role}</span>
                    <span className={styles.year}>{p.year}</span>
                  </div>

                  <h3 className={styles.name}>
                    {p.name}
                    <svg
                      className={styles.arrow}
                      viewBox="0 0 24 24"
                      width="0.62em"
                      height="0.62em"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </h3>

                  <p className={styles.blurb}>{p.blurb}</p>

                  <ul className={styles.tags}>
                    {p.tags.map((t) => (
                      <li key={t} className={styles.tag}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
