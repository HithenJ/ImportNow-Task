export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="flag-cn" viewBox="0 0 30 20">
          <rect width="30" height="20" fill="#de2910" />
          <path fill="#ffde00" d="M5 3l1.18 3.6h3.8l-3.07 2.23 1.17 3.6L5 10.2l-3.08 2.23 1.18-3.6L.02 6.6h3.8z" />
          <circle cx="10.5" cy="2.5" r=".9" fill="#ffde00" />
          <circle cx="12.5" cy="4.6" r=".9" fill="#ffde00" />
          <circle cx="12.5" cy="7.6" r=".9" fill="#ffde00" />
          <circle cx="10.5" cy="9.6" r=".9" fill="#ffde00" />
        </symbol>
        <symbol id="flag-in" viewBox="0 0 30 20">
          <rect width="30" height="20" fill="#fff" />
          <rect width="30" height="6.67" fill="#ff9933" />
          <rect y="13.33" width="30" height="6.67" fill="#138808" />
          <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth=".7" />
          <circle cx="15" cy="10" r=".6" fill="#000080" />
        </symbol>
        <symbol id="logo-o" viewBox="0 0 24 24">
          <path d="M8.2 3.1A9.5 9.5 0 1 0 15.8 3.1" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="butt" />
          <path d="M12 1.5v10.2M7.6 8l4.4 4.6L16.4 8" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="miter" />
        </symbol>
        <symbol id="i-ship" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 17l1.6 3.2c.2.4.6.8 1.1.8h12.6c.5 0 .9-.3 1.1-.8L21 17H3zM5 17V12h14v5M8 12V8h8v4M11 8V4h3v4M2 22c1.5-.8 3-.8 4.5 0s3 .8 4.5 0 3-.8 4.5 0 3 .8 4.5 0" />
        </symbol>
      </defs>
    </svg>
  )
}

export function Logo({ label = false }: { label?: boolean }) {
  return (
    <a href="#home" className="logo" aria-label={label ? 'ImportNow home' : undefined}>
      IMP<svg><use href="#logo-o" /></svg>RTNOW
    </a>
  )
}

export function Flag({ code }: { code: 'cn' | 'in' }) {
  return (
    <svg className="flag">
      <use href={`#flag-${code}`} />
    </svg>
  )
}
