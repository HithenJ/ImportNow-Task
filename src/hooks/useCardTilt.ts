import { useEffect } from 'react'

export function useCardTilt() {
  useEffect(() => {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return

    const cards = document.querySelectorAll<HTMLElement>('.tilt')
    const cleanups: (() => void)[] = []

    cards.forEach((c) => {
      const handleMove = (e: PointerEvent) => {
        const r = c.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        c.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 7).toFixed(2)}deg) rotateY(${((x - 0.5) * 9).toFixed(2)}deg) translateY(-4px)`
        c.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
        c.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
      }

      const handleLeave = () => {
        c.style.transform = ''
      }

      c.addEventListener('pointermove', handleMove)
      c.addEventListener('pointerleave', handleLeave)

      cleanups.push(() => {
        c.removeEventListener('pointermove', handleMove)
        c.removeEventListener('pointerleave', handleLeave)
      })
    })

    const license = document.getElementById('license')
    const stage = license?.parentElement
    if (license && stage) {
      const move = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        license.style.transform = `rotateY(${(x * 24).toFixed(2)}deg) rotateX(${(-y * 16).toFixed(2)}deg)`
      }
      const leave = () => {
        license.style.transform = ''
      }
      stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerleave', leave)
      })
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [])
}

