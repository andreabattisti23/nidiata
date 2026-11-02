import { getStore } from '@netlify/blobs'
import type { Config } from '@netlify/functions'
import { GameError, applyAction, createFamily, joinFamily, tick, touch } from '../../src/game/engine'
import type { Action, FamilyState, NewPlayer } from '../../src/game/types'

const store = () => getStore({ name: 'nidiata-famiglie', consistency: 'strong' })
const key = (id: string) => `famiglia/${id}`
const rng = Math.random

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

const fail = (message: string, status = 400) => json({ error: message }, status)

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function readBody<T>(req: Request): Promise<T> {
  const text = await req.text()
  if (text.length > 8000) throw new HttpError(413, 'Richiesta troppo grande')
  try {
    return JSON.parse(text || '{}') as T
  } catch {
    throw new HttpError(400, 'JSON non valido')
  }
}

// Serializza le modifiche alla stessa famiglia dentro la stessa istanza della funzione
const locks = new Map<string, Promise<unknown>>()
function withLock<T>(id: string, job: () => Promise<T>): Promise<T> {
  const prev = locks.get(id) ?? Promise.resolve()
  const next = prev.catch(() => {}).then(job)
  locks.set(id, next)
  next.finally(() => locks.get(id) === next && locks.delete(id)).catch(() => {})
  return next
}

/** Legge, modifica e salva con controllo di concorrenza (ETag) e qualche tentativo. */
function update<R extends { state: FamilyState }>(id: string, fn: (s: FamilyState) => R & { changed?: boolean }): Promise<R> {
  return withLock(id, () => updateUnlocked(id, fn))
}

async function updateUnlocked<R extends { state: FamilyState }>(
  id: string,
  fn: (s: FamilyState) => R & { changed?: boolean },
): Promise<R> {
  const st = store()
  for (let attempt = 0; attempt < 6; attempt++) {
    const cur = await st.getWithMetadata(key(id), { type: 'json' })
    if (!cur) throw new HttpError(404, 'Famiglia non trovata. Controlla il link!')
    const out = fn(cur.data as FamilyState)
    if (out.changed === false) return out
    const res = cur.etag
      ? await st.setJSON(key(id), out.state, { onlyIfMatch: cur.etag })
      : await st.setJSON(key(id), out.state)
    if (res.modified !== false) return out
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 120))
  }
  throw new HttpError(409, 'Troppe modifiche nello stesso momento, riprova!')
}

export default async (req: Request) => {
  const url = new URL(req.url)
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean)

  try {
    // POST /api/sessions -> nuova famiglia
    if (parts[0] !== 'sessions') return fail('Endpoint sconosciuto', 404)

    if (parts.length === 1 && req.method === 'POST') {
      const body = await readBody<{ familyName: string; player: NewPlayer }>(req)
      const { state, playerId } = createFamily(body.familyName, body.player, Date.now(), rng)
      await store().setJSON(key(state.id), state, { onlyIfNew: true })
      return json({ state, playerId }, 201)
    }

    const id = parts[1]
    if (!id || !/^[a-z0-9]{6,16}$/.test(id)) return fail('Codice famiglia non valido', 400)

    // GET /api/sessions/:id?p=playerId
    if (parts.length === 2 && req.method === 'GET') {
      const playerId = url.searchParams.get('p') ?? ''
      const out = await update(id, (s) => {
        const now = Date.now()
        let next = tick(s, now, rng)
        const touched = playerId ? touch(next, playerId, now) : null
        if (touched) next = touched
        // salviamo solo se è passato abbastanza tempo o è cambiato qualcosa di importante
        const changed = next !== s && (touched !== null || now - s.lastTick > 60_000 || next.events.length !== s.events.length)
        return { state: changed ? { ...next, version: s.version + 1 } : next, changed }
      })
      return json({ state: out.state })
    }

    // POST /api/sessions/:id/join
    if (parts[2] === 'join' && req.method === 'POST') {
      const body = await readBody<{ player: NewPlayer }>(req)
      const out = await update(id, (s) => {
        const ticked = tick(s, Date.now(), rng)
        return joinFamily(ticked, body.player, Date.now(), rng)
      })
      return json(out)
    }

    // POST /api/sessions/:id/action
    if (parts[2] === 'action' && req.method === 'POST') {
      const body = await readBody<{ playerId: string; action: Action }>(req)
      if (!body.playerId || !body.action?.type) return fail('Richiesta incompleta')
      const out = await update(id, (s) => applyAction(s, body.playerId, body.action, Date.now(), rng))
      return json(out)
    }

    return fail('Endpoint sconosciuto', 404)
  } catch (err) {
    if (err instanceof GameError) return fail(err.message, 422)
    if (err instanceof HttpError) return fail(err.message, err.status)
    console.error(err)
    return fail('Errore del server, riprova tra poco', 500)
  }
}

export const config: Config = {
  path: '/api/*',
}
