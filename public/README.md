# Hero media assets

The cinematic hero in `components/VideoIntro` is built around a talking-head
video. Drop your files here:

- `hero.mp4`        — the primary talking-head video (required).
                      Used twice: a sharp foreground layer and a blurred
                      ambient backplate. Encode H.264/MP4, ideally 1080p,
                      a tight loop, ~8–20s, no baked-in audio bars.
- `hero-poster.jpg` — first-frame poster shown before the video paints
                      (optional but recommended for a clean first paint).

The page renders fine without these (it falls back to the dark warm grade),
but the experience is designed around `hero.mp4`.

To use different filenames, pass props to <VideoIntro videoSrc="..." poster="..." />.

## About section

- `about-portrait.jpg` — portrait for the About section (optional).
                         Falls back to a warm gradient placeholder if absent.
                         Recommended ~4:5 portrait crop.
