import type { Slot, Stage, Stats } from './types'

export const SPECIES = [
  { id: 'fagiolo', name: 'Fagiolino', emoji: '🫘' },
  { id: 'gattino', name: 'Gattino', emoji: '🐱' },
  { id: 'coniglio', name: 'Coniglietto', emoji: '🐰' },
  { id: 'orsetto', name: 'Orsetto', emoji: '🐻' },
  { id: 'draghetto', name: 'Draghetto', emoji: '🐲' },
  { id: 'pulcino', name: 'Pulcino', emoji: '🐥' },
  { id: 'alieno', name: 'Alienino', emoji: '👽' },
  { id: 'rana', name: 'Ranocchio', emoji: '🐸' },
] as const

export const COLORS = [
  '#ffc6d9', '#ffd8a8', '#fff3a3', '#c3f2c0', '#a8e6f0', '#b9c8ff',
  '#dcc3ff', '#f7b7a3', '#e9e4d8', '#9fe3c9', '#ffb3c7', '#c9a27e',
]

export const PATTERNS = [
  { id: 'liscio', name: 'Liscio' },
  { id: 'pancino', name: 'Pancino' },
  { id: 'macchie', name: 'Macchie' },
  { id: 'lentiggini', name: 'Lentiggini' },
] as const

export const TRAITS: Record<string, { name: string; emoji: string; desc: string }> = {
  goloso: { name: 'Goloso', emoji: '🍩', desc: 'Ha fame più spesso, ma il cibo lo rende più felice.' },
  dormiglione: { name: 'Dormiglione', emoji: '😴', desc: 'Si stanca prima e adora la nanna.' },
  vivace: { name: 'Vivace', emoji: '⚡', desc: 'Si annoia in fretta, ma il gioco vale doppio.' },
  pulitino: { name: 'Pulitino', emoji: '🫧', desc: 'Si sporca meno e ama il bagnetto.' },
  secchione: { name: 'Secchione', emoji: '📚', desc: 'Impara il doppio quando studia.' },
  coccolone: { name: 'Coccolone', emoji: '🤗', desc: 'Le coccole lo rendono felicissimo.' },
  robusto: { name: 'Robusto', emoji: '💪', desc: 'Si ammala raramente.' },
  artista: { name: 'Artista', emoji: '🎨', desc: 'Adora quando gli cantate qualcosa.' },
  avventuroso: { name: 'Avventuroso', emoji: '🧭', desc: 'Gli capitano più imprevisti.' },
  timido: { name: 'Timido', emoji: '🙈', desc: 'Si emoziona, ma le coccole aiutano tanto.' },
}

export const STAGES: { id: Stage; name: string; xp: number; emoji: string }[] = [
  { id: 'neonato', name: 'Neonato', xp: 0, emoji: '🍼' },
  { id: 'bambino', name: 'Bambino', xp: 200, emoji: '🧸' },
  { id: 'ragazzo', name: 'Ragazzo', xp: 700, emoji: '🛹' },
  { id: 'adulto', name: 'Grande', xp: 1800, emoji: '🎓' },
]

export const STAT_INFO: Record<keyof Stats, { name: string; emoji: string; color: string }> = {
  fame: { name: 'Pancia', emoji: '🍽️', color: '#ff9f43' },
  energia: { name: 'Energia', emoji: '⚡', color: '#feca57' },
  igiene: { name: 'Pulizia', emoji: '🫧', color: '#48dbfb' },
  felicita: { name: 'Felicità', emoji: '💖', color: '#ff6b9d' },
  salute: { name: 'Salute', emoji: '🩺', color: '#1dd1a1' },
}

export interface Food {
  id: string
  name: string
  emoji: string
  cost: number
  effects: Partial<Stats>
  onlyBaby?: boolean
  notBaby?: boolean
}

export const FOODS: Food[] = [
  { id: 'latte', name: 'Biberon di latte', emoji: '🍼', cost: 3, effects: { fame: 30, felicita: 4 }, onlyBaby: true },
  { id: 'pappa', name: 'Pappina', emoji: '🥣', cost: 4, effects: { fame: 25, salute: 2 } },
  { id: 'mela', name: 'Mela', emoji: '🍎', cost: 3, effects: { fame: 14, salute: 5 } },
  { id: 'minestrone', name: 'Minestrone', emoji: '🥕', cost: 6, effects: { fame: 30, salute: 8, felicita: -4 }, notBaby: true },
  { id: 'pasta', name: 'Pasta al pomodoro', emoji: '🍝', cost: 7, effects: { fame: 38, felicita: 6 }, notBaby: true },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', cost: 11, effects: { fame: 42, felicita: 12, salute: -3 }, notBaby: true },
  { id: 'sushi', name: 'Sushi', emoji: '🍣', cost: 14, effects: { fame: 35, felicita: 10, salute: 4 }, notBaby: true },
  { id: 'gelato', name: 'Gelato', emoji: '🍦', cost: 8, effects: { fame: 10, felicita: 18, salute: -2 } },
  { id: 'torta', name: 'Fetta di torta', emoji: '🍰', cost: 12, effects: { fame: 22, felicita: 22, salute: -3 } },
  { id: 'canederli', name: 'Canederli', emoji: '🥟', cost: 9, effects: { fame: 45, felicita: 8, energia: 5 }, notBaby: true },
]

