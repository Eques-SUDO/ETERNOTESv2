import { useLanguage } from '../i18n/LanguageContext.jsx'
import { motion } from 'framer-motion'
import MusicDecor from './MusicDecor.jsx'

/**
 * Club board & staff. `photo` is null until real portraits exist —
 * drop image files in /public/staff/ and set e.g. photo: '/staff/yasmine.jpg'
 * and the card switches from the initials medallion to the picture.
 */
const STAFF = [
  {
    name: 'Faris Moughamir',
    role: 'President',
    photo: '/staff/faris.jpeg',
  },
  {
    name: 'Hiba El Khourani',
    role: 'Vice President (Internal)',
    photo: '/staff/hiba.jpeg',
  },
  {
    name: 'Mehdi Rhzioual',
    role: 'Vice President (External)',
    photo: '/staff/mehdi.jpeg',
  },
  {
    name: 'Aicha Guennouni',
    role: 'VP of Administration',
    photo: '/staff/aicha.jpeg',
  },
  {
    name: 'Tarek Kharraz',
    role: 'Instruments Manager',
    photo: '/staff/tarek.jpeg',
  },
  {
    name: 'Ashraf Elouazzani',
    role: 'Counsellor',
    photo: '/staff/Ashraf.jpeg',
  },
  {
    name: 'Doha Akbour',
    role: 'HR Manager',
    photo: '/staff/Doha.jpeg',
  },
  {
    name: 'Sami Sebbata',
    role: 'Visual Director',
    photo: '/staff/sami.jpeg',
  },
  {
    name: 'Riham Ait Elarab',
    role: 'Vocal Coach',
    photo: '/staff/riham.jpeg',
  },
]

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

export default function Staff() {
  const { t } = useLanguage()
  return (
    <section
      id="staff"
      className="relative z-[3] -mt-10 scroll-mt-20 overflow-hidden rounded-t-[3rem] bg-parchment py-24 sm:py-32"
    >
      <MusicDecor preset="light" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa">{t("The People Behind the Music")}</p>
          <h2 className="font-display text-4xl font-semibold text-mocha sm:text-5xl">{t("Meet the ")}<span className="italic text-gold-ink">{t("Team")}</span>
          </h2>
          <p className="mt-5 text-cocoa">{t("Students first, musicians always — the board that keeps ETERNOTES rehearsing, performing, and growing.")}</p>
        </motion.div>

        <ul className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {STAFF.map((member, i) => (
            <motion.li
              key={member.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-sand bg-ivory p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-champagne/60 hover:shadow-xl hover:shadow-mocha/10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-champagne/0 blur-3xl transition-colors duration-500 group-hover:bg-champagne/25"
              />

              {/* Portrait — image when available, initials medallion until then */}
              <div className="relative mx-auto size-28">
                <div className="absolute -inset-2 rounded-full border border-champagne/40 transition-transform duration-500 group-hover:rotate-45" />
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={t('Portrait of {name}', { name: member.name })}
                    className="size-28 rounded-full object-cover shadow-md"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid size-28 place-items-center rounded-full bg-mocha font-display text-3xl font-semibold text-champagne shadow-md">
                    {initials(member.name)}
                  </div>
                )}
              </div>

              <h3 className="mt-6 font-display text-2xl font-semibold text-mocha">
                {member.name}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-gold-ink">
                {t(member.role)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
