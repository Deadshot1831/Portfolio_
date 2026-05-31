"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Certificates.module.css";

gsap.registerPlugin(ScrollTrigger);

// --- Placeholders — replace with your real certificates. ---------------
// Drop certificate images in /public and set `image`. Set `href` to a
// public verification/credential URL to make the card clickable.
const CERTIFICATES = [
  {
    title: "Certificate Title",
    issuer: "Issuing Organization",
    date: "2025",
    image: null, // e.g. "/cert-ml.jpg"
    href: null, // e.g. "https://coursera.org/verify/XXXX"
    hue: "var(--orange)",
  },
  {
    title: "Certificate Title",
    issuer: "Issuing Organization",
    date: "2025",
    image: null,
    href: null,
    hue: "var(--blue)",
  },
  {
    title: "Certificate Title",
    issuer: "Issuing Organization",
    date: "2024",
    image: null,
    href: null,
    hue: "#ffb070",
  },
];

function AwardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
      <circle
        cx="12"
        cy="9"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8.5 14 7 22l5-3 5 3-1.5-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function Card({ cert }) {
  const visual = (
    <span
      className={styles.thumb}
      style={cert.hue ? { "--hue": cert.hue } : undefined}
    >
      {cert.image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className={styles.thumbImg}
          src={cert.image}
          alt={`${cert.title} certificate`}
          loading="lazy"
        />
      ) : (
        <span className={styles.thumbPlaceholder} aria-hidden="true">
          <AwardIcon />
        </span>
      )}
      {cert.href && (
        <span className={styles.view} aria-hidden="true">
          View credential
          <svg viewBox="0 0 24 24" width="0.8em" height="0.8em">
            <path
              d="M7 17 17 7M9 7h8v8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
      )}
    </span>
  );

  const body = (
    <span className={styles.cardBody}>
      <span className={styles.certTitle}>{cert.title}</span>
      <span className={styles.certMeta}>
        {cert.issuer}
        <span className={styles.dot}>·</span>
        {cert.date}
      </span>
    </span>
  );

  if (cert.href) {
    return (
      <a
        className={styles.card}
        href={cert.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {visual}
        {body}
      </a>
    );
  }
  return (
    <div className={styles.card}>
      {visual}
      {body}
    </div>
  );
}

export default function Certificates() {
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
      q("[data-reveal]").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: "power3.out",
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="certificates"
      ref={rootRef}
      className={styles.certificates}
      aria-label="Certificates and achievements"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            <span className={styles.eyebrowDot} />
            Certificates &amp; Achievements
          </p>
          <h2 className={styles.title} data-reveal>
            Proof of the work.
          </h2>
        </header>

        <div className={styles.grid}>
          {CERTIFICATES.map((cert, i) => (
            <div key={i} className={styles.cell} data-reveal>
              <Card cert={cert} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