export interface Item {
  id: string
  name: string
  slot: Slot
  price: number
  emoji: string
  back?: boolean
  rare?: boolean
}

export const ITEMS: Item[] = [
  // magliette e vestiti
  { id: 'maglia-base', name: 'Magliettina', slot: 'top', price: 0, emoji: '👕' },
  { id: 'maglia-righe', name: 'Maglia a righe', slot: 'top', price: 25, emoji: '🦓' },
  { id: 'felpa-cuore', name: 'Felpa col cuore', slot: 'top', price: 40, emoji: '💗' },
  { id: 'salopette', name: 'Salopette', slot: 'top', price: 45, emoji: '👖' },
  { id: 'vestito-fiori', name: 'Vestitino a fiori', slot: 'top', price: 50, emoji: '🌸' },
  { id: 'pigiama-stelle', name: 'Pigiama stellato', slot: 'top', price: 35, emoji: '🌙' },
  { id: 'maglia-sport', name: 'Maglia della squadra', slot: 'top', price: 55, emoji: '⚽' },
  { id: 'grembiule-chef', name: 'Grembiule da chef', slot: 'top', price: 40, emoji: '👨‍🍳' },
  { id: 'tuta-astronauta', name: 'Tuta da astronauta', slot: 'top', price: 120, emoji: '🚀', rare: true },
  { id: 'maglione-natale', name: 'Maglione natalizio', slot: 'top', price: 60, emoji: '🎄' },
  // cappelli
  { id: 'berretto', name: 'Berretto di lana', slot: 'hat', price: 20, emoji: '🧶' },
  { id: 'fiocco', name: 'Fiocco', slot: 'hat', price: 15, emoji: '🎀' },
  { id: 'baseball', name: 'Cappellino', slot: 'hat', price: 25, emoji: '🧢' },
  { id: 'cowboy', name: 'Cappello da cowboy', slot: 'hat', price: 45, emoji: '🤠' },
  { id: 'coroncina-fiori', name: 'Coroncina di fiori', slot: 'hat', price: 35, emoji: '🌼' },
  { id: 'cuffie', name: 'Cuffie musicali', slot: 'hat', price: 50, emoji: '🎧' },
  { id: 'mago', name: 'Cappello da mago', slot: 'hat', price: 70, emoji: '🧙' },
  { id: 'corona', name: 'Corona reale', slot: 'hat', price: 150, emoji: '👑', rare: true },
  { id: 'casco-bici', name: 'Caschetto', slot: 'hat', price: 30, emoji: '🚲' },
  // accessori
  { id: 'occhiali-sole', name: 'Occhiali da sole', slot: 'acc', price: 30, emoji: '🕶️' },
  { id: 'occhiali-tondi', name: 'Occhialini tondi', slot: 'acc', price: 25, emoji: '👓' },
  { id: 'sciarpa', name: 'Sciarpa', slot: 'acc', price: 20, emoji: '🧣' },
  { id: 'papillon', name: 'Papillon', slot: 'acc', price: 20, emoji: '🎩' },
  { id: 'ciuccio', name: 'Ciuccio', slot: 'acc', price: 10, emoji: '🍭' },
  { id: 'collana', name: 'Collanina di perle', slot: 'acc', price: 40, emoji: '📿' },
  { id: 'mantello', name: 'Mantello da eroe', slot: 'acc', price: 65, emoji: '🦸', back: true },
  { id: 'ali-fata', name: 'Ali da fatina', slot: 'acc', price: 80, emoji: '🧚', back: true, rare: true },
  { id: 'zainetto', name: 'Zainetto', slot: 'acc', price: 35, emoji: '🎒', back: true },
]

export const itemById = (id?: string | null) => ITEMS.find((i) => i.id === id)
export const foodById = (id?: string) => FOODS.find((f) => f.id === id)

export const STARTER_ITEMS = ['maglia-base']

export const JOBS = [
  { id: 'ufficio', name: 'Ufficio', emoji: '💼', min: 35, max: 55, minutes: 60, text: 'ha passato un\'ora a sistemare scartoffie' },
  { id: 'pizzeria', name: 'Pizzeria', emoji: '🍕', min: 25, max: 70, minutes: 60, text: 'ha sfornato pizze a ripetizione' },
  { id: 'giardino', name: 'Giardinaggio', emoji: '🌻', min: 15, max: 30, minutes: 20, text: 'ha curato le aiuole del vicino' },
  { id: 'baby', name: 'Lezioni private', emoji: '✏️', min: 20, max: 40, minutes: 30, text: 'ha dato ripetizioni di matematica' },
]

export const STICKERS = ['💌', '🌈', '⭐', '🍀', '☕', '🐣', '😂', '🥺', '🔥', '🎉']

export const WHEEL = [
  { id: 'c20', label: '20 🪙', weight: 4 },
  { id: 'c50', label: '50 🪙', weight: 3 },
  { id: 'c120', label: '120 🪙', weight: 1 },
  { id: 'item', label: 'Regalo 🎁', weight: 2 },
  { id: 'happy', label: 'Festa 🎉', weight: 3 },
  { id: 'harmony', label: 'Amore 💞', weight: 2 },
  { id: 'xp', label: 'Crescita 🌱', weight: 2 },
  { id: 'none', label: 'Ritenta 🙃', weight: 2 },
]

export const PARENT_STAGE: Stage = 'adulto'
