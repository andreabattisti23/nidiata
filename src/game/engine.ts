import { ACHIEVEMENTS } from './achievements'
import {
  COLORS, FOODS, ITEMS, JOBS, PATTERNS, SPECIES, STAGES, STICKERS, TRAITS, WHEEL, STARTER_ITEMS, foodById, itemById,
} from './catalog'
import { EVENTS, eventById, type Effects, type EventTemplate, type Outcome } from './events'
import type {
  Action, CareKind, FamilyState, Kid, LogEntry, Mood, Msg, MsgParams, NewPlayer, Parent, PendingEvent, Stage, StatKey, Stats,
} from './types'

export type Rng = () => number

/** Errore di gioco: `key` è una chiave del dizionario ("err.*"), tradotta dal client. */
export class GameError extends Error {
  constructor(public key: string, public params?: MsgParams) {
    super(key)
    this.name = 'GameError'
  }
}

const msg = (k: string, p?: MsgParams): Msg => (p ? { k, p } : { k })

export interface ActionResult {
  state: FamilyState
  result?: { emoji: string; m: Msg[]; data?: string }
}

/** Liste da cui il motore pesca a caso: il client mostra la voce tradotta con lo stesso indice. */
export const LIST_SIZE = { game: 7, subj: 7, song: 5 }

const MIN = 60_000
const HOUR = 60 * MIN
const MAX_LOG = 120
const MAX_NOTES = 40
const MAX_KIDS = 5
const MAX_PARENTS = 4
const EVENT_AUTO_RESOLVE = 6 * HOUR
const EVENT_EXPIRE = 36 * HOUR
export const NONNA_AFTER = 2 * HOUR

export const CARE_COOLDOWN: Record<CareKind, number> = {
  feed: 6 * MIN, play: 12 * MIN, bath: 20 * MIN, sleep: 0, wake: 0,
  medicine: 25 * MIN, study: 25 * MIN, cuddle: 4 * MIN, sing: 8 * MIN,
}
export const MINIGAME_COOLDOWN = 3 * MIN
export const SPIN_COOLDOWN = 20 * HOUR
export const ASK_EVENT_COOLDOWN = 15 * MIN

export const uid = (len = 10, rng: Rng = Math.random) => {
  const abc = 'abcdefghijkmnopqrstuvwxyz23456789'
  let s = ''
  for (let i = 0; i < len; i++) s += abc[Math.floor(rng() * abc.length)]
  return s
}

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))
const pick = <T,>(arr: readonly T[], rng: Rng) => arr[Math.floor(rng() * arr.length)]
const between = (a: number, b: number, rng: Rng) => Math.round(a + rng() * (b - a))
const cleanText = (s: unknown, max: number) =>
  String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)

function weighted<T>(items: T[], weight: (t: T) => number, rng: Rng): T | undefined {
  const total = items.reduce((a, t) => a + weight(t), 0)
  if (total <= 0) return undefined
  let r = rng() * total
  for (const t of items) {
    r -= weight(t)
    if (r <= 0) return t
  }
  return items[items.length - 1]
}

export function stageFor(xp: number): Stage {
  let st: Stage = 'neonato'
  for (const s of STAGES) if (xp >= s.xp) st = s.id
  return st
}

export function nextStage(xp: number) {
  const idx = STAGES.findIndex((s) => s.id === stageFor(xp))
  return STAGES[idx + 1]
}

export function moodOf(kid: Kid): Mood {
  const s = kid.stats
  if (kid.asleep) return 'dorme'
  if (kid.sick) return 'malato'
  if (s.fame < 25) return 'affamato'
  if (s.igiene < 25) return 'sporco'
  if (s.energia < 20) return 'stanco'
  const avg = (s.fame + s.energia + s.igiene + s.felicita + s.salute) / 5
  if (s.felicita < 35 || avg < 40) return 'triste'
  if (avg >= 68 && s.felicita >= 60) return 'felice'
  return 'ok'
}

