import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import MusicDecor from './MusicDecor.jsx'

const EVENTS = [
  { id: 'activity-1', status: 'upcoming', tag: 'Activity', title: 'To be announced', date: 'To be determined', place: 'To be determined', entry: 'To be determined', text: 'Activity details will be announced soon.' },
  { id: 'activity-2', status: 'upcoming', tag: 'Activity', title: 'To be announced', date: 'To be determined', place: 'To be determined', entry: 'To be determined', text: 'Activity details will be announced soon.' },
  { id: 'activity-3', status: 'upcoming', tag: 'Activity', title: 'To be announced', date: 'To be determined', place: 'To be determined', entry: 'To be determined', text: 'Activity details will be announced soon.' },
  { id: 'activity-4', status: 'upcoming', tag: 'Activity', title: 'To be announced', date: 'To be determined', place: 'To be determined', entry: 'To be determined', text: 'Activity details will be announced soon.' },
]

export default function Events() {
  const { t } = useLanguage()
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.8', 'end 0.55'],
  })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="events" className="relative z-[5] -mt-10 scroll-mt-20 overflow-hidden rounded-t-[3rem] bg-parchment py-24 sm:py-32">
      <MusicDecor preset="light" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa">{t("On Stage")}</p>
          <h2 className="font-display text-4xl font-semibold text-mocha sm:text-5xl">{t("Performances & ")}<span className="italic text-gold-ink">{t("Events")}</span>
          </h2>
          <p className="mt-5 text-cocoa">{t("University fests, seasonal concerts, acoustic nights, and open-mic jams — the ETERNOTES calendar never goes quiet for long.")}</p>
        </motion.div>

        {/* Timeline — the champagne line draws itself as you scroll */}
        <div ref={timelineRef} className="relative mx-auto mt-16 max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px bg-cocoa/20 sm:left-1/2"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineProgress }}
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-champagne via-champagne to-cocoa sm:left-1/2"
          />
          <ol>
            {EVENTS.map((event, i) => (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                  i > 0 ? 'mt-10 sm:-mt-24' : ''
                } ${
                  i % 2 === 0
                    ? 'sm:pr-10 sm:text-right'
                    : 'sm:ml-auto sm:pl-10'
                }`}
              >
                {/* Timeline node */}
                <span
                  aria-hidden="true"
                  className={`absolute top-6 grid size-8 -translate-x-1/2 place-items-center rounded-full border-2 left-4 ${
                    event.status === 'upcoming'
                      ? 'border-champagne bg-mocha'
                      : 'border-cocoa/50 bg-sand'
                  } sm:left-auto ${
                    i % 2 === 0
                      ? 'sm:-right-10 sm:translate-x-1/2'
                      : 'sm:-left-10 sm:-translate-x-1/2'
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      event.status === 'upcoming' ? 'bg-champagne' : 'bg-cocoa'
                    }`}
                  />
                </span>

                <article className="rounded-2xl border border-sand bg-ivory p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-mocha/10">
                  <div
                    className={`flex flex-wrap items-center gap-2 ${
                      i % 2 === 0 ? 'sm:justify-end' : ''
                    }`}
                  >
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        event.status === 'upcoming'
                          ? 'bg-mocha text-champagne'
                          : 'bg-sand text-cocoa'
                      }`}
                    >
                      {t(event.status === 'upcoming' ? 'Upcoming' : 'Past')}
                    </span>
                    <span className="rounded-full border border-sand px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cocoa">
                      {t(event.tag)}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-semibold text-mocha">
                    {t(event.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa">{t(event.text)}</p>

                  <dl
                    className={`mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-cocoa ${
                      i % 2 === 0 ? 'sm:justify-end' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{t("Date")}</dt>
                      <CalendarDays size={14} className="text-champagne" aria-hidden="true" />
                      <dd>{t(event.date)}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{t("Location")}</dt>
                      <MapPin size={14} className="text-champagne" aria-hidden="true" />
                      <dd>{t(event.place)}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{t("Entry")}</dt>
                      <Ticket size={14} className="text-champagne" aria-hidden="true" />
                      <dd>{t(event.entry)}</dd>
                    </div>
                  </dl>
                </article>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
