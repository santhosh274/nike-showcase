import { useState, useEffect, useRef } from 'react'

const sections = [
  {
    num: '01',
    title: 'AIR JORDAN 1',
    subtitle: 'ORIGIN STORY',
    description: 'First released in 1985, it broke every NBA rule and rewrote the cultural playbook of sport forever.',
    specs: { Year: '1985', Colorway: 'Chicago OG', Material: 'Full-Grain Leather', Silhouette: 'High-Top' },
    range: [0, 0.2]
  },
  {
    num: '02',
    title: 'THE SWOOSH',
    subtitle: 'CRAFTED TO PERFORM',
    description: 'Every stitch carries the weight of intention. Precision construction born for the court and the streets.',
    specs: { Sole: 'Rubber Cupsole', Lining: 'Foam Padded', Closure: 'Lace-Up', Origin: 'Taiwan, 1985' },
    range: [0.2, 0.4]
  },
  {
    num: '03',
    title: 'AIR TECH',
    subtitle: 'ENGINEERED COMFORT',
    description: 'Nike Air cushioning redefined what a basketball shoe could feel like — impact absorbed, energy returned.',
    specs: { Technology: 'Nike Air Unit', Cushioning: 'Full-Length', Flexibility: 'Forefoot Grooves', Ankle: 'Padded Collar' },
    range: [0.4, 0.6]
  },
  {
    num: '04',
    title: 'LEGACY',
    subtitle: 'BEYOND THE COURT',
    description: 'An artifact that transcends sport, fashion, and generations. The shoe Michael Jordan made mythological.',
    specs: { NBA: 'Banned 1984–85', Fine: '$5,000 per game', Editions: '200+ Colorways', Status: 'Cultural Icon' },
    range: [0.6, 0.8]
  },
  {
    num: '05',
    title: 'JUST DO IT',
    subtitle: 'CARRY THE LEGEND',
    description: 'Join the movement. The Air Jordan 1 is more than a shoe — it is a manifesto written in leather and air.',
    specs: { Heritage: 'Since 1985', Era: 'Timeless', Movement: 'Global', Drop: 'Limited Always' },
    range: [0.8, 1.0]
  },
]

export default function Overlay({ scrollProgress, theme }) {
  const [displayIdx, setDisplayIdx] = useState(0)
  const [isChanging, setIsChanging] = useState(false)
  const [swooshProgress, setSwooshProgress] = useState(0)
  const offset = scrollProgress || 0

  const swooshSrc = theme === 'dark' ? '/nike-swoosh-white.png' : '/nike-swoosh-black.png'

  useEffect(() => {
    if (offset >= 0.75) {
      const progress = (offset - 0.75) / 0.25
      setSwooshProgress(Math.min(1, Math.max(0, progress)))
    } else {
      setSwooshProgress(0)
    }
  }, [offset])

  useEffect(() => {
    for (let i = 0; i < sections.length; i++) {
      const isLast = i === sections.length - 1
      const upper = isLast ? 1.01 : sections[i].range[1]
      if (offset >= sections[i].range[0] && offset < upper) {
        if (displayIdx !== i) {
          setIsChanging(true)
          setTimeout(() => {
            setDisplayIdx(i)
            setIsChanging(false)
          }, 150)
        }
        break
      }
    }
  }, [offset])

  const section = sections[displayIdx]

  return (
    <div className="overlay-wrapper">
      <div className="brand-mark">
        <span className="brand-name">NIKE</span>
        <span className="brand-line" />
      </div>

      <div className={`content-block ${isChanging ? 'changing' : ''}`}>
        <div className="content-inner">
          <div className="content-header">
            <span className="content-num">{section.num}</span>
            <span className="content-line" />
            <span className="content-sub">{section.subtitle}</span>
          </div>
          
          <h1 className="content-title">{section.title}</h1>
          
          <p className="content-desc">{section.description}</p>
          
          <div className="content-meta">
            <span className="meta-label">SCROLL</span>
            <span className="meta-pct">{Math.round(offset * 100)}%</span>
          </div>
        </div>
      </div>

      <div className={`specs-block ${isChanging ? 'changing' : ''}`}>
        <div className="specs-inner">
          <div className="specs-header">
            <span className="specs-label">SPECIFICATIONS</span>
            <span className="specs-badge">AJ1</span>
          </div>
          
          <div className="specs-grid">
            {Object.entries(section.specs).map(([key, val], i) => (
              <div key={key} className="spec-item" style={{ '--delay': i * 0.05 }}>
                <span className="spec-key">{key.toUpperCase()}</span>
                <span className="spec-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        className="swoosh-reveal"
        style={{ '--progress': swooshProgress }}
      >
        <img src={swooshSrc} alt="Nike Swoosh" className="swoosh-img" />
      </div>

      <div className="nav-dots">
        {sections.map((s, i) => (
          <div key={i} className={`nav-dot ${i === displayIdx ? 'active' : ''}`} />
        ))}
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ height: `${offset * 100}%` }} />
      </div>

      {offset > 0.999 && (
        <div className={`final-cta ${theme}`}>
          <div className="cta-content">
            <img src={swooshSrc} alt="Nike Swoosh" className="cta-swoosh" />
            <a href="https://apollodesign.vercel.app/" target="_blank" rel="noopener noreferrer" className="cta-link">
              made by <span className="cta-brand">apollodesign.sv</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}