export function cooldownLeft(map: Record<string, number>, key: string, now: number) {
  return Math.max(0, (map[key] ?? 0) - now)
}

function validLook(p: { species: string; color: string; pattern: string }) {
  if (!SPECIES.some((s) => s.id === p.species)) throw new GameError('err.look')
  if (!COLORS.includes(p.color)) throw new GameError('err.look')
  if (!PATTERNS.some((x) => x.id === p.pattern)) throw new GameError('err.look')
}

function addLog(s: FamilyState, entry: Omit<LogEntry, 'id'>, rng: Rng) {
  s.log.unshift({ id: uid(8, rng), ...entry })
  if (s.log.length > MAX_LOG) s.log.length = MAX_LOG
}

function bump(s: FamilyState, key: string, by = 1) {
  s.counters[key] = (s.counters[key] ?? 0) + by
}

function addStats(kid: Kid, delta: Partial<Stats>) {
  for (const k of Object.keys(delta) as StatKey[]) kid.stats[k] = clamp(kid.stats[k] + (delta[k] ?? 0))
}

function addXp(s: FamilyState, kid: Kid, xp: number, now: number, rng: Rng) {
  if (xp <= 0) return
  const before = kid.stage
  kid.xp = Math.round((kid.xp + xp) * 10) / 10
  const after = stageFor(kid.xp)
  if (after !== before) {
    kid.stage = after
    const info = STAGES.find((x) => x.id === after)!
    s.coins += 40
    addLog(s, { at: now, kidId: kid.id, emoji: info.emoji, m: [msg('log.grew', { kid: kid.name, stage: after })] }, rng)
  }
}

function giveItem(s: FamilyState, itemId: string, now: number, rng: Rng): Msg[] {
  const item = itemById(itemId)
  if (!item) return []
  if (s.inventory.includes(itemId)) {
    s.coins += 20
    return [msg('log.itemDup', { item: itemId })]
  }
  s.inventory.push(itemId)
  addLog(s, { at: now, emoji: item.emoji, m: [msg('log.itemNewLog', { item: itemId })] }, rng)
  return [msg('log.itemNew', { item: itemId })]
}

function checkAchievements(s: FamilyState, now: number, rng: Rng) {
  for (const a of ACHIEVEMENTS) {
    if (s.achievements[a.id]) continue
    if (a.check(s)) {
      s.achievements[a.id] = now
      s.coins += a.reward
      addLog(s, { at: now, emoji: '🏆', m: [msg('log.trophy', { ach: a.id, n: a.reward })] }, rng)
    }
  }
}

const parentName = (s: FamilyState, id: string) => s.parents.find((p) => p.id === id)?.name ?? '?'

// ------------------------------------------------------------------ creazione

export function makeParent(p: NewPlayer, now: number, rng: Rng): Parent {
  const name = cleanText(p.name, 18)
  if (!name) throw new GameError('err.yourName')
  validLook(p)
  return {
    id: uid(12, rng), name, species: p.species, color: p.color, pattern: p.pattern,
    joinedAt: now, lastSeen: now, outfit: { top: 'maglia-base' }, cooldowns: {},
  }
}

export function createFamily(familyName: string, player: NewPlayer, now: number, rng: Rng) {
  const name = cleanText(familyName, 28) || 'Nidiata'
  const parent = makeParent(player, now, rng)
  const state: FamilyState = {
    id: uid(10, rng), version: 1, familyName: name, createdAt: now, lastTick: now,
    coins: 150, harmony: 70, parents: [parent], kids: [], inventory: [...STARTER_ITEMS],
    events: [], log: [], notes: [], achievements: {}, counters: {},
    nextEventAt: now + 3 * MIN, cooldowns: {},
  }
  addLog(state, { at: now, who: parent.id, emoji: '🏡', m: [msg('log.founded', { p: parent.name, f: name })] }, rng)
  return { state, playerId: parent.id }
}

