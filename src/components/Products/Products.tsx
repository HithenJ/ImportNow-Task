import { categories } from '../../data/content'
import { Art } from '../Common/Art'
import { SectionHead } from '../Common/SectionHead'
import { Flag } from '../Common/SvgDefs'

export function Products() {
  return (
    <section className="section" id="products">
      <div className="wrap">
        <SectionHead
          eyebrow="What we import"
          text="Each industry has its own manufacturing hub. We take you straight to the source."
        >
          China has a market for every industry. <span className="grad-text">We know each one.</span>
        </SectionHead>
        <div className="products">
          {categories.map((category, index) => (
            <article key={category.hub} className={`card prod tilt rv${index % 3 ? ` d${index % 3}` : ''}`}>
              <Art name={category.art} className="art" />
              <span className="hub">
                <Flag code="cn" /> {category.hub}
              </span>
              <h3>{category.name}</h3>
              <ul>
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="tag">{category.note}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
