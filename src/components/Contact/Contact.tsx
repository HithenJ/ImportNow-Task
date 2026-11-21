import type { FormEvent } from 'react'
import { budgets, instagram, phoneDisplay, phoneTel, quoteCategories, whatsapp } from '../../data/content'
import { Eyebrow } from '../Common/Eyebrow'

export function Contact() {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? '').trim()
    const msg = `Hi ImportNow, I'd like a sourcing quote.\n\nName: ${value('name')}\nCity: ${value('city')}\nCategory: ${value('category')}\nQuantity: ${value('quantity')}\nBudget: ${value('budget')}\nDetails: ${value('details')}`
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  return (
    <section className="section contact" id="contact">
      <div className="wrap ct-grid">
        <div>
          <Eyebrow className="rv">Start importing</Eyebrow>
          <h2 className="ct-title rv d1">
            Tell us what you want to import. <span className="grad-text">We&apos;ll take it from there.</span>
          </h2>
          <p className="lede rv d2">Share the product and quantity. You&apos;ll get supplier options, landed cost and timelines, free of charge.</p>
          <div className="ct-lines">
            <a className="ct-line rv d2" href={`tel:${phoneTel}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
              </svg>
              <div>
                <small>Call or WhatsApp</small>
                <b>{phoneDisplay}</b>
              </div>
            </a>
            <a className="ct-line rv d3" href={instagram} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              <div>
                <small>Instagram</small>
                <b>@importnow.in</b>
              </div>
            </a>
            <div className="ct-line rv d4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div>
                <small>Offices</small>
                <b>Hyderabad, India · Shanghai, China</b>
              </div>
            </div>
          </div>
        </div>
        <form className="quote-form rv d2" id="qform" onSubmit={submit}>
          <h3>Get a free sourcing quote</h3>
          <div className="row2">
            <div className="field">
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" name="name" required placeholder="Full name" />
            </div>
            <div className="field">
              <label htmlFor="f-city">City</label>
              <input id="f-city" name="city" placeholder="e.g. Hyderabad" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-cat">What do you want to import?</label>
            <select id="f-cat" name="category">
              {quoteCategories.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="row2">
            <div className="field">
              <label htmlFor="f-qty">Approx. quantity</label>
              <input id="f-qty" name="quantity" placeholder="e.g. 1 container" />
            </div>
            <div className="field">
              <label htmlFor="f-budget">Budget</label>
              <select id="f-budget" name="budget">
                {budgets.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-msg">Details</label>
            <textarea id="f-msg" name="details" placeholder="Product, specs, reference photos or links…" />
          </div>
          <button className="btn btn-primary block" type="submit">
            Send on WhatsApp →
          </button>
          <p className="form-note">Opens WhatsApp with your details filled in. We usually reply within a few hours.</p>
        </form>
      </div>
    </section>
  )
}
