import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Full-width mocha manifesto band — one big parallax statement
 * bridging the hero and the club story.
 */
export default function Manifesto() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const noteY = useTransform(scrollYProgress, [0, 1], [120, -120])

  return (
    <section
      ref={ref}
      aria-label={t("ETERNOTES manifesto")}
      className="grain relative z-[2] -mt-10 overflow-hidden rounded-t-[3rem] bg-mocha py-28 sm:py-36"
    >
      {/* Drifting champagne glow + oversized parallax note */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 size-96 rounded-full bg-champagne/10 blur-3xl"
      />
      <motion.span
        aria-hidden="true"
        style={{ y: noteY }}
        className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 font-display text-[11rem] leading-none text-champagne/10 lg:block"
      >
        ♪
      </motion.span>

      <motion.div style={{ y }} className="relative mx-auto max-w-4xl px-5 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-champagne"
        >{t("The Eternotes Manifesto")}</motion.p>
        <motion.blockquote
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-3xl font-medium leading-snug text-ivory sm:text-4xl lg:text-[2.75rem]"
        >{t("We spend our days proving theorems and titrating solutions —")}{' '}
          <em className="italic text-champagne">{t("and our evenings proving that a faculty of scientists can sing.")}</em>
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-sm font-medium tracking-wide text-sand/70"
        >{t("— The members, Faculty of Sciences of Rabat")}</motion.p>
      </motion.div>
    </section>
  )
}
