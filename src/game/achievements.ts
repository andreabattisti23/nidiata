import type { FamilyState } from './types'

export interface Achievement {
  id: string
  emoji: string
  name: string
  desc: string
  reward: number
  check: (s: FamilyState) => boolean
}

const c = (s: FamilyState, k: string) => s.counters[k] ?? 0

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'primo-cucciolo', emoji: '🐣', name: 'È nato!', desc: 'Date il benvenuto al primo cucciolo.', reward: 20, check: (s) => s.kids.length >= 1 },
  { id: 'in-due', emoji: '💑', name: 'Squadra di due', desc: 'Il secondo genitore si unisce alla famiglia.', reward: 50, check: (s) => s.parents.length >= 2 },
  { id: 'famiglia-numerosa', emoji: '👨‍👩‍👧‍👦', name: 'Famiglia numerosa', desc: 'Crescete tre cuccioli insieme.', reward: 60, check: (s) => s.kids.length >= 3 },
  { id: 'primo-imprevisto', emoji: '🎲', name: 'Prima decisione', desc: 'Risolvete il vostro primo imprevisto.', reward: 15, check: (s) => c(s, 'events') >= 1 },
  { id: 'dieci-imprevisti', emoji: '🧠', name: 'Genitori navigati', desc: 'Risolvete 10 imprevisti.', reward: 60, check: (s) => c(s, 'events') >= 10 },
  { id: 'accordo', emoji: '🤝', name: 'Sulla stessa lunghezza d\'onda', desc: 'Votate la stessa scelta 5 volte.', reward: 40, check: (s) => c(s, 'agree') >= 5 },
  { id: 'bambino', emoji: '🧸', name: 'Primi passi', desc: 'Un cucciolo diventa bambino.', reward: 30, check: (s) => s.kids.some((k) => k.stage !== 'neonato') },
  { id: 'ragazzo', emoji: '🛹', name: 'Adolescenza!', desc: 'Un cucciolo diventa ragazzo.', reward: 60, check: (s) => s.kids.some((k) => k.stage === 'ragazzo' || k.stage === 'adulto') },
  { id: 'grande', emoji: '🎓', name: 'Diploma!', desc: 'Un cucciolo diventa grande.', reward: 150, check: (s) => s.kids.some((k) => k.stage === 'adulto') },
  { id: 'cento-cure', emoji: '🫶', name: 'Cento attenzioni', desc: 'Prendetevi cura dei cuccioli 100 volte.', reward: 50, check: (s) => c(s, 'care') >= 100 },
  { id: 'chef', emoji: '🍝', name: 'Cucina stellata', desc: 'Preparate 30 pasti.', reward: 30, check: (s) => c(s, 'feed') >= 30 },
  { id: 'fashion', emoji: '💅', name: 'Fashion family', desc: 'Possedete 8 capi nel guardaroba.', reward: 40, check: (s) => s.inventory.length >= 8 },
  { id: 'look-completo', emoji: '✨', name: 'Look completo', desc: 'Un cucciolo con maglia, cappello e accessorio.', reward: 20, check: (s) => s.kids.some((k) => k.outfit.top && k.outfit.hat && k.outfit.acc) },
  { id: 'paperone', emoji: '💰', name: 'Salvadanaio pieno', desc: 'Accumulate 500 monete.', reward: 50, check: (s) => s.coins >= 500 },
  { id: 'armonia', emoji: '💞', name: 'Amore infinito', desc: 'Armonia di coppia al 100%.', reward: 50, check: (s) => s.harmony >= 100 },
  { id: 'perfetto', emoji: '🌟', name: 'Cucciolo al top', desc: 'Tutte le statistiche di un cucciolo sopra 80.', reward: 40, check: (s) => s.kids.some((k) => Object.values(k.stats).every((v) => v >= 80)) },
  { id: 'campione', emoji: '🏆', name: 'Campione di biscotti', desc: 'Fate almeno 30 punti al minigioco.', reward: 30, check: (s) => c(s, 'bestScore') >= 30 },
  { id: 'postino', emoji: '💌', name: 'Postini d\'amore', desc: 'Lasciate 10 bigliettini in bacheca.', reward: 25, check: (s) => c(s, 'notes') >= 10 },
  { id: 'fortunelli', emoji: '🎡', name: 'Fortunelli', desc: 'Girate la ruota 7 volte.', reward: 40, check: (s) => c(s, 'spins') >= 7 },
  { id: 'genio', emoji: '🧪', name: 'Piccolo genio', desc: 'Un cucciolo arriva a 80 di intelligenza.', reward: 50, check: (s) => s.kids.some((k) => k.smarts >= 80) },
]
