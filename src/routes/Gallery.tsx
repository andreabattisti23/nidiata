import { Link } from '@tanstack/react-router'
import { Avatar } from '../components/Avatar'
import { COLORS, ITEMS, SPECIES } from '../game/catalog'
import type { Mood, Stage } from '../game/types'
import { useT } from '../i18n'

const MOODS: Mood[] = ['felice', 'ok', 'triste', 'dorme', 'malato', 'affamato', 'sporco', 'stanco']
const STAGES: Stage[] = ['neonato', 'bambino', 'ragazzo', 'adulto']

/** Album di tutti i personaggi, umori e vestiti: utile per vedere cosa si può sbloccare. */
export function GalleryPage() {
  const { t, c } = useT()
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Link to="/" className="text-sm font-semibold opacity-70">{t('common.home')}</Link>
      <h1 className="text-4xl font-bold">{t('ga.title')}</h1>

      <section className="card p-4">
        <h2 className="mb-2 text-xl font-bold">{t('ga.species')}</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {SPECIES.map((s, i) => (
            <div key={s.id} className="text-center">
              <Avatar look={{ species: s.id, color: COLORS[i], pattern: ['liscio', 'pancino', 'macchie', 'lentiggini'][i % 4] }} mood="felice" size={110} />
              <p className="text-sm font-bold">{c.species(s.id)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-xl font-bold">{t('ga.ages')}</h2>
        <div className="flex flex-wrap items-end justify-center gap-3">
          {STAGES.map((st) => (
            <div key={st} className="text-center">
              <Avatar look={{ species: 'gattino', color: '#ffd8a8', pattern: 'pancino' }} outfit={{ top: 'maglia-righe' }} stage={st} mood="ok" size={120} />
              <p className="text-sm font-bold">{c.stage(st)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-xl font-bold">{t('ga.moods')}</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {MOODS.map((m) => (
            <div key={m} className="text-center">
              <Avatar look={{ species: 'orsetto', color: '#a8e6f0', pattern: 'liscio' }} mood={m} size={100} />
              <p className="text-sm font-bold">{t(`mood.${m}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-xl font-bold">{t('ga.wardrobe')}</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
          {ITEMS.map((it, i) => (
            <div key={it.id} className="rounded-2xl border-2 border-ink bg-white p-1 text-center">
              <Avatar look={{ species: SPECIES[i % SPECIES.length].id, color: COLORS[(i * 5) % COLORS.length], pattern: 'liscio' }} outfit={{ [it.slot]: it.id }} stage={i % 2 ? 'bambino' : 'ragazzo'} mood="felice" size={100} animate={false} />
              <p className="text-xs font-bold">{it.emoji} {c.item(it.id)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
