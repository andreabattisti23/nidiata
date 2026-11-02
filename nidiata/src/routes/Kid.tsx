import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { LookPicker } from '../components/LookPicker'
import { Room } from '../components/Scene'
import { Wardrobe } from '../components/Wardrobe'
import { Coins, Modal, Section, StatBar } from '../components/ui'
import { FOODS, STAGES, TRAITS, foodById } from '../game/catalog'
import { CARE_COOLDOWN, MOOD_LABEL, cooldownLeft, moodOf, nextStage } from '../game/engine'
import type { CareKind, Look } from '../game/types'
import { fmtLeft, timeAgo, useAct, useNow } from '../lib/hooks'
import { useSession } from '../lib/session'

const ACTIONS: { kind: CareKind; label: string; emoji: string; color: string }[] = [
  { kind: 'feed', label: 'Pappa', emoji: '🍽️', color: 'bg-peach' },
  { kind: 'play', label: 'Gioca', emoji: '🎈', color: 'bg-pink' },
  { kind: 'bath', label: 'Bagnetto', emoji: '🛁', color: 'bg-sky' },
  { kind: 'sleep', label: 'Nanna', emoji: '🌙', color: 'bg-lilac' },
  { kind: 'cuddle', label: 'Coccole', emoji: '🤗', color: 'bg-pink' },
  { kind: 'sing', label: 'Canta', emoji: '🎶', color: 'bg-butter' },
  { kind: 'study', label: 'Studia', emoji: '📚', color: 'bg-mint' },
  { kind: 'medicine', label: 'Medicina', emoji: '💊', color: 'bg-white' },
]

