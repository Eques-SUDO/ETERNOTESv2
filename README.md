# ETERNOTESv2

Presentation website for ETERNOTES, the music club of the Faculty of Sciences
of Rabat (Mohammed V University). Built with Vite + React, Tailwind CSS v4,
React Three Fiber, Framer Motion, and GSAP.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

## Languages

Use the **EN / FR** buttons in the navigation to switch between English and
French. The selection is saved in the visitor's browser; English is the default.
Switching languages preserves form entries and updates page text, validation
messages, accessibility labels, the document language, title, and description.

French translations live in `src/i18n/translations.js`. Dropdown labels are
translated while their submitted values remain compatible with the deployed
Apps Script, so no script update is required for language switching.

Run `npm run test:i18n` to check translation coverage, rendered pages, form
validation, saved preferences, and Google Sheets-compatible option values.

## Structure

```
index.html                     Fonts (Cormorant Garamond + Plus Jakarta Sans), meta
public/
  logo-360.gif                 Official animated monogram (360° rotation)
  logo-mark.png                Static transparent monogram (navbar, footer, favicon)
src/
  index.css                    Tailwind v4 @theme — brand palette & utilities
  App.jsx                      Page assembly
  components/
    Navbar.jsx                 Sticky glassmorphism nav + mobile menu
    Hero.jsx                   Split hero with 3D canvas + dual CTAs
    SmoothScroll.jsx           Lenis inertial scrolling, synced with ScrollTrigger
    Marquee.jsx                GSAP ScrollTrigger scrubbed text ribbon
    Manifesto.jsx              Full-width parallax statement band
    LogoShowcase.jsx           Unused: animated emblem section (rotating logo GIF)
    About.jsx                  Pillars + animated stat counters
    Staff.jsx                  Board/staff cards (swap `photo: null` for real portraits)
    Ensembles.jsx              Musical branches card grid (pointer-tilt cards)
    Events.jsx                 Alternating timeline of performances
    Gallery.jsx                Masonry grid + floating audio player widget
    JoinForm.jsx               Validated audition sign-up form (Google Sheets)
    Footer.jsx                 Affiliation, nav, socials
    three/
      EternotesLogo3D.jsx      Hero scene: the real logo traced into 3D (vanilla Three.js)
      HeroScene.jsx            Unused fallback: R3F canvas wrapper for the procedural artifact
      EternotesArtifact.jsx    Unused fallback: procedural golden artifact (no .gltf needed)
```

## Brand palette

| Token     | Hex       | Role                          |
| --------- | --------- | ----------------------------- |
| mocha     | `#49342E` | Primary dark                  |
| cocoa     | `#88685B` | Secondary dark / accents      |
| champagne | `#C6A879` | Gold highlights / 3D emissive |
| gold-ink  | `#79592E` | Readable gold text on light backgrounds |
| parchment | `#F4ECDF` | Alternating light sections |
| sand      | `#E9DCCB` | Subtle surfaces / borders     |
| ivory     | `#FAF5EE` | Background / light text       |

Use them anywhere as Tailwind classes: `bg-mocha`, `text-champagne`, `border-sand`, …

## 3D scene notes

The hero renders `EternotesLogo3D` — the official mark traced into 3D:
a flat gradient "E", a golden stave ribbon wound around it, two metallic
notes, the star, a halo, and gold dust, with a staged draw-on intro.

- Vanilla Three.js with a code-built PMREM studio environment for the gold.
- Pointer parallax with damping (pass `interactive={false}` to lock it —
  the Hero does this automatically on `pointer: coarse` touch devices).
- Respects `prefers-reduced-motion` (skips the intro and idle sway).
- Lazy-loaded behind `Suspense` with a CSS shimmer skeleton.
- `HeroScene.jsx` / `EternotesArtifact.jsx` remain as an unused R3F
  procedural fallback — swap the import in `Hero.jsx` to restore it.

## Swapping in real content

- **Gallery**: replace the gradient tiles in `Gallery.jsx` (`TILES`) with real
  `<img>` elements — the CSS-columns masonry adapts to any image height.
- **Audio player**: the widget sweeps a demo progress bar; wire it to an
  `<audio>` element once rehearsal tracks exist.
- **Join form / Google Sheets**: follow the [Google Sheets setup guide](./google-apps-script/README.md).
  The script stores the submission time, name, department, instrument/vocal role,
  experience, and required phone number in a private `Submissions` tab.
  Set `VITE_GOOGLE_APPS_SCRIPT_URL` in `.env.local` after deploying the script.
- **Socials**: the official Instagram and TikTok profiles are shared by the footer
  and gallery through `src/data/socialProfiles.js`.
