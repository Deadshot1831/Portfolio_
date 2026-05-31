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
    hue: "var(--orange)",
    hue2: "#ff4d6d",
  },
  {
    name: "AI Threat Modeler",
    year: "2025",
    role: "AI · Security",
    blurb:
      "An AI-powered threat-modeling tool that turns a system or application description into a structured set of likely security threats and mitigations — helping teams reason about risk early.",
    tags: ["LLM", "Threat Modeling", "Security"],
    href: "https://ai-in-cybersecurity-woad.vercel.app",
    hue: "var(--blue)",
    hue2: "#7c5cff",
  },
  {
    name: "Vision",
    year: "2024",
    role: "AI Engineering",
    blurb:
      "An end-to-end computer vision service for image classification and segmentation, packaged behind a clean, versioned API.",
    tags: ["TensorFlow", "FastAPI", "Docker"],
    href: "#",
    hue: "#ffb070",
    hue2: "var(--orange)",
  },
  {
    name: "Scale",
    year: "2023",
    role: "ML Platform",
    blurb:
      "Cloud infrastructure for serving models at scale — autoscaling inference, live monitoring and automated drift detection.",
    tags: ["AWS", "Kubernetes", "MLOps"],
    href: "#",
    hue: "#4dd6c4",
    hue2: "var(--blue)",
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
        gsap.fromTo(
          el.querySelector(`.${styles.coverInner}`),
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
                  <div className={styles.coverInner}>
                    <span className={styles.index}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.monogram}>{p.name[0]}</span>
                  </div>
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
