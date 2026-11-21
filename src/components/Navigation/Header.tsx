import { useEffect, useState } from 'react'
import { navLinks } from '../../data/content'
import { Logo } from '../Common/SvgDefs'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap">
          <Logo label />
          <nav className="nav-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="btn btn-primary nav-cta" href="#contact">
            Get a free quote
          </a>
          <button className="burger" aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      <MobileMenu open={open} onNavigate={() => setOpen(false)} />
    </>
  )
}
