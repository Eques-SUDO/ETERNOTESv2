import { useLanguage } from './i18n/LanguageContext.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Manifesto from './components/Manifesto.jsx'
import About from './components/About.jsx'
import Staff from './components/Staff.jsx'
import Ensembles from './components/Ensembles.jsx'
import Events from './components/Events.jsx'
import Gallery from './components/Gallery.jsx'
import JoinForm from './components/JoinForm.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-ivory text-mocha font-body">
      <SmoothScroll />
      <Navbar />

      {/* Editorial side label, desktop only */}
      <p
        aria-hidden="true"
        className="pointer-events-none fixed bottom-32 left-6 z-40 hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-cocoa/50 [writing-mode:vertical-rl] xl:block"
      >{t("Music Club · Faculty of Sciences of Rabat")}</p>

      <main>
        <Hero />
        <div className="bg-ivory pb-16">
          <Marquee />
        </div>
        <Manifesto />
        <About />
        <Staff />
        <Ensembles />
        <Events />
        <Gallery />
        <JoinForm />
      </main>
      <Footer />
    </div>
  )
}