export function joinFamily(prev: FamilyState, player: NewPlayer, now: number, rng: Rng) {
  const s = structuredClone(prev)
  if (s.parents.length >= MAX_PARENTS) throw new GameError('err.familyFull')
  const parent = makeParent(player, now, rng)
  s.parents.push(parent)
  addLog(s, { at: now, who: parent.id, emoji: '💞', m: [msg('log.joined', { p: parent.name })] }, rng)
  checkAchievements(s, now, rng)
  s.version++
  return { state: s, playerId: parent.id }
}

export function touch(prev: FamilyState, playerId: string, now: number) {
  const p = prev.parents.find((x) => x.id === playerId)
  if (!p || now - p.lastSeen < 45_000) return null
  const s = structuredClone(prev)
  s.parents.find((x) => x.id === playerId)!.lastSeen = now
  return s
}

// ------------------------------------------------------------------ tempo

function decayKid(s: FamilyState, kid: Kid, f: number, now: number, rng: Rng) {
  const t = (id: string) => kid.traits.includes(id)
  // Quando nessun genitore passa da più di 2 ore, ci pensa la nonna: tutto rallenta
  const nonna = s.parents.every((p) => now - p.lastSeen > NONNA_AFTER)
  if (nonna) {
    f *= 0.35
    if (!kid.asleep && kid.stats.energia < 30) kid.asleep = true
    if (kid.stats.fame < 35) kid.stats.fame = clamp(kid.stats.fame + 10 * f)
  }
  const baby = kid.stage === 'neonato' ? 1.2 : 1
  const st = kid.stats
  if (kid.asleep) {
    st.energia = clamp(st.energia + 20 * f * (t('dormiglione') ? 0.8 : 1))
    st.fame = clamp(st.fame - 3 * f * baby)
    st.igiene = clamp(st.igiene - 1.5 * f)
    if (st.energia >= 100) {
      kid.asleep = false
      addLog(s, { at: now, kidId: kid.id, emoji: '🌅', m: [msg('log.wokeUp', { kid: kid.name })] }, rng)
    }
  } else {
    st.fame = clamp(st.fame - 7 * f * baby * (t('goloso') ? 1.3 : 1))
    st.energia = clamp(st.energia - 5 * f * (t('dormiglione') ? 1.35 : 1) * (t('vivace') ? 0.85 : 1))
    st.igiene = clamp(st.igiene - 4.5 * f * (t('pulitino') ? 0.6 : 1))
    st.felicita = clamp(st.felicita - 4 * f * (t('vivace') ? 1.3 : 1))
  }
  let dh = 0
  if (st.fame < 20) dh -= 6
  if (st.igiene < 20) dh -= 4
  if (st.energia < 10) dh -= 3
  if (dh === 0 && st.fame > 50 && st.igiene > 50) dh = 1.5
  if (kid.sick) {
    dh -= 2
    st.felicita = clamp(st.felicita - 3 * f)
  }
  st.salute = clamp(st.salute + dh * f)
  if (!kid.sick && st.salute < 35 && rng() < 0.3 * f * (t('robusto') ? 0.35 : 1)) {
    kid.sick = true
    addLog(s, { at: now, kidId: kid.id, emoji: '🤧', m: [msg('log.cold', { kid: kid.name })] }, rng)
  }
  const avg = (st.fame + st.energia + st.igiene + st.felicita + st.salute) / 5
  if (avg >= 60 && !kid.sick) addXp(s, kid, 3 * f, now, rng)
}

