import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'
import { useLanguage } from '../i18n/LanguageContext.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * Inertial smooth scrolling via Lenis, driven by GSAP's ticker so
 * ScrollTrigger animations stay perfectly in sync. Disabled for users
 * who prefer reduced motion.
 */
export default function SmoothScroll() {
  const { language } = useLanguage()

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [language])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      anchors: { offset: -88 }, // clear the fixed glass navbar
    })
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
