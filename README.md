# Cinematic Portfolio — Yashwant Yadav

A premium, immersive one-page developer portfolio built around a cinematic
talking-head video hero. Dark *Cinematic Noir* aesthetic — warm orange
practical light, soft monitor-blue glow, film grain, and a GPU-driven bokeh
field drifting over the footage.

## Stack

- **Next.js 16** (App Router) · **React 19**
- **Three.js** — transparent shader bokeh layer (all motion in the vertex shader)
- **GSAP** + **ScrollTrigger** — entrance timeline and scroll-driven reveals
- **CSS Modules** — no UI framework; a hand-built design system

## Sections

| Section | What it does |
| --- | --- |
| **Hero** | Sticky fullscreen video — sharp foreground + blurred ambient backplate of the same clip, glassmorphism play/pause + mute controls, "Tap for sound" badge, GSAP name reveal, animated scroll cue. |
| **About** | Editorial bio with line-by-line scroll reveals, portrait frame, and a continuous skill marquee. |
| **Work** | Alternating project rows with gradient covers, scrub parallax, tech chips. |
| **Contact** | Big CTA, `mailto:` link, social pills, footer with back-to-top. |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Your assets & content

- `public/hero.mp4` — primary talking-head video (required; used as both the
  sharp foreground and the blurred backplate). Optional `public/hero-poster.jpg`
  and `public/about-portrait.jpg`. See [`public/README.md`](public/README.md).
- Editable content lives at the top of each component:
  - `components/About/About.jsx` → `LEAD`, `SKILLS`, `DETAILS`
  - `components/Work/Work.jsx` → `PROJECTS`
  - `components/Contact/Contact.jsx` → `EMAIL`, `SOCIALS`

## Architecture

```
app/
  layout.js            fonts (Bricolage Grotesque · JetBrains Mono · Geist) + metadata
  globals.css          design tokens, reset, film grain
  page.js              composes the four sections
components/
  VideoIntro/          hero (video stack, controls, GSAP entrance)
  CinematicLayer/      Three.js bokeh (shader motion, parallax, disposal)
  About/  Work/  Contact/
```

Built with care for performance and accessibility: capped pixel ratio, rAF
pauses on tab-hide, full Three.js resource disposal on unmount, and a
`prefers-reduced-motion` path throughout.
