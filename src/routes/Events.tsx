import { Avatar, Face } from '../components/Avatar'
import { Section } from '../components/ui'
import { ASK_EVENT_COOLDOWN, cooldownLeft, moodOf } from '../game/engine'
import { eventById } from '../game/events'
import type { PendingEvent } from '../game/types'
import { useT } from '../i18n'
import { fmtLeft, timeAgo, useAct, useNow } from '../lib/hooks'
import { useSession } from '../lib/session'

function EventCard({ ev }: { ev: PendingEvent }) {
  const { state, me, sessionId } = useSession()
  const { t, c } = useT()
  const act = useAct(sessionId)
  const now = useNow(30_000)
  const tpl = eventById(ev.templateId)
  if (!tpl) return null
  const kid = state.kids.find((k) => k.id === ev.kidId)
  const myVote = ev.votes[me.id]
  const autoIn = ev.createdAt + 6 * 3600_000 - now
  const hasVotes = Object.keys(ev.votes).length > 0

  return (
    <article className="card pop-in overflow-hidden">
      <div className="flex items-center gap-4 border-b-[3px] border-ink bg-butter p-4">
        {kid ? (
          <div className="shrink-0 rounded-2xl border-2 border-ink bg-white">
            <Avatar look={kid} outfit={kid.outfit} stage={kid.stage} mood={moodOf(kid)} size={72} />
          </div>
        ) : (
          <span className="text-5xl">{tpl.emoji}</span>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide opacity-60">{t('ev.label', { t: timeAgo(ev.createdAt, now) })}</p>
          <h3 className="text-xl font-bold">
            {kid && tpl.emoji} {c.event(tpl.id)?.t}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[17px]">{c.eventText(tpl.id, kid?.name)}</p>
        <div className="mt-4 grid gap-2">
          {tpl.options.map((o) => {
            const voters = state.parents.filter((p) => ev.votes[p.id] === o.id)
            return (
              <button
                key={o.id}
                disabled={act.isPending}
                onClick={() => act.mutate({ type: 'vote', eventId: ev.id, optionId: o.id })}
                className={`btn justify-between text-left ${myVote === o.id ? 'bg-pink' : 'bg-white'}`}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xl">{o.emoji}</span>
                  {c.option(tpl.id, o.id)[0]}
                  {o.chance && <span className="chip bg-lilac">{t('ev.risk')}</span>}
                </span>
                <span className="flex -space-x-2">
                  {voters.map((p) => (
                    <span key={p.id} title={p.name}>
                      <Face look={p} outfit={p.outfit} d={30} />
                    </span>
                  ))}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs opacity-60">
          {state.parents.length < 2
            ? t('ev.solo')
            : myVote
              ? hasVotes
                ? t('ev.votedAuto', { t: fmtLeft(Math.max(0, autoIn)) })
                : t('ev.voted')
              : t('ev.voteBoth')}
        </p>
      </div>
    </article>
  )
}

export function EventsPage() {
  const { state, sessionId } = useSession()
  const { t, msg, log } = useT()
  const now = useNow(1000)
  const act = useAct(sessionId)
  const left = cooldownLeft(state.cooldowns, 'askEvent', now)
  const past = state.log.filter((l) => l.m?.[0]?.k === 'log.evDone' || l.text?.includes(' → ')).slice(0, 8)
  const last = state.lastResult

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-2xl font-bold">{t('ev.title')}</h2>
          <p className="text-sm opacity-75">{t('ev.sub')}</p>
        </div>
        <button className="btn-soft bg-butter" disabled={act.isPending || left > 0 || state.events.length >= 2 || !state.kids.length} onClick={() => act.mutate({ type: 'askEvent' })}>
          {left > 0 ? `⏳ ${fmtLeft(left)}` : t('ev.ask')}
        </button>
      </div>

      {last && now - last.at < 10 * 60_000 && (
        <div className="card pop-in flex gap-3 bg-mint p-4">
          <span className="text-3xl">{last.emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide opacity-60">{t('ev.result')}</p>
            <p className="font-semibold">{msg(last.m, last.text)}</p>
          </div>
        </div>
      )}

      {state.events.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {state.events.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-5xl">☕</p>
          <p className="mt-2 text-lg font-bold">{t('ev.calm')}</p>
          <p className="text-sm opacity-70">
            {state.kids.length ? (state.nextEventAt > now ? t('ev.next', { t: fmtLeft(state.nextEventAt - now) }) : t('ev.nextSoon')) : t('ev.noKids')}
          </p>
          <p className="mt-1 text-xs opacity-50">{t('ev.bell', { n: ASK_EVENT_COOLDOWN / 60000 })}</p>
        </div>
      )}

      {past.length > 0 && (
        <Section title={t('ev.past')}>
          <ul className="space-y-2 text-sm">
            {past.map((l) => (
              <li key={l.id} className="flex gap-2 rounded-xl bg-white p-2.5">
                <span>{l.emoji}</span>
                <span className="flex-1">{log(l)}</span>
                <span className="shrink-0 text-xs opacity-50">{timeAgo(l.at, now)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
