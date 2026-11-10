import { useLanguage } from '../i18n/LanguageContext.jsx'
import { ArrowUp } from 'lucide-react'
import { SOCIAL_PROFILES } from '../data/socialProfiles.js'

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Staff', href: '#staff' },
  { label: 'Ensembles', href: '#ensembles' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Join Us', href: '#join' },
]

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="relative overflow-hidden border-t border-cocoa/40 bg-mocha pb-6 pt-14 text-sand sm:pt-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#top" className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-ivory p-1.5 shadow-md">
                <img
                  src="/logo-mark.png"
                  alt=""
                  width={376}
                  height={617}
                  className="h-9 w-auto"
                />
              </span>
              <span className="font-display text-2xl font-semibold tracking-[0.14em] text-ivory">
                ETERNOTES
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-sand/80">{t("The official music club of the Faculty of Sciences of Rabat — Mohammed V University. Where music lives forever.")}</p>
          </div>

          <nav aria-label={t("Footer")}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-champagne">{t("Explore")}</h3>
            <ul className="space-y-2.5">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-sand/80 transition-colors hover:text-champagne"
                  >
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-champagne">{t("Follow the Sound")}</h3>
            <ul className="flex gap-3">
              {SOCIAL_PROFILES.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid size-11 place-items-center rounded-full border border-cocoa/50 text-sand/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:bg-champagne hover:text-mocha"
                  >
                    <social.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-7 text-sand/80">{t("Faculté des Sciences, Avenue Ibn Battouta,")}<br />{t("Rabat, Morocco")}</p>
          </div>
        </div>

        <div aria-hidden="true" className="relative mt-12 border-t border-champagne/20 pt-7 text-center sm:mt-16 sm:pt-10">
          <p className="footer-wordmark select-none font-display font-medium">
            ETERNOTES
          </p>
        </div>

        <div className="mt-7 flex flex-col items-center justify-between gap-5 border-t border-champagne/20 pt-6 text-center text-xs leading-relaxed text-sand/80 lg:mt-10 lg:flex-row lg:text-left">
          <p className="max-w-lg">
            © {new Date().getFullYear()}{t(" ETERNOTES · Faculty of Sciences of Rabat, Mohammed V University")}
          </p>
          <div className="flex items-center gap-5">
            <p>{t("Crafted with ")}<span className="text-champagne">♪</span>{t(" by the ETERNOTES team")}</p>
            <a
              href="#top"
              aria-label={t("Back to top")}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-cocoa/50 text-champagne transition-all duration-300 hover:-translate-y-0.5 hover:bg-champagne hover:text-mocha"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
