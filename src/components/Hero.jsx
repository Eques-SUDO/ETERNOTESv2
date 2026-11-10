import { useLanguage, LanguageContext } from '../i18n/LanguageContext.jsx'
import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import MusicDecor from './MusicDecor.jsx'
const EternotesLogo3D = lazy(() => import('./three/EternotesLogo3D.jsx'))

/* If WebGL fails or the scene throws, show the static mark instead of a blank page. */
class SceneErrorBoundary extends Component {
  static contextType = LanguageContext
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.error('3D hero failed, falling back to static logo:', error)
  }
  render() {
    const { t } = this.context
    if (this.state.failed) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <img
            src="/logo-mark.png"
            alt={t("ETERNOTES monogram")}
            className="h-[70%] w-auto drop-shadow-[0_18px_30px_rgba(73,52,46,0.25)]"
          />
        </div>
      )
    }
    return this.props.children
  }
}

function SceneSkeleton() {
  const { t } = useLanguage()
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      role="status"
      aria-label={t("Loading 3D scene")}
    >
      <div className="skeleton-shimmer size-56 rounded-full opacity-70 sm:size-72" />
    </div>
  )
}

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const onChange = (e) => setIsTouch(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isTouch
}

/* CTA buttons ease toward the cursor and spring back on leave. */
function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 })

  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}

/* One headline word sliding up from behind an overflow mask. */
function RevealWord({ children, index, className = '' }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: '115%' }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.85,
          delay: 0.35 + index * 0.09,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const { t } = useLanguage()
  const isTouch = useIsTouchDevice()

  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-ivory pt-24"
    >
      {/* Warm backdrop wash + atmosphere layers */}
      <div
        aria-hidden="true"
        className="hero-backdrop pointer-events-none absolute inset-0"
      />
      <div aria-hidden="true" className="stave-lines pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 size-[32rem] rounded-full bg-champagne/20 blur-3xl"
      />
      <p
        aria-hidden="true"
        className="hero-wordmark pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[16vw] font-semibold leading-none tracking-tight"
      >
        ETERNOTES
      </p>
      <div aria-hidden="true" className="grain absolute inset-0 pointer-events-none" />
      <MusicDecor preset="hero" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-6 lg:px-8">
        {/* Copy */}
        <motion.div
          initial="hidden"
          animate="show"
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-sand bg-ivory/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa"
          >
            <Sparkles size={14} className="text-champagne" aria-hidden="true" />{t("Official Music Club · FSR")}</motion.p>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-mocha sm:text-6xl xl:text-7xl">
            <RevealWord index={0}>{t("Where")}</RevealWord>{' '}
            <RevealWord index={1}>{t("Music")}</RevealWord>
            <br />
            <RevealWord index={2}>{t("Lives")}</RevealWord>{' '}
            <RevealWord index={3} className="italic text-gold-ink drop-shadow-sm">
              <em>{t("Forever")}</em>
            </RevealWord>
          </h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cocoa sm:text-lg lg:mx-0"
          >{t("ETERNOTES is the rhythm of the Faculty of Sciences of Rabat — a collective of student musicians, singers, and producers turning lecture-hall minds into stage-ready sound.")}</motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Magnetic>
              <a
                href="#ensembles"
                className="group inline-flex items-center gap-2 rounded-full bg-mocha px-7 py-3.5 font-semibold text-champagne shadow-lg shadow-mocha/20 transition-colors duration-300 hover:bg-mocha"
              >{t("Explore Our Sound")}<ArrowDown
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-full border-2 border-champagne bg-ivory/60 px-7 py-3 font-semibold text-mocha transition-colors duration-300 hover:bg-champagne hover:text-mocha"
              >{t("Join the Club")}</a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="order-1 h-[46vh] min-h-[320px] w-full sm:h-[52vh] lg:order-2 lg:h-[70vh]"
        >
          <SceneErrorBoundary>
            <Suspense fallback={<SceneSkeleton />}>
              <EternotesLogo3D height="100%" interactive={!isTouch} />
            </Suspense>
          </SceneErrorBoundary>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        aria-label={t("Scroll to About section")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-cocoa sm:flex"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.25em]">{t("Scroll")}</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  )
}
