import { useCallback, useEffect, useRef, useState } from 'react'

type Drop = { id: number; x: number; y: number; v: number; emoji: string; pts: number }

const GOOD = [
  { emoji: '🍪', pts: 1, w: 6 },
  { emoji: '🍬', pts: 1, w: 4 },
  { emoji: '🧁', pts: 2, w: 2 },
  { emoji: '🌟', pts: 3, w: 1 },
]
const BAD = [
  { emoji: '🧦', pts: -2, w: 2 },
  { emoji: '🌶️', pts: -2, w: 1 },
]
const ALL = [...GOOD, ...BAD]
const DURATION = 30

function pickDrop() {
  const total = ALL.reduce((a, b) => a + b.w, 0)
  let r = Math.random() * total
  for (const d of ALL) if ((r -= d.w) <= 0) return d
  return ALL[0]
}

/** Minigioco: acchiappa i biscotti col cestino, evita i calzini puzzolenti. */
export function CookieGame({ onFinish }: { onFinish: (score: number) => void }) {
  const [phase, setPhase] = useState<'ready' | 'play' | 'done'>('ready')
  const [, force] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const drops = useRef<Drop[]>([])
  const basket = useRef(50)
  const score = useRef(0)
  const time = useRef(DURATION)
  const pops = useRef<{ id: number; x: number; txt: string }[]>([])

  const start = () => {
    drops.current = []
    score.current = 0
    time.current = DURATION
    basket.current = 50
    setPhase('play')
  }

  useEffect(() => {
    if (phase !== 'play') return
    let raf = 0
    let last = performance.now()
    let spawn = 0
    let id = 0
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      time.current -= dt
      spawn -= dt
      const elapsed = DURATION - time.current
      if (spawn <= 0) {
        const d = pickDrop()
        drops.current.push({ id: ++id, x: 6 + Math.random() * 88, y: -6, v: 32 + Math.random() * 18 + elapsed * 1.4, emoji: d.emoji, pts: d.pts })
        spawn = Math.max(0.28, 0.62 - elapsed * 0.012)
      }
      for (const d of drops.current) d.y += d.v * dt
      drops.current = drops.current.filter((d) => {
        if (d.y > 84 && d.y < 96 && Math.abs(d.x - basket.current) < 10) {
          score.current = Math.max(0, score.current + d.pts)
          pops.current.push({ id: d.id, x: d.x, txt: d.pts > 0 ? `+${d.pts}` : `${d.pts}` })
          setTimeout(() => (pops.current = pops.current.filter((p) => p.id !== d.id)), 700)
          return false
        }
        return d.y < 105
      })
      if (time.current <= 0) {
        setPhase('done')
        return
      }
      force((n) => n + 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') basket.current = Math.max(6, basket.current - 7)
      if (e.key === 'ArrowRight') basket.current = Math.min(94, basket.current + 7)
    }
    window.addEventListener('keydown', key)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', key)
    }
  }, [phase])

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    basket.current = Math.min(94, Math.max(6, ((clientX - r.left) / r.width) * 100))
  }, [])

  return (
    <div
      ref={box}
      className="relative h-[360px] touch-none select-none overflow-hidden rounded-3xl border-[3px] border-ink bg-gradient-to-b from-sky to-[#fff4e6]"
      onPointerMove={(e) => phase === 'play' && move(e.clientX)}
      onPointerDown={(e) => phase === 'play' && move(e.clientX)}
    >
      {phase === 'play' && (
        <>
          <div className="absolute left-3 top-2 rounded-full border-2 border-ink bg-white px-3 font-bold">🍪 {score.current}</div>
          <div className="absolute right-3 top-2 rounded-full border-2 border-ink bg-white px-3 font-bold tabular-nums">⏱ {Math.ceil(time.current)}</div>
          {drops.current.map((d) => (
            <span key={d.id} className="absolute -translate-x-1/2 text-3xl" style={{ left: `${d.x}%`, top: `${d.y}%` }}>
              {d.emoji}
            </span>
          ))}
          {pops.current.map((p) => (
            <span key={p.id} className={`float-up absolute top-[78%] font-bold ${p.txt.startsWith('-') ? 'text-red-600' : 'text-[#2b8a3e]'}`} style={{ left: `${p.x}%` }}>
              {p.txt}
            </span>
          ))}
          <span className="absolute top-[86%] -translate-x-1/2 text-5xl" style={{ left: `${basket.current}%` }}>
            🧺
          </span>
        </>
      )}
      {phase !== 'play' && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            {phase === 'ready' ? (
              <>
                <p className="text-5xl">🍪🧺</p>
                <p className="mt-2 text-lg font-bold">Pioggia di biscotti!</p>
                <p className="text-sm opacity-75">Muovi il cestino col dito (o con le frecce). Evita calzini 🧦 e peperoncini 🌶️!</p>
                <button className="btn-primary mt-4" onClick={start}>Gioca!</button>
              </>
            ) : (
              <>
                <p className="text-5xl">🎉</p>
                <p className="mt-2 text-2xl font-bold">{score.current} biscotti!</p>
                <p className="text-sm opacity-75">Valgono {Math.round(Math.min(80, score.current) * 1.5)} monete per la famiglia.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <button className="btn-primary" onClick={() => onFinish(score.current)}>Incassa 🪙</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
