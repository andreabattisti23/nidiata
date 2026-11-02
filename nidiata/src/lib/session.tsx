import { createContext, useContext } from 'react'
import type { FamilyState, Parent } from '../game/types'

export interface SessionCtx {
  sessionId: string
  state: FamilyState
  me: Parent
}

export const SessionContext = createContext<SessionCtx | null>(null)

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession fuori da una sessione')
  return ctx
}
