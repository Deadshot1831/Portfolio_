"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Experience.module.css";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCE = [
  {
    role: "AI Intern",
    company: "Valiance Solutions",
    period: "Jan 2026 — Present",
    current: true,
    points: [
      "Collected and preprocessed large datasets using Python, Pandas and NumPy for machine learning training pipelines.",
      "Implemented regression and classification models and evaluated performance using cross-validation and statistical metrics.",
      "Built data-processing workflows and collaborated with engineers to integrate ML components into applications.",
    ],
    tags: ["Python", "Pandas", "NumPy", "Machine Learning"],
  },
  {
    role: "Software Intern",
    company: "IBM",
    period: "Jul 2025 — Aug 2025",
    points: [
      "Developed Python scripts for data processing, automation and performance optimization.",
      "Worked with SQL databases to extract, transform and analyze large datasets.",
      "Participated in testing, debugging and deployment following SDLC and Agile practices.",
    ],
    tags: ["Python", "SQL", "Automation", "Agile"],
  },
  {
    role: "AI Intern",
    company: "Aftershoot",
    period: "Jun 2024 — Aug 2024",
    points: [
      "Built machine learning models for image-processing tasks using Python, NumPy and Scikit-learn.",
      "Performed feature engineering, dataset preparation and model evaluation using accuracy and validation metrics.",
      "Assisted in integrating trained models into backend services for real-time prediction.",
    ],
    tags: ["Python", "Scikit-learn", "Computer Vision"],
  },
];

export default function Experience() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context((self) => {
      const q = self.selector;
      const fill = q(`.${styles.railFill}`)[0];

      if (reduced) {
        gsap.set(q("[data-reveal]"), { opacity: 1, y: 0 });
        gsap.set(fill, { scaleY: 1 });
        return;
      }

      q("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Rail fills as you read down the timeline.
      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: q(`.${styles.timeline}`)[0],
              start: "top 72%",
              end: "bottom 78%",
              scrub: true,
            },
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={rootRef}
      className={styles.experience}
      aria-label="Experience"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            <span className={styles.eyebrowDot} />
            Experience
          </p>
          <h2 className={styles.title} data-reveal>
            Where I&rsquo;ve worked.
          </h2>
        </header>

        <div className={styles.timeline}>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} />
          </span>

          <ol className={styles.list}>
            {EXPERIENCE.map((e, i) => (
              <li key={i} className={styles.item} data-reveal>
                <span
                  className={`${styles.dot}${
                    e.current ? ` ${styles.dotCurrent}` : ""
                  }`}
                  aria-hidden="true"
                />
                <div className={styles.content}>
                  <span className={styles.period}>
                    {e.period}
                    {e.current && <span className={styles.live}>Now</span>}
                  </span>

                  <h3 className={styles.role}>
                    {e.role}
                    <span className={styles.sep}>·</span>
                    <span className={styles.company}>{e.company}</span>
                  </h3>

                  <ul className={styles.points}>
                    {e.points.map((p, j) => (
                      <li key={j} className={styles.point}>
                        {p}
                      </li>
                    ))}
                  </ul>

                  <ul className={styles.tags}>
                    {e.tags.map((t) => (
                      <li key={t} className={styles.tag}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
