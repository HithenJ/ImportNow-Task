import { projects } from '../../data/content'
import { Art } from '../Common/Art'
import { SectionHead } from '../Common/SectionHead'
import { Flag } from '../Common/SvgDefs'

export function Work() {
  return (
    <section className="section tight" id="work">
      <div className="wrap">
        <SectionHead eyebrow="Recently delivered">
          Another container unloaded, <span className="grad-text">another happy client.</span>
        </SectionHead>
        <div className="work-grid">
          {projects.map((project, index) => (
            <article key={project.name} className={`card work tilt rv${index ? ` d${index}` : ''}`}>
              <div className={`ph ${project.tone}`}>
                <Art name={project.art} stroke={1.3} />
                <span className="route-chip">
                  <Flag code="cn" />
                  {project.place}
                </span>
              </div>
              <div className="bd">
                <h3>{project.name}</h3>
                <p>{project.desc}</p>
                <div className="meta">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
