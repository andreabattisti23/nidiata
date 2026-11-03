import { Link } from '@tanstack/react-router'
import { Avatar } from '../components/Avatar'
import { Room, timeOfDay } from '../components/Scene'
import { Section, StatBar } from '../components/ui'
import { STAGES } from '../game/catalog'
import { moodOf } from '../game/engine'
import { eventById } from '../game/events'
import type { Kid } from '../game/types'
import { timeAgo, useNow } from '../lib/hooks'
import { useSession } from '../lib/session'
import { useT, type T } from '../i18n'

function alertsFor(kid: Kid, t: T['t']) {
  const a: string[] = []
  const p = { kid: kid.name }
  if (kid.sick) a.push(t('al.sick', p))
  if (kid.stats.fame < 30) a.push(t('al.hungry', p))
  if (kid.stats.igiene < 30) a.push(t('al.dirty', p))
  if (kid.stats.energia < 25 && !kid.asleep) a.push(t('al.tired', p))
  if (kid.stats.felicita < 30) a.push(t('al.sad', p))
  return a
}

export function HousePage() {
  const { state, sessionId, me } = useSession()
  const now = useNow(30_000)
  const { t, c, log } = useT()
  const greet = t(`greet.${timeOfDay()}`)
  const alerts = state.kids.flatMap((k) => alertsFor(k, t))
  const toVote = state.events.filter((e) => !e.votes[me.id])
  const partner = state.parents.find((p) => p.id !== me.id)

  return (
    <div className="space-y-4">
      <p className="px-1 text-lg font-semibold">
        {greet} {me.name}! {partner ? t('house.partnerSeen', { p: partner.name, t: timeAgo(partner.lastSeen, now) }) : t('house.alone')}
      </p>

      {toVote.length > 0 && (
        <Link to="/s/$sessionId/imprevisti" params={{ sessionId }} className="card wiggle flex items-center gap-3 bg-butter p-4 transition hover:-translate-y-0.5">
          <span className="text-4xl">{eventById(toVote[0].templateId)?.emoji}</span>
          <div className="flex-1">
            <p className="font-bold">{toVote.length === 1 ? t('house.evOne') : t('house.evMany', { n: toVote.length })}</p>
            <p className="text-sm opacity-80">{t('house.yourTurn', { ev: c.event(toVote[0].templateId)?.t ?? '' })}</p>
          </div>
          <span className="btn-primary px-3 py-1.5 text-sm">{t('common.go')} →</span>
        </Link>
      )}

      <Room>
        {state.kids.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-end gap-3 pb-8 sm:min-h-[340px]">
            <div className="text-7xl av-bob">🥚</div>
            <Link to="/s/$sessionId/nuovo-cucciolo" params={{ sessionId }} className="btn-primary text-lg">
              {t('house.firstKid')}
            </Link>
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-wrap items-end justify-center gap-x-2 gap-y-4 px-3 pb-5 pt-36 sm:min-h-[340px] sm:pt-28">
            {state.kids.map((k) => {
              const mood = moodOf(k)
              return (
                <Link key={k.id} to="/s/$sessionId/cucciolo/$kidId" params={{ sessionId, kidId: k.id }} className="group flex flex-col items-center">
                  <div className="transition group-hover:-translate-y-2">
                    <Avatar look={k} outfit={k.outfit} stage={k.stage} mood={mood} size={state.kids.length > 3 ? 96 : state.kids.length > 1 ? 130 : 160} />
                  </div>
                  <span className="-mt-1 rounded-full border-2 border-ink bg-white px-3 py-0.5 text-sm font-bold shadow-[2px_2px_0_var(--color-ink)]">
                    {k.name}
                  </span>
                  <span className="mt-1 text-xs font-semibold text-ink/80">{t(`mood.${mood}`)}</span>
                </Link>
              )
            })}
          </div>
        )}
      </Room>

      {state.kids.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.kids.map((k) => (
            <Link key={k.id} to="/s/$sessionId/cucciolo/$kidId" params={{ sessionId, kidId: k.id }} className="card block p-4 transition hover:-translate-y-0.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-bold">
                  {k.name} <span className="font-medium opacity-60">· {STAGES.find((s) => s.id === k.stage)?.emoji} {c.stage(k.stage)}</span>
                </p>
                <span className="text-xs font-semibold opacity-60">{t('house.care')}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['fame', 'energia', 'igiene', 'felicita', 'salute'] as const).map((st) => (
                  <div key={st} className="text-center">
                    <StatBar stat={st} value={k.stats[st]} compact />
                    <span className="text-xs">{{ fame: '🍽️', energia: '⚡', igiene: '🫧', felicita: '💖', salute: '🩺' }[st]}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
          {state.kids.length < 5 && (
            <Link to="/s/$sessionId/nuovo-cucciolo" params={{ sessionId }} className="grid place-items-center rounded-3xl border-[3px] border-dashed border-ink/50 p-4 font-bold opacity-80 transition hover:bg-white hover:opacity-100">
              {t('house.another')}
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={t('house.todo')}>
          {alerts.length ? (
            <ul className="space-y-1.5 text-sm font-medium">
              {alerts.slice(0, 6).map((a) => (
                <li key={a} className="rounded-xl bg-white px-3 py-2">{a}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-70">{state.kids.length ? t('house.allGood') : t('house.noKids')}</p>
          )}
          {state.kids.length > 0 && <p className="mt-3 text-xs opacity-60">{t('house.nonna')}</p>}
        </Section>
        <Section title={t('house.news')} right={<Link to="/s/$sessionId/diario" params={{ sessionId }} className="text-sm font-semibold opacity-70">{t('house.diaryLink')}</Link>}>
          <ul className="space-y-2 text-sm">
            {state.log.slice(0, 5).map((l) => (
              <li key={l.id} className="flex gap-2">
                <span>{l.emoji}</span>
                <span className="flex-1">{log(l)}</span>
                <span className="shrink-0 text-xs opacity-50">{timeAgo(l.at, now)}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  )
}
