import { useState } from 'react'
import { WHEEL } from '../game/catalog'
import { useT } from '../i18n'

const COLORS = ['#ffc6d9', '#fff3a3', '#c3f2c0', '#a8e6f0', '#dcc3ff', '#ffd8a8', '#9fe3c9', '#ffb3c7']

/** Ruota della fortuna: gira verso lo spicchio restituito dal server. */
export function Wheel({ disabled, onSpin, label }: { disabled: boolean; onSpin: () => Promise<string | undefined>; label: string }) {
  const { t, c } = useT()
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const n = WHEEL.length
  const seg = 360 / n

  const spin = async () => {
    setSpinning(true)
    setAngle((a) => a + 720)
    const prize = await onSpin().catch(() => undefined)
    const idx = WHEEL.findIndex((w) => w.id === prize)
    if (idx === -1) {
      setSpinning(false)
      return
    }
    // porta lo spicchio idx sotto la freccia (in alto)
    setAngle((a) => {
      const base = a - (a % 360) + 360 * 4
      return base + (360 - (idx * seg + seg / 2))
    })
    setTimeout(() => setSpinning(false), 3200)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-3xl drop-shadow">🔻</div>
        <svg viewBox="-110 -110 220 220" width={230} height={230} style={{ transform: `rotate(${angle}deg)`, transition: 'transform 3s cubic-bezier(.17,.67,.2,1)' }}>
          {WHEEL.map((w, i) => {
            const a0 = ((i * seg - 90) * Math.PI) / 180
            const a1 = (((i + 1) * seg - 90) * Math.PI) / 180
            const mid = ((i * seg + seg / 2 - 90) * Math.PI) / 180
            return (
              <g key={w.id}>
                <path d={`M 0 0 L ${Math.cos(a0) * 100} ${Math.sin(a0) * 100} A 100 100 0 0 1 ${Math.cos(a1) * 100} ${Math.sin(a1) * 100} Z`} fill={COLORS[i % COLORS.length]} stroke="#2b2140" strokeWidth={3} />
                <text
                  x={Math.cos(mid) * 62}
                  y={Math.sin(mid) * 62}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="Fredoka, sans-serif"
                  fill="#2b2140"
                  transform={`rotate(${i * seg + seg / 2 - 90} ${Math.cos(mid) * 62} ${Math.sin(mid) * 62})`}
                >
                  {c.wheel(w.id)}
                </text>
              </g>
            )
          })}
          <circle r={16} fill="#ff5c8a" stroke="#2b2140" strokeWidth={3} />
        </svg>
      </div>
      <button className="btn-primary mt-3" disabled={disabled || spinning} onClick={spin}>
        {spinning ? t('mo.spinning') : label}
      </button>
    </div>
  )
}
