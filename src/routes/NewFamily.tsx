import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LookPicker, randomLook } from '../components/LookPicker'
import type { Look } from '../game/types'
import { useT } from '../i18n'
import { api } from '../lib/api'
import { rememberFamily, setPlayerId } from '../lib/identity'
import { toast } from '../lib/toast'

export function NewFamilyPage() {
  const { t } = useT()
  const navigate = useNavigate()
  const [familyName, setFamilyName] = useState('')
  const [name, setName] = useState('')
  const [look, setLook] = useState<Look>(randomLook)

  const create = useMutation({
    mutationFn: () => api.create(familyName.trim() || t('nfam.default'), { name, ...look }),
    onSuccess: ({ state, playerId }) => {
      setPlayerId(state.id, playerId)
      rememberFamily(state.id, state.familyName)
      navigate({ to: '/s/$sessionId', params: { sessionId: state.id }, search: { benvenuto: true } })
    },
    onError: (e) => toast(e.message, '🙈', 'error'),
  })

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/" className="text-sm font-semibold opacity-70 hover:opacity-100">{t('common.back')}</Link>
      <h1 className="mt-2 text-4xl font-bold">{t('nfam.title')}</h1>
      <form
        className="card mt-5 space-y-5 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          create.mutate()
        }}
      >
        <label className="block">
          <span className="mb-1.5 block font-bold">{t('nfam.famName')}</span>
          <input className="input" maxLength={28} value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-bold">{t('nfam.yourName')}</span>
          <input className="input" maxLength={18} required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <div>
          <p className="mb-2 font-bold">{t('nfam.char')}</p>
          <LookPicker value={look} onChange={setLook} stage="adulto" outfit={{ top: 'maglia-base' }} />
        </div>
        <button className="btn-primary w-full text-lg" disabled={!name.trim() || create.isPending}>
          {create.isPending ? t('nfam.creating') : t('nfam.create')}
        </button>
      </form>
    </main>
  )
}
