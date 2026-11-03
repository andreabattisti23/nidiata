/** Testi dei contenuti di gioco per una lingua (nomi, eventi, trofei...). */
export interface Content {
  species: Record<string, string>
  patterns: Record<string, string>
  stages: Record<string, string>
  stats: Record<string, string>
  /** [nome, descrizione] */
  traits: Record<string, [string, string]>
  foods: Record<string, string>
  items: Record<string, string>
  /** [nome, cosa fa (frase dopo il nome del genitore)] */
  jobs: Record<string, [string, string]>
  wheel: Record<string, string>
  /** [nome, descrizione] */
  achievements: Record<string, [string, string]>
  /** t = titolo, x = testo; o[opzione] = [etichetta, esito] oppure [etichetta, successo, fallimento] */
  events: Record<string, { t: string; x: string; o: Record<string, string[]> }>
  lists: { game: string[]; subj: string[]; song: string[] }
  kidNames: string[]
  /** true se i nomi comuni vanno scritti con la maiuscola (tedesco) */
  keepCase?: boolean
}
