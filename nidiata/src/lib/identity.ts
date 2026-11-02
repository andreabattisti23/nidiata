const IDS = 'nidiata:ids'
const FAMS = 'nidiata:families'

export interface SavedFamily {
  id: string
  name: string
  lastOpen: number
}

const read = <T,>(k: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? '') as T
  } catch {
    return fallback
  }
}

export function getPlayerId(sessionId: string): string | undefined {
  return read<Record<string, string>>(IDS, {})[sessionId]
}

export function setPlayerId(sessionId: string, playerId: string) {
  const ids = read<Record<string, string>>(IDS, {})
  ids[sessionId] = playerId
  localStorage.setItem(IDS, JSON.stringify(ids))
}

export function forgetFamily(sessionId: string) {
  const ids = read<Record<string, string>>(IDS, {})
  delete ids[sessionId]
  localStorage.setItem(IDS, JSON.stringify(ids))
  localStorage.setItem(FAMS, JSON.stringify(listFamilies().filter((f) => f.id !== sessionId)))
}

export function listFamilies(): SavedFamily[] {
  return read<SavedFamily[]>(FAMS, []).sort((a, b) => b.lastOpen - a.lastOpen)
}

export function rememberFamily(id: string, name: string) {
  const list = listFamilies().filter((f) => f.id !== id)
  list.unshift({ id, name, lastOpen: Date.now() })
  localStorage.setItem(FAMS, JSON.stringify(list.slice(0, 12)))
}

export const inviteUrl = (sessionId: string) => `${window.location.origin}/s/${sessionId}/unisciti`