function spawnEvent(s: FamilyState, now: number, rng: Rng): PendingEvent | undefined {
  const usable = EVENTS.filter((e) => {
    if (now - (s.cooldowns['ev:' + e.id] ?? -Infinity) < 12 * HOUR) return false
    if (s.events.some((p) => p.templateId === e.id)) return false
    if (e.needsKid && !kidsFor(s, e).length) return false
    if (e.when && !e.when(s)) return false
    return true
  })
  const tpl = weighted(usable, (e) => e.weight ?? 1, rng)
  if (!tpl) return
  let kidId: string | undefined
  if (tpl.needsKid) {
    const kid = weighted(kidsFor(s, tpl), (k) => (k.traits.includes('avventuroso') ? 2 : 1), rng)
    kidId = kid?.id
  }
  const ev: PendingEvent = { id: uid(8, rng), templateId: tpl.id, kidId, createdAt: now, votes: {} }
  s.events.push(ev)
  s.cooldowns['ev:' + tpl.id] = now
  const kidName = s.kids.find((k) => k.id === kidId)?.name
  addLog(s, { at: now, kidId, emoji: tpl.emoji, m: [kidName ? msg('log.evNewKid', { ev: tpl.id, kid: kidName }) : msg('log.evNew', { ev: tpl.id })] }, rng)
  return ev
}

function kidsFor(s: FamilyState, e: EventTemplate) {
  return s.kids.filter((k) => !e.stages || e.stages.includes(k.stage))
}

export function tick(prev: FamilyState, now: number, rng: Rng): FamilyState {
  if (now - prev.lastTick < 5_000) return prev
  const s = structuredClone(prev)
  const end = Math.min(now, s.lastTick + 72 * HOUR)
  let t = s.lastTick
  while (t < end) {
    const dt = Math.min(HOUR, end - t)
    for (const kid of s.kids) decayKid(s, kid, dt / HOUR, t + dt, rng)
    t += dt
  }
  s.lastTick = now

  for (const ev of [...s.events]) {
    const age = now - ev.createdAt
    if (Object.keys(ev.votes).length && age > EVENT_AUTO_RESOLVE) resolveEvent(s, ev, now, rng, true)
    else if (age > EVENT_EXPIRE) {
      s.events = s.events.filter((e) => e.id !== ev.id)
      const tpl = eventById(ev.templateId)
      if (tpl) addLog(s, { at: now, emoji: '💨', m: [msg('log.evExpired', { ev: tpl.id })] }, rng)
      s.harmony = clamp(s.harmony - 2)
    }
  }

  if (s.kids.length && now >= s.nextEventAt) {
    if (s.events.length < 2) spawnEvent(s, now, rng)
    s.nextEventAt = now + between(70, 190, rng) * MIN
  }
  checkAchievements(s, now, rng)
  return s
}

// ------------------------------------------------------------------ eventi

function applyOutcome(s: FamilyState, kid: Kid | undefined, o: Outcome, now: number, rng: Rng): Msg[] {
  const e: Effects = o
  const extra: Msg[] = []
  if (kid && e.stats) addStats(kid, e.stats)
  if (e.allKids) for (const k of s.kids) addStats(k, e.allKids)
  if (kid && e.smarts) kid.smarts = clamp(kid.smarts + e.smarts)
  if (e.coins) s.coins = Math.max(0, s.coins + e.coins)
  if (e.harmony) s.harmony = clamp(s.harmony + e.harmony)
  if (kid && e.sick) kid.sick = true
  if (kid && e.heal) kid.sick = false
  if (kid && e.trait && !kid.traits.includes(e.trait) && kid.traits.length < 4) {
    kid.traits.push(e.trait)
    extra.push(msg('log.traitGot', { kid: kid.name, trait: e.trait }))
  }
  if (e.item) extra.push(...giveItem(s, e.item, now, rng))
  if (kid) addXp(s, kid, e.xp ?? 10, now, rng)
  else for (const k of s.kids) addXp(s, k, 8, now, rng)
  return extra
}