export function KidPage() {
  const { kidId } = useParams({ from: '/s/$sessionId/cucciolo/$kidId' })
  const { state, sessionId } = useSession()
  const now = useNow(1000)
  const [foodOpen, setFoodOpen] = useState(false)
  const [styleOpen, setStyleOpen] = useState(false)
  const [floats, setFloats] = useState<{ id: number; emoji: string }[]>([])
  const act = useAct(sessionId, {
    onResult: (r) => {
      if (!r.result) return
      const id = Math.random()
      setFloats((f) => [...f, { id, emoji: r.result!.emoji }])
      setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1100)
    },
  })
  const kid = state.kids.find((k) => k.id === kidId)

  if (!kid)
    return (
      <div className="card p-6 text-center">
        <p className="text-4xl">🔍</p>
        <p className="font-bold">Cucciolo non trovato</p>
        <Link to="/s/$sessionId" params={{ sessionId }} className="btn-primary mt-3">Torna a casa</Link>
      </div>
    )

  const mood = moodOf(kid)
  const stage = STAGES.find((s) => s.id === kid.stage)!
  const next = nextStage(kid.xp)
  const progress = next ? ((kid.xp - stage.xp) / (next.xp - stage.xp)) * 100 : 100
  const days = Math.max(1, Math.ceil((now - kid.bornAt) / 86_400_000))
  const kidLog = state.log.filter((l) => l.kidId === kid.id).slice(0, 8)
  const fav = foodById(kid.favoriteFood)
  const knowsFav = state.log.some((l) => l.kidId === kid.id && l.text.includes('preferito'))

  const care = (kind: CareKind, foodId?: string) => act.mutate({ type: 'care', kidId: kid.id, kind, foodId })

  return (
    <div className="space-y-4">
      <Link to="/s/$sessionId" params={{ sessionId }} className="text-sm font-semibold opacity-70 hover:opacity-100">← Casa</Link>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Room compact>
            <div className="relative flex min-h-[260px] flex-col items-center justify-end pb-4 pt-20">
              <button onClick={() => care('cuddle')} title="Fai una coccola" className="relative">
                <Avatar look={kid} outfit={kid.outfit} stage={kid.stage} mood={mood} size={190} />
                {floats.map((f) => (
                  <span key={f.id} className="float-up pointer-events-none absolute left-1/2 top-6 text-4xl">{f.emoji}</span>
                ))}
              </button>
              <span className="rounded-full border-2 border-ink bg-white px-4 py-1 text-xl font-bold shadow-[3px_3px_0_var(--color-ink)]">{kid.name}</span>
              <span className="mt-1.5 rounded-full bg-white/80 px-3 text-sm font-semibold">{MOOD_LABEL[mood]}</span>
            </div>
          </Room>

          <Section title="Come sta" right={<span className="text-sm font-semibold opacity-70">🧠 {Math.round(kid.smarts)}</span>}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['fame', 'energia', 'igiene', 'felicita', 'salute'] as const).map((s) => (
                <StatBar key={s} stat={s} value={kid.stats[s]} />
              ))}
              <div className="space-y-1">
                <div className="flex justify-between text-sm font-semibold">
                  <span>🧠 Intelligenza</span>
                  <span className="opacity-70">{Math.round(kid.smarts)}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full border-2 border-ink bg-white">
                  <div className="h-full rounded-full bg-[#845ef7] transition-[width] duration-700" style={{ width: `${kid.smarts}%` }} />
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Prenditi cura di lui">
            <div className="grid grid-cols-4 gap-2">
              {ACTIONS.map((a) => {
                const kind = a.kind === 'sleep' && kid.asleep ? 'wake' : a.kind
                const left = CARE_COOLDOWN[kind] ? cooldownLeft(kid.cooldowns, 'care:' + kind, now) : 0
                const blocked = (kid.asleep && !['wake', 'cuddle', 'sing', 'medicine'].includes(kind)) || (kind === 'study' && kid.stage === 'neonato')
                return (
                  <button
                    key={a.kind}
                    className={`btn flex-col gap-0.5 px-1 py-2 text-xs ${a.color} ${kind === 'medicine' && kid.sick ? 'badge-pulse bg-[#ffd6d6]' : ''}`}
                    disabled={act.isPending || left > 0 || blocked}
                    onClick={() => (kind === 'feed' ? setFoodOpen(true) : care(kind))}
                  >
                    <span className="text-2xl">{kind === 'wake' ? '⏰' : a.emoji}</span>
                    {left > 0 ? fmtLeft(left) : kind === 'wake' ? 'Sveglia' : a.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-xs opacity-60">Tocca il cucciolo per fargli una coccola. Le cure lo fanno crescere!</p>
          </Section>

          <Section title={`${stage.emoji} ${stage.name}`} right={<button className="chip" onClick={() => setStyleOpen(true)}>🎨 Aspetto</button>}>
            <div className="text-sm">
              <div className="mb-1 flex justify-between font-semibold">
                <span>Crescita</span>
                <span className="opacity-70">{next ? `verso ${next.name.toLowerCase()} ${next.emoji}` : 'Completamente cresciuto!'}</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border-2 border-ink bg-white">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#ff8fab,#ffd43b)] transition-[width] duration-700" style={{ width: `${Math.min(100, progress)}%` }} />
              </div>
              <ul className="mt-3 space-y-1">
                <li>🎂 Con voi da {days} {days === 1 ? 'giorno' : 'giorni'}</li>
                <li>🍴 Cibo preferito: {knowsFav && fav ? `${fav.emoji} ${fav.name}` : 'scopritelo provando! 🤫'}</li>
                <li>🫶 Attenzioni ricevute: {kid.careCount}</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {kid.traits.map((t) => (
                  <span key={t} className="chip bg-butter" title={TRAITS[t]?.desc}>
                    {TRAITS[t]?.emoji} {TRAITS[t]?.name}
                  </span>
                ))}
              </div>
            </div>
          </Section>

          <Section title="👗 Guardaroba">
            <Wardrobe target={{ type: 'kid', id: kid.id }} outfit={kid.outfit} />
          </Section>
        </div>
      </div>

      {kidLog.length > 0 && (
        <Section title={`📔 I ricordi di ${kid.name}`}>
          <ul className="space-y-2 text-sm">
            {kidLog.map((l) => (
              <li key={l.id} className="flex gap-2">
                <span>{l.emoji}</span>
                <span className="flex-1">{l.text}</span>
                <span className="shrink-0 text-xs opacity-50">{timeAgo(l.at, now)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Modal open={foodOpen} onClose={() => setFoodOpen(false)} title={`Cosa mangia ${kid.name}?`}>
        <p className="mb-3 text-sm">
          In cassa: <Coins n={state.coins} />
        </p>
        <div className="grid grid-cols-2 gap-2">
          {FOODS.filter((f) => (kid.stage === 'neonato' ? !f.notBaby : !f.onlyBaby)).map((f) => (
            <button
              key={f.id}
              className="btn-soft flex-col items-start gap-0 px-3 py-2 text-left"
              disabled={act.isPending || state.coins < f.cost}
              onClick={() => {
                care('feed', f.id)
                setFoodOpen(false)
              }}
            >
              <span className="text-2xl">{f.emoji}</span>
              <span className="text-sm">{f.name}</span>
              <span className="text-xs font-medium opacity-70">
                {f.cost} 🪙 · {Object.entries(f.effects).map(([k, v]) => `${v! > 0 ? '+' : ''}${v} ${({ fame: '🍽️', felicita: '💖', salute: '🩺', energia: '⚡', igiene: '🫧' } as Record<string, string>)[k]}`).join(' ')}
              </span>
            </button>
          ))}
        </div>
      </Modal>

      <RestyleModal open={styleOpen} onClose={() => setStyleOpen(false)} initial={kid} onSave={(l) => act.mutate({ type: 'restyle', target: { type: 'kid', id: kid.id }, ...l })} stage={kid.stage} outfit={kid.outfit} />
    </div>
  )
}

export function RestyleModal({ open, onClose, initial, onSave, stage, outfit }: {
  open: boolean
  onClose: () => void
  initial: Look
  onSave: (l: Look) => void
  stage: Parameters<typeof LookPicker>[0]['stage']
  outfit: Parameters<typeof LookPicker>[0]['outfit']
}) {
  const [look, setLook] = useState<Look>({ species: initial.species, color: initial.color, pattern: initial.pattern })
  return (
    <Modal open={open} onClose={onClose} title="🎨 Cambia aspetto" wide>
      <LookPicker value={look} onChange={setLook} stage={stage} outfit={outfit} />
      <button
        className="btn-primary mt-4 w-full"
        onClick={() => {
          onSave(look)
          onClose()
        }}
      >
        Salva
      </button>
    </Modal>
  )
}
