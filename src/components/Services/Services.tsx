import { services } from '../../data/content'
import { SectionHead } from '../Common/SectionHead'

function Icon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3M8 11h6M11 8v6" />
      </svg>
    )
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M3 21V9l6 4V9l6 4V5l6 4v12H3z" />
        <path d="M7 17h2M12 17h2M17 17h1" />
      </svg>
    )
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </svg>
    )
  }
  if (index === 3) {
    return (
      <svg>
        <use href="#i-ship" />
      </svg>
    )
  }
  if (index === 4) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l5 5v13H7z" />
        <path d="M14 3v5h5M10 13h6M10 17h6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6h13v10H1zM14 10h4l4 3v3h-8z" />
      <circle cx="5.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </svg>
  )
}

export function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <SectionHead
          eyebrow="End-to-end imports"
          text="Anyone can say they import from China. What you actually need is a smooth process, clear communication and a shipment that arrives safely."
        >
          One team from the <span className="grad-text">factory floor</span> to your front door.
        </SectionHead>
        <div className="grid-3">
          {services.map((service, index) => (
            <article key={service.num} className={`card tilt rv${index % 3 ? ` d${index % 3}` : ''}`}>
              <span className="num">{service.num}</span>
              <div className="icon">
                <Icon index={index} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
