import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Staff', href: '#staff' },
  { label: 'Ensembles', href: '#ensembles' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Join Us', href: '#join' },
]

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav border-b border-sand/70 shadow-lg shadow-mocha/5'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Reading progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-champagne"
      />
      <nav
        aria-label={t("Primary")}
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
      >
        <a href="#top" className="group flex items-center gap-2 sm:gap-3">
          <img
            src="/logo-mark.png"
            alt=""
            width={376}
            height={617}
            className="h-9 w-auto sm:h-11 transition-transform duration-300 group-hover:-rotate-6"
          />
          <span className="font-display text-lg font-semibold tracking-[0.1em] sm:text-2xl sm:tracking-[0.18em] text-mocha">
            ETERNOTES
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 xl:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative text-sm font-medium text-cocoa transition-colors hover:text-mocha after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-champagne after:transition-all after:duration-300 hover:after:w-full"
              >
                {t(link.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <div role="group" aria-label={t('Language')} className="flex shrink-0 rounded-full border border-cocoa/30 bg-ivory/90 p-1">
            {['en', 'fr'].map((locale) => (
              <button
                key={locale}
                type="button"
                lang={locale}
                aria-label={locale === 'en' ? 'English' : 'Français'}
                aria-pressed={language === locale}
                onClick={() => setLanguage(locale)}
                className={`rounded-full px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mocha ${language === locale ? 'bg-mocha text-champagne' : 'text-cocoa hover:bg-sand'}`}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#join"
            className="hidden rounded-full bg-mocha px-5 py-2.5 text-sm font-semibold text-champagne shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-mocha hover:shadow-lg sm:inline-block"
          >{t("Audition / Join")}</a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-mocha transition-colors hover:bg-sand xl:hidden"
            aria-expanded={open}
            aria-label={t(open ? 'Close menu' : 'Open menu')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="glass-nav overflow-hidden border-t border-sand xl:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 font-medium text-mocha transition-colors hover:bg-sand"
                  >
                    {t(link.label)}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#join"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-mocha px-5 py-3 text-center font-semibold text-champagne"
                >{t("Audition / Join")}</a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
