import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  opacity: number
  phase: number
  hue: number
}

const STAR_COUNT = 200
const TRAIL_LENGTH = 24       // max points in the trail
const TRAIL_MAX_AGE = 0.9     // seconds before a point fades out

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const trailRef = useRef<{ x: number; y: number; t: number }[]>([])
  const mouseRef = useRef({ x: -100, y: -100 })
  const lastMoveRef = useRef(0)
  const animRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      generateStars()
    }

    function generateStars() {
      const stars: Star[] = []
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          r: Math.random() * 1.6 + 0.3,
          opacity: Math.random() * 0.65 + 0.2,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.08 ? 160 : Math.random() < 0.12 ? 210 : 0,
        })
      }
      starsRef.current = stars
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      lastMoveRef.current = performance.now()
    }

    function draw(now: number) {
      const w = canvas!.width
      const h = canvas!.height
      ctx!.clearRect(0, 0, w, h)

      // ---- Stars ----
      for (const s of starsRef.current) {
        const twinkle = 0.5 + 0.5 * Math.sin(now * 0.0008 + s.phase)
        const alpha = s.opacity * (0.6 + 0.4 * twinkle)
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        if (s.hue === 0) {
          ctx!.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`
        } else {
          ctx!.fillStyle = `hsla(${s.hue},60%,65%,${alpha.toFixed(2)})`
        }
        ctx!.fill()
      }

      const { x: mx, y: my } = mouseRef.current
      const timeSinceMove = now - lastMoveRef.current

      // ---- Trail management ----
      // Only add points when mouse is moving
      if (timeSinceMove < 120 && mx > 0 && my > 0) {
        const trail = trailRef.current
        const last = trail[trail.length - 1]
        // Only add if mouse has actually moved at least 2px
        if (!last || Math.abs(last.x - mx) > 1.5 || Math.abs(last.y - my) > 1.5) {
          trail.push({ x: mx, y: my, t: now })
          if (trail.length > TRAIL_LENGTH) trail.shift()
        }
      }

      // Remove old trail points
      const trail = trailRef.current
      for (let i = trail.length - 1; i >= 0; i--) {
        if (now - trail[i].t > TRAIL_MAX_AGE * 1000) {
          trail.splice(i, 1)
        }
      }

      // ---- Draw smooth trail ----
      if (trail.length >= 2) {
        // Draw a smooth tapered line
        for (let i = 1; i < trail.length; i++) {
          const age = (now - trail[i].t) / 1000
          const ageRatio = Math.max(0, 1 - age / TRAIL_MAX_AGE)
          const progress = i / (trail.length - 1) // 0=oldest, 1=newest
          const alpha = ageRatio * progress * 0.5
          const lineWidth = progress * 2.2 + 0.4

          ctx!.beginPath()
          ctx!.moveTo(trail[i - 1].x, trail[i - 1].y)
          ctx!.lineTo(trail[i].x, trail[i].y)
          ctx!.strokeStyle = `rgba(34,211,160,${alpha.toFixed(3)})`
          ctx!.lineWidth = lineWidth
          ctx!.lineCap = 'round'
          ctx!.stroke()
        }

        // Draw a soft glow at the current cursor position (tail tip)
        const tip = trail[trail.length - 1]
        const glow = ctx!.createRadialGradient(tip.x, tip.y, 2, tip.x, tip.y, 50)
        glow.addColorStop(0, 'rgba(34,211,160,0.25)')
        glow.addColorStop(0.4, 'rgba(34,211,160,0.08)')
        glow.addColorStop(1, 'rgba(34,211,160,0)')
        ctx!.fillStyle = glow
        ctx!.fillRect(tip.x - 50, tip.y - 50, 100, 100)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  )
}
