import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { Flag, LangGrid } from '../components/LangPicker'
import { Modal } from '../components/ui'
import { useT } from '../i18n'
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
  const { t, lang } = useT()
  const families = listFamilies()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [langOpen, setLangOpen] = useState(false)

  const openCode = () => {
    const m = code.trim().match(/\/s\/([a-z0-9]+)/) ?? code.trim().match(/^([a-z0-9]{6,16})$/)
    if (m) navigate({ to: '/s/$sessionId/unisciti', params: { sessionId: m[1] } })
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <div className="flex justify-end">
        <button className="btn-soft gap-2 px-2.5 py-1.5 text-sm" onClick={() => setLangOpen(true)} aria-label={t('lang.label')}>
          <Flag lang={lang} size={24} />
          {t('lang.label')}
        </button>
      </div>
      <header className="mt-2 text-center">
        <p className="chip mx-auto mb-3 bg-butter">{t('home.badge')}</p>
        <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">
          Nidi<span className="text-berry">ata</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg opacity-80">{t('home.sub')}</p>
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
          <h2 className="text-xl font-bold">{t('home.newTitle')}</h2>
          <p className="mt-1 text-sm opacity-75">{t('home.newText')}</p>
          <Link to="/nuova" className="btn-primary mt-4 w-full text-lg">
            {t('home.start')}
          </Link>
        </div>
        <div className="card p-5">
          <h2 className="text-xl font-bold">{t('home.inviteTitle')}</h2>
          <p className="mt-1 text-sm opacity-75">{t('home.inviteText')}</p>
          <div className="mt-4 flex gap-2">
            <input className="input" placeholder={t('home.codePh')} value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && openCode()} />
            <button className="btn-soft" onClick={openCode}>
              {t('common.go')}
            </button>
          </div>
        </div>
      </div>

      {families.length > 0 && (
        <section className="card mt-4 p-5">
          <h2 className="mb-3 text-xl font-bold">{t('home.yours')}</h2>
          <ul className="grid gap-2">
            {families.map((f) => (
              <li key={f.id}>
                <Link
                  to="/s/$sessionId"
                  params={{ sessionId: f.id }}
                  className="flex items-center justify-between gap-2 rounded-2xl border-2 border-ink bg-white px-4 py-3 font-semibold transition hover:bg-pink"
                >
                  <span className="truncate">🏠 {f.name}</span>
                  <span className="shrink-0 text-xs opacity-60">{t('home.opened', { t: timeAgo(f.lastOpen) })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
        {(
          [
            ['🍼', 'home.f1t', 'home.f1d'],
            ['🎲', 'home.f2t', 'home.f2d'],
            ['👗', 'home.f3t', 'home.f3d'],
          ] as const
        ).map(([e, ti, d]) => (
          <div key={ti} className="rounded-3xl border-[3px] border-dashed border-ink/40 p-4">
            <p className="text-2xl">{e}</p>
            <p className="font-bold">{t(ti)}</p>
            <p className="opacity-75">{t(d)}</p>
          </div>
        ))}
      </section>
      <p className="mt-6 text-center text-sm">
        <Link to="/album" className="font-semibold underline decoration-berry decoration-wavy underline-offset-4">
          {t('home.album')}
        </Link>
      </p>

      <Modal open={langOpen} onClose={() => setLangOpen(false)} title={`🌍 ${t('lang.title')}`}>
        <LangGrid onPick={() => setLangOpen(false)} />
      </Modal>
    </main>
  )
}
