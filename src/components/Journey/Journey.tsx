import { useRef } from 'react'
import { steps } from '../../data/content'
import { Eyebrow } from '../Common/Eyebrow'
import { Flag } from '../Common/SvgDefs'
import { ShipCanvas } from './ShipCanvas'

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  return (
    <section className="journey" id="journey" ref={sectionRef}>
      <div className="journey-sticky" ref={hostRef}>
        <ShipCanvas sectionRef={sectionRef} hostRef={hostRef} />
        <div className="j-shade" />
        <div className="j-badge">
          <i /> Live shipment view
        </div>
        <div className="j-ui">
          <div className="wrap j-col">
            <div className="j-head">
              <Eyebrow>How it works</Eyebrow>
              <h2>Watch your order travel from China to India.</h2>
            </div>
            <ol className="j-steps" id="jsteps">
              {steps.map(([title, body], index) => (
                <li key={title} className={`j-step${index === 0 ? ' on' : ''}`}>
                  <span className="n">{index + 1}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="j-route">
              <div className="j-port">
                <Flag code="cn" />
                <div>
                  <span className="pname">Shanghai</span>
                  <small>Origin port</small>
                </div>
              </div>
              <div className="j-track">
                <div className="j-fill" id="jfill" />
                <div className="j-boat" id="jboat">
                  <svg>
                    <use href="#i-ship" />
                  </svg>
                </div>
              </div>
              <div className="j-port">
                <div className="right">
                  <span className="pname">Chennai</span>
                  <small>Destination</small>
                </div>
                <Flag code="in" />
              </div>
              <div className="j-day" id="jday">
                Day 0
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
