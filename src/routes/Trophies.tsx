import { Section } from '../components/ui'
import { ACHIEVEMENTS } from '../game/achievements'
import { useSession } from '../lib/session'

export function TrophiesPage() {
  const { state } = useSession()
  const got = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length
  const c = (k: string) => state.counters[k] ?? 0
  const days = Math.max(1, Math.ceil((Date.now() - state.createdAt) / 86_400_000))

  const stats = [
    ['🗓️', 'Giorni insieme', days],
    ['🫶', 'Cure date', c('care')],
    ['🍽️', 'Pappe servite', c('feed')],
    ['🎲', 'Imprevisti risolti', c('events')],
    ['🤝', 'Decisioni all\'unanimità', c('agree')],
    ['💼', 'Turni di lavoro', c('works')],
    ['🛍️', 'Acquisti', c('buys')],
    ['💌', 'Bigliettini', c('notes')],
  ] as const

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between bg-lilac p-4">
        <div>
          <h2 className="text-2xl font-bold">🏆 Bacheca dei trofei</h2>
          <p className="text-sm opacity-75">Ogni trofeo regala monete alla famiglia.</p>
        </div>
        <p className="text-3xl font-bold">
          {got}/{ACHIEVEMENTS.length}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ACHIEVEMENTS.map((a) => {
          const at = state.achievements[a.id]
          return (
            <div key={a.id} className={`card p-3 ${at ? 'bg-butter' : 'opacity-60 grayscale'}`}>
              <p className="text-4xl">{at ? a.emoji : '🔒'}</p>
              <p className="mt-1 font-bold leading-tight">{a.name}</p>
              <p className="text-xs opacity-75">{a.desc}</p>
              <p className="mt-1 text-xs font-bold">{at ? `✅ ${new Date(at).toLocaleDateString('it-IT')}` : `+${a.reward} 🪙`}</p>
            </div>
          )
        })}
      </div>
      <Section title="📊 Statistiche di famiglia">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map(([e, label, v]) => (
            <div key={label} className="rounded-2xl border-2 border-ink bg-white p-3">
              <p className="text-2xl">{e}</p>
              <p className="text-2xl font-bold tabular-nums">{v}</p>
              <p className="text-xs font-semibold opacity-70">{label}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
