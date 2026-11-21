import { mobileLinks } from '../../data/content'

export function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <div className={`mobile-menu${open ? ' open' : ''}`} id="mmenu">
      {mobileLinks.map((link) => (
        <a key={link.href + link.label} href={link.href} onClick={onNavigate}>
          {link.label}
        </a>
      ))}
    </div>
  )
}
