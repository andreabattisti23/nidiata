import { useState } from 'react'
import { CookieGame } from '../components/CookieGame'
import { Coins, Section } from '../components/ui'
import { Wheel } from '../components/Wheel'
import { JOBS } from '../game/catalog'
import { cooldownLeft } from '../game/engine'
import { fmtLeft, useAct, useNow } from '../lib/hooks'
import { useSession } from '../lib/session'
import { toast } from '../lib/toast'

export function MoneyPage() {
  const { state, me, sessionId } = useSession()
  const now = useNow(1000)
  const act = useAct(sessionId)
  const silent = useAct(sessionId, { silent: true })
  const [gameKey, setGameKey] = useState(0)
  const workLeft = cooldownLeft(me.cooldowns, 'work', now)
  const gameLeft = cooldownLeft(me.cooldowns, 'minigame', now)
  const spinLeft = cooldownLeft(state.cooldowns, 'spin', now)

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 bg-butter p-4">
        <div>
          <h2 className="text-2xl font-bold">🪙 Soldini di famiglia</h2>
          <p className="text-sm opacity-75">Il salvadanaio è condiviso: quello che guadagni tu lo può spendere anche l'altro genitore.</p>
        </div>
        <Coins n={state.coins} className="text-3xl" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="💼 Vai al lavoro" right={workLeft > 0 && <span className="chip bg-lilac">⏳ {fmtLeft(workLeft)}</span>}>
          <div className="grid grid-cols-2 gap-2">
            {JOBS.map((j) => (
              <button key={j.id} className="btn-soft flex-col items-start gap-0 text-left" disabled={act.isPending || workLeft > 0} onClick={() => act.mutate({ type: 'work', jobId: j.id })}>
                <span className="text-3xl">{j.emoji}</span>
                <span>{j.name}</span>
                <span className="text-xs font-medium opacity-70">
                  {j.min}–{j.max} 🪙 · {j.minutes} min
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs opacity-60">Mentre lavori i cuccioli restano a casa con l'altro genitore... organizzatevi!</p>
        </Section>

        <Section title="🎡 Ruota della fortuna" right={<span className="text-xs font-semibold opacity-60">1 giro al giorno per famiglia</span>}>
          <Wheel
            disabled={spinLeft > 0}
            label={spinLeft > 0 ? `Torna tra ${fmtLeft(spinLeft)}` : 'Gira la ruota!'}
            onSpin={async () => {
              const r = await silent.mutateAsync({ type: 'spin' })
              if (r.result) setTimeout(() => toast(r.result!.text, '🎡', 'success'), 3200)
              return r.result?.data
            }}
          />
        </Section>
      </div>

      <Section title="🍪 Minigioco" right={gameLeft > 0 && <span className="chip bg-lilac">⏳ {fmtLeft(gameLeft)}</span>}>
        {gameLeft > 0 ? (
          <div className="grid h-[200px] place-items-center rounded-3xl border-[3px] border-dashed border-ink/40 text-center">
            <div>
              <p className="text-4xl">😮‍💨</p>
              <p className="font-bold">Riposa le dita!</p>
              <p className="text-sm opacity-70">Puoi rigiocare tra {fmtLeft(gameLeft)}</p>
            </div>
          </div>
        ) : (
          <CookieGame
            key={gameKey}
            onFinish={(score) =>
              act.mutate({ type: 'minigame', game: 'biscotti', score }, { onSettled: () => setGameKey((k) => k + 1) })
            }
          />
        )}
        <p className="mt-2 text-xs opacity-60">Record di famiglia: {state.counters.bestScore ?? 0} biscotti</p>
      </Section>
    </div>
  )
}
