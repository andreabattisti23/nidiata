import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LookPicker, randomLook } from '../components/LookPicker'
import { TRAITS } from '../game/catalog'
import type { Look } from '../game/types'
import { useAct } from '../lib/hooks'
import { useSession } from '../lib/session'

const NAMES = ['Biscotto', 'Nuvola', 'Pepe', 'Mirtillo', 'Zuccherino', 'Polpetta', 'Leo', 'Luna', 'Gnocchi', 'Briciola', 'Tofu', 'Stella', 'Pistacchio', 'Mela', 'Brio']

const rollTraits = () => {
  const keys = Object.keys(TRAITS).sort(() => Math.random() - 0.5)
  return keys.slice(0, 2)
}

export function NewKidPage() {
  const { sessionId, state } = useSession()
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
        <p className="font-bold">Casa piena! Massimo 5 cuccioli.</p>
      </div>
    )

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/s/$sessionId" params={{ sessionId }} className="text-sm font-semibold opacity-70 hover:opacity-100">← Casa</Link>
      <h1 className="mt-1 text-3xl font-bold">Un nuovo cucciolo! 🐣</h1>
      <p className="opacity-75">Sceglietelo insieme: nascerà come neonato e crescerà con le vostre cure.</p>
      <form
        className="card mt-4 space-y-5 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          act.mutate({ type: 'addKid', name, ...look, traits })
        }}
      >
        <label className="block">
          <span className="mb-1.5 block font-bold">Nome</span>
          <div className="flex gap-2">
            <input className="input" required maxLength={16} placeholder="Come lo chiamiamo?" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="button" className="btn-soft" title="Nome a caso" onClick={() => setName(NAMES[Math.floor(Math.random() * NAMES.length)])}>
              🎲
            </button>
          </div>
        </label>
        <LookPicker value={look} onChange={setLook} stage="neonato" />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-bold">Carattere</span>
            <button type="button" className="chip bg-butter" onClick={() => setTraits(rollTraits())}>🎲 Rimescola</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {traits.map((t) => (
              <div key={t} className="rounded-2xl border-2 border-ink bg-white p-3">
                <p className="font-bold">{TRAITS[t].emoji} {TRAITS[t].name}</p>
                <p className="text-sm opacity-75">{TRAITS[t].desc}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="btn-primary w-full text-lg" disabled={!name.trim() || act.isPending}>
          {act.isPending ? 'Sta nascendo...' : `Benvenuto ${name || 'piccolo'}! 🎉`}
        </button>
      </form>
    </div>
  )
}
