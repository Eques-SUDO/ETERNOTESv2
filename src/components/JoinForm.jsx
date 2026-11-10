import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import MusicDecor from './MusicDecor.jsx'

const INITIAL = {
  fullName: '',
  department: '',
  otherDepartment: '',
  role: '',
  experience: '',
  phone: '',
}

const DEPARTMENTS = [
  'Biology', 'Chemistry', 'Physics', 'Mathematics',
  'Computer Science', 'Geology', 'Other',
]

const ROLES = [
  'Vocals / Choir', 'Guitar (Acoustic)', 'Guitar (Electric)', 'Bass',
  'Piano / Keys', 'Violin / Strings', 'Drums / Percussion',
  'Production / Sound Engineering', 'Other',
]

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional']

function validate(values) {
  const errors = {}
  if (values.fullName.trim().length < 3 || values.fullName.trim().length > 100) {
    errors.fullName = 'Please enter your full name (3–100 characters).'
  }
  if (!values.department) {
    errors.department = 'Select your department or major.'
  }
  if (values.department === 'Other' && (
    !values.otherDepartment.trim() || values.otherDepartment.trim().length > 100
  )) {
    errors.otherDepartment = 'Enter your field of study (up to 100 characters).'
  }
  if (!values.role) {
    errors.role = 'Tell us your instrument or vocal role.'
  }
  if (!values.experience) {
    errors.experience = 'Pick the level that fits you best.'
  }
  const phone = values.phone.trim()
  const phoneDigits = phone.replace(/\D/g, '')
  if (
    phone.length > 30 || !/^\+?[\d\s().-]+$/.test(phone) ||
    phoneDigits.length < 7 || phoneDigits.length > 15
  ) {
    errors.phone = 'Enter a valid phone number with 7–15 digits, including your country code if needed.'
  }
  return errors
}

function Field({ label, error, children, htmlFor }) {
  const { t } = useLanguage()
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-mocha">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
            role="alert"
          >
            <AlertCircle size={13} aria-hidden="true" /> {t(error)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-ivory px-4 py-3 text-sm text-mocha placeholder:text-cocoa/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-champagne/60 ${
    hasError ? 'border-red-400' : 'border-sand focus:border-champagne'
  }`

export default function JoinForm() {
  const { t } = useLanguage()
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setSubmissionError('')
    if (Object.keys(errs).length > 0) return

    const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim()
    if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
      setSubmissionError('The form is not connected yet. Please try again later.')
      return
    }

    setSubmitting(true)
    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(values),
        credentials: 'omit',
        signal: AbortSignal.timeout(30000),
      })
      setSubmitted(true)
    } catch {
      setSubmissionError('We couldn’t send your request. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="join" className="relative z-[7] -mt-10 scroll-mt-20 overflow-hidden rounded-t-[3rem] bg-mocha py-24 sm:py-32">
      <MusicDecor preset="dark" />
      {/* Stage glow behind the form card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-[8%] size-96 rounded-full bg-champagne/15 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-champagne">{t("Auditions Open")}</p>
          <h2 className="font-display text-4xl font-semibold text-ivory sm:text-5xl">{t("Join the ")}<span className="italic text-champagne">{t("Club")}</span>
          </h2>
          <p className="mt-6 leading-relaxed text-sand/90">{t("Whether you've toured with a conservatory or only ever sung in the shower, there's a seat for you. Fill in the form and we'll invite you to the next open jam — no pressure, no gatekeeping, just music.")}</p>
          <ul className="mt-8 space-y-3 text-sm text-sand/80">
            {[
              'Auditions are friendly 10-minute sessions, not exams.',
              'Production members need curiosity, not gear.',
              'Rehearsals fit around the FSR exam calendar.',
            ].map((line) => (
              <li key={t(line)} className="flex items-start gap-2.5">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-champagne" aria-hidden="true" />
                {t(line)}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-ivory p-7 shadow-2xl shadow-black/20 ring-1 ring-champagne/30 sm:p-9"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <span className="mb-5 grid size-16 place-items-center rounded-full bg-champagne/20 text-gold-ink">
                <CheckCircle2 size={32} aria-hidden="true" />
              </span>
              <h3 className="font-display text-3xl font-semibold text-mocha">{t("Request sent")}</h3>
              <p className="mt-3 max-w-sm text-sm text-cocoa">{t("Thanks, ")}{values.fullName.trim().split(/\s+/)[0]}{t(". Your audition request has been sent. Receipt is subject to confirmation by the club.")}</p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <Field label={t("Full Name")} htmlFor="fullName" error={errors.fullName}>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder={t("e.g. Salma Bennani")}
                  value={values.fullName}
                  onChange={set('fullName')}
                  className={inputClass(errors.fullName)}
                  aria-invalid={Boolean(errors.fullName)}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("Major / Department")} htmlFor="department" error={errors.department}>
                  <select
                    id="department"
                    value={values.department}
                    onChange={set('department')}
                    className={inputClass(errors.department)}
                    aria-invalid={Boolean(errors.department)}
                  >
                    <option value="">{t("Select…")}</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{t(d)}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t("Instrument / Vocal Role")} htmlFor="role" error={errors.role}>
                  <select
                    id="role"
                    value={values.role}
                    onChange={set('role')}
                    className={inputClass(errors.role)}
                    aria-invalid={Boolean(errors.role)}
                  >
                    <option value="">{t("Select…")}</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{t(r)}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {values.department === 'Other' && (
                <Field label={t("Your Field of Study")} htmlFor="otherDepartment" error={errors.otherDepartment}>
                  <input
                    id="otherDepartment"
                    type="text"
                    required
                    maxLength={100}
                    placeholder={t("e.g. Economics, Medicine, Architecture")}
                    value={values.otherDepartment}
                    onChange={set('otherDepartment')}
                    className={inputClass(errors.otherDepartment)}
                    aria-invalid={Boolean(errors.otherDepartment)}
                  />
                </Field>
              )}

              <Field label={t("Experience Level")} htmlFor="experience" error={errors.experience}>
                <div
                  id="experience"
                  role="radiogroup"
                  aria-label={t("Experience level")}
                  className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
                >
                  {LEVELS.map((level) => (
                    <button
                      key={t(level)}
                      type="button"
                      role="radio"
                      aria-checked={values.experience === level}
                      onClick={() => {
                        setValues((v) => ({ ...v, experience: level }))
                        setErrors((prev) => ({ ...prev, experience: undefined }))
                      }}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                        values.experience === level
                          ? 'border-mocha bg-mocha text-champagne shadow-md'
                          : 'border-sand bg-ivory text-cocoa hover:border-cocoa'
                      }`}
                    >
                      {t(level)}
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label={t("Phone Number")}
                htmlFor="phone"
                error={errors.phone}
              >
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  maxLength={30}
                  placeholder={t("e.g. +212 612 345 678")}
                  value={values.phone}
                  onChange={set('phone')}
                  className={inputClass(errors.phone)}
                  aria-invalid={Boolean(errors.phone)}
                />
              </Field>

              {submissionError && (
                <p className="text-sm font-medium text-red-700" role="alert">
                  {t(submissionError)}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-mocha px-7 py-4 font-semibold text-champagne shadow-lg shadow-mocha/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-mocha disabled:cursor-wait disabled:opacity-70"
              >
                {t(submitting ? 'Sending…' : 'Request an Audition')}
                <Send
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
