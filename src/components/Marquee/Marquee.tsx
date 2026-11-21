import { marqueeRoutes } from '../../data/content'

function Track() {
  return (
    <>
      {marqueeRoutes.map(([from, to]) => (
        <span key={`${from}-${to}`}>
          {from} <em>→</em> {to}
        </span>
      ))}
    </>
  )
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" id="mq">
        <Track />
        <Track />
      </div>
    </div>
  )
}
