import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import CanvasContainer from './components/CanvasContainer'
import Overlay from './components/Overlay'

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? lenis.scroll / max : 0
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }

    lenis.on('scroll', handleScroll)
    return () => lenis.destroy()
  }, [])

  return (
    <>
      <button 
        className="theme-toggle" 
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      
      <CanvasContainer scrollProgress={scrollProgress} theme={theme} />
      <Overlay scrollProgress={scrollProgress} theme={theme} />
      <div className="scroll-spacer" />
    </>
  )
}

export default App