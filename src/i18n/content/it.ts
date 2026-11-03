import { ACHIEVEMENTS } from '../../game/achievements'
import { FOODS, ITEMS, JOBS, PATTERNS, SPECIES, STAGES, STAT_INFO, TRAITS, WHEEL } from '../../game/catalog'
import { EVENTS } from '../../game/events'
import type { Content } from './types'

const map = <T, V>(arr: readonly T[], key: (t: T) => string, val: (t: T) => V) =>
  Object.fromEntries(arr.map((t) => [key(t), val(t)])) as Record<string, V>

/** L'italiano si legge direttamente dai cataloghi del gioco. */
export const contentIt: Content = {
  species: map(SPECIES, (s) => s.id, (s) => s.name),
  patterns: map(PATTERNS, (s) => s.id, (s) => s.name),
  stages: map(STAGES, (s) => s.id, (s) => s.name),
  stats: Object.fromEntries(Object.entries(STAT_INFO).map(([k, v]) => [k, v.name])),
  traits: Object.fromEntries(Object.entries(TRAITS).map(([k, v]) => [k, [v.name, v.desc]])) as Record<string, [string, string]>,
  foods: map(FOODS, (f) => f.id, (f) => f.name),
  items: map(ITEMS, (i) => i.id, (i) => i.name),
  jobs: map(JOBS, (j) => j.id, (j) => [j.name, j.text] as [string, string]),
  wheel: map(WHEEL, (w) => w.id, (w) => w.label),
  achievements: map(ACHIEVEMENTS, (a) => a.id, (a) => [a.name, a.desc] as [string, string]),
  events: map(EVENTS, (e) => e.id, (e) => ({
    t: e.title,
    x: e.text,
    o: map(e.options, (o) => o.id, (o) => (o.outcome ? [o.label, o.outcome.text] : [o.label, o.chance!.success.text, o.chance!.fail.text])),
  })),
  lists: {
    game: ['a nascondino', 'con le costruzioni', 'a palla', 'al dottore', 'a rincorrersi', 'con la sabbia cinetica', 'a fare le bolle'],
    subj: ['le tabelline', 'la geografia', "l'inglese", 'le scienze', 'la storia dei dinosauri', 'a leggere', 'il coding'],
    song: ['una ninna nanna', 'la canzone del coccodrillo', 'una canzone inventata', 'la sigla dei cartoni', 'una canzone in dialetto'],
  },
  kidNames: ['Biscotto', 'Nuvola', 'Pepe', 'Mirtillo', 'Zuccherino', 'Polpetta', 'Leo', 'Luna', 'Gnocchi', 'Briciola', 'Tofu', 'Stella', 'Pistacchio', 'Mela', 'Brio'],
}
