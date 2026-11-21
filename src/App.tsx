import { Contact } from './components/Contact/Contact'
import { SvgDefs } from './components/Common/SvgDefs'
import { WhatsAppFloat } from './components/Common/WhatsAppFloat'
import { FAQ } from './components/FAQ/FAQ'
import { Footer } from './components/Footer/Footer'
import { Hero } from './components/Hero/Hero'
import { Journey } from './components/Journey/Journey'
import { Marquee } from './components/Marquee/Marquee'
import { Header } from './components/Navigation/Header'
import { Products } from './components/Products/Products'
import { Services } from './components/Services/Services'
import { Shanghai } from './components/Shanghai/Shanghai'
import { Stories } from './components/Stories/Stories'
import { Trips } from './components/Trips/Trips'
import { Work } from './components/Work/Work'
import { useCardTilt } from './hooks/useCardTilt'
import { useScrollReveal } from './hooks/useScrollReveal'

export default function App() {
  useCardTilt()
  useScrollReveal()

  return (
    <>
      <SvgDefs />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Journey />
        <Products />
        <Shanghai />
        <Trips />
        <Work />
        <Stories />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