function resolveEvent(s: FamilyState, ev: PendingEvent, now: number, rng: Rng, auto = false) {
  const tpl = eventById(ev.templateId)
  s.events = s.events.filter((e) => e.id !== ev.id)
  if (!tpl) return undefined
  const voters = Object.keys(ev.votes)
  const choices = [...new Set(Object.values(ev.votes))]
  const prefix: Msg[] = []
  let optionId = choices[0]
  if (choices.length > 1) {
    const winner = pick(voters, rng)
    optionId = ev.votes[winner]
    prefix.push(msg('log.coinFlip', { p: parentName(s, winner) }))
    s.harmony = clamp(s.harmony - 3)
  } else if (voters.length > 1) {
    prefix.push(msg('log.agree'))
    s.harmony = clamp(s.harmony + 2)
    bump(s, 'agree')
  } else if (auto && s.parents.length > 1) {
    prefix.push(msg('log.noAnswer', { p: parentName(s, voters[0]) }))
  }
  const opt = tpl.options.find((o) => o.id === optionId) ?? tpl.options[0]
  const kid = s.kids.find((k) => k.id === ev.kidId)
  let outcome = opt.outcome
  let r: 'o' | 's' | 'f' = 'o'
  if (opt.chance) {
    const ok = rng() < opt.chance.p
    outcome = ok ? opt.chance.success : opt.chance.fail
    r = ok ? 's' : 'f'
  }
  const extra = applyOutcome(s, kid, outcome!, now, rng)
  const m = [...prefix, msg('out', { ev: tpl.id, opt: opt.id, r, kid: kid?.name ?? '' }), ...extra]
  bump(s, 'events')
  addLog(s, { at: now, kidId: kid?.id, emoji: opt.emoji, m: [msg('log.evDone', { ev: tpl.id, opt: opt.id }), ...m] }, rng)
  s.lastResult = { at: now, emoji: opt.emoji, m }
  return { emoji: opt.emoji, m }
}

// ------------------------------------------------------------------ azioni

