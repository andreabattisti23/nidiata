import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { Coins } from '../components/ui'
import { ITEMS, itemById } from '../game/catalog'
import type { Look, Outfit, Slot, Stage } from '../game/types'
import { useAct } from '../lib/hooks'
import { useSession } from '../lib/session'

const FILTERS: { id: Slot | 'all'; name: string }[] = [
  { id: 'all', name: 'Tutto' },
  { id: 'top', name: '👕 Vestiti' },
  { id: 'hat', name: '🎩 Cappelli' },
  { id: 'acc', name: '🕶️ Accessori' },
]

export function ShopPage() {
  const { state, sessionId, me } = useSession()
  const act = useAct(sessionId)
  const [filter, setFilter] = useState<Slot | 'all'>('all')
  const models = [
    ...state.kids.map((k) => ({ id: k.id, name: k.name, look: k as Look, outfit: k.outfit, stage: k.stage })),
    { id: me.id, name: `${me.name} (tu)`, look: me as Look, outfit: me.outfit, stage: 'adulto' as Stage },
  ]
  const [modelId, setModelId] = useState(models[0].id)
  const [tryOn, setTryOn] = useState<string | null>(null)
  const model = models.find((m) => m.id === modelId) ?? models[0]
  const tried = itemById(tryOn)
  const outfit: Outfit = tried ? { ...model.outfit, [tried.slot]: tried.id } : model.outfit
  const items = ITEMS.filter((i) => i.price > 0 && (filter === 'all' || i.slot === filter))

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <aside className="card h-fit p-4 lg:sticky lg:top-4">
        <h2 className="text-xl font-bold">🛍️ Boutique Nidiata</h2>
        <p className="text-sm opacity-70">Tocca un capo per provarlo in camerino.</p>
        <div className="my-3 grid place-items-center rounded-3xl border-[3px] border-ink bg-[repeating-linear-gradient(45deg,#ffe8f0_0_14px,#fff_14px_28px)] py-4">
          <Avatar look={model.look} outfit={outfit} stage={model.stage} mood="felice" size={170} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {models.map((m) => (
            <button key={m.id} className={`chip ${m.id === modelId ? 'bg-pink' : ''}`} onClick={() => setModelId(m.id)}>
              {m.name}
            </button>
          ))}
        </div>
        {tried && (
          <div className="mt-3 rounded-2xl border-2 border-ink bg-white p-3">
            <p className="font-bold">{tried.emoji} {tried.name}</p>
            {state.inventory.includes(tried.id) ? (
              <p className="text-sm opacity-70">Già nel guardaroba ✅</p>
            ) : (
              <button className="btn-primary mt-2 w-full" disabled={act.isPending || state.coins < tried.price} onClick={() => act.mutate({ type: 'buy', itemId: tried.id })}>
                Compra per {tried.price} 🪙
              </button>
            )}
          </div>
        )}
        <p className="mt-3 text-sm">
          In cassa: <Coins n={state.coins} />
        </p>
      </aside>

      <div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button key={f.id} className={`chip px-3 py-1 text-sm ${filter === f.id ? 'bg-lilac' : ''}`} onClick={() => setFilter(f.id)}>
              {f.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((i) => {
            const owned = state.inventory.includes(i.id)
            return (
              <button
                key={i.id}
                onClick={() => setTryOn(i.id)}
                className={`card relative p-3 text-left transition hover:-translate-y-0.5 ${tryOn === i.id ? 'bg-pink' : ''}`}
              >
                {i.rare && <span className="chip absolute right-2 top-2 bg-butter">✨ raro</span>}
                <span className="text-4xl">{i.emoji}</span>
                <p className="mt-1 font-bold leading-tight">{i.name}</p>
                <p className="mt-1 text-sm">{owned ? <span className="font-semibold text-[#2b8a3e]">Ce l'avete ✅</span> : <Coins n={i.price} />}</p>
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-sm opacity-70">💡 Alcuni capi speciali si vincono solo con gli imprevisti e la ruota della fortuna!</p>
      </div>
    </div>
  )
}
