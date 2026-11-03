export type Stage = 'neonato' | 'bambino' | 'ragazzo' | 'adulto'
export type StatKey = 'fame' | 'energia' | 'igiene' | 'felicita' | 'salute'
export type Stats = Record<StatKey, number>
export type Slot = 'top' | 'hat' | 'acc'
export type Outfit = Partial<Record<Slot, string>>

export type Mood = 'felice' | 'ok' | 'triste' | 'dorme' | 'malato' | 'affamato' | 'sporco' | 'stanco'

export interface Look {
  species: string
  color: string
  pattern: string
}

export interface Kid extends Look {
  id: string
  name: string
  stats: Stats
  smarts: number
  xp: number
  stage: Stage
  bornAt: number
  asleep: boolean
  sick: boolean
  traits: string[]
  outfit: Outfit
  cooldowns: Record<string, number>
  favoriteFood?: string
  careCount: number
}

export interface Parent extends Look {
  id: string
  name: string
  joinedAt: number
  lastSeen: number
  outfit: Outfit
  cooldowns: Record<string, number>
}

export interface PendingEvent {
  id: string
  templateId: string
  kidId?: string
  createdAt: number
  votes: Record<string, string>
}

/** Messaggio traducibile: chiave del dizionario + parametri. */
export type MsgParams = Record<string, string | number>
export interface Msg {
  k: string
  p?: MsgParams
}

export interface LogEntry {
  id: string
  at: number
  who?: string
  kidId?: string
  emoji: string
  /** messaggio traducibile (nuovo formato) */
  m?: Msg[]
  /** testo già scritto in italiano (vecchi salvataggi) */
  text?: string
}

export interface Note {
  id: string
  at: number
  who: string
  text: string
  sticker: string
}

export interface FamilyState {
  id: string
  version: number
  familyName: string
  createdAt: number
  lastTick: number
  coins: number
  harmony: number
  parents: Parent[]
  kids: Kid[]
  inventory: string[]
  events: PendingEvent[]
  log: LogEntry[]
  notes: Note[]
  achievements: Record<string, number>
  counters: Record<string, number>
  nextEventAt: number
  cooldowns: Record<string, number>
  lastResult?: { at: number; emoji: string; m?: Msg[]; text?: string }
}

export type CareKind = 'feed' | 'play' | 'bath' | 'sleep' | 'wake' | 'medicine' | 'study' | 'cuddle' | 'sing'

export type Target = { type: 'kid' | 'parent'; id: string }

export type Action =
  | { type: 'addKid'; name: string; species: string; color: string; pattern: string; traits: string[] }
  | { type: 'care'; kidId: string; kind: CareKind; foodId?: string }
  | { type: 'work'; jobId: string }
  | { type: 'minigame'; game: string; score: number }
  | { type: 'buy'; itemId: string }
  | { type: 'equip'; target: Target; slot: Slot; itemId: string | null }
  | { type: 'restyle'; target: Target; species: string; color: string; pattern: string }
  | { type: 'vote'; eventId: string; optionId: string }
  | { type: 'note'; text: string; sticker: string }
  | { type: 'spin' }
  | { type: 'askEvent' }
  | { type: 'renameFamily'; name: string }

export interface NewPlayer {
  name: string
  species: string
  color: string
  pattern: string
}
