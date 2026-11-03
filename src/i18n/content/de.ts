import type { Content } from './types'

export const contentDe: Content = {
  keepCase: true,
  species: { fagiolo: 'Böhnchen', gattino: 'Kätzchen', coniglio: 'Häschen', orsetto: 'Teddy', draghetto: 'Drachenbaby', pulcino: 'Küken', alieno: 'Alien', rana: 'Fröschlein' },
  patterns: { liscio: 'Einfarbig', pancino: 'Bäuchlein', macchie: 'Flecken', lentiggini: 'Sommersprossen' },
  stages: { neonato: 'Baby', bambino: 'Kind', ragazzo: 'Teenager', adulto: 'Erwachsen' },
  stats: { fame: 'Bauch', energia: 'Energie', igiene: 'Sauberkeit', felicita: 'Glück', salute: 'Gesundheit' },
  traits: {
    goloso: ['Leckermaul', 'Hat öfter Hunger, aber Essen macht es glücklicher.'],
    dormiglione: ['Schlafmütze', 'Wird schneller müde und liebt das Bett.'],
    vivace: ['Wirbelwind', 'Langweilt sich schnell, aber Spielen zählt doppelt.'],
    pulitino: ['Sauberfrau', 'Wird weniger schmutzig und liebt das Baden.'],
    secchione: ['Streber', 'Lernt doppelt so viel.'],
    coccolone: ['Kuschelmonster', 'Kuscheln macht es überglücklich.'],
    robusto: ['Kräftig', 'Wird selten krank.'],
    artista: ['Künstler', 'Liebt es, wenn ihr ihm etwas vorsingt.'],
    avventuroso: ['Abenteurer', 'Erlebt mehr Überraschungen.'],
    timido: ['Schüchtern', 'Wird schnell nervös, aber Kuscheln hilft sehr.'],
  },
  foods: {
    latte: 'Milchfläschchen', pappa: 'Brei', mela: 'Apfel', minestrone: 'Gemüsesuppe', pasta: 'Nudeln mit Tomatensoße',
    pizza: 'Pizza', sushi: 'Sushi', gelato: 'Eis', torta: 'Stück Kuchen', canederli: 'Knödel',
  },
  items: {
    'maglia-base': 'T-Shirt', 'maglia-righe': 'Ringelshirt', 'felpa-cuore': 'Herz-Pulli', salopette: 'Latzhose',
    'vestito-fiori': 'Blümchenkleid', 'pigiama-stelle': 'Sternen-Schlafanzug', 'maglia-sport': 'Trikot', 'grembiule-chef': 'Kochschürze',
    'tuta-astronauta': 'Astronautenanzug', 'maglione-natale': 'Weihnachtspulli', berretto: 'Wollmütze', fiocco: 'Schleife',
    baseball: 'Kappe', cowboy: 'Cowboyhut', 'coroncina-fiori': 'Blumenkranz', cuffie: 'Kopfhörer', mago: 'Zauberhut',
    corona: 'Königskrone', 'casco-bici': 'Fahrradhelm', 'occhiali-sole': 'Sonnenbrille', 'occhiali-tondi': 'Runde Brille',
    sciarpa: 'Schal', papillon: 'Fliege', ciuccio: 'Schnuller', collana: 'Perlenkette', mantello: 'Heldenumhang',
    'ali-fata': 'Feenflügel', zainetto: 'Rucksäckchen',
  },
  jobs: {
    ufficio: ['Büro', 'hat eine Stunde lang Papierkram sortiert'],
    pizzeria: ['Pizzeria', 'hat eine Pizza nach der anderen gebacken'],
    giardino: ['Gartenarbeit', 'hat die Beete der Nachbarn gepflegt'],
    baby: ['Nachhilfe', 'hat Mathe-Nachhilfe gegeben'],
  },
  wheel: { c20: '20 🪙', c50: '50 🪙', c120: '120 🪙', item: 'Geschenk 🎁', happy: 'Party 🎉', harmony: 'Liebe 💞', xp: 'Wachsen 🌱', none: 'Nochmal 🙃' },
  achievements: {
    'primo-cucciolo': ['Es ist da!', 'Begrüßt das erste Kleine.'],
    'in-due': ['Zweierteam', 'Der zweite Elternteil tritt der Familie bei.'],
    'famiglia-numerosa': ['Großfamilie', 'Zieht drei Kleine gemeinsam groß.'],
    'primo-imprevisto': ['Erste Entscheidung', 'Löst euer erstes Ereignis.'],
    'dieci-imprevisti': ['Erfahrene Eltern', 'Löst 10 Ereignisse.'],
    accordo: ['Auf einer Wellenlänge', 'Stimmt 5-mal für dasselbe.'],
    bambino: ['Erste Schritte', 'Ein Kleines wird ein Kind.'],
    ragazzo: ['Pubertät!', 'Ein Kleines wird ein Teenager.'],
    grande: ['Abschluss!', 'Ein Kleines wird erwachsen.'],
    'cento-cure': ['Hundertmal Liebe', 'Kümmert euch 100-mal um die Kleinen.'],
    chef: ['Sterneküche', 'Serviert 30 Mahlzeiten.'],
    fashion: ['Fashion-Familie', 'Habt 8 Teile im Kleiderschrank.'],
    'look-completo': ['Komplettes Outfit', 'Ein Kleines mit Shirt, Hut und Accessoire.'],
    paperone: ['Volles Sparschwein', 'Spart 500 Münzen.'],
    armonia: ['Unendliche Liebe', 'Paar-Harmonie bei 100 %.'],
    perfetto: ['Top-Kleines', 'Alle Werte eines Kleinen über 80.'],
    campione: ['Keks-Champion', 'Erreicht mindestens 30 Punkte im Minispiel.'],
    postino: ['Liebesbriefträger', 'Hängt 10 Nachrichten an die Pinnwand.'],
    fortunelli: ['Glückspilze', 'Dreht 7-mal am Glücksrad.'],
    genio: ['Kleines Genie', 'Ein Kleines erreicht 80 Klugheit.'],
  },
  events: {
    'pianto-notte': { t: 'Weinen in der Nacht', x: '{kid} ist um 3 Uhr nachts aufgewacht und weint bitterlich. Wer steht auf?', o: {
      ninna: ['Zuckersüßes Schlaflied', '{kid} schläft wieder ein und hält Mamas oder Papas Finger fest.'],
      latte: ['Notfall-Fläschchen', 'Voller Bauch, tiefer Schlaf. Klappt immer!'],
      aspetta: ['Warten, bis es sich beruhigt', 'Unglaublich: Es hat sich von selbst beruhigt!', 'Es hat eine Stunde geweint. Keiner hat geschlafen.'] } },
    'primo-dente': { t: 'Das erste Zähnchen!', x: 'Bei {kid} kommt das erste Zähnchen! Es tut ein bisschen weh und es beißt auf alles.', o: {
      anello: ['Beißring', 'Kaut fröhlich auf dem Beißring. Was für eine Erleichterung!'],
      foto: ['Foto fürs Album', 'Wunderschönes Foto. Schade, dass es ein bisschen quengelig ist.'] } },
    'prima-parola': { t: 'Das erste Wort', x: '{kid} sagt gleich sein erstes Wort... Was soll es sagen?', o: {
      mamma: ['„Mama!“', '{kid} sagt... „PAPPA“! Na ja, fast.'],
      papa: ['„Papa!“', '{kid} sagt... „WAU“! Es hat einen Hund gesehen.'],
      libero: ['Wir lassen es selbst wählen', '{kid} sagt euren Familiennamen! Gänsehaut.'] } },
    pozzanghera: { t: 'Riesenpfütze', x: 'Im Park hat {kid} die größte Pfütze der Welt entdeckt. Die Augen leuchten.', o: {
      salta: ['Spring ruhig!', 'PLATSCH! Unendliches Glück, null Sauberkeit.'],
      stivali: ['Nur mit Gummistiefeln', 'Perfekter Kompromiss: Hüpfen und trockene Füße.'],
      no: ['Nein, wir gehen nach Hause', 'Schmollen auf dem ganzen Heimweg.'] } },
    'muro-disegnato': { t: 'Meisterwerk an der Wand', x: '{kid} hat einen riesigen Dinosaurier an die Wohnzimmerwand gemalt. Mit wasserfesten Stiften.', o: {
      cornice: ['Wir rahmen es ein', 'Jetzt ist es das Kunstwerk des Hauses. {kid} ist mächtig stolz.'],
      pulisci: ['Gemeinsam putzen', 'Ein Nachmittag Schrubben. Lektion gelernt (vielleicht).'],
      pittore: ['Den Maler rufen', 'Wand wie neu, Geldbeutel nicht mehr ganz.'] } },
    'cane-randagio': { t: 'Ein Hündchen!', x: '{kid} kommt mit einem Hündchen von der Straße nach Hause und schaut euch mit großen Augen an.', o: {
      tieni: ['Wir behalten es!', 'Willkommen, Keks! {kid} war noch nie so glücklich.'],
      canile: ['Ins Tierheim bringen', 'Im Tierheim findet man eine Familie für es. {kid} ist traurig, versteht es aber.'],
      vicina: ['Der Nachbarin geben', 'Frau Pina liebt es. Und {kid} kann es besuchen!'] } },
    'brutto-voto': { t: 'Eine schlechte Note', x: '{kid} ist mit einer Fünf in Mathe und langem Gesicht von der Schule gekommen.', o: {
      aiuto: ['Gemeinsam lernen', 'Zwei Stunden Übungen und endlich ergeben Brüche einen Sinn!'],
      gelato: ['Trost-Eis', 'Die Laune ist wieder gut. Die Note eher nicht.'],
      punizione: ['3 Tage kein Tablet', 'Aus Langeweile zwei Bücher gelesen. Unerwartet!', 'Tür zugeknallt und Funkstille.'] } },
    'gita-scolastica': { t: 'Klassenausflug', x: 'Die Schule von {kid} macht einen Ausflug ins Naturwissenschaftsmuseum in Trient. Kostet 25 Münzen.', o: {
      si: ['Na klar fährt es mit!', '{kid} kam zurück und redet nur noch von Dinosauriern und Planeten.'],
      no: ['Diesmal nicht', 'Ein Tag zu Hause. Die anderen reden wochenlang vom Ausflug...'] } },
    'talent-show': { t: 'Talentshow der Schule', x: '{kid} will bei der Talentshow der Schule mitmachen. Mit welcher Nummer?', o: {
      canto: ['Lied', 'Standing Ovations! {kid} gewinnt den ersten Preis.', 'Ein bisschen schief... aber alle haben trotzdem geklatscht.'],
      magia: ['Zaubertrick', 'Das Kaninchen kam aus dem Hut! Das Publikum tobt.', 'Der Trick ging schief, aber alle mussten lachen.'],
      pubblico: ['Lieber im Publikum', 'Popcorn und Anfeuern für die Freunde. Ein ruhiger Abend.'] } },
    febbre: { t: 'Leichtes Fieber', x: '{kid} ist ganz warm und ein bisschen schlapp. Vielleicht hat es sich verkühlt.', o: {
      dottore: ['Zum Kinderarzt', 'Kurze Untersuchung und Erdbeersirup. Schon besser!'],
      brodo: ['Brühe und Kuscheldecke', 'Omas Brühe wirkt Wunder.', 'Es wird etwas schlimmer... Medizin ist nötig.'] } },
    'compleanno-amico': { t: 'Geburtstagsparty', x: '{kid} ist zur Party des besten Freundes eingeladen. Was schenken wir?', o: {
      costoso: ['Riesengeschenk', 'Der Freund ist im siebten Himmel. {kid} auch.'],
      'fatto-mano': ['Ein selbst gemaltes Bild', 'Das Bild hängt jetzt im Zimmer des Freundes. Wie süß!'] } },
    'mostro-armadio': { t: 'Das Monster im Schrank', x: '{kid} schwört, dass ein Monster im Schrank ist. Es will nicht schlafen.', o: {
      spray: ['Anti-Monster-Spray', 'Zwei Sprühstöße Duftwasser und das Monster ist geflohen!'],
      lettone: ['Ab in unser Bett', 'Es schläft selig. Ihr weniger, zwischen Tritten und Knien.'],
      spiega: ['Erklären, dass es keine gibt', 'Inspektion mit der Taschenlampe: keine Monster. Mut gewonnen!'] } },
    sport: { t: 'Welcher Sport?', x: '{kid} möchte mit einem Sport anfangen. Welchen wählt ihr?', o: {
      calcio: ['Fußball', 'Aufgeschürfte Knie und ein Tor beim ersten Spiel!'],
      sci: ['Skifahren im Fleimstal', 'Erste Abfahrt auf der blauen Piste ohne Sturz!'],
      scacchi: ['Schach', 'Hat Opa in 14 Zügen geschlagen. Opa redet nicht darüber.'] } },
    cotta: { t: 'Verknallt!', x: '{kid} schreibt Zettelchen und seufzt beim Blick aufs Handy. Es ist verknallt!', o: {
      consigli: ['Ratschläge geben', 'Der Rat hat geklappt: Eis-Date!', '„Ihr seid so peinlich!“ Tür zu.'],
      privacy: ['Privatsphäre respektieren', '{kid} schätzt das Vertrauen sehr.'] } },
    telefono: { t: 'Das erste Handy', x: 'Alle Mitschüler haben ein Handy. {kid} will auch eins.', o: {
      si: ['Neues Handy', 'Glück ohne Ende (und Benachrichtigungen ohne Ende).'],
      usato: ['Das alte Familienhandy', 'Etwas langsam, aber es funktioniert! Und es hat gelernt, es zu reparieren.'],
      aspetta: ['Noch ein Jahr warten', 'Enttäuschung... aber es hat die Comics wiederentdeckt.'] } },
    patente: { t: 'Fahrstunde', x: '{kid} will mit dem Familienauto üben. Wer setzt sich daneben?', o: {
      coraggio: ['Los geht’s!', 'Perfekt eingeparkt beim ersten Versuch. Stolz!', 'Spiegel gegen die Mülltonne. Hoppla.'],
      scuola: ['Lieber die Fahrschule', 'Geduldiger Fahrlehrer, Nerven der Eltern gerettet.'] } },
    lavoretto: { t: 'Ferienjob', x: 'Das Café am Platz sucht eine Aushilfe für den Sommer. {kid} hätte Lust.', o: {
      si: ['Nützliche Erfahrung!', '{kid} bringt den ersten selbst verdienten Lohn nach Hause und lädt alle zur Pizza ein!'],
      vacanza: ['Erst mal Ferien', 'Ein Sommer voller Entspannung.'] } },
    bolletta: { t: 'Überraschende Rechnung', x: 'Die Stromrechnung ist höher als erwartet. Was macht ihr?', o: {
      paga: ['Einfach bezahlen', 'Bezahlt. Aber ab heute wird das Licht ausgemacht!'],
      risparmio: ['Spar-Woche', 'Abendessen bei Kerzenschein: romantisch und günstig.'] } },
    nonna: { t: 'Oma kommt zu Besuch', x: 'Oma kommt mit einer Form Lasagne und großer Lust, die Enkel zu knuddeln.', o: {
      pranzo: ['Großes Mittagessen zusammen', 'Voller Bauch, volles Herz. Oma hat sogar Taschengeld dagelassen!'],
      babysitter: ['Freier Abend für euch zwei', 'Oma passt auf die Kleinen auf und ihr geht essen. Wie schön!'] } },
    lotteria: { t: 'Lotterielos', x: 'Im Café gibt es Lose für die Dorflotterie. 10 Münzen pro Stück.', o: {
      compra: ['Wir versuchen unser Glück', 'GEWONNEN! 100 Münzen! Es wird gefeiert!', 'Kein Glück. Nächstes Mal vielleicht.'],
      no: ['Nein, danke', 'Geld in Sicherheit. Klug!'] } },
    'trasloco-mobili': { t: 'Neues Sofa?', x: 'Das alte Sofa quietscht seit Monaten. Im Laden gibt es ein Angebot.', o: {
      compra: ['Superweiches Sofa', 'Kuschelige Filmnachmittage. Alle sind entspannter.'],
      aggiusta: ['Wir reparieren es selbst', 'Repariert! Heimwerker-Champions.', 'Jetzt quietscht es UND hängt nach links.'] } },
    nevicata: { t: 'Großer Schneefall!', x: 'Heute Nacht sind 40 cm Schnee gefallen. Die Schulen sind geschlossen!', o: {
      pupazzo: ['Schneemann im Garten', 'Der Schneemann trägt euren Schal und eine Karotte. Wunderschön!'],
      cioccolata: ['Heiße Schokolade und Film', 'Decke, Schokolade und Zeichentrick. Perfekter Tag.'] } },
    'festa-paese': { t: 'Dorffest', x: 'Auf dem Platz ist Dorffest: Karussells, Zuckerwatte und Musik.', o: {
      giostre: ['Karussell für alle!', 'Autoscooter und Lachen ohne Ende.'],
      pesca: ['Wohltätigkeitslos', 'Ihr habt einen Sonderpreis gezogen!', 'Ihr habt... einen Schlüsselanhänger in Salamiform gewonnen.'] } },
    'pacco-misterioso': { t: 'Geheimnisvolles Paket', x: 'Auf der Fußmatte liegt ein Paket ohne Absender mit roter Schleife.', o: {
      apri: ['Aufmachen!', 'Ein Geschenk vom Onkel aus Amerika! Ein neues Accessoire.', 'Es war für den Nachbarn. Wie peinlich.'],
      vicini: ['Die Nachbarn fragen', 'Es gehörte dem Nachbarn, der euch zum Dank einen Kuchen bringt!'] } },
    'litigio-fratelli': { t: 'Geschwisterstreit', x: 'Die Kinder streiten um die Fernbedienung. Kissen fliegen!', o: {
      turni: ['Abwechseln mit Timer', 'Gerechtigkeit ist hergestellt. Frieden (bis morgen).'],
      fuori: ['Alle raus zum Spielen', 'Im Park sind sie wieder beste Freunde geworden.'] } },
    vacanza: { t: 'Wochenende weg?', x: 'Wie wäre ein Camping-Wochenende am Tovel-See?', o: {
      campeggio: ['Zelt und Marshmallows', 'Sterne, Lagerfeuer und Gruselgeschichten. Unvergesslich!'],
      hotel: ['Hotel mit Pool', 'Totale Entspannung für die ganze Familie.'],
      casa: ['Wir bleiben zu Hause', 'Pizza und Brettspiele. So ist es auch schön.'] } },
    cucinare: { t: 'Kleine Köche', x: '{kid} will heute Abend ganz allein das Essen kochen.', o: {
      si: ['Volles Vertrauen!', 'Perfekte Nudeln! Ein Sternekoch in der Familie.', 'Zerkochte Nudeln und explodierte Küche. Aber mit ganz viel Herz.'],
      aiuto: ['Wir kochen zusammen', 'Lasagne mit sechs Händen. Köstlich!'] } },
    bugia: { t: 'Eine kleine Lüge', x: '{kid} sagt, die Hausaufgaben sind fertig... aber der Rucksack ist noch zu.', o: {
      parla: ['Ruhig darüber reden', 'Es hat gestanden und sich entschuldigt. Ein schöner Moment.'],
      finta: ['So tun, als wäre nichts', 'Am nächsten Tag ein Eintrag von der Schule. Hoppla.'] } },
  },
  lists: {
    game: ['Verstecken gespielt', 'mit Bauklötzen gespielt', 'Ball gespielt', 'Doktor gespielt', 'Fangen gespielt', 'mit Zaubersand gespielt', 'Seifenblasen gemacht'],
    subj: ['das Einmaleins', 'Erdkunde', 'Englisch', 'Naturkunde', 'die Geschichte der Dinosaurier', 'Lesen', 'Programmieren'],
    song: ['ein Schlaflied', 'das Krokodil-Lied', 'ein selbst erfundenes Lied', 'die Titelmelodie der Zeichentrickserie', 'ein Lied im Dialekt'],
  },
  kidNames: ['Keks', 'Wölkchen', 'Pfeffer', 'Heidelbeere', 'Zuckerl', 'Knödel', 'Leo', 'Luna', 'Gnocchi', 'Krümel', 'Tofu', 'Sternchen', 'Pistazie', 'Apfel', 'Flocke'],
}
