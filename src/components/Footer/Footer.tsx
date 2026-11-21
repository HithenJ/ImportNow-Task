import { footerLinks } from '../../data/content'
import { Logo } from '../Common/SvgDefs'

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ft">
          <div>
            <Logo />
            <p>End-to-end imports from China to India: sourcing, factory inspection, shipping and customs. Save time. Reduce costs.</p>
          </div>
          <div className="ft-links">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} ImportNow.in · All rights reserved.</span>
          <span className="concept">Concept design · preview prepared for ImportNow</span>
        </div>
      </div>
    </footer>
  )
}
