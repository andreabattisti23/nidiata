import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LookPicker, randomLook } from '../components/LookPicker'
import { TRAITS } from '../game/catalog'
import type { Look } from '../game/types'
import { useT } from '../i18n'
import { useAct } from '../lib/hooks'
import { useSession } from '../lib/session'

const rollTraits = () => Object.keys(TRAITS).sort(() => Math.random() - 0.5).slice(0, 2)

export function NewKidPage() {
  const { sessionId, state } = useSession()
  const { t, c } = useT()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [look, setLook] = useState<Look>(randomLook)
  const [traits, setTraits] = useState<string[]>(rollTraits)
  const act = useAct(sessionId, {
    onResult: (r) => r.result?.data && navigate({ to: '/s/$sessionId/cucciolo/$kidId', params: { sessionId, kidId: r.result.data } }),
  })

  if (state.kids.length >= 5)
    return (
      <div className="card p-6 text-center">
        <p className="text-4xl">🏠</p>
        <p className="font-bold">{t('nk.full')}</p>
      </div>
    )

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/s/$sessionId" params={{ sessionId }} className="text-sm font-semibold opacity-70 hover:opacity-100">{t('common.house')}</Link>
      <h1 className="mt-1 text-3xl font-bold">{t('nk.title')}</h1>
      <p className="opacity-75">{t('nk.sub')}</p>
      <form
        className="card mt-4 space-y-5 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          act.mutate({ type: 'addKid', name, ...look, traits })
        }}
      >
        <label className="block">
          <span className="mb-1.5 block font-bold">{t('nk.name')}</span>
          <div className="flex gap-2">
            <input className="input" required maxLength={16} placeholder={t('nk.namePh')} value={name} onChange={(e) => setName(e.target.value)} />
            <button type="button" className="btn-soft" title={t('nk.randomName')} onClick={() => setName(c.kidNames[Math.floor(Math.random() * c.kidNames.length)])}>
              🎲
            </button>
          </div>
        </label>
        <LookPicker value={look} onChange={setLook} stage="neonato" />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-bold">{t('nk.traits')}</span>
            <button type="button" className="chip bg-butter" onClick={() => setTraits(rollTraits())}>{t('nk.reroll')}</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {traits.map((tr) => (
              <div key={tr} className="rounded-2xl border-2 border-ink bg-white p-3">
                <p className="font-bold">{TRAITS[tr].emoji} {c.trait(tr)[0]}</p>
                <p className="text-sm opacity-75">{c.trait(tr)[1]}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="btn-primary w-full text-lg" disabled={!name.trim() || act.isPending}>
          {act.isPending ? t('nk.born') : t('nk.welcome', { name: name || t('nk.little') })}
        </button>
      </form>
    </div>
  )
}
