import type { FamilyState, Kid, Stage, Stats } from './types'

export interface Effects {
  stats?: Partial<Stats>
  smarts?: number
  coins?: number
  harmony?: number
  xp?: number
  item?: string
  trait?: string
  sick?: boolean
  heal?: boolean
  allKids?: Partial<Stats>
}

export interface Outcome extends Effects {
  text: string
}

export interface EventOption {
  id: string
  label: string
  emoji: string
  outcome?: Outcome
  chance?: { p: number; success: Outcome; fail: Outcome }
}

export interface EventTemplate {
  id: string
  emoji: string
  title: string
  text: string
  stages?: Stage[]
  needsKid?: boolean
  weight?: number
  when?: (s: FamilyState, kid?: Kid) => boolean
  options: EventOption[]
}

const piccoli: Stage[] = ['neonato', 'bambino']
const grandi: Stage[] = ['bambino', 'ragazzo', 'adulto']
const teen: Stage[] = ['ragazzo', 'adulto']

export const EVENTS: EventTemplate[] = [
  {
    id: 'pianto-notte', emoji: '🌙', title: 'Pianto nella notte', needsKid: true, stages: ['neonato'],
    text: '{kid} si è svegliato alle 3 di notte e piange a dirotto. Chi si alza?',
    options: [
      { id: 'ninna', label: 'Ninna nanna dolcissima', emoji: '🎶', outcome: { text: '{kid} si riaddormenta stringendo il dito di mamma/papà.', stats: { felicita: 12, energia: 10 }, harmony: 2, xp: 15 } },
      { id: 'latte', label: 'Biberon di emergenza', emoji: '🍼', outcome: { text: 'Pancia piena, sonno pieno. Funziona sempre!', stats: { fame: 25, energia: 8 }, coins: -3, xp: 10 } },
      { id: 'aspetta', label: 'Aspettiamo che si calmi', emoji: '🙉', chance: { p: 0.4, success: { text: 'Incredibile: si è calmato da solo!', stats: { energia: 5 }, xp: 5 }, fail: { text: 'Ha pianto per un\'ora. Nessuno ha dormito.', stats: { felicita: -15, energia: -10 }, harmony: -3 } } },
    ],
  },
  {
    id: 'primo-dente', emoji: '🦷', title: 'Il primo dentino!', needsKid: true, stages: ['neonato'],
    text: 'Spunta il primo dentino di {kid}! È un po\' dolorante e morde tutto.',
    options: [
      { id: 'anello', label: 'Anello da dentizione', emoji: '💍', outcome: { text: 'Morde felice il suo anello. Che sollievo!', stats: { felicita: 10, salute: 5 }, coins: -8, xp: 20 } },
      { id: 'foto', label: 'Foto ricordo per l\'album', emoji: '📸', outcome: { text: 'Foto bellissima. Peccato che lui sia un po\' nervoso.', stats: { felicita: -3 }, harmony: 4, xp: 20 } },
    ],
  },
  {
    id: 'prima-parola', emoji: '🗣️', title: 'La prima parola', needsKid: true, stages: ['neonato'], weight: 0.7,
    text: '{kid} sta per dire la sua prima parola... Cosa cercate di fargli dire?',
    options: [
      { id: 'mamma', label: '"Mamma!"', emoji: '👩', outcome: { text: '{kid} dice... "PAPPA"! Beh, quasi.', stats: { felicita: 10 }, smarts: 5, xp: 25 } },
      { id: 'papa', label: '"Papà!"', emoji: '👨', outcome: { text: '{kid} dice... "BAU"! Ha visto un cane.', stats: { felicita: 10 }, smarts: 5, xp: 25 } },
      { id: 'libero', label: 'Lasciamolo libero', emoji: '🕊️', outcome: { text: '{kid} dice il vostro nome di famiglia! Brividi.', stats: { felicita: 15 }, smarts: 8, harmony: 5, xp: 30 } },
    ],
  },
  {
    id: 'pozzanghera', emoji: '🌧️', title: 'Pozzanghera gigante', needsKid: true, stages: piccoli,
    text: 'Al parco {kid} ha avvistato la pozzanghera più grande del mondo. Gli occhi brillano.',
    options: [
      { id: 'salta', label: 'Salta pure!', emoji: '💦', outcome: { text: 'SPLASH! Felicità infinita, pulizia zero.', stats: { felicita: 25, igiene: -40 }, xp: 15 } },
      { id: 'stivali', label: 'Solo con gli stivaletti', emoji: '🥾', outcome: { text: 'Compromesso perfetto: saltelli e piedi asciutti.', stats: { felicita: 15, igiene: -10 }, coins: -10, xp: 15, harmony: 2 } },
      { id: 'no', label: 'No, andiamo a casa', emoji: '🙅', outcome: { text: 'Broncio per tutto il tragitto.', stats: { felicita: -12 }, xp: 5 } },
    ],
  },
  {
    id: 'muro-disegnato', emoji: '🖍️', title: 'Capolavoro sul muro', needsKid: true, stages: piccoli,
    text: '{kid} ha disegnato un enorme dinosauro sul muro del salotto. Con i pennarelli indelebili.',
    options: [
      { id: 'cornice', label: 'Ci mettiamo una cornice', emoji: '🖼️', outcome: { text: 'Ora è l\'opera d\'arte di casa. {kid} è orgogliosissimo.', stats: { felicita: 20 }, harmony: 3, xp: 15, trait: 'artista' } },
      { id: 'pulisci', label: 'Puliamo insieme', emoji: '🧽', outcome: { text: 'Un pomeriggio a strofinare. Ha imparato la lezione (forse).', stats: { felicita: -5, energia: -10 }, smarts: 4, xp: 15 } },
      { id: 'pittore', label: 'Chiamiamo l\'imbianchino', emoji: '🪣', outcome: { text: 'Muro come nuovo, portafoglio un po\' meno.', coins: -40, xp: 5 } },
    ],
  },
  {
    id: 'cane-randagio', emoji: '🐶', title: 'Un cagnolino!', needsKid: true, stages: grandi,
    text: '{kid} torna a casa con un cagnolino trovato per strada e vi guarda con gli occhioni.',
    options: [
      { id: 'tieni', label: 'Lo teniamo!', emoji: '🏡', outcome: { text: 'Benvenuto Biscotto! {kid} non è mai stato così felice.', allKids: { felicita: 20 }, coins: -30, harmony: 4, xp: 25 } },
      { id: 'canile', label: 'Portiamolo al rifugio', emoji: '🏥', outcome: { text: 'Al rifugio gli troveranno una famiglia. {kid} è triste ma capisce.', stats: { felicita: -8 }, smarts: 6, xp: 20 } },
      { id: 'vicina', label: 'Lo diamo alla vicina', emoji: '👵', outcome: { text: 'La signora Pina lo adora. E {kid} può andarlo a trovare!', stats: { felicita: 10 }, harmony: 2, xp: 20 } },
    ],
  },
  {
    id: 'brutto-voto', emoji: '📝', title: 'Un brutto voto', needsKid: true, stages: ['bambino', 'ragazzo'],
    text: '{kid} è tornato da scuola con un 4 in matematica e la faccia lunga.',
    options: [
      { id: 'aiuto', label: 'Studiamo insieme', emoji: '📐', outcome: { text: 'Due ore di esercizi e finalmente le frazioni hanno senso!', smarts: 12, stats: { felicita: -3, energia: -10 }, xp: 25, harmony: 2 } },
      { id: 'gelato', label: 'Gelato consolatorio', emoji: '🍨', outcome: { text: 'Il morale è tornato su. Il voto, meno.', stats: { felicita: 15 }, coins: -6, xp: 10 } },
      { id: 'punizione', label: 'Niente tablet per 3 giorni', emoji: '📵', chance: { p: 0.5, success: { text: 'Ha letto due libri per noia. Inaspettato!', smarts: 15, stats: { felicita: -8 }, xp: 20 }, fail: { text: 'Porta sbattuta e silenzio stampa.', stats: { felicita: -18 }, harmony: -3, xp: 10 } } },
    ],
  },
  {
    id: 'gita-scolastica', emoji: '🚌', title: 'Gita scolastica', needsKid: true, stages: grandi,
    text: 'La scuola di {kid} organizza una gita al Museo delle Scienze di Trento. Costa 25 monete.',
    options: [
      { id: 'si', label: 'Certo che ci va!', emoji: '🦕', outcome: { text: '{kid} è tornato parlando solo di dinosauri e pianeti.', smarts: 15, stats: { felicita: 15, energia: -15 }, coins: -25, xp: 30 } },
      { id: 'no', label: 'Questa volta no', emoji: '🏠', outcome: { text: 'Giornata a casa. Gli altri parlano della gita per settimane...', stats: { felicita: -12 }, xp: 5 } },
    ],
  },
  {
    id: 'talent-show', emoji: '🎤', title: 'Il talent della scuola', needsKid: true, stages: grandi,
    text: '{kid} vuole partecipare al talent show della scuola. Con quale numero?',
    options: [
      { id: 'canto', label: 'Canzone', emoji: '🎶', chance: { p: 0.6, success: { text: 'Standing ovation! {kid} vince il primo premio.', stats: { felicita: 25 }, coins: 50, xp: 35, item: 'cuffie' }, fail: { text: 'Stonatina... ma tutti hanno applaudito lo stesso.', stats: { felicita: 5 }, xp: 20 } } },
      { id: 'magia', label: 'Numero di magia', emoji: '🪄', chance: { p: 0.45, success: { text: 'Il coniglio è uscito dal cappello! Pubblico in delirio.', stats: { felicita: 25 }, xp: 35, item: 'mago' }, fail: { text: 'Il trucco è andato storto, ma ha fatto ridere tutti.', stats: { felicita: 8 }, xp: 20 } } },
      { id: 'pubblico', label: 'Meglio in platea', emoji: '🍿', outcome: { text: 'Popcorn e tifo per gli amici. Serata tranquilla.', stats: { felicita: 6 }, xp: 10 } },
    ],
  },
  {
    id: 'febbre', emoji: '🤒', title: 'Febbriciattola', needsKid: true,
    text: '{kid} è caldo caldo e un po\' moscio. Forse ha preso freddo.',
    options: [
      { id: 'dottore', label: 'Dal pediatra', emoji: '👩‍⚕️', outcome: { text: 'Visita veloce e sciroppo alla fragola. Già meglio!', heal: true, stats: { salute: 20 }, coins: -20, xp: 10 } },
      { id: 'brodo', label: 'Brodino e copertina', emoji: '🍲', chance: { p: 0.65, success: { text: 'Il brodo della nonna fa miracoli.', stats: { salute: 15, felicita: 8 }, xp: 10 }, fail: { text: 'Peggiora un po\'... servirà la medicina.', sick: true, stats: { salute: -15 }, xp: 5 } } },
    ],
  },
  {
    id: 'compleanno-amico', emoji: '🎈', title: 'Festa di compleanno', needsKid: true, stages: grandi,
    text: '{kid} è invitato alla festa del suo migliore amico. Che regalo portiamo?',
    options: [
      { id: 'costoso', label: 'Regalone', emoji: '🎁', outcome: { text: 'L\'amico è al settimo cielo. {kid} pure.', stats: { felicita: 15 }, coins: -35, xp: 20 } },
      { id: 'fatto-mano', label: 'Un disegno fatto a mano', emoji: '✍️', outcome: { text: 'Il disegno è finito appeso in camera dell\'amico. Che cuore!', stats: { felicita: 12 }, smarts: 4, harmony: 3, xp: 25 } },
    ],
  },
  {
    id: 'mostro-armadio', emoji: '👹', title: 'Il mostro nell\'armadio', needsKid: true, stages: piccoli,
    text: '{kid} giura che nell\'armadio c\'è un mostro. Non vuole dormire.',
    options: [
      { id: 'spray', label: 'Spray anti-mostri', emoji: '🧴', outcome: { text: 'Due spruzzi d\'acqua profumata e il mostro è scappato!', stats: { felicita: 12, energia: 15 }, xp: 15, harmony: 2 } },
      { id: 'lettone', label: 'Nel lettone con noi', emoji: '🛏️', outcome: { text: 'Dorme beato. Voi un po\' meno, tra calci e ginocchiate.', stats: { felicita: 18, energia: 10 }, harmony: -2, xp: 10 } },
      { id: 'spiega', label: 'Spieghiamo che non esistono', emoji: '🔦', outcome: { text: 'Ispezione con la torcia: niente mostri. Coraggio guadagnato!', smarts: 6, stats: { energia: 8 }, xp: 15 } },
    ],
  },
  {
    id: 'sport', emoji: '🏅', title: 'Quale sport?', needsKid: true, stages: ['bambino', 'ragazzo'], weight: 0.8,
    text: '{kid} vuole iniziare uno sport. Quale scegliete?',
    options: [
      { id: 'calcio', label: 'Calcio', emoji: '⚽', outcome: { text: 'Ginocchia sbucciate e un gol all\'esordio!', stats: { felicita: 15, salute: 10, igiene: -20 }, coins: -20, xp: 25, item: 'maglia-sport' } },
      { id: 'sci', label: 'Sci in Val di Fiemme', emoji: '⛷️', outcome: { text: 'Prima discesa sulla pista blu senza cadere!', stats: { felicita: 18, salute: 12, energia: -20 }, coins: -40, xp: 30, item: 'berretto' } },
      { id: 'scacchi', label: 'Scacchi', emoji: '♟️', outcome: { text: 'Ha battuto il nonno in 14 mosse. Il nonno non ne parla.', smarts: 18, stats: { felicita: 8 }, coins: -10, xp: 25 } },
    ],
  },
  {
    id: 'cotta', emoji: '💘', title: 'Una cotta!', needsKid: true, stages: teen,
    text: '{kid} scrive bigliettini e sospira guardando il telefono. Si è preso una cotta!',
    options: [
      { id: 'consigli', label: 'Diamogli consigli', emoji: '🧠', chance: { p: 0.55, success: { text: 'Il consiglio ha funzionato: appuntamento per un gelato!', stats: { felicita: 25 }, harmony: 3, xp: 30 }, fail: { text: '"Siete imbarazzanti!" Porta chiusa.', stats: { felicita: -6 }, xp: 15 } } },
      { id: 'privacy', label: 'Rispettiamo la privacy', emoji: '🤐', outcome: { text: '{kid} apprezza tantissimo la fiducia.', stats: { felicita: 12 }, smarts: 3, xp: 20 } },
    ],
  },
  {
    id: 'telefono', emoji: '📱', title: 'Il primo telefono', needsKid: true, stages: ['ragazzo'],
    text: 'Tutti i compagni hanno il telefono. {kid} chiede il suo.',
    options: [
      { id: 'si', label: 'Telefono nuovo', emoji: '📲', outcome: { text: 'Felicità alle stelle (e notifiche a raffica).', stats: { felicita: 25, energia: -8 }, coins: -80, smarts: -3, xp: 25 } },
      { id: 'usato', label: 'Il vecchio di casa', emoji: '☎️', outcome: { text: 'Un po\' lento, ma funziona! E ha imparato a ripararlo.', stats: { felicita: 10 }, smarts: 6, coins: -5, xp: 25 } },
      { id: 'aspetta', label: 'Aspettiamo ancora un anno', emoji: '⏳', outcome: { text: 'Delusione... ma ha riscoperto i fumetti.', stats: { felicita: -10 }, smarts: 8, xp: 15 } },
    ],
  },
  {
    id: 'patente', emoji: '🚗', title: 'Lezione di guida', needsKid: true, stages: ['adulto'],
    text: '{kid} vuole fare pratica con la macchina di famiglia. Chi si siede accanto?',
    options: [
      { id: 'coraggio', label: 'Andiamo!', emoji: '😬', chance: { p: 0.7, success: { text: 'Parcheggio perfetto al primo colpo. Orgoglio!', stats: { felicita: 20 }, smarts: 8, xp: 35 }, fail: { text: 'Specchietto contro il cassonetto. Ops.', coins: -45, stats: { felicita: -5 }, xp: 25 } } },
      { id: 'scuola', label: 'Meglio l\'autoscuola', emoji: '🏫', outcome: { text: 'Istruttore paziente, nervi dei genitori salvi.', coins: -50, smarts: 6, xp: 30, harmony: 2 } },
    ],
  },
  {
    id: 'lavoretto', emoji: '🧺', title: 'Lavoretto estivo', needsKid: true, stages: teen,
    text: 'Il bar in piazza cerca un aiutante per l\'estate. {kid} ci starebbe.',
    options: [
      { id: 'si', label: 'Esperienza utile!', emoji: '☕', outcome: { text: '{kid} porta a casa la prima paghetta guadagnata e offre lui la pizza!', coins: 60, stats: { energia: -20, felicita: 10 }, smarts: 6, xp: 30 } },
      { id: 'vacanza', label: 'Prima le vacanze', emoji: '🏖️', outcome: { text: 'Un\'estate di relax totale.', stats: { felicita: 18, energia: 20 }, xp: 15 } },
    ],
  },
  // eventi di famiglia (senza figlio specifico)
  {
    id: 'bolletta', emoji: '💡', title: 'Bolletta a sorpresa', weight: 0.8,
    text: 'È arrivata una bolletta della luce più alta del previsto. Come la gestite?',
    options: [
      { id: 'paga', label: 'Paghiamo e basta', emoji: '💸', outcome: { text: 'Pagata. Ma da oggi si spengono le luci!', coins: -30 } },
      { id: 'risparmio', label: 'Settimana del risparmio', emoji: '🕯️', outcome: { text: 'Cene a lume di candela: romantiche e economiche.', coins: -10, harmony: 6, allKids: { felicita: -4 } } },
    ],
  },
  {
    id: 'nonna', emoji: '👵', title: 'Visita della nonna', weight: 1.1,
    text: 'Arriva la nonna con una teglia di lasagne e tanta voglia di coccolare i nipotini.',
    options: [
      { id: 'pranzo', label: 'Grande pranzo insieme', emoji: '🍽️', outcome: { text: 'Pancia piena, cuore pieno. La nonna ha lasciato pure una mancia!', allKids: { fame: 35, felicita: 15 }, coins: 25, harmony: 4 } },
      { id: 'babysitter', label: 'Serata libera per voi due', emoji: '🥂', outcome: { text: 'La nonna tiene i piccoli e voi uscite a cena. Che bello!', harmony: 12, coins: -20, allKids: { felicita: 8 } } },
    ],
  },
  {
    id: 'lotteria', emoji: '🎟️', title: 'Biglietto della lotteria', weight: 0.6,
    text: 'Al bar vendono biglietti della lotteria di paese. 10 monete l\'uno.',
    options: [
      { id: 'compra', label: 'Tentiamo la fortuna', emoji: '🍀', chance: { p: 0.3, success: { text: 'VINTO! 100 monete! Si festeggia!', coins: 90, harmony: 4 }, fail: { text: 'Niente da fare. Ritenteremo.', coins: -10 } } },
      { id: 'no', label: 'No, grazie', emoji: '🙂', outcome: { text: 'Soldi al sicuro. Saggi!', harmony: 1 } },
    ],
  },
  {
    id: 'trasloco-mobili', emoji: '🛋️', title: 'Divano nuovo?', weight: 0.6,
    text: 'Il vecchio divano cigola da mesi. C\'è un\'offerta in negozio.',
    options: [
      { id: 'compra', label: 'Divano morbidissimo', emoji: '☁️', outcome: { text: 'Pomeriggi di film abbracciati. Tutti più rilassati.', coins: -60, harmony: 8, allKids: { energia: 15, felicita: 8 } } },
      { id: 'aggiusta', label: 'Lo aggiustiamo noi', emoji: '🔧', chance: { p: 0.5, success: { text: 'Riparato! Fai-da-te campioni.', coins: -5, harmony: 6 }, fail: { text: 'Ora cigola E pende a sinistra.', coins: -5, harmony: -3 } } },
    ],
  },
  {
    id: 'nevicata', emoji: '❄️', title: 'Grande nevicata!', weight: 0.9,
    text: 'Stanotte sono caduti 40 cm di neve. Le scuole sono chiuse!',
    options: [
      { id: 'pupazzo', label: 'Pupazzo di neve in giardino', emoji: '⛄', outcome: { text: 'Il pupazzo ha la vostra sciarpa e una carota. Bellissimo!', allKids: { felicita: 20, energia: -10, igiene: -10 }, harmony: 5, item: 'sciarpa' } },
      { id: 'cioccolata', label: 'Cioccolata calda e film', emoji: '☕', outcome: { text: 'Plaid, cioccolata e cartoni. Giornata perfetta.', allKids: { felicita: 15, energia: 15 }, coins: -8, harmony: 4 } },
    ],
  },
  {
    id: 'festa-paese', emoji: '🎡', title: 'Sagra di paese', weight: 0.9,
    text: 'C\'è la sagra in piazza: giostre, zucchero filato e musica.',
    options: [
      { id: 'giostre', label: 'Giostre per tutti!', emoji: '🎠', outcome: { text: 'Giri sull\'autoscontro e risate a crepapelle.', allKids: { felicita: 20, energia: -12 }, coins: -25, harmony: 3 } },
      { id: 'pesca', label: 'Pesca di beneficenza', emoji: '🎣', chance: { p: 0.5, success: { text: 'Avete pescato un premio speciale!', coins: -5, item: 'coroncina-fiori', allKids: { felicita: 10 } }, fail: { text: 'Avete vinto... un portachiavi a forma di salame.', coins: -5, allKids: { felicita: 4 } } } },
    ],
  },
  {
    id: 'pacco-misterioso', emoji: '📦', title: 'Pacco misterioso', weight: 0.7,
    text: 'Sullo zerbino c\'è un pacco senza mittente con un fiocco rosso.',
    options: [
      { id: 'apri', label: 'Apriamolo!', emoji: '🎁', chance: { p: 0.7, success: { text: 'Un regalo dallo zio d\'America! Un accessorio nuovo.', item: 'papillon', harmony: 2 }, fail: { text: 'Era per il vicino. Figuraccia.', harmony: -1 } } },
      { id: 'vicini', label: 'Chiediamo ai vicini', emoji: '🚪', outcome: { text: 'Era del vicino, che per ringraziarvi vi porta una torta!', allKids: { fame: 15, felicita: 10 }, harmony: 3 } },
    ],
  },
  {
    id: 'litigio-fratelli', emoji: '😤', title: 'Litigio tra fratelli', weight: 1.2,
    when: (s) => s.kids.length >= 2,
    text: 'I bambini litigano per il telecomando. Volano cuscini!',
    options: [
      { id: 'turni', label: 'Turni con il timer', emoji: '⏲️', outcome: { text: 'Giustizia è fatta. Pace ritrovata (fino a domani).', allKids: { felicita: 5 }, harmony: 2 } },
      { id: 'fuori', label: 'Tutti fuori a giocare', emoji: '🌳', outcome: { text: 'Al parco sono tornati migliori amici.', allKids: { felicita: 12, energia: -10, salute: 5 } } },
    ],
  },
  {
    id: 'vacanza', emoji: '🏕️', title: 'Weekend fuori?', weight: 0.7,
    text: 'Che ne dite di un weekend in campeggio sul lago di Tovel?',
    options: [
      { id: 'campeggio', label: 'Tenda e marshmallow', emoji: '🔥', outcome: { text: 'Stelle, falò e storie di paura. Ricordo indimenticabile!', allKids: { felicita: 25, igiene: -20, energia: -10 }, coins: -30, harmony: 8 } },
      { id: 'hotel', label: 'Hotel con piscina', emoji: '🏊', outcome: { text: 'Relax totale per tutta la famiglia.', allKids: { felicita: 20, energia: 20, igiene: 10 }, coins: -80, harmony: 6 } },
      { id: 'casa', label: 'Restiamo a casa', emoji: '🏠', outcome: { text: 'Pizza e giochi da tavolo. Anche così è bello.', allKids: { felicita: 8 }, coins: -10, harmony: 2 } },
    ],
  },
  {
    id: 'cucinare', emoji: '👩‍🍳', title: 'Piccoli chef', needsKid: true, stages: grandi,
    text: '{kid} vuole cucinare la cena da solo stasera.',
    options: [
      { id: 'si', label: 'Fiducia totale!', emoji: '🍳', chance: { p: 0.55, success: { text: 'Pasta perfetta! Chef stellato in famiglia.', stats: { felicita: 20, fame: 30 }, smarts: 8, xp: 25, item: 'grembiule-chef' }, fail: { text: 'Pasta scotta e cucina esplosa. Ma ci ha messo il cuore.', stats: { felicita: 6, igiene: -20 }, xp: 15 } } },
      { id: 'aiuto', label: 'Cuciniamo insieme', emoji: '🥄', outcome: { text: 'Lasagne a sei mani. Squisite!', stats: { felicita: 15, fame: 30 }, smarts: 5, harmony: 3, xp: 20 } },
    ],
  },
  {
    id: 'bugia', emoji: '🤥', title: 'Una piccola bugia', needsKid: true, stages: grandi,
    text: '{kid} dice di aver fatto i compiti... ma lo zaino è ancora chiuso.',
    options: [
      { id: 'parla', label: 'Parliamone con calma', emoji: '💬', outcome: { text: 'Ha confessato e chiesto scusa. Bel momento.', smarts: 6, stats: { felicita: 4 }, harmony: 3, xp: 20 } },
      { id: 'finta', label: 'Facciamo finta di nulla', emoji: '🙈', outcome: { text: 'Il giorno dopo nota a scuola. Oops.', smarts: -4, stats: { felicita: -8 }, harmony: -2, xp: 10 } },
    ],
  },
]

export const eventById = (id: string) => EVENTS.find((e) => e.id === id)
