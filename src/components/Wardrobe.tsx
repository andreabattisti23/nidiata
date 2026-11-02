import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ITEMS, itemById } from '../game/catalog'
import type { Outfit, Slot, Target } from '../game/types'
import { useAct } from '../lib/hooks'
import { useSession } from '../lib/session'

const SLOTS: { id: Slot; name: string; emoji: string }[] = [
  { id: 'top', name: 'Vestiti', emoji: '👕' },
  { id: 'hat', name: 'Cappelli', emoji: '🎩' },
  { id: 'acc', name: 'Accessori', emoji: '🕶️' },
]

export function Wardrobe({ target, outfit }: { target: Target; outfit: Outfit }) {
  const { state, sessionId } = useSession()
  const act = useAct(sessionId, { silent: true })
  const [slot, setSlot] = useState<Slot>('top')
  const owned = ITEMS.filter((i) => i.slot === slot && state.inventory.includes(i.id))
  const current = outfit[slot]

  return (
    <div>
      <div className="mb-3 flex gap-1.5">
        {SLOTS.map((s) => (
          <button key={s.id} className={`chip px-3 py-1 text-sm ${slot === s.id ? 'bg-lilac' : ''}`} onClick={() => setSlot(s.id)}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        <button
          className={`rounded-2xl border-2 border-ink p-2 text-center text-xs font-semibold ${!current ? 'bg-pink shadow-[2px_2px_0_var(--color-ink)]' : 'bg-white'}`}
          onClick={() => act.mutate({ type: 'equip', target, slot, itemId: null })}
          disabled={act.isPending}
        >
          <span className="block text-2xl">🚫</span>
          Niente
        </button>
        {owned.map((i) => (
          <button
            key={i.id}
            className={`rounded-2xl border-2 border-ink p-2 text-center text-xs font-semibold leading-tight transition ${current === i.id ? 'bg-pink shadow-[2px_2px_0_var(--color-ink)]' : 'bg-white hover:bg-cream'}`}
            onClick={() => act.mutate({ type: 'equip', target, slot, itemId: i.id })}
            disabled={act.isPending}
          >
            <span className="block text-2xl">{i.emoji}</span>
            {i.name}
          </button>
        ))}
        <Link to="/s/$sessionId/negozio" params={{ sessionId }} className="grid place-items-center rounded-2xl border-2 border-dashed border-ink/50 p-2 text-center text-xs font-semibold opacity-80 hover:opacity-100">
          <span className="block text-2xl">🛍️</span>
          Compra altro
        </Link>
      </div>
      {current && <p className="mt-2 text-xs opacity-60">Indossa: {itemById(current)?.name}</p>}
    </div>
  )
}
