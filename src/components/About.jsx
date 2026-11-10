import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { HeartPulse, Scale, Users, Theater } from 'lucide-react'
import MusicDecor from './MusicDecor.jsx'

const PILLARS = [
  {
    icon: HeartPulse,
    title: 'Passion for Sound',
    text: 'Every member joins for one reason: music that moves. From first chords to full arrangements.',
  },
  {
    icon: Scale,
    title: 'Academic Balance',
    text: 'Rehearsals built around lab schedules and exams — music as the counterweight to the amphitheater.',
  },
  {
    icon: Users,
    title: 'Collaborative Jamming',
    text: 'Weekly open jams where biologists meet bassists and physicists find their voice.',
  },
  {
    icon: Theater,
    title: 'Stage Performance',
    text: 'From campus amphi nights to city stages — we rehearse to perform, not just to practice.',
  },
]

const STATS = [
  { value: 50, suffix: '+', label: 'Active Musicians' },
  { value: 4, prefix: '+', suffix: '', label: 'Annual Events' },
  { value: 30, suffix: '+', label: 'Jam Sessions / Year' },
  { value: 4, suffix: '', label: 'Creative Workspaces' },
]

function Counter({ value, prefix = '', suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref} className="font-display text-5xl font-semibold text-champagne sm:text-6xl">
      {prefix}{display}
      {suffix}
    </span>
  )
}

export default function About() {
  const { t } = useLanguage()
  return (
    <section id="about" className="grain relative z-[2] scroll-mt-20 overflow-hidden bg-mocha py-24 text-ivory sm:py-32">
      <MusicDecor preset="dark" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-champagne">{t("The Identity")}</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">{t("Discover ")}<span className="text-champagne">ETERNOTES</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-sand/90 sm:text-lg">{t("Founded at the Faculté des Sciences de Rabat, ETERNOTES began as a handful of students trading sheet music between lectures. Today it is the faculty's official music club — a home for choirs, bands, producers, and anyone who believes a campus of scientists deserves a soundtrack of its own.")}</p>
        </motion.div>

        {/* Pillars */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <motion.article
              key={t(pillar.title)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group rounded-2xl border border-cocoa/40 bg-ivory/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-champagne/60 hover:bg-ivory/10"
            >
              <span className="mb-5 inline-grid size-12 place-items-center rounded-xl bg-champagne/15 text-champagne transition-colors duration-300 group-hover:bg-champagne group-hover:text-mocha">
                <pillar.icon size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-semibold text-ivory">{t(pillar.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand/80">{t(pillar.text)}</p>
            </motion.article>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-cocoa/40 pt-14 text-center lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={t(stat.label)}>
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-sand/70 sm:text-sm">
                {t(stat.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
