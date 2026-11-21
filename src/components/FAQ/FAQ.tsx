import { faqs } from '../../data/content'
import { SectionHead } from '../Common/SectionHead'

export function FAQ() {
  return (
    <section className="section tight" id="faq">
      <div className="wrap">
        <SectionHead eyebrow="Questions">Before you import</SectionHead>
        <div className="faq rv d2">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0 || undefined}>
              <summary>
                {question}
                <i />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
