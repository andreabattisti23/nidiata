import { useState } from 'react'
import { Face } from '../components/Avatar'
import { Section } from '../components/ui'
import { STICKERS } from '../game/catalog'
import { useT } from '../i18n'
import { timeAgo, useAct, useNow } from '../lib/hooks'
import { useSession } from '../lib/session'

const NOTE_COLORS = ['#fff3a3', '#ffc6d9', '#c3f2c0', '#a8e6f0', '#dcc3ff']

export function DiaryPage() {
  const { state, me, sessionId } = useSession()
  const { t, log, locale } = useT()
  const now = useNow(30_000)
  const act = useAct(sessionId, { silent: true })
  const [text, setText] = useState('')
  const [sticker, setSticker] = useState(STICKERS[0])
  const [kidFilter, setKidFilter] = useState<string>('tutti')
  const parent = (id: string) => state.parents.find((p) => p.id === id)
  const entries = kidFilter === 'tutti' ? state.log : state.log.filter((l) => l.kidId === kidFilter)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section title={t('di.board')}>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            act.mutate({ type: 'note', text, sticker }, { onSuccess: () => setText('') })
          }}
        >
          <textarea className="input min-h-20 resize-none" maxLength={160} placeholder={t('di.notePh')} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex flex-wrap items-center gap-1">
            {STICKERS.map((s) => (
              <button type="button" key={s} onClick={() => setSticker(s)} className={`grid h-9 w-9 place-items-center rounded-xl border-2 text-lg ${sticker === s ? 'border-ink bg-pink' : 'border-transparent'}`}>
                {s}
              </button>
            ))}
            <button className="btn-primary ml-auto px-4 py-1.5" disabled={!text.trim() || act.isPending}>
              {t('di.attach')}
            </button>
          </div>
        </form>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {state.notes.map((n, i) => {
            const p = parent(n.who)
            return (
              <div
                key={n.id}
                className="relative rounded-2xl border-[3px] border-ink p-3 shadow-[3px_3px_0_var(--color-ink)]"
                style={{ background: NOTE_COLORS[i % NOTE_COLORS.length], transform: `rotate(${((i * 37) % 5) - 2}deg)` }}
              >
                <span className="absolute -right-2 -top-3 text-2xl">{n.sticker}</span>
                <p className="whitespace-pre-wrap break-words font-medium">{n.text}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold opacity-70">
                  {p && <Face look={p} outfit={p.outfit} d={24} />}
                  {p?.name ?? t('common.someone')} {n.who === me.id && t('common.you')} · {timeAgo(n.at, now)}
                </div>
              </div>
            )
          })}
          {!state.notes.length && <p className="text-sm opacity-60">{t('di.empty')}</p>}
        </div>
      </Section>

      <Section title={t('di.title')}>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button className={`chip ${kidFilter === 'tutti' ? 'bg-lilac' : ''}`} onClick={() => setKidFilter('tutti')}>
            {t('di.all')}
          </button>
          {state.kids.map((k) => (
            <button key={k.id} className={`chip ${kidFilter === k.id ? 'bg-lilac' : ''}`} onClick={() => setKidFilter(k.id)}>
              {k.name}
            </button>
          ))}
        </div>
        <ol className="relative space-y-3 border-l-[3px] border-dashed border-ink/30 pl-5">
          {entries.map((l) => (
            <li key={l.id} className="relative">
              <span className="absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-white text-sm">{l.emoji}</span>
              <p className="text-sm">{log(l)}</p>
              <p className="text-xs opacity-50">
                {timeAgo(l.at, now)} · {new Date(l.at).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}
