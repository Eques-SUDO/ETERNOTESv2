import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Guitar, BookOpen, SlidersHorizontal, Mic2, Piano, AudioWaveform, Disc3, Users, Music } from 'lucide-react'
import MusicDecor from './MusicDecor.jsx'

/* Pointer-tracked 3D tilt — springs back flat on leave. */
function TiltCard({ children, className, ...motionProps }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 18 })
  const sry = useSpring(ry, { stiffness: 160, damping: 18 })

  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 7)
    rx.set(-py * 7)
  }
  const onMouseLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.article>
  )
}

const WORKSHOPS = [
  {
    icon: BookOpen,
    accent: Music,
    title: 'Music Theory Classes',
    tagline: 'Understand the music',
    text: 'Build your understanding of musical notation, rhythm, and harmony to support your playing and singing.',
    items: ['Reading Music', 'Rhythm & Harmony'],
  },
  {
    icon: Piano,
    accent: Music,
    title: 'Piano Lessons',
    tagline: 'Learn at the keyboard',
    text: 'Develop your piano playing through technique, chords, and musical practice.',
    items: ['Piano Technique', 'Chords & Melodies'],
  },
  {
    icon: Guitar,
    accent: Music,
    title: 'Guitar Lessons',
    tagline: 'Find your sound on guitar',
    text: 'Explore guitar technique, chord progressions, and accompaniment as you develop your playing.',
    items: ['Guitar Technique', 'Chords & Accompaniment'],
  },
  {
    icon: SlidersHorizontal,
    accent: AudioWaveform,
    title: 'Music Production Lessons',
    tagline: 'Turn ideas into tracks',
    text: 'Discover how to create and shape music, from your first musical ideas to arranging and mixing a track.',
    items: ['Music Creation & Arrangement', 'Mixing Basics'],
  },
  {
    icon: Disc3,
    accent: AudioWaveform,
    title: 'DJing Lessons',
    tagline: 'Build your mix',
    text: 'Learn to select tracks, match beats, and create smooth transitions for a DJ set.',
    items: ['Track Selection & Beatmatching', 'Transitions & DJ Sets'],
  },
  {
    icon: Users,
    accent: Mic2,
    title: 'Choir Sessions',
    tagline: 'Bring your voices together',
    text: 'Sing together, develop your ear, and explore vocal harmonies with the club choir.',
    items: ['Group Singing', 'Vocal Harmony'],
  },
]

export default function Ensembles() {
  const { t } = useLanguage()
  return (
    <section id="ensembles" className="relative z-[4] -mt-10 scroll-mt-20 overflow-hidden rounded-t-[3rem] bg-ivory py-24 sm:py-32">
      <MusicDecor preset="light" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa">{t("Learn & Play Together")}</p>
          <h2 className="font-display text-4xl font-semibold text-mocha sm:text-5xl">{t("Workshops & ")}<span className="italic text-gold-ink">{t("Sessions")}</span>
          </h2>
          <p className="mt-5 text-cocoa">{t("Explore music theory, piano, guitar, music production, DJing, and choir. Find a session that matches your interests.")}</p>
        </motion.div>

        <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {WORKSHOPS.map((workshop, i) => (
            <TiltCard
              key={workshop.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.12 }}
              className="group relative overflow-hidden rounded-3xl border border-sand bg-ivory p-8 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-cocoa/50 hover:shadow-xl hover:shadow-mocha/10"
            >
              {/* Warm hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-champagne/0 blur-3xl transition-colors duration-500 group-hover:bg-champagne/25"
              />

              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid size-14 place-items-center rounded-2xl bg-mocha text-champagne shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <workshop.icon size={26} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <workshop.accent
                    size={22}
                    strokeWidth={1.5}
                    className="text-cocoa/50 transition-colors duration-300 group-hover:text-champagne"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="font-display text-2xl font-semibold text-mocha">
                  {t(workshop.title)}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-gold-ink">
                  {t(workshop.tagline)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-cocoa">{t(workshop.text)}</p>

                <ul className="mt-6 space-y-2.5 border-t border-sand pt-5">
                  {workshop.items.map((item) => (
                    <li key={t(item)} className="flex items-center gap-2.5 text-sm text-mocha">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-champagne transition-transform duration-300 group-hover:scale-150"
                      />
                      {t(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
