import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = document.querySelectorAll('.rv')
    elements.forEach((el) => io.observe(el))

    // Count-up elements
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          countObserver.unobserve(e.target)
          const el = e.target as HTMLElement
          const to = Number(el.dataset.count || '0')
          const t0 = performance.now()
          const duration = 1600

          const step = (t: number) => {
            const progress = Math.min(1, (t - t0) / duration)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = Math.round(to * eased).toString()
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        })
      },
      { threshold: 0.6 }
    )

    const countEls = document.querySelectorAll('[data-count]')
    countEls.forEach((el) => countObserver.observe(el))

    return () => {
      io.disconnect()
      countObserver.disconnect()
    }
  }, [])
}

