import { Section } from '../components/ui'
import { ACHIEVEMENTS } from '../game/achievements'
import { useT } from '../i18n'
import { useSession } from '../lib/session'

export function TrophiesPage() {
  const { state } = useSession()
  const { t, c, locale } = useT()
  const got = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length
  const n = (k: string) => state.counters[k] ?? 0
  const days = Math.max(1, Math.ceil((Date.now() - state.createdAt) / 86_400_000))

  const stats = [
    ['🗓️', 'st.days', days],
    ['🫶', 'st.care', n('care')],
    ['🍽️', 'st.feed', n('feed')],
    ['🎲', 'st.events', n('events')],
    ['🤝', 'st.agree', n('agree')],
    ['💼', 'st.works', n('works')],
    ['🛍️', 'st.buys', n('buys')],
    ['💌', 'st.notes', n('notes')],
  ] as const

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between gap-3 bg-lilac p-4">
        <div>
          <h2 className="text-2xl font-bold">{t('tr.title')}</h2>
          <p className="text-sm opacity-75">{t('tr.sub')}</p>
        </div>
        <p className="text-3xl font-bold">
          {got}/{ACHIEVEMENTS.length}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ACHIEVEMENTS.map((a) => {
          const at = state.achievements[a.id]
          const [name, desc] = c.ach(a.id)
          return (
            <div key={a.id} className={`card p-3 ${at ? 'bg-butter' : 'opacity-60 grayscale'}`}>
              <p className="text-4xl">{at ? a.emoji : '🔒'}</p>
              <p className="mt-1 font-bold leading-tight">{name}</p>
              <p className="text-xs opacity-75">{desc}</p>
              <p className="mt-1 text-xs font-bold">{at ? `✅ ${new Date(at).toLocaleDateString(locale)}` : `+${a.reward} 🪙`}</p>
            </div>
          )
        })}
      </div>
      <Section title={t('tr.stats')}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map(([e, label, v]) => (
            <div key={label} className="rounded-2xl border-2 border-ink bg-white p-3">
              <p className="text-2xl">{e}</p>
              <p className="text-2xl font-bold tabular-nums">{v}</p>
              <p className="text-xs font-semibold opacity-70">{t(label)}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
