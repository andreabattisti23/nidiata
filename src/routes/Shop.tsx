import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { Coins } from '../components/ui'
import { ITEMS, itemById } from '../game/catalog'
import type { Look, Outfit, Slot, Stage } from '../game/types'
import { useT } from '../i18n'
import { useAct } from '../lib/hooks'
import { useSession } from '../lib/session'

const FILTERS: { id: Slot | 'all'; key: 'shop.all' | 'wd.top' | 'wd.hat' | 'wd.acc'; emoji: string }[] = [
  { id: 'all', key: 'shop.all', emoji: '' },
  { id: 'top', key: 'wd.top', emoji: '👕' },
  { id: 'hat', key: 'wd.hat', emoji: '🎩' },
  { id: 'acc', key: 'wd.acc', emoji: '🕶️' },
]

export function ShopPage() {
  const { state, sessionId, me } = useSession()
  const { t, c } = useT()
  const act = useAct(sessionId)
  const [filter, setFilter] = useState<Slot | 'all'>('all')
  const models = [
    ...state.kids.map((k) => ({ id: k.id, name: k.name, look: k as Look, outfit: k.outfit, stage: k.stage })),
    { id: me.id, name: `${me.name} ${t('common.you')}`, look: me as Look, outfit: me.outfit, stage: 'adulto' as Stage },
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
        <h2 className="text-xl font-bold">{t('shop.title')}</h2>
        <p className="text-sm opacity-70">{t('shop.tryHint')}</p>
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
            <p className="font-bold">
              {tried.emoji} {c.item(tried.id)}
            </p>
            {state.inventory.includes(tried.id) ? (
              <p className="text-sm opacity-70">{t('shop.owned')}</p>
            ) : (
              <button className="btn-primary mt-2 w-full" disabled={act.isPending || state.coins < tried.price} onClick={() => act.mutate({ type: 'buy', itemId: tried.id })}>
                {t('shop.buy', { n: tried.price })}
              </button>
            )}
          </div>
        )}
        <p className="mt-3 text-sm">
          {t('common.inCash')} <Coins n={state.coins} />
        </p>
      </aside>

      <div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button key={f.id} className={`chip px-3 py-1 text-sm ${filter === f.id ? 'bg-lilac' : ''}`} onClick={() => setFilter(f.id)}>
              {f.emoji} {t(f.key)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((i) => {
            const owned = state.inventory.includes(i.id)
            return (
              <button key={i.id} onClick={() => setTryOn(i.id)} className={`card relative p-3 text-left transition hover:-translate-y-0.5 ${tryOn === i.id ? 'bg-pink' : ''}`}>
                {i.rare && <span className="chip absolute right-2 top-2 bg-butter">{t('shop.rare')}</span>}
                <span className="text-4xl">{i.emoji}</span>
                <p className="mt-1 font-bold leading-tight">{c.item(i.id)}</p>
                <p className="mt-1 text-sm">{owned ? <span className="font-semibold text-[#2b8a3e]">{t('shop.have')}</span> : <Coins n={i.price} />}</p>
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-sm opacity-70">{t('shop.tip')}</p>
      </div>
    </div>
  )
}
