import { COLORS, PATTERNS, SPECIES } from '../game/catalog'
import type { Look, Outfit, Stage } from '../game/types'
import { Avatar } from './Avatar'

export function randomLook(): Look {
  const r = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)]
  return { species: r(SPECIES).id, color: r(COLORS), pattern: r(PATTERNS).id }
}

export function LookPicker({ value, onChange, stage = 'bambino', outfit, preview = true }: {
  value: Look
  onChange: (l: Look) => void
  stage?: Stage
  outfit?: Outfit
  preview?: boolean
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start">
      {preview && (
        <div className="relative mx-auto grid h-[190px] w-[180px] place-items-center rounded-3xl border-[3px] border-ink bg-gradient-to-b from-sky to-white">
          <Avatar look={value} outfit={outfit} stage={stage} mood="felice" size={140} />
          <button
            type="button"
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-butter px-3 py-0.5 text-xs font-bold shadow-[2px_2px_0_var(--color-ink)]"
            onClick={() => onChange(randomLook())}
          >
            🎲 A caso
          </button>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <p className="mb-1.5 text-sm font-bold">Specie</p>
          <div className="grid grid-cols-4 gap-1.5">
            {SPECIES.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => onChange({ ...value, species: s.id })}
                className={`rounded-xl border-2 border-ink px-1 py-1.5 text-center text-xs font-semibold leading-tight transition ${value.species === s.id ? 'bg-pink shadow-[2px_2px_0_var(--color-ink)]' : 'bg-white opacity-80 hover:opacity-100'}`}
              >
                <span className="block text-xl">{s.emoji}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-bold">Colore</p>
          <div className="flex flex-wrap gap-1.5">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                aria-label={`Colore ${c}`}
                onClick={() => onChange({ ...value, color: c })}
                className={`h-8 w-8 rounded-full border-[3px] transition ${value.color === c ? 'scale-110 border-ink shadow-[2px_2px_0_var(--color-ink)]' : 'border-ink/30'}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-bold">Motivo</p>
          <div className="flex flex-wrap gap-1.5">
            {PATTERNS.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => onChange({ ...value, pattern: p.id })}
                className={`chip ${value.pattern === p.id ? 'bg-lilac' : ''}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
