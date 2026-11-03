import { useMemo, useSyncExternalStore } from 'react'
import { ACHIEVEMENTS } from '../game/achievements'
import { TRAITS, itemById } from '../game/catalog'
import { eventById } from '../game/events'
import type { LogEntry, Msg, MsgParams } from '../game/types'
import { contentDe } from './content/de'
import { contentEn } from './content/en'
import { contentEs } from './content/es'
import { contentIt } from './content/it'
import type { Content } from './content/types'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { it, type DictKey } from './it'

export type Lang = 'it' | 'en' | 'es' | 'de'

export const LANGS: { id: Lang; name: string; hello: string }[] = [
  { id: 'it', name: 'Italiano', hello: 'Ciao!' },
  { id: 'en', name: 'English', hello: 'Hello!' },
  { id: 'es', name: 'Español', hello: '¡Hola!' },
  { id: 'de', name: 'Deutsch', hello: 'Hallo!' },
]

const DICTS = { it, en, es, de }
const CONTENT: Record<Lang, Content> = { it: contentIt, en: contentEn, es: contentEs, de: contentDe }
const LOCALES: Record<Lang, string> = { it: 'it-IT', en: 'en-GB', es: 'es-ES', de: 'de-DE' }
const KEY = 'nidiata:lang'

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved && saved in DICTS) return saved as Lang
  } catch {
    /* niente */
  }
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'it').slice(0, 2)
  return (nav in DICTS ? nav : 'it') as Lang
}

let current: Lang = detect()
const subs = new Set<() => void>()
if (typeof document !== 'undefined') document.documentElement.lang = current

export const getLang = () => current
export const hasChosenLang = () => {
  try {
    return !!localStorage.getItem(KEY)
  } catch {
    return false
  }
}

export function setLang(l: Lang) {
  current = l
  try {
    localStorage.setItem(KEY, l)
  } catch {
    /* niente */
  }
  document.documentElement.lang = l
  subs.forEach((f) => f())
}

const subscribe = (f: () => void) => {
  subs.add(f)
  return () => void subs.delete(f)
}

export const useLang = () => useSyncExternalStore(subscribe, getLang, getLang)

// ------------------------------------------------------------------ traduzione base

const fill = (s: string, p?: MsgParams) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => (k in p ? String(p[k]) : m)) : s)

/** Traduce una chiave nella lingua corrente (anche fuori da React). */
export function tr(key: string, p?: MsgParams, lang: Lang = current): string {
  const d = DICTS[lang] as Record<string, string>
  const s = d[key] ?? (it as Record<string, string>)[key] ?? key
  return fill(s, p)
}

// ------------------------------------------------------------------ contenuti

function makeContent(lang: Lang) {
  const C = CONTENT[lang]
  const low = (s: string) => (C.keepCase ? s : s.charAt(0).toLowerCase() + s.slice(1))
  const pick = <T,>(rec: Record<string, T>, base: Record<string, T>, id: string) => rec[id] ?? base[id]
  const I = contentIt
  return {
    species: (id: string) => pick(C.species, I.species, id) ?? id,
    pattern: (id: string) => pick(C.patterns, I.patterns, id) ?? id,
    stage: (id: string) => pick(C.stages, I.stages, id) ?? id,
    stat: (id: string) => pick(C.stats, I.stats, id) ?? id,
    trait: (id: string) => pick(C.traits, I.traits, id) ?? [id, ''],
    food: (id: string) => pick(C.foods, I.foods, id) ?? id,
    item: (id: string) => pick(C.items, I.items, id) ?? id,
    job: (id: string) => pick(C.jobs, I.jobs, id) ?? [id, ''],
    wheel: (id: string) => pick(C.wheel, I.wheel, id) ?? id,
    ach: (id: string) => pick(C.achievements, I.achievements, id) ?? [id, ''],
    event: (id: string) => pick(C.events, I.events, id),
    eventText: (id: string, kid?: string) => (pick(C.events, I.events, id)?.x ?? '').replaceAll('{kid}', kid || tr('nk.little', undefined, lang)),
    option: (ev: string, opt: string) => pick(C.events, I.events, ev)?.o[opt] ?? I.events[ev]?.o[opt] ?? [opt],
    list: (name: keyof Content['lists'], i: number) => C.lists[name][i] ?? I.lists[name][i] ?? '',
    kidNames: C.kidNames,
    low,
  }
}

/** Valore leggibile di un parametro: gli id (vestiti, cibi, eventi...) diventano nomi tradotti. */
function resolveParam(k: string, v: string | number, p: MsgParams, c: ReturnType<typeof makeContent>): string {
  const id = String(v)
  switch (k) {
    case 'stage':
      return c.low(c.stage(id))
    case 'item':
      return `${itemById(id)?.emoji ?? ''} ${c.item(id)}`.trim()
    case 'itemName':
      return c.item(id)
    case 'food':
      return c.low(c.food(id))
    case 'trait':
      return `${c.low(c.trait(id)[0])} ${TRAITS[id]?.emoji ?? ''}`.trim()
    case 'ach':
      return `${ACHIEVEMENTS.find((a) => a.id === id)?.emoji ?? ''} ${c.ach(id)[0]}`.trim()
    case 'ev':
      return c.event(id)?.t ?? id
    case 'opt': {
      const emoji = eventById(String(p.ev))?.options.find((o) => o.id === id)?.emoji ?? ''
      return `${emoji} ${c.option(String(p.ev), id)[0]}`.trim()
    }
    case 'jobText':
      return c.job(id)[1]
    case 'game':
    case 'subj':
    case 'song':
      return c.list(k, Number(v))
    default:
      return id
  }
}

function renderMsg(m: Msg, lang: Lang, c: ReturnType<typeof makeContent>): string {
  const p = m.p ?? {}
  if (m.k === 'out') {
    const o = c.option(String(p.ev), String(p.opt))
    const text = p.r === 'f' ? o[2] : p.r === 's' ? o[1] : o[1]
    return (text ?? '').replaceAll('{kid}', String(p.kid || tr('nk.little', undefined, lang)))
  }
  const resolved: MsgParams = {}
  for (const [k, v] of Object.entries(p)) resolved[k] = resolveParam(k, v, p, c)
  return tr(m.k, resolved, lang)
}

/** Hook principale per i componenti: t() per le chiavi, c per i contenuti, msg() per i messaggi di gioco. */
export function useT() {
  const lang = useLang()
  return useMemo(() => {
    const c = makeContent(lang)
    const msg = (m?: Msg[], fallback?: string) => (m?.length ? m.map((x) => renderMsg(x, lang, c)).join(' ') : fallback ?? '')
    return {
      lang,
      locale: LOCALES[lang],
      t: (key: DictKey | `mood.${string}` | `greet.${string}`, p?: MsgParams) => tr(key, p, lang),
      c,
      msg,
      log: (l: Pick<LogEntry, 'm' | 'text'>) => msg(l.m, l.text),
    }
  }, [lang])
}

export type T = ReturnType<typeof useT>


/** Come msg() di useT, ma utilizzabile anche fuori dai componenti (e nei test). */
export function formatMsgs(m: Msg[] | undefined, lang: Lang = current, fallback = ''): string {
  if (!m?.length) return fallback
  const c = makeContent(lang)
  return m.map((x) => renderMsg(x, lang, c)).join(' ')
}
