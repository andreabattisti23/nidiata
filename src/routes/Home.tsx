import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { listFamilies } from '../lib/identity'
import { timeAgo } from '../lib/hooks'

const PARADE = [
  { look: { species: 'gattino', color: '#ffc6d9', pattern: 'pancino' }, outfit: { hat: 'fiocco', top: 'vestito-fiori' }, mood: 'felice' as const, stage: 'bambino' as const },
  { look: { species: 'draghetto', color: '#c3f2c0', pattern: 'macchie' }, outfit: { hat: 'mago' }, mood: 'ok' as const, stage: 'neonato' as const },
  { look: { species: 'coniglio', color: '#b9c8ff', pattern: 'liscio' }, outfit: { top: 'maglia-righe', acc: 'occhiali-sole' }, mood: 'felice' as const, stage: 'ragazzo' as const },
  { look: { species: 'pulcino', color: '#fff3a3', pattern: 'pancino' }, outfit: { acc: 'ciuccio' }, mood: 'dorme' as const, stage: 'neonato' as const },
  { look: { species: 'orsetto', color: '#c9a27e', pattern: 'pancino' }, outfit: { hat: 'berretto', acc: 'sciarpa', top: 'salopette' }, mood: 'felice' as const, stage: 'bambino' as const },
]

export function HomePage() {
  const families = listFamilies()
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const openCode = () => {
    const m = code.trim().match(/\/s\/([a-z0-9]+)/) ?? code.trim().match(/^([a-z0-9]{6,16})$/)
    if (m) navigate({ to: '/s/$sessionId/unisciti', params: { sessionId: m[1] } })
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <header className="text-center">
        <p className="chip mx-auto mb-3 bg-butter">🥚 un tamagotchi da crescere in due</p>
        <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">
          Nidi<span className="text-berry">ata</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg opacity-80">
          Crescete insieme i vostri cuccioli digitali: pappe, bagnetti, vestitini e imprevisti da decidere in coppia.
        </p>
      </header>

      <div className="mt-6 flex items-end justify-center gap-0 sm:gap-2">
        {PARADE.map((p, i) => (
          <div key={i} className={i % 2 ? 'translate-y-2' : ''}>
            <Avatar {...p} size={i === 2 ? 120 : 92} />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-xl font-bold">🏡 Nuova famiglia</h2>
          <p className="mt-1 text-sm opacity-75">Crea la tua casetta e poi manda il link alla persona con cui vuoi giocare.</p>
          <Link to="/nuova" className="btn-primary mt-4 w-full text-lg">
            Inizia ✨
          </Link>
        </div>
        <div className="card p-5">
          <h2 className="text-xl font-bold">💌 Hai un invito?</h2>
          <p className="mt-1 text-sm opacity-75">Apri direttamente il link, oppure incollalo qui sotto.</p>
          <div className="mt-4 flex gap-2">
            <input className="input" placeholder="Link o codice famiglia" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && openCode()} />
            <button className="btn-soft" onClick={openCode}>
              Vai
            </button>
          </div>
        </div>
      </div>

      {families.length > 0 && (
        <section className="card mt-4 p-5">
          <h2 className="mb-3 text-xl font-bold">Le tue famiglie</h2>
          <ul className="grid gap-2">
            {families.map((f) => (
              <li key={f.id}>
                <Link
                  to="/s/$sessionId"
                  params={{ sessionId: f.id }}
                  className="flex items-center justify-between rounded-2xl border-2 border-ink bg-white px-4 py-3 font-semibold transition hover:bg-pink"
                >
                  <span>🏠 {f.name}</span>
                  <span className="text-xs opacity-60">aperta {timeAgo(f.lastOpen)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
        {[
          ['🍼', 'Prenditene cura', 'Pappe, bagnetti, nanne, coccole e compiti. Il tempo scorre anche quando siete offline!'],
          ['🎲', 'Decidete in due', 'Imprevisti a sorpresa: votate entrambi. Se non siete d\'accordo decide la monetina!'],
          ['👗', 'Vestiteli', 'Guadagnate monete con lavoretti e minigiochi e riempite il guardaroba.'],
        ].map(([e, t, d]) => (
          <div key={t} className="rounded-3xl border-[3px] border-dashed border-ink/40 p-4">
            <p className="text-2xl">{e}</p>
            <p className="font-bold">{t}</p>
            <p className="opacity-75">{d}</p>
          </div>
        ))}
      </section>
      <p className="mt-6 text-center text-sm">
        <Link to="/album" className="font-semibold underline decoration-wavy decoration-berry underline-offset-4">📸 Sfoglia l'album di cuccioli e vestiti</Link>
      </p>
    </main>
  )
}
