"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Contact.module.css";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "yadavyeshwant6166@gmail.com";
const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Deadshot1831" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yashwant-yadav-174aa12b2/",
  },
  { label: "LeetCode", href: "https://leetcode.com/u/Deadshot1831/" },
];

export default function Contact({
  email = EMAIL,
  name = "Yashwant Yadav",
  socials = SOCIALS,
}) {
  const rootRef = useRef(null);
  const year = new Date().getFullYear();

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context((self) => {
      const q = self.selector;

      if (reduced) {
        gsap.set(q(`.${styles.line}`), { yPercent: 0, opacity: 1 });
        gsap.set(q("[data-reveal]"), { opacity: 1, y: 0 });
        return;
      }

      gsap.from(q(`.${styles.line}`), {
        yPercent: 115,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q(`.${styles.cta}`)[0], start: "top 82%" },
      });

      q("[data-reveal]").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 1,
          ease: "power3.out",
          delay: (i % 2) * 0.08,
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="contact" ref={rootRef} className={styles.contact} aria-label="Contact">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.eyebrow} data-reveal>
          <span className={styles.eyebrowDot} />
          Contact
        </p>

        <h2 className={styles.cta}>
          <span className={styles.lineMask}>
            <span className={styles.line}>Let&rsquo;s build</span>
          </span>
          <span className={styles.lineMask}>
            <span className={`${styles.line} ${styles.lineAccent}`}>
              something intelligent.
            </span>
          </span>
        </h2>

        <p className={styles.intro} data-reveal>
          Have a problem worth solving with AI, computer vision or data? I&rsquo;m
          always open to new ideas, collaborations and roles where intelligent
          systems can make a real-world difference.
        </p>

        <a className={styles.email} href={`mailto:${email}`} data-reveal>
          {email}
          <span className={styles.emailUnderline} aria-hidden="true" />
        </a>

        <ul className={styles.socials} data-reveal>
          {socials.map((s) => (
            <li key={s.label}>
              <a
                className={styles.social}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
                <svg viewBox="0 0 24 24" width="0.7em" height="0.7em" aria-hidden="true">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.bar}>
          <span className={styles.copyline}>
            © {year} {name}
          </span>
          <span className={styles.built}>
            Built with Next.js · Three.js · GSAP
          </span>
          <button type="button" className={styles.top} onClick={toTop}>
            Back to top
            <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
              <path
                d="M12 19V5M6 11l6-6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
