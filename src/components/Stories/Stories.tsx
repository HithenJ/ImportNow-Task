import { testimonials } from '../../data/content'
import { SectionHead } from '../Common/SectionHead'

export function Stories() {
  return (
    <section className="section tight" id="stories">
      <div className="wrap">
        <SectionHead eyebrow="Client stories">
          Heard from the people <span className="grad-text">who made the trip.</span>
        </SectionHead>
        <div className="grid-3">
          {testimonials.map((story, index) => (
            <article key={story.name} className={`card quote rv${index ? ` d${index}` : ''}`}>
              <p className="q">{story.quote}</p>
              <div className="who">
                <span className="avatar">{story.initials}</span>
                <div>
                  <b>{story.name}</b>
                  <span>{story.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
