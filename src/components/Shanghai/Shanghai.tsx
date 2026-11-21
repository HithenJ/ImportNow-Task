import { checks, licenceRows } from '../../data/content'
import { Eyebrow } from '../Common/Eyebrow'

function Tick() {
  return (
    <span className="tick">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  )
}

export function Shanghai() {
  return (
    <section className="section shanghai" id="shanghai">
      <div className="wrap sh-grid">
        <div>
          <Eyebrow className="rv">Officially in China</Eyebrow>
          <h2 className="sh-title rv d1">
            Many claim an office in China. <span className="grad-text">We have the licence.</span>
          </h2>
          <p className="lede rv d2">
            ImportNow operates through its own registered company in Shanghai, <b style={{ color: '#fff' }}>Shanghai Shengqiao Chain Trading Co., Ltd.</b> That means we can sign contracts with factories, pay suppliers locally and stand behind every order.
          </p>
          <ul className="checks">
            {checks.map(([strong, rest], index) => (
              <li key={strong} className={`rv d${Math.min(index + 2, 5)}`}>
                <Tick />
                <div>
                  <b>{strong}</b>
                  {rest}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="license-stage rv d2">
          <div className="license" id="license">
            <div className="lt">营业执照</div>
            <div className="ls">BUSINESS LICENCE</div>
            <div className="emblem" />
            <dl>
              {licenceRows.map(([label, value]) => (
                <span key={label} style={{ display: 'contents' }}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </span>
              ))}
            </dl>
            <div className="qr" />
            <div className="stamp">
              <span>
                SHANGHAI
                <br />
                SHENGQIAO
                <br />
                TRADING
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
