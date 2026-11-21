import { departures, tripIncludes, tripPills } from '../../data/content'
import { SectionHead } from '../Common/SectionHead'
import { Eyebrow } from '../Common/Eyebrow'

const includeIcons = [
  <svg key="visa" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>,
  <svg key="hotel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6" /></svg>,
  <svg key="food" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 11h16a8 8 0 01-16 0zM12 3v4M8 5v2M16 5v2" /></svg>,
  <svg key="guide" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c-1 4-4 7-7 8M14 21l4-9 4 9M15.5 18h5" /></svg>,
  <svg key="factory" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21V9l6 4V9l6 4V5l6 4v12H3z" /></svg>,
  <svg key="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
]

export function Trips() {
  return (
    <section className="section" id="trips">
      <div className="wrap">
        <SectionHead
          eyebrow="Business trips to China"
          text="Guided trips to the Canton Fair, wholesale markets and factories you choose. Our clients often tell us it felt like a personal trip, not a business tour."
        >
          Your business trip doesn&apos;t have to <span className="grad-text">feel like work.</span>
        </SectionHead>
        <div className="trips-grid">
          <article className="card trip-hero rv">
            <svg className="skyline" viewBox="0 0 600 150" preserveAspectRatio="none" fill="rgba(255,255,255,.18)">
              <path d="M0 150V110h30V80h20v30h25V60h15V40h10v20h15v50h30V70h40v40h20V30l15-25 15 25v80h25V85h30v25h20V50h35v60h25V90h30V20h12V0h6v20h12v90h30V75h40v35h25V95h30v55z" />
            </svg>
            <Eyebrow>Canton Fair · Guangzhou</Eyebrow>
            <h3>Meet factories face to face. We handle everything else.</h3>
            <p>Walk the world&apos;s biggest trade fair with a guide who speaks the language, then visit the factories you shortlist.</p>
            <div className="pill-row">
              {tripPills.map((pill) => (
                <span className="pill" key={pill}>{pill}</span>
              ))}
            </div>
          </article>
          <article className="card rv d1">
            <h3 className="mb">What&apos;s included</h3>
            <div className="inc">
              {tripIncludes.map((item, index) => (
                <div key={item}>
                  {includeIcons[index]}
                  {item}
                </div>
              ))}
            </div>
          </article>
          <article className="card rv d2">
            <h3 className="mb-sm">Next departures</h3>
            <div className="dates">
              {departures.map(([when, detail]) => (
                <div className="date" key={when}>
                  <b>{when}</b>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
            <a className="btn btn-primary mt" href="#contact">Join the next trip →</a>
          </article>
        </div>
      </div>
    </section>
  )
}