export function applyAction(prev: FamilyState, playerId: string, action: Action, now: number, rng: Rng): ActionResult {
  const ticked = tick(prev, now, rng)
  const s = ticked === prev ? structuredClone(prev) : ticked
  const me = s.parents.find((p) => p.id === playerId)
  if (!me) throw new GameError('err.notMember')
  me.lastSeen = now
  const who = me.id
  let result: ActionResult['result']

  const getKid = (id: string) => {
    const k = s.kids.find((x) => x.id === id)
    if (!k) throw new GameError('err.kidNotFound')
    return k
  }
  const pay = (n: number) => {
    if (s.coins < n) throw new GameError('err.noMoney', { n, have: s.coins })
    s.coins -= n
  }

  switch (action.type) {
    case 'addKid': {
      if (s.kids.length >= MAX_KIDS) throw new GameError('err.houseFull')
      const name = cleanText(action.name, 16)
      if (!name) throw new GameError('err.kidName')
      validLook(action)
      const traits = [...new Set((action.traits ?? []).filter((t) => TRAITS[t]))].slice(0, 2)
      const foods = FOODS.filter((f) => !f.onlyBaby)
      const kid: Kid = {
        id: uid(8, rng), name, species: action.species, color: action.color, pattern: action.pattern,
        stats: { fame: 75, energia: 80, igiene: 90, felicita: 85, salute: 90 },
        smarts: 10, xp: 0, stage: 'neonato', bornAt: now, asleep: false, sick: false,
        traits, outfit: {}, cooldowns: {}, favoriteFood: pick(foods, rng).id, careCount: 0,
      }
      s.kids.push(kid)
      addLog(s, { at: now, who, kidId: kid.id, emoji: '🐣', m: [msg('log.kidLog', { kid: name, p: me.name })] }, rng)
      result = { emoji: '🐣', m: [msg('log.kidRes', { kid: name })], data: kid.id }
      if (s.nextEventAt > now + 10 * MIN) s.nextEventAt = now + 5 * MIN
      break
    }

    case 'care': {
      const kid = getKid(action.kidId)
      result = care(s, me, kid, action.kind, action.foodId, now, rng)
      break
    }

    case 'work': {
      const job = JOBS.find((j) => j.id === action.jobId)
      if (!job) throw new GameError('err.unknown')
      const left = cooldownLeft(me.cooldowns, 'work', now)
      if (left) throw new GameError('err.working', { n: Math.ceil(left / MIN) })
      const pay = between(job.min, job.max, rng)
      s.coins += pay
      me.cooldowns.work = now + job.minutes * MIN
      bump(s, 'works')
      addLog(s, { at: now, who, emoji: job.emoji, m: [msg('log.workLog', { p: me.name, jobText: job.id, n: pay })] }, rng)
      result = { emoji: job.emoji, m: [msg('log.workRes', { n: pay })] }
      break
    }

    case 'minigame': {
      const left = cooldownLeft(me.cooldowns, 'minigame', now)
      if (left) throw new GameError('err.rest', { n: Math.ceil(left / 1000) })
      const score = clamp(Math.round(Number(action.score) || 0), 0, 80)
      const coins = Math.round(score * 1.5)
      s.coins += coins
      me.cooldowns.minigame = now + MINIGAME_COOLDOWN
      s.counters.bestScore = Math.max(s.counters.bestScore ?? 0, score)
      for (const k of s.kids) if (!k.asleep) addStats(k, { felicita: Math.min(10, Math.round(score / 4)) })
      addLog(s, { at: now, who, emoji: '🍪', m: [msg('log.gameLog', { p: me.name, s: score, n: coins })] }, rng)
      result = { emoji: '🍪', m: [msg('log.gameRes', { s: score, n: coins })] }
      break
    }

    case 'buy': {
      const item = itemById(action.itemId)
      if (!item) throw new GameError('err.unknown')
      if (s.inventory.includes(item.id)) throw new GameError('err.owned')
      pay(item.price)
      s.inventory.push(item.id)
      bump(s, 'buys')
      addLog(s, { at: now, who, emoji: '🛍️', m: [msg('log.buyLog', { p: me.name, item: item.id, n: item.price })] }, rng)
      result = { emoji: item.emoji, m: [msg('log.buyRes', { itemName: item.id })] }
      break
    }

    case 'equip': {
      const target = action.target.type === 'kid' ? getKid(action.target.id) : s.parents.find((p) => p.id === action.target.id)
      if (!target) throw new GameError('err.unknown')
      if (!['top', 'hat', 'acc'].includes(action.slot)) throw new GameError('err.unknown')
      if (action.itemId === null) delete target.outfit[action.slot]
      else {
        const item = itemById(action.itemId)
        if (!item || item.slot !== action.slot) throw new GameError('err.unknown')
        if (!s.inventory.includes(item.id)) throw new GameError('err.buyFirst')
        target.outfit[action.slot] = item.id
        if ('stats' in target && !target.asleep) addStats(target, { felicita: 2 })
      }
      break
    }

    case 'restyle': {
      validLook(action)
      const target = action.target.type === 'kid' ? getKid(action.target.id) : s.parents.find((p) => p.id === action.target.id)
      if (!target) throw new GameError('err.unknown')
      if (action.target.type === 'parent' && action.target.id !== who) throw new GameError('err.onlyYou')
      target.species = action.species
      target.color = action.color
      target.pattern = action.pattern
      break
    }

    case 'vote': {
      const ev = s.events.find((e) => e.id === action.eventId)
      if (!ev) throw new GameError('err.evGone')
      const tpl = eventById(ev.templateId)
      if (!tpl?.options.some((o) => o.id === action.optionId)) throw new GameError('err.badChoice')
      ev.votes[who] = action.optionId
      const allVoted = s.parents.every((p) => ev.votes[p.id])
      if (allVoted) result = resolveEvent(s, ev, now, rng)
      else {
        addLog(s, { at: now, who, emoji: '🗳️', m: [msg('log.voteLog', { p: me.name, ev: tpl.id })] }, rng)
        result = { emoji: '🗳️', m: [msg('log.voteRes', { ev: tpl.id, opt: action.optionId })] }
      }
      break
    }

    case 'note': {
      const text = cleanText(action.text, 160)
      if (!text) throw new GameError('err.noteEmpty')
      const sticker = STICKERS.includes(action.sticker) ? action.sticker : '💌'
      s.notes.unshift({ id: uid(8, rng), at: now, who, text, sticker })
      if (s.notes.length > MAX_NOTES) s.notes.length = MAX_NOTES
      bump(s, 'notes')
      s.harmony = clamp(s.harmony + 1)
      addLog(s, { at: now, who, emoji: sticker, m: [msg('log.noteLog', { p: me.name })] }, rng)
      break
    }

    case 'spin': {
      const left = cooldownLeft(s.cooldowns, 'spin', now)
      if (left) throw new GameError('err.wheel', { n: Math.ceil(left / HOUR) })
      s.cooldowns.spin = now + SPIN_COOLDOWN
      bump(s, 'spins')
      const prize = weighted([...WHEEL], (w) => w.weight, rng)!
      let m: Msg[] = []
      switch (prize.id) {
        case 'c20': s.coins += 20; m = [msg('spin.coins', { n: 20 })]; break
        case 'c50': s.coins += 50; m = [msg('spin.coins', { n: 50 })]; break
        case 'c120': s.coins += 120; m = [msg('spin.jackpot', { n: 120 })]; break
        case 'item': {
          const missing = ITEMS.filter((i) => !s.inventory.includes(i.id) && i.price > 0 && i.price <= 80)
          const it = missing.length ? pick(missing, rng) : undefined
          m = it ? [msg('spin.gift'), ...giveItem(s, it.id, now, rng)] : [msg('spin.all')]
          if (!it) s.coins += 60
          break
        }
        case 'happy': for (const k of s.kids) addStats(k, { felicita: 25 }); m = [msg('spin.happy')]; break
        case 'harmony': s.harmony = clamp(s.harmony + 10); m = [msg('spin.harmony')]; break
        case 'xp': for (const k of s.kids) addXp(s, k, 30, now, rng); m = [msg('spin.xp')]; break
        default: m = [msg('spin.none')]
      }
      addLog(s, { at: now, who, emoji: '🎡', m: [msg('log.spinLog', { p: me.name }), ...m] }, rng)
      result = { emoji: '🎡', m, data: prize.id }
      break
    }

    case 'askEvent': {
      if (!s.kids.length) throw new GameError('err.needKid')
      if (s.events.length >= 2) throw new GameError('err.resolveFirst')
      const left = cooldownLeft(s.cooldowns, 'askEvent', now)
      if (left) throw new GameError('err.quiet', { n: Math.ceil(left / MIN) })
      s.cooldowns.askEvent = now + ASK_EVENT_COOLDOWN
      const ev = spawnEvent(s, now, rng)
      if (!ev) throw new GameError('err.nothing')
      result = { emoji: '🎲', m: [msg('log.askRes')], data: ev.id }
      break
    }

    case 'renameFamily': {
      const name = cleanText(action.name, 28)
      if (!name) throw new GameError('err.badName')
      s.familyName = name
      addLog(s, { at: now, who, emoji: '✏️', m: [msg('log.renameLog', { p: me.name, f: name })] }, rng)
      break
    }

    default:
      throw new GameError('err.unknown')
  }

  checkAchievements(s, now, rng)
  s.version++
  return { state: s, result }
}

