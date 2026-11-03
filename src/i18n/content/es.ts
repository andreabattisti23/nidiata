import type { Content } from './types'

export const contentEs: Content = {
  species: { fagiolo: 'Frijolito', gattino: 'Gatito', coniglio: 'Conejito', orsetto: 'Osito', draghetto: 'Dragoncito', pulcino: 'Pollito', alieno: 'Alienígena', rana: 'Ranita' },
  patterns: { liscio: 'Liso', pancino: 'Barriguita', macchie: 'Manchas', lentiggini: 'Pecas' },
  stages: { neonato: 'Bebé', bambino: 'Niño', ragazzo: 'Adolescente', adulto: 'Mayor' },
  stats: { fame: 'Barriga', energia: 'Energía', igiene: 'Limpieza', felicita: 'Felicidad', salute: 'Salud' },
  traits: {
    goloso: ['Glotón', 'Tiene hambre más a menudo, pero la comida lo hace más feliz.'],
    dormiglione: ['Dormilón', 'Se cansa antes y le encanta la cama.'],
    vivace: ['Movido', 'Se aburre enseguida, pero jugar vale el doble.'],
    pulitino: ['Limpito', 'Se ensucia menos y le encanta el baño.'],
    secchione: ['Empollón', 'Aprende el doble cuando estudia.'],
    coccolone: ['Mimoso', 'Los mimos lo hacen felicísimo.'],
    robusto: ['Fuerte', 'Casi nunca se pone enfermo.'],
    artista: ['Artista', 'Le encanta que le cantéis algo.'],
    avventuroso: ['Aventurero', 'Le pasan más imprevistos.'],
    timido: ['Tímido', 'Se pone nervioso, pero los mimos ayudan mucho.'],
  },
  foods: {
    latte: 'Biberón de leche', pappa: 'Papilla', mela: 'Manzana', minestrone: 'Sopa de verduras', pasta: 'Pasta con tomate',
    pizza: 'Pizza', sushi: 'Sushi', gelato: 'Helado', torta: 'Trozo de tarta', canederli: 'Albóndigas de pan',
  },
  items: {
    'maglia-base': 'Camisetita', 'maglia-righe': 'Camiseta de rayas', 'felpa-cuore': 'Sudadera de corazón', salopette: 'Peto vaquero',
    'vestito-fiori': 'Vestido de flores', 'pigiama-stelle': 'Pijama de estrellas', 'maglia-sport': 'Camiseta del equipo', 'grembiule-chef': 'Delantal de chef',
    'tuta-astronauta': 'Traje de astronauta', 'maglione-natale': 'Jersey navideño', berretto: 'Gorro de lana', fiocco: 'Lazo',
    baseball: 'Gorra', cowboy: 'Sombrero vaquero', 'coroncina-fiori': 'Corona de flores', cuffie: 'Auriculares', mago: 'Sombrero de mago',
    corona: 'Corona real', 'casco-bici': 'Casco de bici', 'occhiali-sole': 'Gafas de sol', 'occhiali-tondi': 'Gafitas redondas',
    sciarpa: 'Bufanda', papillon: 'Pajarita', ciuccio: 'Chupete', collana: 'Collar de perlas', mantello: 'Capa de héroe',
    'ali-fata': 'Alas de hada', zainetto: 'Mochilita',
  },
  jobs: {
    ufficio: ['Oficina', 'se ha pasado una hora ordenando papeles'],
    pizzeria: ['Pizzería', 'ha horneado pizzas sin parar'],
    giardino: ['Jardinería', 'ha cuidado los parterres del vecino'],
    baby: ['Clases particulares', 'ha dado clases de matemáticas'],
  },
  wheel: { c20: '20 🪙', c50: '50 🪙', c120: '120 🪙', item: 'Regalo 🎁', happy: 'Fiesta 🎉', harmony: 'Amor 💞', xp: 'Estirón 🌱', none: 'Otra vez 🙃' },
  achievements: {
    'primo-cucciolo': ['¡Ha nacido!', 'Dad la bienvenida al primer peque.'],
    'in-due': ['Equipo de dos', 'El segundo padre o madre se une a la familia.'],
    'famiglia-numerosa': ['Familia numerosa', 'Criad juntos a tres peques.'],
    'primo-imprevisto': ['Primera decisión', 'Resolved vuestro primer imprevisto.'],
    'dieci-imprevisti': ['Padres expertos', 'Resolved 10 imprevistos.'],
    accordo: ['En la misma onda', 'Votad la misma opción 5 veces.'],
    bambino: ['Primeros pasos', 'Un peque se convierte en niño.'],
    ragazzo: ['¡Adolescencia!', 'Un peque se convierte en adolescente.'],
    grande: ['¡Graduación!', 'Un peque se hace mayor.'],
    'cento-cure': ['Cien atenciones', 'Cuidad a los peques 100 veces.'],
    chef: ['Cocina de estrellas', 'Preparad 30 comidas.'],
    fashion: ['Familia fashion', 'Tened 8 prendas en el armario.'],
    'look-completo': ['Look completo', 'Un peque con camiseta, gorro y accesorio.'],
    paperone: ['Hucha llena', 'Juntad 500 monedas.'],
    armonia: ['Amor infinito', 'Armonía de pareja al 100%.'],
    perfetto: ['Peque de diez', 'Todas las estadísticas de un peque por encima de 80.'],
    campione: ['Campeones de galletas', 'Haced al menos 30 puntos en el minijuego.'],
    postino: ['Carteros de amor', 'Dejad 10 notitas en el tablón.'],
    fortunelli: ['Suertudos', 'Girad la ruleta 7 veces.'],
    genio: ['Pequeño genio', 'Un peque llega a 80 de inteligencia.'],
  },
  events: {
    'pianto-notte': { t: 'Llanto en la noche', x: '{kid} se ha despertado a las 3 de la madrugada y llora sin parar. ¿Quién se levanta?', o: {
      ninna: ['Nana dulcísima', '{kid} se vuelve a dormir agarrando el dedo de mamá o papá.'],
      latte: ['Biberón de emergencia', 'Barriga llena, sueño profundo. ¡Funciona siempre!'],
      aspetta: ['Esperamos a que se calme', '¡Increíble: se ha calmado solo!', 'Ha llorado una hora. Nadie ha dormido.'] } },
    'primo-dente': { t: '¡El primer diente!', x: '¡A {kid} le sale el primer diente! Le duele un poco y lo muerde todo.', o: {
      anello: ['Mordedor', 'Muerde feliz su mordedor. ¡Qué alivio!'],
      foto: ['Foto para el álbum', 'Foto preciosa. Lástima que esté un poco gruñón.'] } },
    'prima-parola': { t: 'La primera palabra', x: '{kid} está a punto de decir su primera palabra... ¿Qué intentáis que diga?', o: {
      mamma: ['"¡Mamá!"', '{kid} dice... "¡PAPA!" Bueno, casi.'],
      papa: ['"¡Papá!"', '{kid} dice... "¡GUAU!" Ha visto un perro.'],
      libero: ['Lo dejamos libre', '¡{kid} dice el nombre de vuestra familia! Escalofríos.'] } },
    pozzanghera: { t: 'Charco gigante', x: 'En el parque {kid} ha visto el charco más grande del mundo. Le brillan los ojos.', o: {
      salta: ['¡Salta!', '¡SPLASH! Felicidad infinita, limpieza cero.'],
      stivali: ['Solo con botas de agua', 'Compromiso perfecto: saltos y pies secos.'],
      no: ['No, nos vamos a casa', 'Morros durante todo el camino.'] } },
    'muro-disegnato': { t: 'Obra maestra en la pared', x: '{kid} ha dibujado un dinosaurio enorme en la pared del salón. Con rotuladores permanentes.', o: {
      cornice: ['Le ponemos un marco', 'Ahora es la obra de arte de la casa. {kid} está orgullosísimo.'],
      pulisci: ['Lo limpiamos juntos', 'Una tarde frotando. Ha aprendido la lección (quizá).'],
      pittore: ['Llamamos al pintor', 'Pared como nueva, cartera no tanto.'] } },
    'cane-randagio': { t: '¡Un perrito!', x: '{kid} vuelve a casa con un perrito encontrado en la calle y os mira con ojitos.', o: {
      tieni: ['¡Nos lo quedamos!', '¡Bienvenido Galleta! {kid} nunca ha estado tan feliz.'],
      canile: ['Lo llevamos al refugio', 'En el refugio le buscarán una familia. {kid} está triste, pero lo entiende.'],
      vicina: ['Se lo damos a la vecina', 'La señora Pina lo adora. ¡Y {kid} puede ir a visitarlo!'] } },
    'brutto-voto': { t: 'Una mala nota', x: '{kid} ha vuelto del colegio con un suspenso en matemáticas y cara larga.', o: {
      aiuto: ['Estudiamos juntos', '¡Dos horas de ejercicios y por fin las fracciones tienen sentido!'],
      gelato: ['Helado de consuelo', 'El ánimo ha vuelto. La nota, no tanto.'],
      punizione: ['Sin tablet 3 días', 'Ha leído dos libros de puro aburrimiento. ¡Inesperado!', 'Portazo y silencio total.'] } },
    'gita-scolastica': { t: 'Excursión escolar', x: 'El colegio de {kid} organiza una excursión al Museo de las Ciencias de Trento. Cuesta 25 monedas.', o: {
      si: ['¡Claro que va!', '{kid} ha vuelto hablando solo de dinosaurios y planetas.'],
      no: ['Esta vez no', 'Día en casa. Los demás hablan de la excursión durante semanas...'] } },
    'talent-show': { t: 'Concurso de talentos', x: '{kid} quiere participar en el concurso de talentos del colegio. ¿Con qué número?', o: {
      canto: ['Canción', '¡Ovación de pie! {kid} gana el primer premio.', 'Ha desafinado un poco... pero todos han aplaudido igual.'],
      magia: ['Número de magia', '¡El conejo ha salido del sombrero! El público enloquece.', 'El truco ha salido mal, pero ha hecho reír a todos.'],
      pubblico: ['Mejor en el público', 'Palomitas y ánimos para los amigos. Noche tranquila.'] } },
    febbre: { t: 'Fiebrecilla', x: '{kid} está calentito y un poco decaído. Quizá ha cogido frío.', o: {
      dottore: ['Al pediatra', 'Visita rápida y jarabe de fresa. ¡Ya está mejor!'],
      brodo: ['Caldito y mantita', 'El caldo de la abuela hace milagros.', 'Empeora un poco... hará falta la medicina.'] } },
    'compleanno-amico': { t: 'Fiesta de cumpleaños', x: '{kid} está invitado a la fiesta de su mejor amigo. ¿Qué regalo llevamos?', o: {
      costoso: ['Regalazo', 'El amigo está en el séptimo cielo. {kid} también.'],
      'fatto-mano': ['Un dibujo hecho a mano', 'El dibujo acabó colgado en la habitación del amigo. ¡Qué bonito!'] } },
    'mostro-armadio': { t: 'El monstruo del armario', x: '{kid} jura que hay un monstruo en el armario. No quiere dormir.', o: {
      spray: ['Spray antimonstruos', '¡Dos rociadas de agua perfumada y el monstruo ha huido!'],
      lettone: ['A nuestra cama', 'Duerme a pierna suelta. Vosotros no tanto, entre patadas y rodillazos.'],
      spiega: ['Le explicamos que no existen', 'Inspección con linterna: ni rastro de monstruos. ¡Valor ganado!'] } },
    sport: { t: '¿Qué deporte?', x: '{kid} quiere empezar un deporte. ¿Cuál elegís?', o: {
      calcio: ['Fútbol', '¡Rodillas peladas y un gol en el debut!'],
      sci: ['Esquí en el Val di Fiemme', '¡Primera bajada por la pista azul sin caerse!'],
      scacchi: ['Ajedrez', 'Ha ganado al abuelo en 14 jugadas. El abuelo no quiere hablar de ello.'] } },
    cotta: { t: '¡Un flechazo!', x: '{kid} escribe notitas y suspira mirando el móvil. ¡Se ha enamorado!', o: {
      consigli: ['Le damos consejos', 'El consejo ha funcionado: ¡cita para un helado!', '"¡Qué vergüenza dais!" Puerta cerrada.'],
      privacy: ['Respetamos su intimidad', '{kid} agradece muchísimo la confianza.'] } },
    telefono: { t: 'El primer móvil', x: 'Todos sus compañeros tienen móvil. {kid} pide el suyo.', o: {
      si: ['Móvil nuevo', 'Felicidad por las nubes (y notificaciones sin parar).'],
      usato: ['El viejo de casa', 'Un poco lento, ¡pero funciona! Y ha aprendido a arreglarlo.'],
      aspetta: ['Esperamos un año más', 'Decepción... pero ha redescubierto los cómics.'] } },
    patente: { t: 'Clase de conducir', x: '{kid} quiere practicar con el coche de la familia. ¿Quién se sienta al lado?', o: {
      coraggio: ['¡Vamos!', 'Aparcamiento perfecto a la primera. ¡Qué orgullo!', 'Retrovisor contra el contenedor. Ups.'],
      scuola: ['Mejor la autoescuela', 'Instructor paciente, nervios de los padres a salvo.'] } },
    lavoretto: { t: 'Trabajo de verano', x: 'El bar de la plaza busca ayudante para el verano. A {kid} le apetecería.', o: {
      si: ['¡Experiencia útil!', '¡{kid} trae a casa su primer sueldo e invita él a pizza!'],
      vacanza: ['Primero las vacaciones', 'Un verano de relax total.'] } },
    bolletta: { t: 'Factura sorpresa', x: 'Ha llegado una factura de la luz más alta de lo previsto. ¿Cómo lo hacéis?', o: {
      paga: ['La pagamos y ya', 'Pagada. ¡Pero desde hoy se apagan las luces!'],
      risparmio: ['Semana del ahorro', 'Cenas a la luz de las velas: románticas y baratas.'] } },
    nonna: { t: 'Visita de la abuela', x: 'Llega la abuela con una bandeja de lasaña y muchas ganas de mimar a los nietos.', o: {
      pranzo: ['Gran comida juntos', 'Barriga llena, corazón contento. ¡La abuela hasta ha dejado una propina!'],
      babysitter: ['Noche libre para vosotros', 'La abuela cuida a los peques y vosotros salís a cenar. ¡Qué bien!'] } },
    lotteria: { t: 'Boleto de lotería', x: 'En el bar venden boletos de la lotería del pueblo. 10 monedas cada uno.', o: {
      compra: ['Probamos suerte', '¡PREMIO! ¡100 monedas! ¡Hay que celebrarlo!', 'Nada que hacer. Lo volveremos a intentar.'],
      no: ['No, gracias', 'Dinero a salvo. ¡Sabios!'] } },
    'trasloco-mobili': { t: '¿Sofá nuevo?', x: 'El viejo sofá cruje desde hace meses. Hay una oferta en la tienda.', o: {
      compra: ['Sofá suavísimo', 'Tardes de pelis abrazados. Todos más relajados.'],
      aggiusta: ['Lo arreglamos nosotros', '¡Arreglado! Campeones del bricolaje.', 'Ahora cruje Y se inclina a la izquierda.'] } },
    nevicata: { t: '¡Gran nevada!', x: 'Esta noche han caído 40 cm de nieve. ¡No hay colegio!', o: {
      pupazzo: ['Muñeco de nieve en el jardín', 'El muñeco lleva vuestra bufanda y una zanahoria. ¡Precioso!'],
      cioccolata: ['Chocolate caliente y peli', 'Mantita, chocolate y dibujos. Día perfecto.'] } },
    'festa-paese': { t: 'Fiesta del pueblo', x: 'Hay fiesta en la plaza: atracciones, algodón de azúcar y música.', o: {
      giostre: ['¡Atracciones para todos!', 'Coches de choque y risas sin parar.'],
      pesca: ['Rifa benéfica', '¡Os ha tocado un premio especial!', 'Os ha tocado... un llavero con forma de salchichón.'] } },
    'pacco-misterioso': { t: 'Paquete misterioso', x: 'En el felpudo hay un paquete sin remitente con un lazo rojo.', o: {
      apri: ['¡Abrámoslo!', '¡Un regalo del tío de América! Un accesorio nuevo.', 'Era para el vecino. Qué vergüenza.'],
      vicini: ['Preguntamos a los vecinos', '¡Era del vecino, que para daros las gracias os trae una tarta!'] } },
    'litigio-fratelli': { t: 'Pelea entre hermanos', x: 'Los niños se pelean por el mando de la tele. ¡Vuelan cojines!', o: {
      turni: ['Turnos con temporizador', 'Se ha hecho justicia. Paz recuperada (hasta mañana).'],
      fuori: ['Todos fuera a jugar', 'En el parque han vuelto a ser mejores amigos.'] } },
    vacanza: { t: '¿Fin de semana fuera?', x: '¿Qué tal un fin de semana de acampada en el lago de Tovel?', o: {
      campeggio: ['Tienda y nubes de azúcar', 'Estrellas, hoguera e historias de miedo. ¡Inolvidable!'],
      hotel: ['Hotel con piscina', 'Relax total para toda la familia.'],
      casa: ['Nos quedamos en casa', 'Pizza y juegos de mesa. Así también es bonito.'] } },
    cucinare: { t: 'Pequeños chefs', x: '{kid} quiere cocinar la cena solo esta noche.', o: {
      si: ['¡Confianza total!', '¡Pasta perfecta! Un chef con estrella en la familia.', 'Pasta pasada y cocina explotada. Pero le ha puesto todo el corazón.'],
      aiuto: ['Cocinamos juntos', 'Lasaña a seis manos. ¡Riquísima!'] } },
    bugia: { t: 'Una pequeña mentira', x: '{kid} dice que ha hecho los deberes... pero la mochila sigue cerrada.', o: {
      parla: ['Hablémoslo con calma', 'Lo ha confesado y ha pedido perdón. Un momento bonito.'],
      finta: ['Hacemos como si nada', 'Al día siguiente, nota del colegio. Ups.'] } },
  },
  lists: {
    game: ['al escondite', 'con bloques de construcción', 'a la pelota', 'a los médicos', 'al pilla-pilla', 'con arena mágica', 'a hacer pompas'],
    subj: ['las tablas de multiplicar', 'geografía', 'inglés', 'ciencias', 'la historia de los dinosaurios', 'a leer', 'programación'],
    song: ['una nana', 'la canción del cocodrilo', 'una canción inventada', 'la sintonía de los dibujos', 'una canción popular'],
  },
  kidNames: ['Galleta', 'Nube', 'Pimienta', 'Arándano', 'Azuquita', 'Albóndiga', 'Leo', 'Luna', 'Ñoqui', 'Miguita', 'Tofu', 'Estrella', 'Pistacho', 'Manzana', 'Chispa'],
}
