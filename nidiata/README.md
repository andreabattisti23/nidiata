# Nidiata 🐣

Un tamagotchi da giocare in due: create una famiglia, mandate il link all'altra persona e crescete insieme dei cuccioli digitali.

**Stack:** React 19 · Tailwind CSS 4 · TanStack Router · TanStack Query · Netlify Functions + Netlify Blobs.

## Cosa c'è dentro

- **Sessione condivisa via link**: chi crea la famiglia riceve un link `/s/<codice>/unisciti` (copia, WhatsApp, condividi). Fino a 4 genitori per famiglia.
- **Fino a 5 cuccioli**, 8 specie (fagiolino, gattino, coniglietto, orsetto, draghetto, pulcino, alienino, ranocchio), 12 colori, 4 motivi, 10 tratti di carattere.
- **Statistiche** (pancia, energia, pulizia, felicità, salute, intelligenza) che calano col tempo reale, anche offline. Se nessuno passa da 2 ore arriva la nonna e tutto rallenta.
- **Cure**: 10 cibi (ognuno ha il suo cibo preferito segreto), gioco, bagnetto, nanna, coccole, canzoni, studio, medicine. Si ammalano se trascurati.
- **Crescita** in 4 fasi (neonato → bambino → ragazzo → grande): l'avatar cambia forma.
- **28 imprevisti** con scelte, alcune a rischio 🎲. Votate entrambi; se non siete d'accordo decide la monetina (e cala l'armonia di coppia 💞). Dopo 6 ore senza il voto del partner vale il voto già dato.
- **Guardaroba**: 28 capi (vestiti, cappelli, accessori, mantelli e ali) per cuccioli e genitori, negozio con camerino di prova.
- **Soldini**: lavori con timer, minigioco "Pioggia di biscotti", ruota della fortuna giornaliera.
- **Bacheca** di bigliettini con sticker, **diario** di famiglia, **20 trofei**, notifiche quando l'altro fa qualcosa, giorno/notte nella stanza in base all'ora.
- **Album** (`/album`) con tutti gli avatar, umori e vestiti.

## Avvio in locale

```bash
npm install
npm run dev          # solo frontend: "modalità prova" con salvataggio nel browser
```

Per provare la vera sessione condivisa (funzione + Blobs) in locale:

```bash
npm install -g netlify-cli
netlify dev          # http://localhost:8888
```

## Pubblicare su Netlify

1. Carica la cartella su un repo GitHub e importalo su Netlify (oppure `netlify deploy --prod`).
2. Le impostazioni sono già in `netlify.toml` (build `npm run build`, cartella `dist`).
3. Netlify Blobs si attiva da solo, non serve configurare nulla.

## Struttura

```
src/game/        regole del gioco (condivise tra browser e server)
  engine.ts      tempo, cure, eventi, voti, ruota, trofei
  catalog.ts     specie, cibi, vestiti, lavori
  events.ts      gli imprevisti
netlify/functions/api.mts   API /api/sessions (stato salvato su Netlify Blobs)
src/components/Avatar.tsx   avatar SVG componibili (specie, umori, vestiti)
src/routes/      pagine (TanStack Router)
```

Lo stato è calcolato sul server, così entrambi vedono la stessa famiglia. Il client aggiorna ogni 4 secondi con TanStack Query.

Nota: chi ha il link può entrare in famiglia, quindi mandalo solo a chi vuoi tu.
