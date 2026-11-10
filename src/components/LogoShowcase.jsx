import { useLanguage } from '../i18n/LanguageContext.jsx'
import { motion } from 'framer-motion'

/**
 * The animated emblem section — the official ETERNOTES monogram
 * (360° rotating GIF) presented as a brand moment between the hero
 * and the club story.
 */
export default function LogoShowcase() {
  const { t } = useLanguage()
  return (
    <section
      aria-label={t("ETERNOTES emblem")}
      className="relative overflow-hidden bg-ivory py-20 sm:py-28"
    >
      {/* Soft champagne halo behind the emblem */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/25 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Thin champagne ring framing the spinning monogram */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-full border border-champagne/40 sm:-inset-12"
          />
          <div
            aria-hidden="true"
            className="absolute -inset-14 rounded-full border border-sand sm:-inset-20"
          />
          <img
            src="/logo-360.gif"
            alt={t("ETERNOTES monogram — a serif E wrapped in a rotating musical stave ribbon")}
            width={376}
            height={617}
            loading="lazy"
            className="relative h-64 w-auto drop-shadow-[0_18px_30px_rgba(73,52,46,0.25)] sm:h-80"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-12 text-xs font-semibold uppercase tracking-[0.3em] text-cocoa"
        >{t("The Emblem of Eternotes")}</motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-3 max-w-md font-display text-xl italic leading-relaxed text-mocha/80"
        >{t("“One letter, one note, one endless stave — music that never stops turning.”")}</motion.p>
      </div>
    </section>
  )
}
