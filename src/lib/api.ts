import { GameError, applyAction, createFamily, joinFamily, tick, touch } from '../game/engine'
import type { Action, FamilyState, Msg, NewPlayer } from '../game/types'
import { tr } from '../i18n'

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export interface ActResponse {
  state: FamilyState
  result?: { emoji: string; m: Msg[]; data?: string }
}

/**
 * Il gioco usa la Netlify Function /api. Se non c'è (ad esempio con `npm run dev`
 * senza `netlify dev`), si passa in automatico alla "modalità prova" che salva
 * tutto nel browser: utile per testare, ma il link invito funziona solo online.
 */
type Mode = 'remote' | 'local'
let mode: Mode | null = null
export const isLocalMode = () => mode === 'local'

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  if (mode !== 'local') {
    try {
      const res = await fetch('/api' + path, {
        method,
        headers: body ? { 'content-type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      const ct = res.headers.get('content-type') ?? ''
      if (ct.includes('application/json')) {
        const data = await res.json()
        mode = 'remote'
        if (!res.ok) throw new ApiError(tr(data.error ?? 'err.generic', data.params), res.status)
        return data as T
      }
      if (mode === 'remote') throw new ApiError(tr('err.server'), res.status)
    } catch (err) {
      if (err instanceof ApiError) throw err
      if (mode === 'remote') throw new ApiError(tr('err.offline'), 0)
    }
    mode = 'local'
    console.info('[Nidiata] API non trovata: modalità prova locale attiva')
  }
  return localCall<T>(method, path, body)
}

// ---------------------------------------------------------------- modalità locale

const LS = 'nidiata:local:'
const load = (id: string): FamilyState => {
  const raw = localStorage.getItem(LS + id)
  if (!raw) throw new ApiError(tr('err.notFound'), 404)
  return JSON.parse(raw)
}
const save = (s: FamilyState) => localStorage.setItem(LS + s.id, JSON.stringify(s))

async function localCall<T>(method: string, path: string, body: any): Promise<T> {
  await new Promise((r) => setTimeout(r, 60))
  const [, , id, sub] = path.split(/[/?]/)
  const now = Date.now()
  try {
    if (method === 'POST' && !id) {
      const out = createFamily(body.familyName, body.player, now, Math.random)
      save(out.state)
      return out as T
    }
    if (method === 'GET') {
      const pid = new URLSearchParams(path.split('?')[1] ?? '').get('p') ?? ''
      let s = tick(load(id), now, Math.random)
      s = touch(s, pid, now) ?? s
      save(s)
      return { state: s } as T
    }
    if (sub === 'join') {
      const out = joinFamily(tick(load(id), now, Math.random), body.player, now, Math.random)
      save(out.state)
      return out as T
    }
    if (sub === 'action') {
      const out = applyAction(load(id), body.playerId, body.action, now, Math.random)
      save(out.state)
      return out as T
    }
  } catch (err) {
    if (err instanceof GameError) throw new ApiError(tr(err.key, err.params), 422)
    throw err
  }
  throw new ApiError(tr('err.server'), 404)
}

// ---------------------------------------------------------------- API pubblica

export const api = {
  create: (familyName: string, player: NewPlayer) =>
    call<{ state: FamilyState; playerId: string }>('POST', '/sessions', { familyName, player }),
  get: (id: string, playerId?: string) =>
    call<{ state: FamilyState }>('GET', `/sessions/${id}${playerId ? `?p=${encodeURIComponent(playerId)}` : ''}`),
  join: (id: string, player: NewPlayer) =>
    call<{ state: FamilyState; playerId: string }>('POST', `/sessions/${id}/join`, { player }),
  act: (id: string, playerId: string, action: Action) =>
    call<ActResponse>('POST', `/sessions/${id}/action`, { playerId, action }),
}