function care(s: FamilyState, me: Parent, kid: Kid, kind: CareKind, foodId: string | undefined, now: number, rng: Rng) {
  const t = (id: string) => kid.traits.includes(id)
  const cdKey = 'care:' + kind
  const left = cooldownLeft(kid.cooldowns, cdKey, now)
  if (left) throw new GameError('err.wait', { n: Math.ceil(left / MIN) })
  if (kid.asleep && !['wake', 'cuddle', 'sing', 'medicine'].includes(kind)) throw new GameError('err.asleep', { kid: kid.name })
  let xp = 5
  let emoji = '💛'
  const m: Msg[] = []
  const base = { p: me.name, kid: kid.name }
  const pay = (n: number) => {
    if (s.coins < n) throw new GameError('err.noMoney', { n, have: s.coins })
    s.coins -= n
  }

  switch (kind) {
    case 'feed': {
      const food = foodById(foodId) ?? FOODS[1]
      if (food.onlyBaby && kid.stage !== 'neonato') throw new GameError('err.bottleOnly')
      if (food.notBaby && kid.stage === 'neonato') throw new GameError('err.tooEarlyFood')
      if (kid.stats.fame >= 95) {
        addStats(kid, { felicita: -3 })
        return { emoji: '😝', m: [msg('care.full', { kid: kid.name })] }
      }
      pay(food.cost)
      const fx = { ...food.effects }
      if (t('goloso')) fx.felicita = (fx.felicita ?? 0) + 6
      addStats(kid, fx)
      emoji = food.emoji
      m.push(msg('care.feed', { ...base, food: food.id }))
      if (kid.favoriteFood === food.id) {
        addStats(kid, { felicita: 10 })
        m.push(msg('care.fav'))
        xp += 4
      }
      bump(s, 'feed')
      xp += 1
      break
    }
    case 'play': {
      if (kid.stats.energia < 12) throw new GameError('err.tooTired', { kid: kid.name })
      addStats(kid, { felicita: t('vivace') ? 30 : 18, energia: -12, igiene: -8, fame: -5 })
      emoji = '🎈'
      m.push(msg('care.play', { ...base, game: Math.floor(rng() * LIST_SIZE.game) }))
      xp = 10
      break
    }
    case 'bath': {
      addStats(kid, { igiene: 100, felicita: t('pulitino') ? 12 : 4 })
      emoji = '🛁'
      m.push(msg('care.bath', base))
      xp = 6
      break
    }
    case 'sleep': {
      if (kid.asleep) throw new GameError('err.alreadyAsleep')
      kid.asleep = true
      emoji = '🌙'
      m.push(msg('care.sleep', base))
      xp = 2
      break
    }
    case 'wake': {
      if (!kid.asleep) throw new GameError('err.alreadyAwake')
      kid.asleep = false
      const early = kid.stats.energia < 60
      if (early) addStats(kid, { felicita: -6 })
      emoji = '⏰'
      m.push(msg(early ? 'care.wakeEarly' : 'care.wake', base))
      xp = 1
      break
    }
    case 'medicine': {
      pay(8)
      if (kid.sick) {
        kid.sick = false
        addStats(kid, { salute: 25, felicita: -5 })
        m.push(msg('care.medCure', base))
      } else {
        addStats(kid, { salute: 8 })
        m.push(msg('care.medVit', base))
      }
      emoji = '💊'
      xp = 4
      break
    }
    case 'study': {
      if (kid.stage === 'neonato') throw new GameError('err.tooSmall')
      if (kid.stats.energia < 12) throw new GameError('err.tooTiredStudy', { kid: kid.name })
      const gain = t('secchione') ? 10 : 5
      kid.smarts = clamp(kid.smarts + gain)
      addStats(kid, { felicita: t('secchione') ? 2 : -4, energia: -8 })
      emoji = '📚'
      m.push(msg('care.study', { ...base, subj: Math.floor(rng() * LIST_SIZE.subj), n: gain }))
      xp = 12
      break
    }
    case 'cuddle': {
      addStats(kid, { felicita: t('coccolone') || t('timido') ? 18 : 10 })
      emoji = '🤗'
      m.push(msg(kid.asleep ? 'care.cuddleSleep' : 'care.cuddle', base))
      xp = 4
      break
    }
    case 'sing': {
      addStats(kid, { felicita: t('artista') ? 16 : 8, energia: kid.asleep ? 5 : 2 })
      emoji = '🎶'
      m.push(msg('care.sing', { ...base, song: Math.floor(rng() * LIST_SIZE.song) }))
      xp = 5
      break
    }
  }

  if (CARE_COOLDOWN[kind]) kid.cooldowns[cdKey] = now + CARE_COOLDOWN[kind]
  kid.careCount++
  bump(s, 'care')
  addXp(s, kid, xp, now, rng)
  addLog(s, { at: now, who: me.id, kidId: kid.id, emoji, m }, rng)
  return { emoji, m }
}

export { EVENTS }
