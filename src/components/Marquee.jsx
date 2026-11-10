import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WORDS = [
  'Harmony', 'Rhythm', 'Choir', 'Jam Sessions', 'Stage Nights',
  'Production', 'Acoustic', 'FSR', 'Open Mic', 'Strings',
]

/**
 * A scroll-scrubbed golden ribbon between the hero and the story —
 * GSAP ScrollTrigger drives the horizontal drift as the user scrolls.
 */
export default function Marquee() {
  const { t } = useLanguage()
  const stripRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stripRef.current,
        { xPercent: 0 },
        {
          xPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: stripRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-sand bg-champagne/15 py-5"
    >
      <div ref={stripRef} className="flex w-max items-center gap-8 whitespace-nowrap">
        {[...WORDS, ...WORDS].map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-2xl font-medium italic text-mocha/80 sm:text-3xl">
              {t(word)}
            </span>
            <span className="text-xl text-champagne">♪</span>
          </span>
        ))}
      </div>
    </div>
  )
}
