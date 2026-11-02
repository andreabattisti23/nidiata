import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { Action, FamilyState } from '../game/types'
import { ApiError, api, type ActResponse } from './api'
import { getPlayerId } from './identity'
import { toast } from './toast'

export const familyKey = (id: string) => ['family', id] as const

export function useFamily(sessionId: string) {
  const playerId = getPlayerId(sessionId)
  return useQuery({
    queryKey: familyKey(sessionId),
    queryFn: async () => (await api.get(sessionId, playerId)).state,
    refetchInterval: 4000,
    refetchIntervalInBackground: false,
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 3,
  })
}

export function useAct(sessionId: string, opts?: { silent?: boolean; onResult?: (r: ActResponse) => void }) {
  const qc = useQueryClient()
  const playerId = getPlayerId(sessionId) ?? ''
  return useMutation({
    mutationFn: (action: Action) => api.act(sessionId, playerId, action),
    onSuccess: (res) => {
      qc.setQueryData<FamilyState>(familyKey(sessionId), (old) =>
        !old || res.state.version >= old.version ? res.state : old,
      )
      if (res.result && !opts?.silent) toast(res.result.text, res.result.emoji, 'success')
      opts?.onResult?.(res)
    },
    onError: (err) => toast(err instanceof Error ? err.message : 'Ops, qualcosa è andato storto', '🙈', 'error'),
  })
}

/** Ritorna Date.now() aggiornato ogni `ms` millisecondi (per i countdown). */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

export function fmtLeft(ms: number) {
  if (ms <= 0) return ''
  const s = Math.ceil(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.ceil(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

export function timeAgo(at: number, now = Date.now()) {
  const s = Math.round((now - at) / 1000)
  if (s < 45) return 'adesso'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min fa`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h fa`
  const d = Math.round(h / 24)
  return d === 1 ? 'ieri' : `${d} giorni fa`
}
