import { useId, type ReactNode } from 'react'
import type { Look, Mood, Outfit, Stage } from '../game/types'

const INK = '#2b2140'
const SW = 4

const DIM: Record<Stage, { rx: number; h: number; eye: number; eyeF: number }> = {
  neonato: { rx: 62, h: 102, eye: 9.5, eyeF: 0.44 },
  bambino: { rx: 68, h: 120, eye: 8.5, eyeF: 0.41 },
  ragazzo: { rx: 68, h: 138, eye: 7.5, eyeF: 0.38 },
  adulto: { rx: 72, h: 148, eye: 7.5, eyeF: 0.36 },
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c: number) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255)
  return `rgb(${r},${g},${b})`
}

export interface AvatarProps {
  look: Look
  outfit?: Outfit
  stage?: Stage
  mood?: Mood
  size?: number
  animate?: boolean
  className?: string
}

export function Avatar({ look, outfit = {}, stage = 'bambino', mood = 'ok', size = 160, animate = true, className = '' }: AvatarProps) {
  const uid = useId().replace(/:/g, '')
  const clip = `body-${uid}`
  const { rx, h, eye, eyeF } = DIM[stage]
  const cx = 100
  const bot = 188
  const top = bot - h
  const frog = look.species === 'rana'
  const eyeY = frog ? top + 8 : top + h * eyeF
  const eyeDx = frog ? rx * 0.45 : rx * 0.36
  const mouthY = frog ? top + h * 0.36 : eyeY + (stage === 'neonato' ? 22 : 20)
  const neckY = top + h * 0.6
  const c = look.color
  const dark = shade(c, -0.28)
  const light = shade(c, 0.55)

  const body = `M ${cx} ${top} C ${cx + rx * 1.25} ${top}, ${cx + rx * 1.32} ${bot}, ${cx} ${bot} C ${cx - rx * 1.32} ${bot}, ${cx - rx * 1.25} ${top}, ${cx} ${top} Z`

  const g = { cx, top, bot, rx, h, eyeY, eyeDx, mouthY, neckY, eye }

  return (
    <svg
      viewBox="-15 -42 230 242"
      width={size}
      height={size * (242 / 230)}
      className={`overflow-visible ${className}`}
      role="img"
      aria-label="avatar"
    >
      <defs>
        <clipPath id={clip}>
          <path d={body} />
        </clipPath>
      </defs>
      <ellipse cx={cx} cy={bot + 6} rx={rx * 0.9} ry={8} fill={INK} opacity={0.12} />
      <g className={animate ? (mood === 'dorme' ? 'av-breathe' : 'av-bob') : ''}>
        {/* dietro il corpo */}
        {outfit.acc && BACK[outfit.acc]?.(g)}
        <Ears species={look.species} g={g} c={c} dark={dark} />
        {/* braccine */}
        {[-1, 1].map((s) => (
          <ellipse key={s} cx={cx + s * rx * 0.98} cy={top + h * 0.68} rx={10} ry={17} fill={c} stroke={INK} strokeWidth={SW} transform={`rotate(${s * -28} ${cx + s * rx * 0.98} ${top + h * 0.68})`} />
        ))}
        {/* piedini */}
        {[-1, 1].map((s) => (
          <ellipse key={s} cx={cx + s * rx * 0.42} cy={bot - 1} rx={17} ry={9} fill={look.species === 'pulcino' ? '#ffa94d' : dark} stroke={INK} strokeWidth={SW} />
        ))}
        {/* corpo */}
        <path d={body} fill={c} />
        <g clipPath={`url(#${clip})`}>
          <Pattern id={look.pattern} g={g} light={light} dark={dark} />
          {mood === 'malato' && <rect x={0} y={top} width={200} height={h * 0.55} fill="#8fd694" opacity={0.35} />}
          {mood === 'sporco' && (
            <g fill="#8a6a43" opacity={0.45}>
              <ellipse cx={cx - rx * 0.5} cy={top + h * 0.75} rx={11} ry={8} />
              <ellipse cx={cx + rx * 0.45} cy={top + h * 0.3} rx={9} ry={6} />
              <ellipse cx={cx + rx * 0.2} cy={top + h * 0.85} rx={7} ry={5} />
            </g>
          )}
          {outfit.top && TOPS[outfit.top]?.(g)}
        </g>
        <path d={body} fill="none" stroke={INK} strokeWidth={SW} />
        {outfit.top && TOP_FRONT[outfit.top]?.(g)}

        {/* guance */}
        {[-1, 1].map((s) => (
          <ellipse key={s} cx={cx + s * rx * 0.58} cy={eyeY + 14} rx={9} ry={5.5} fill="#ff7aa2" opacity={mood === 'malato' ? 0.15 : 0.45} />
        ))}
        <Expression mood={mood} g={g} species={look.species} />
        {outfit.acc && FRONT[outfit.acc]?.(g)}
        {outfit.hat && HATS[outfit.hat]?.(g)}
        {look.species === 'fagiolo' && !outfit.hat && (
          <g>
            <path d={`M ${cx} ${top + 2} q 2 -14 -4 -22`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
            <path d={`M ${cx - 3} ${top - 16} q 18 -14 24 0 q -14 10 -24 0 Z`} fill="#7bd389" stroke={INK} strokeWidth={3} />
          </g>
        )}
      </g>
      {mood === 'dorme' && (
        <g fill={INK} fontFamily="Fredoka, sans-serif" fontWeight={700}>
          <text x={cx + rx * 0.8} y={top + 4} fontSize={22} className="av-zzz">z</text>
          <text x={cx + rx * 1.05} y={top - 14} fontSize={16} className="av-zzz av-zzz-2">z</text>
        </g>
      )}
      {mood === 'sporco' && (
        <g className="av-fly">
          <circle cx={cx + rx * 0.9} cy={top - 6} r={3.5} fill={INK} />
          <ellipse cx={cx + rx * 0.9 - 3} cy={top - 11} rx={3} ry={4} fill="#fff" stroke={INK} strokeWidth={1.5} />
        </g>
      )}
      {mood === 'affamato' && <text x={cx + rx * 0.75} y={top + 6} fontSize={26}>🍽️</text>}
    </svg>
  )
}

type G = { cx: number; top: number; bot: number; rx: number; h: number; eyeY: number; eyeDx: number; mouthY: number; neckY: number; eye: number }

function Ears({ species, g, c, dark }: { species: string; g: G; c: string; dark: string }) {
  const { cx, top, rx } = g
  const s = { fill: c, stroke: INK, strokeWidth: SW, strokeLinejoin: 'round' as const }
  switch (species) {
    case 'gattino':
      return (
        <g>
          {[-1, 1].map((d) => (
            <g key={d}>
              <path d={`M ${cx + d * rx * 0.85} ${top + 34} L ${cx + d * rx * 0.72} ${top - 22} L ${cx + d * rx * 0.15} ${top + 6} Z`} {...s} />
              <path d={`M ${cx + d * rx * 0.72} ${top + 22} L ${cx + d * rx * 0.68} ${top - 8} L ${cx + d * rx * 0.35} ${top + 10} Z`} fill="#ff9fbf" />
            </g>
          ))}
        </g>
      )
    case 'coniglio':
      return (
        <g>
          {[-1, 1].map((d) => (
            <g key={d} transform={`rotate(${d * 12} ${cx + d * rx * 0.32} ${top + 10})`}>
              <ellipse cx={cx + d * rx * 0.32} cy={top - 26} rx={14} ry={38} {...s} />
              <ellipse cx={cx + d * rx * 0.32} cy={top - 24} rx={6} ry={26} fill="#ff9fbf" />
            </g>
          ))}
        </g>
      )
    case 'orsetto':
      return (
        <g>
          {[-1, 1].map((d) => (
            <g key={d}>
              <circle cx={cx + d * rx * 0.66} cy={top + 14} r={19} {...s} />
              <circle cx={cx + d * rx * 0.66} cy={top + 14} r={9} fill={dark} />
            </g>
          ))}
        </g>
      )
    case 'draghetto':
      return (
        <g>
          {[-1, 1].map((d) => (
            <g key={d}>
              <path d={`M ${cx + d * rx * 1.02} ${top + g.h * 0.5} l ${d * 30} -34 l ${d * -6} 26 l ${d * 18} -6 Z`} fill={dark} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
              <path d={`M ${cx + d * rx * 0.28} ${top + 8} Q ${cx + d * rx * 0.5} ${top - 30} ${cx + d * rx * 0.62} ${top - 28} Q ${cx + d * rx * 0.55} ${top - 6} ${cx + d * rx * 0.58} ${top + 16} Z`} fill="#ffe08a" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
            </g>
          ))}
        </g>
      )
    case 'pulcino':
      return (
        <g fill={c} stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
          <path d={`M ${cx - 4} ${top + 4} q -12 -18 -2 -26 q 4 12 6 22 Z`} />
          <path d={`M ${cx + 2} ${top + 4} q 4 -22 16 -24 q -6 14 -10 26 Z`} />
        </g>
      )
    case 'alieno':
      return (
        <g>
          {[-1, 1].map((d) => (
            <g key={d}>
              <path d={`M ${cx + d * 18} ${top + 6} Q ${cx + d * 24} ${top - 14} ${cx + d * 32} ${top - 28}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
              <circle cx={cx + d * 32} cy={top - 30} r={7} fill="#ff6b9d" stroke={INK} strokeWidth={3} />
            </g>
          ))}
        </g>
      )
    case 'rana':
      return (
        <g>
          {[-1, 1].map((d) => (
            <circle key={d} cx={cx + d * rx * 0.45} cy={top + 8} r={22} {...s} />
          ))}
        </g>
      )
    default:
      return null
  }
}

function Pattern({ id, g, light, dark }: { id: string; g: G; light: string; dark: string }) {
  const { cx, top, h, rx } = g
  if (id === 'pancino') return <ellipse cx={cx} cy={top + h * 0.78} rx={rx * 0.62} ry={h * 0.3} fill={light} />
  if (id === 'macchie')
    return (
      <g fill={dark} opacity={0.35}>
        <circle cx={cx - rx * 0.7} cy={top + h * 0.3} r={13} />
        <circle cx={cx + rx * 0.75} cy={top + h * 0.55} r={16} />
        <circle cx={cx - rx * 0.35} cy={top + h * 0.85} r={10} />
        <circle cx={cx + rx * 0.3} cy={top + h * 0.12} r={8} />
      </g>
    )
  if (id === 'lentiggini')
    return (
      <g fill={dark} opacity={0.6}>
        {[-1, 1].flatMap((s) => [
          <circle key={s + 'a'} cx={cx + s * rx * 0.5} cy={g.eyeY + 22} r={2} />,
          <circle key={s + 'b'} cx={cx + s * rx * 0.62} cy={g.eyeY + 24} r={2} />,
          <circle key={s + 'c'} cx={cx + s * rx * 0.56} cy={g.eyeY + 29} r={2} />,
        ])}
      </g>
    )
  return null
}

function Expression({ mood, g, species }: { mood: Mood; g: G; species: string }) {
  const { cx, eyeY, eyeDx, mouthY, eye } = g
  const eyes: ReactNode[] = []
  for (const s of [-1, 1]) {
    const x = cx + s * eyeDx
    if (mood === 'felice') eyes.push(<path key={s} d={`M ${x - eye} ${eyeY + 3} Q ${x} ${eyeY - eye - 4} ${x + eye} ${eyeY + 3}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />)
    else if (mood === 'dorme') eyes.push(<path key={s} d={`M ${x - eye} ${eyeY} Q ${x} ${eyeY + eye} ${x + eye} ${eyeY}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />)
    else if (mood === 'malato' || mood === 'stanco')
      eyes.push(
        <g key={s}>
          <path d={`M ${x - eye} ${eyeY} A ${eye} ${eye} 0 0 0 ${x + eye} ${eyeY} Z`} fill={INK} />
          <line x1={x - eye - 2} y1={eyeY} x2={x + eye + 2} y2={eyeY} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </g>,
      )
    else {
      const r = mood === 'affamato' ? eye + 2 : eye
      eyes.push(
        <g key={s} className="av-blink">
          <circle cx={x} cy={eyeY} r={r} fill={INK} />
          <circle cx={x + r * 0.35} cy={eyeY - r * 0.4} r={r * 0.38} fill="#fff" />
          {mood === 'affamato' && <circle cx={x - r * 0.35} cy={eyeY + r * 0.35} r={r * 0.18} fill="#fff" />}
        </g>,
      )
    }
    if (mood === 'triste') eyes.push(<line key={'b' + s} x1={x - eye} y1={eyeY - eye - 6 - s * -2} x2={x + eye} y2={eyeY - eye - 6 + s * -2 - 2} stroke={INK} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${s * -14} ${x} ${eyeY - eye - 6})`} />)
  }
  let mouth: ReactNode
  const m = mouthY
  switch (mood) {
    case 'felice':
      mouth = (
        <g>
          <path d={`M ${cx - 12} ${m} Q ${cx} ${m + 18} ${cx + 12} ${m} Z`} fill="#7a2e45" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          <ellipse cx={cx} cy={m + 8} rx={5} ry={3} fill="#ff8fab" />
        </g>
      )
      break
    case 'triste':
    case 'malato':
    case 'stanco':
      mouth = <path d={`M ${cx - 9} ${m + 6} Q ${cx} ${m - 3} ${cx + 9} ${m + 6}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      break
    case 'dorme':
      mouth = <ellipse cx={cx} cy={m + 3} rx={4} ry={4.5} fill="#7a2e45" stroke={INK} strokeWidth={3} />
      break
    case 'affamato':
      mouth = (
        <g>
          <ellipse cx={cx} cy={m + 4} rx={8} ry={10} fill="#7a2e45" stroke={INK} strokeWidth={3.5} />
          <path d={`M ${cx + 9} ${m + 6} q 3 8 0 12 q -4 -4 0 -12`} fill="#8fd3ff" stroke={INK} strokeWidth={2} />
        </g>
      )
      break
    case 'sporco':
      mouth = <path d={`M ${cx - 10} ${m + 3} q 5 -5 10 0 q 5 5 10 0`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      break
    default:
      mouth = <path d={`M ${cx - 9} ${m} Q ${cx} ${m + 9} ${cx + 9} ${m}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
  }
  if (species === 'pulcino')
    mouth = (
      <g>
        <path d={`M ${cx - 9} ${m - 2} L ${cx} ${m + (mood === 'felice' || mood === 'affamato' ? 12 : 7)} L ${cx + 9} ${m - 2} Z`} fill="#ffa94d" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      </g>
    )
  return (
    <g>
      {eyes}
      {mouth}
      {mood === 'triste' && <path d={`M ${cx - eyeDx - 4} ${eyeY + 10} q -4 8 0 10 q 4 -2 0 -10`} fill="#8fd3ff" stroke={INK} strokeWidth={2} className="av-tear" />}
      {mood === 'malato' && <path d={`M ${cx + eyeDx + 14} ${eyeY - 14} q -5 9 0 11 q 5 -2 0 -11`} fill="#8fd3ff" stroke={INK} strokeWidth={2} />}
    </g>
  )
}

// ------------------------------------------------------------------ vestiti (clippati sul corpo)

const rectFrom = (g: G, y: number, fill: string) => <rect x={0} y={y} width={200} height={g.bot - y + 5} fill={fill} />
const collar = (g: G, color = INK) => <path d={`M ${g.cx - 16} ${g.neckY} Q ${g.cx} ${g.neckY + 14} ${g.cx + 16} ${g.neckY}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
const hem = (_g: G, y: number) => <line x1={0} y1={y} x2={200} y2={y} stroke={INK} strokeWidth={3.5} />

const TOPS: Record<string, (g: G) => ReactNode> = {
  'maglia-base': (g) => <g>{rectFrom(g, g.neckY, '#fdf8ff')}{hem(g, g.neckY)}{collar(g)}</g>,
  'maglia-righe': (g) => (
    <g>
      {rectFrom(g, g.neckY, '#fff')}
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={0} y={g.neckY + 8 + i * 16} width={200} height={7} fill="#ff6b6b" />)}
      {hem(g, g.neckY)}{collar(g)}
    </g>
  ),
  'felpa-cuore': (g) => {
    const y = g.neckY + (g.bot - g.neckY) * 0.42
    return (
      <g>
        {rectFrom(g, g.neckY, '#ff8fab')}{hem(g, g.neckY)}
        <path d={`M ${g.cx} ${y + 12} C ${g.cx - 22} ${y - 2}, ${g.cx - 12} ${y - 18}, ${g.cx} ${y - 6} C ${g.cx + 12} ${y - 18}, ${g.cx + 22} ${y - 2}, ${g.cx} ${y + 12} Z`} fill="#fff" stroke={INK} strokeWidth={3} />
        <line x1={g.cx - 8} y1={g.neckY + 2} x2={g.cx - 9} y2={g.neckY + 18} stroke={INK} strokeWidth={2.5} />
        <line x1={g.cx + 8} y1={g.neckY + 2} x2={g.cx + 9} y2={g.neckY + 18} stroke={INK} strokeWidth={2.5} />
      </g>
    )
  },
  salopette: (g) => {
    const y = g.neckY + 16
    return (
      <g>
        {rectFrom(g, g.neckY, '#ffe066')}{hem(g, g.neckY)}
        {rectFrom(g, y, '#5b8def')}{hem(g, y)}
        <rect x={g.cx - 14} y={y + 10} width={28} height={20} rx={4} fill="#4a76d0" stroke={INK} strokeWidth={2.5} />
        <line x1={g.cx - 26} y1={y} x2={g.cx - 30} y2={g.neckY} stroke="#5b8def" strokeWidth={9} />
        <line x1={g.cx + 26} y1={y} x2={g.cx + 30} y2={g.neckY} stroke="#5b8def" strokeWidth={9} />
        <circle cx={g.cx - 26} cy={y + 3} r={3.5} fill="#ffd43b" stroke={INK} strokeWidth={2} />
        <circle cx={g.cx + 26} cy={y + 3} r={3.5} fill="#ffd43b" stroke={INK} strokeWidth={2} />
      </g>
    )
  },
  'vestito-fiori': (g) => (
    <g>
      {rectFrom(g, g.neckY, '#ffb3d1')}{hem(g, g.neckY)}
      {[[-0.5, 0.3], [0.2, 0.2], [0.55, 0.55], [-0.2, 0.62], [0.1, 0.9], [-0.65, 0.85]].map(([fx, fy], i) => {
        const x = g.cx + fx * g.rx, y = g.neckY + fy * (g.bot - g.neckY)
        return (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 4.5} cy={y + Math.sin((a * Math.PI) / 180) * 4.5} r={3.4} fill="#fff" />)}
            <circle cx={x} cy={y} r={2.6} fill="#ffd43b" />
          </g>
        )
      })}
      {collar(g, '#fff')}
    </g>
  ),
  'pigiama-stelle': (g) => (
    <g>
      {rectFrom(g, g.neckY, '#4d5bb0')}{hem(g, g.neckY)}
      {[[-0.55, 0.25], [0.3, 0.18], [0.6, 0.6], [-0.15, 0.55], [0.05, 0.88], [-0.6, 0.82]].map(([fx, fy], i) => (
        <text key={i} x={g.cx + fx * g.rx} y={g.neckY + fy * (g.bot - g.neckY)} fontSize={13} fill="#ffe066" textAnchor="middle">★</text>
      ))}
      {collar(g, '#ffe066')}
    </g>
  ),
  'maglia-sport': (g) => (
    <g>
      {rectFrom(g, g.neckY, '#e84a5f')}
      <rect x={g.cx - 28} y={g.neckY} width={10} height={200} fill="#fff" />
      <rect x={g.cx + 18} y={g.neckY} width={10} height={200} fill="#fff" />
      {hem(g, g.neckY)}
      <text x={g.cx} y={g.neckY + (g.bot - g.neckY) * 0.62} fontSize={26} fontWeight={800} fontFamily="Fredoka, sans-serif" fill="#fff" stroke={INK} strokeWidth={1.5} textAnchor="middle">10</text>
      {collar(g)}
    </g>
  ),
  'grembiule-chef': (g) => (
    <g>
      {rectFrom(g, g.neckY + 4, '#f5f0e6')}
      <path d={`M ${g.cx - 22} ${g.neckY - 8} L ${g.cx + 22} ${g.neckY - 8} L ${g.cx + 26} ${g.neckY + 14} L ${g.cx + 70} ${g.neckY + 16} L ${g.cx + 70} 200 L ${g.cx - 70} 200 L ${g.cx - 70} ${g.neckY + 16} L ${g.cx - 26} ${g.neckY + 14} Z`} fill="#fff" stroke={INK} strokeWidth={3} />
      <rect x={g.cx - 13} y={g.neckY + 28} width={26} height={16} rx={3} fill="#fff" stroke={INK} strokeWidth={2.5} />
      <line x1={g.cx - 70} y1={g.neckY + 16} x2={g.cx + 70} y2={g.neckY + 16} stroke="#ff6b6b" strokeWidth={4} />
    </g>
  ),
  'tuta-astronauta': (g) => (
    <g>
      {rectFrom(g, g.neckY - 8, '#eef0f6')}{hem(g, g.neckY - 8)}
      <rect x={0} y={g.neckY + (g.bot - g.neckY) * 0.55} width={200} height={9} fill="#9aa3b5" stroke={INK} strokeWidth={2.5} />
      <circle cx={g.cx - g.rx * 0.38} cy={g.neckY + 16} r={9} fill="#3d5af1" stroke={INK} strokeWidth={2.5} />
      <path d={`M ${g.cx - g.rx * 0.38 - 6} ${g.neckY + 18} q 6 -8 12 -2`} stroke="#fff" strokeWidth={2} fill="none" />
      <rect x={g.cx + 8} y={g.neckY + 8} width={22} height={13} rx={2} fill="#fff" stroke={INK} strokeWidth={2} />
      <rect x={g.cx + 8} y={g.neckY + 8} width={22} height={4} fill="#e84a5f" />
    </g>
  ),
  'maglione-natale': (g) => {
    const y = g.neckY + 22
    return (
      <g>
        {rectFrom(g, g.neckY, '#c0392b')}{hem(g, g.neckY)}
        <rect x={0} y={y - 6} width={200} height={14} fill="#fff" />
        <path d={Array.from({ length: 20 }, (_, i) => `${i ? 'L' : 'M'} ${i * 11} ${y + (i % 2 ? -5 : 5)}`).join(' ')} fill="none" stroke="#2e8b57" strokeWidth={3} />
        <path d={`M ${g.cx} ${y + 14} l 13 22 h -26 Z`} fill="#2e8b57" stroke={INK} strokeWidth={2.5} />
        <text x={g.cx} y={y + 20} fontSize={9} textAnchor="middle" fill="#ffd43b">★</text>
      </g>
    )
  },
}

const TOP_FRONT: Record<string, (g: G) => ReactNode> = {}

// ------------------------------------------------------------------ cappelli

const HATS: Record<string, (g: G) => ReactNode> = {
  berretto: ({ cx, top, rx }) => (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d={`M ${cx - rx * 0.82} ${top + 30} Q ${cx - rx * 0.8} ${top - 26} ${cx} ${top - 26} Q ${cx + rx * 0.8} ${top - 26} ${cx + rx * 0.82} ${top + 30} Z`} fill="#4ecdc4" />
      <rect x={cx - rx * 0.88} y={top + 18} width={rx * 1.76} height={16} rx={8} fill="#38b2a8" />
      <circle cx={cx} cy={top - 30} r={11} fill="#fff" />
    </g>
  ),
  fiocco: ({ cx, top, rx }) => {
    const x = cx + rx * 0.45, y = top + 12
    return (
      <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round" fill="#ff5c8a">
        <path d={`M ${x} ${y} L ${x - 26} ${y - 16} L ${x - 24} ${y + 14} Z`} />
        <path d={`M ${x} ${y} L ${x + 26} ${y - 16} L ${x + 24} ${y + 14} Z`} />
        <circle cx={x} cy={y} r={7} fill="#ff8fab" />
      </g>
    )
  },
  baseball: ({ cx, top, rx }) => (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d={`M ${cx + rx * 0.3} ${top + 22} Q ${cx + rx * 1.2} ${top + 18} ${cx + rx * 1.15} ${top + 30} Q ${cx + rx * 0.6} ${top + 34} ${cx + rx * 0.3} ${top + 28} Z`} fill="#c92a2a" />
      <path d={`M ${cx - rx * 0.72} ${top + 26} Q ${cx - rx * 0.7} ${top - 22} ${cx} ${top - 22} Q ${cx + rx * 0.7} ${top - 22} ${cx + rx * 0.72} ${top + 26} Z`} fill="#fa5252" />
      <circle cx={cx} cy={top - 22} r={4.5} fill="#c92a2a" />
      <text x={cx} y={top + 14} fontSize={20} textAnchor="middle" fill="#fff" stroke="none" fontWeight={800} fontFamily="Fredoka, sans-serif">N</text>
    </g>
  ),
  cowboy: ({ cx, top, rx }) => (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d={`M ${cx - rx * 0.55} ${top + 14} Q ${cx - rx * 0.62} ${top - 30} ${cx - rx * 0.2} ${top - 28} Q ${cx} ${top - 18} ${cx + rx * 0.2} ${top - 28} Q ${cx + rx * 0.62} ${top - 30} ${cx + rx * 0.55} ${top + 14} Z`} fill="#b07b4f" />
      <rect x={cx - rx * 0.56} y={top + 2} width={rx * 1.12} height={9} fill="#6d4524" strokeWidth={2.5} />
      <path d={`M ${cx - rx * 1.15} ${top + 8} Q ${cx} ${top + 34} ${cx + rx * 1.15} ${top + 8} Q ${cx} ${top + 22} ${cx - rx * 1.15} ${top + 8} Z`} fill="#c48b5c" />
    </g>
  ),
  'coroncina-fiori': ({ cx, top, rx }) => (
    <g>
      {[-0.62, -0.31, 0, 0.31, 0.62].map((t, i) => {
        const x = cx + t * rx * 1.05, y = top + 12 + t * t * 34
        const col = ['#ff8fab', '#ffd43b', '#b197fc', '#ff8fab', '#74c0fc'][i]
        return (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 7} cy={y + Math.sin((a * Math.PI) / 180) * 7} r={6} fill={col} stroke={INK} strokeWidth={2} />)}
            <circle cx={x} cy={y} r={4.5} fill="#ffe066" stroke={INK} strokeWidth={2} />
          </g>
        )
      })}
    </g>
  ),
  cuffie: ({ cx, top, rx, eyeY }) => (
    <g stroke={INK} strokeWidth={SW}>
      <path d={`M ${cx - rx * 0.92} ${eyeY - 2} Q ${cx - rx * 0.9} ${top - 22} ${cx} ${top - 22} Q ${cx + rx * 0.9} ${top - 22} ${cx + rx * 0.92} ${eyeY - 2}`} fill="none" stroke="#444" strokeWidth={9} />
      {[-1, 1].map((s) => <rect key={s} x={cx + s * rx * 0.95 - 11} y={eyeY - 14} width={22} height={32} rx={9} fill="#7b61ff" />)}
    </g>
  ),
  mago: ({ cx, top, rx }) => (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d={`M ${cx - rx * 0.62} ${top + 18} Q ${cx - 8} ${top - 40} ${cx + 18} ${top - 74} Q ${cx + 12} ${top - 30} ${cx + rx * 0.62} ${top + 18} Z`} fill="#7048e8" />
      <ellipse cx={cx} cy={top + 18} rx={rx * 0.95} ry={10} fill="#5f3dc4" />
      <text x={cx - 10} y={top - 4} fontSize={14} fill="#ffe066" stroke="none">★</text>
      <text x={cx + 6} y={top - 30} fontSize={10} fill="#ffe066" stroke="none">★</text>
      <circle cx={cx + 18} cy={top - 74} r={6} fill="#ffe066" strokeWidth={3} />
    </g>
  ),
  corona: ({ cx, top, rx }) => {
    const w = rx * 0.66, y = top + 14
    return (
      <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
        <path d={`M ${cx - w} ${y} L ${cx - w} ${y - 30} L ${cx - w / 2} ${y - 14} L ${cx} ${y - 38} L ${cx + w / 2} ${y - 14} L ${cx + w} ${y - 30} L ${cx + w} ${y} Z`} fill="#ffd43b" />
        <circle cx={cx} cy={y - 10} r={5} fill="#e64980" strokeWidth={2.5} />
        <circle cx={cx - w * 0.6} cy={y - 7} r={3.5} fill="#4dabf7" strokeWidth={2} />
        <circle cx={cx + w * 0.6} cy={y - 7} r={3.5} fill="#4dabf7" strokeWidth={2} />
      </g>
    )
  },
  'casco-bici': ({ cx, top, rx, eyeY }) => (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <line x1={cx - rx * 0.7} y1={top + 24} x2={cx - rx * 0.55} y2={eyeY + 26} strokeWidth={2.5} />
      <line x1={cx + rx * 0.7} y1={top + 24} x2={cx + rx * 0.55} y2={eyeY + 26} strokeWidth={2.5} />
      <path d={`M ${cx - rx * 0.86} ${top + 26} Q ${cx - rx * 0.84} ${top - 24} ${cx} ${top - 24} Q ${cx + rx * 0.84} ${top - 24} ${cx + rx * 0.86} ${top + 26} Z`} fill="#40c057" />
      {[-0.4, 0, 0.4].map((t) => <path key={t} d={`M ${cx + t * rx} ${top - 16} L ${cx + t * rx * 1.15} ${top + 12}`} strokeWidth={5} stroke="#2b8a3e" strokeLinecap="round" />)}
    </g>
  ),
}

// ------------------------------------------------------------------ accessori

const BACK: Record<string, (g: G) => ReactNode> = {
  mantello: ({ cx, rx, neckY, bot }) => (
    <path d={`M ${cx - rx * 0.6} ${neckY - 10} Q ${cx - rx * 1.4} ${bot - 30} ${cx - rx * 1.25} ${bot + 4} L ${cx + rx * 1.25} ${bot + 4} Q ${cx + rx * 1.4} ${bot - 30} ${cx + rx * 0.6} ${neckY - 10} Z`} fill="#e03131" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
  ),
  'ali-fata': ({ cx, rx, neckY }) => (
    <g stroke={INK} strokeWidth={3}>
      {[-1, 1].map((s) => (
        <g key={s} className="av-wing" style={{ transformOrigin: `${cx + s * rx * 0.6}px ${neckY}px` }}>
          <ellipse cx={cx + s * rx * 1.08} cy={neckY - 22} rx={26} ry={36} fill="#c5f6fa" opacity={0.85} transform={`rotate(${s * 30} ${cx + s * rx * 1.08} ${neckY - 22})`} />
          <ellipse cx={cx + s * rx * 1.0} cy={neckY + 22} rx={16} ry={22} fill="#e5dbff" opacity={0.85} transform={`rotate(${s * -20} ${cx + s * rx * 1.0} ${neckY + 22})`} />
        </g>
      ))}
    </g>
  ),
  zainetto: ({ cx, rx, neckY }) => (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <rect x={cx + rx * 0.6} y={neckY - 18} width={44} height={58} rx={14} fill="#fab005" />
      <rect x={cx + rx * 0.6 + 16} y={neckY + 8} width={24} height={18} rx={6} fill="#f08c00" strokeWidth={2.5} />
    </g>
  ),
}

const FRONT: Record<string, (g: G) => ReactNode> = {
  'occhiali-sole': ({ cx, eyeY, eyeDx }) => (
    <g stroke={INK} strokeWidth={3.5}>
      <line x1={cx - eyeDx + 14} y1={eyeY - 3} x2={cx + eyeDx - 14} y2={eyeY - 3} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={cx + s * eyeDx - 16} y={eyeY - 12} width={32} height={22} rx={9} fill="#212529" />
          <line x1={cx + s * eyeDx - 9} y1={eyeY - 6} x2={cx + s * eyeDx - 3} y2={eyeY - 6} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),
  'occhiali-tondi': ({ cx, eyeY, eyeDx }) => (
    <g stroke={INK} strokeWidth={3.5} fill="#fff" fillOpacity={0.18}>
      <path d={`M ${cx - eyeDx + 14} ${eyeY - 2} Q ${cx} ${eyeY - 9} ${cx + eyeDx - 14} ${eyeY - 2}`} fill="none" />
      {[-1, 1].map((s) => <circle key={s} cx={cx + s * eyeDx} cy={eyeY} r={14} />)}
    </g>
  ),
  sciarpa: ({ cx, rx, neckY }) => (
    <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
      <rect x={cx + rx * 0.25} y={neckY} width={18} height={40} rx={5} fill="#f03e3e" transform={`rotate(-8 ${cx + rx * 0.25} ${neckY})`} />
      <rect x={cx - rx * 0.98} y={neckY - 10} width={rx * 1.96} height={20} rx={10} fill="#f03e3e" />
      {[-0.5, 0, 0.5].map((t) => <line key={t} x1={cx + t * rx} y1={neckY - 9} x2={cx + t * rx} y2={neckY + 9} stroke="#fff" strokeWidth={4} />)}
    </g>
  ),
  papillon: ({ cx, neckY }) => (
    <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round" fill="#7048e8">
      <path d={`M ${cx} ${neckY} L ${cx - 20} ${neckY - 11} L ${cx - 20} ${neckY + 11} Z`} />
      <path d={`M ${cx} ${neckY} L ${cx + 20} ${neckY - 11} L ${cx + 20} ${neckY + 11} Z`} />
      <rect x={cx - 5} y={neckY - 6} width={10} height={12} rx={3} fill="#9775fa" />
    </g>
  ),
  ciuccio: ({ cx, mouthY }) => (
    <g stroke={INK} strokeWidth={3}>
      <ellipse cx={cx} cy={mouthY + 4} rx={15} ry={9} fill="#74c0fc" />
      <circle cx={cx} cy={mouthY + 12} r={7} fill="none" stroke="#fab005" strokeWidth={4} />
      <circle cx={cx} cy={mouthY + 4} r={4} fill="#fff" strokeWidth={2} />
    </g>
  ),
  collana: ({ cx, rx, neckY }) => (
    <g stroke={INK} strokeWidth={2}>
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8 - 0.5
        return <circle key={i} cx={cx + t * rx * 1.1} cy={neckY + 2 + (0.25 - t * t) * 40} r={4.5} fill="#fff9db" />
      })}
    </g>
  ),
  mantello: ({ cx, neckY }) => (
    <g stroke={INK} strokeWidth={3}>
      <circle cx={cx - 14} cy={neckY - 4} r={6} fill="#ffd43b" />
      <circle cx={cx + 14} cy={neckY - 4} r={6} fill="#ffd43b" />
    </g>
  ),
  zainetto: ({ cx, rx, neckY, bot }) => (
    <g stroke="#e8590c" strokeWidth={6} strokeLinecap="round" fill="none">
      <path d={`M ${cx - rx * 0.45} ${neckY - 12} Q ${cx - rx * 0.5} ${neckY + 20} ${cx - rx * 0.6} ${bot - 30}`} />
      <path d={`M ${cx + rx * 0.45} ${neckY - 12} Q ${cx + rx * 0.5} ${neckY + 20} ${cx + rx * 0.6} ${bot - 30}`} />
    </g>
  ),
}

/** Avatar ritagliato sul viso, dentro un cerchio (per header, voti, bacheca). */
export function Face({ look, outfit, d = 48, className = '' }: { look: Look; outfit?: Outfit; d?: number; className?: string }) {
  const s = d * 1.5
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-full border-2 border-ink bg-sky ${className}`} style={{ width: d, height: d }}>
      <span className="absolute" style={{ left: d / 2 - s / 2, top: d / 2 - 0.72 * s }}>
        <Avatar look={look} outfit={outfit} stage="adulto" mood="felice" size={s} animate={false} />
      </span>
    </span>
  )
}
