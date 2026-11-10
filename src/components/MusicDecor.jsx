import { Guitar, Piano, Drum, Mic2, Music, AudioWaveform } from 'lucide-react'

/**
 * Decorative floating music glyphs & instrument icons for section
 * backgrounds. Deliberately cheap: a few absolutely-positioned SVGs
 * animated with CSS transforms only (compositor-friendly, no JS per
 * frame, no network requests). Hidden from screen readers.
 *
 * presets: "hero" (ivory, denser) · "light" (ivory sections)
 *          · "dark" (mocha sections, champagne tint)
 */
const PRESETS = {
  hero: [
    { icon: Guitar, size: 44, style: { left: '5%', top: '20%' }, dur: 19, delay: 0, tilt: '-rotate-12' },
    { glyph: '♫', cls: 'text-4xl', style: { left: '9%', bottom: '24%' }, dur: 15, delay: 2 },
    { icon: Piano, size: 38, style: { right: '8%', top: '12%' }, dur: 17, delay: 1, tilt: 'rotate-6' },
    { glyph: '♪', cls: 'text-3xl', style: { left: '45%', top: '13%' }, dur: 13, delay: 4 },
    { icon: Drum, size: 40, style: { right: '3%', bottom: '18%' }, dur: 21, delay: 3, tilt: 'rotate-12' },
    { glyph: '♬', cls: 'text-5xl', style: { right: '30%', bottom: '8%' }, dur: 16, delay: 1.5 },
  ],
  light: [
    { glyph: '♩', cls: 'text-5xl', style: { left: '3%', top: '24%' }, dur: 18, delay: 0 },
    { icon: Music, size: 34, style: { right: '5%', top: '16%' }, dur: 14, delay: 2, tilt: '-rotate-6' },
    { glyph: '♬', cls: 'text-4xl', style: { left: '8%', bottom: '14%' }, dur: 16, delay: 3.5 },
    { icon: Guitar, size: 40, style: { right: '7%', bottom: '20%' }, dur: 20, delay: 1, tilt: 'rotate-12' },
  ],
  dark: [
    { glyph: '♪', cls: 'text-5xl', style: { left: '5%', top: '18%' }, dur: 17, delay: 0 },
    { icon: Mic2, size: 36, style: { right: '6%', top: '28%' }, dur: 15, delay: 2.5, tilt: 'rotate-6' },
    { glyph: '♫', cls: 'text-4xl', style: { right: '12%', bottom: '14%' }, dur: 19, delay: 1 },
    { icon: AudioWaveform, size: 40, style: { left: '9%', bottom: '20%' }, dur: 14, delay: 3, tilt: '-rotate-6' },
  ],
}

export default function MusicDecor({ preset = 'light' }) {
  const items = PRESETS[preset]
  const tone = preset === 'dark' ? 'text-champagne/10' : 'text-mocha/[0.07]'

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item, i) => (
        <span
          key={i}
          className={`float-note absolute ${tone} ${item.tilt ?? ''} ${item.cls ?? ''} ${
            item.glyph ? 'font-display leading-none' : ''
          }`}
          style={{
            ...item.style,
            '--dur': `${item.dur}s`,
            '--delay': `${item.delay}s`,
          }}
        >
          {item.glyph ?? <item.icon size={item.size} strokeWidth={1.2} />}
        </span>
      ))}
    </div>
  )
}
