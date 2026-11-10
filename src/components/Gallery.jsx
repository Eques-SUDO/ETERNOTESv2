import { SOCIAL_PROFILES } from '../data/socialProfiles.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Camera, Music, Mic2, Guitar, Piano, Drum, Users, AudioWaveform,
  Play, Pause, SkipForward, Volume2,
} from 'lucide-react'

/**
 * Placeholder tiles for the masonry grid. Swap each tile for a real
 * <img src="..." alt="..."> once club photos are available — the masonry
 * layout (CSS columns) adapts to any image height automatically.
 */
const TILES = [
  { icon: Mic2, label: 'To be announced', tag: 'To be determined', h: 'h-64', tone: 'from-mocha to-cocoa' },
  { icon: Guitar, label: 'Acoustic rehearsal, Bloc B workspace', tag: 'Rehearsal', h: 'h-44', tone: 'from-cocoa to-champagne' },
  { icon: Drum, label: 'To be announced', tag: 'To be determined', h: 'h-52', tone: 'from-champagne to-cocoa' },
  { icon: Piano, label: 'Piano ensemble open studio', tag: 'Studio', h: 'h-72', tone: 'from-mocha via-cocoa to-champagne' },
  { icon: Users, label: 'Open-mic crowd, Grand Amphi', tag: 'Open Mic', h: 'h-48', tone: 'from-cocoa to-mocha' },
  { icon: AudioWaveform, label: 'Mixing session in the booth', tag: 'Production', h: 'h-60', tone: 'from-champagne to-mocha' },
  { icon: Camera, label: 'To be announced', tag: 'Backstage', h: 'h-44', tone: 'from-mocha to-champagne' },
  { icon: Music, label: 'Strings sectional rehearsal', tag: 'Rehearsal', h: 'h-56', tone: 'from-cocoa via-champagne to-sand' },
]

const TRACKS = [
  { title: 'To be announced', length: '3:42' },
  { title: 'To be announced', length: '4:15' },
  { title: 'To be announced', length: '2:58' },
]

function AudioPlayer() {
  const { t } = useLanguage()
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef()

  // Demo progress sweep — wire to an <audio> element once real tracks exist.
  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      setProgress((p) => {
        const next = p + dt / 30
        return next >= 1 ? 0 : next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, track])

  const nextTrack = () => {
    setTrack((t) => (t + 1) % TRACKS.length)
    setProgress(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto mt-12 flex max-w-xl items-center gap-4 rounded-2xl border border-cocoa/40 bg-mocha p-4 shadow-xl shadow-mocha/20 sm:gap-5 sm:p-5"
    >
      <button
        type="button"
        onClick={() => setPlaying((v) => !v)}
        aria-label={t(playing ? 'Pause sample track' : 'Play sample track')}
        className="grid size-12 shrink-0 place-items-center rounded-full bg-champagne text-mocha shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-sm font-semibold text-ivory">{t(TRACKS[track].title)}</p>
          <span className="shrink-0 text-xs text-sand/70">{TRACKS[track].length}</span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-cocoa/50"
          role="progressbar"
          aria-label={t("Track progress")}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-champagne transition-[width] duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] uppercase tracking-wider text-sand/60">{t("Club rehearsal snippets · demo widget")}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-sand/80">
        <button
          type="button"
          onClick={nextTrack}
          aria-label={t("Next track")}
          className="grid size-9 place-items-center rounded-full transition-colors hover:bg-cocoa/50 hover:text-ivory"
        >
          <SkipForward size={17} />
        </button>
        <Volume2 size={17} className="hidden sm:block" aria-hidden="true" />
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const { t } = useLanguage()
  return (
    <section id="gallery" className="relative z-[6] -mt-10 scroll-mt-20 overflow-hidden rounded-t-[3rem] bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa">{t("Community & Media")}</p>
          <h2 className="font-display text-4xl font-semibold text-mocha sm:text-5xl">{t("The ")}<span className="italic text-gold-ink">{t("Gallery")}</span>
          </h2>
          <p className="mt-5 text-cocoa">{t("Stage lights, rehearsal rooms, and everything in between.")}</p>
        </motion.div>

        <div className="masonry mt-14">
          {TILES.map((tile, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`grain group relative ${tile.h} overflow-hidden rounded-2xl bg-gradient-to-br ${tile.tone} shadow-md saturate-[0.8] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-mocha/20 hover:saturate-125`}
            >
              <div className="absolute inset-0 grid place-items-center text-ivory/35 transition-transform duration-500 group-hover:scale-110">
                <tile.icon size={44} strokeWidth={1.2} aria-hidden="true" />
              </div>
              {/* Soft vignette so tiles read as moody prints */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(73,52,46,0.38)_100%)]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-mocha/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory/90 backdrop-blur-sm">
                {t(tile.tag)}
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-mocha/90 to-transparent p-4 pt-10 text-sm font-medium text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {t(tile.label)}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SOCIAL_PROFILES.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-sand px-6 py-3 text-sm font-semibold text-cocoa transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:text-mocha"
            >
              <social.icon size={16} aria-hidden="true" />
              {t(social.followLabel)}
            </a>
          ))}
        </div>

        <AudioPlayer />
      </div>
    </section>
  )
}
