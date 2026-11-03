import { useEffect, type ReactNode } from 'react'
import { STAT_INFO } from '../game/catalog'
import type { StatKey } from '../game/types'
import { tr, useT } from '../i18n'

export function StatBar({ stat, value, compact = false }: { stat: StatKey; value: number; compact?: boolean }) {
  const { c } = useT()
  const info = STAT_INFO[stat]
  const name = c.stat(stat)
  const v = Math.round(value)
  const low = v < 25
  return (
    <div className={compact ? '' : 'space-y-1'}>
      {!compact && (
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>
            {info.emoji} {name}
          </span>
          <span className={low ? 'text-red-600' : 'opacity-70'}>{v}%</span>
        </div>
      )}
      <div className={`overflow-hidden rounded-full border-2 border-ink bg-white ${compact ? 'h-2.5' : 'h-4'} ${low ? 'badge-pulse' : ''}`} title={`${name}: ${v}%`}>
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${v}%`, background: low ? '#ff6b6b' : info.color }} />
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 backdrop-blur-[2px] sm:items-center" onClick={onClose}>
      <div className={`card pop-in max-h-[88dvh] w-full overflow-y-auto p-5 ${wide ? 'max-w-2xl' : 'max-w-md'}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-3">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          <button className="ml-auto grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-white text-lg font-bold" onClick={onClose} aria-label={tr('common.close')}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Coins({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 font-bold tabular-nums ${className}`}>
      <span aria-hidden>🪙</span>
      {n}
    </span>
  )
}

export function Section({ title, right, children, className = '' }: { title: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`card p-4 sm:p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <div className="text-center">
        <div className="mx-auto mb-3 text-5xl av-bob">🐣</div>
        <p className="font-semibold opacity-70">{label ?? tr('common.loading')}</p>
      </div>
    </div>
  )
}
