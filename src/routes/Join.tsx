import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, Navigate, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { LookPicker, randomLook } from '../components/LookPicker'
import { Spinner } from '../components/ui'
import type { Look } from '../game/types'
import { api } from '../lib/api'
import { getPlayerId, rememberFamily, setPlayerId } from '../lib/identity'
import { toast } from '../lib/toast'

export function JoinPage() {
  const { sessionId } = useParams({ from: '/s/$sessionId/unisciti' })
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [look, setLook] = useState<Look>(randomLook)
  const existing = getPlayerId(sessionId)

  const q = useQuery({ queryKey: ['preview', sessionId], queryFn: () => api.get(sessionId).then((r) => r.state), retry: false })

  const join = useMutation({
    mutationFn: () => api.join(sessionId, { name, ...look }),
    onSuccess: ({ state, playerId }) => {
      setPlayerId(sessionId, playerId)
      rememberFamily(sessionId, state.familyName)
      toast(`Benvenuto nella famiglia ${state.familyName}!`, '💞', 'success')
      navigate({ to: '/s/$sessionId', params: { sessionId } })
    },
    onError: (e) => toast(e.message, '🙈', 'error'),
  })

  if (existing && q.data?.parents.some((p) => p.id === existing)) return <Navigate to="/s/$sessionId" params={{ sessionId }} />
  if (q.isPending) return <Spinner label="Bussiamo alla porta..." />
  if (q.isError)
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <div className="card max-w-sm p-6 text-center">
          <p className="text-5xl">🚪</p>
          <h1 className="mt-2 text-2xl font-bold">Nessuno in casa</h1>
          <p className="mt-1 opacity-70">{q.error.message}</p>
          <Link to="/" className="btn-primary mt-4">Torna alla home</Link>
        </div>
      </div>
    )

  const s = q.data
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="card bg-pink p-5 text-center">
        <p className="text-sm font-bold uppercase tracking-wide opacity-70">Sei stato invitato in</p>
        <h1 className="text-4xl font-bold">{s.familyName}</h1>
        <div className="mt-3 flex items-end justify-center gap-1">
          {s.parents.map((p) => (
            <div key={p.id} className="text-center">
              <Avatar look={p} outfit={p.outfit} stage="adulto" mood="felice" size={80} />
              <p className="text-sm font-bold">{p.name}</p>
            </div>
          ))}
          {s.kids.map((k) => (
            <div key={k.id} className="text-center">
              <Avatar look={k} outfit={k.outfit} stage={k.stage} mood="ok" size={58} />
              <p className="text-xs font-bold">{k.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm">{s.parents[0]?.name} ti aspetta per crescere insieme {s.kids.length ? 'i cuccioli' : 'il primo cucciolo'}!</p>
      </div>
      <form
        className="card mt-5 space-y-5 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          join.mutate()
        }}
      >
        <label className="block">
          <span className="mb-1.5 block font-bold">Il tuo nome</span>
          <input className="input" maxLength={18} required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <div>
          <p className="mb-2 font-bold">Il tuo personaggio</p>
          <LookPicker value={look} onChange={setLook} stage="adulto" outfit={{ top: 'maglia-base' }} />
        </div>
        <button className="btn-primary w-full text-lg" disabled={!name.trim() || join.isPending}>
          {join.isPending ? 'Entro...' : 'Entra in famiglia 💞'}
        </button>
      </form>
    </main>
  )
}
