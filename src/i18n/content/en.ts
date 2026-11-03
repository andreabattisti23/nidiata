import type { Content } from './types'

export const contentEn: Content = {
  species: { fagiolo: 'Little Bean', gattino: 'Kitten', coniglio: 'Bunny', orsetto: 'Teddy', draghetto: 'Baby Dragon', pulcino: 'Chick', alieno: 'Alien', rana: 'Froggy' },
  patterns: { liscio: 'Plain', pancino: 'Tummy', macchie: 'Spots', lentiggini: 'Freckles' },
  stages: { neonato: 'Baby', bambino: 'Child', ragazzo: 'Teen', adulto: 'Grown-up' },
  stats: { fame: 'Tummy', energia: 'Energy', igiene: 'Cleanliness', felicita: 'Happiness', salute: 'Health' },
  traits: {
    goloso: ['Foodie', 'Gets hungry more often, but food makes them happier.'],
    dormiglione: ['Sleepyhead', 'Gets tired sooner and loves bedtime.'],
    vivace: ['Lively', 'Gets bored quickly, but playing counts double.'],
    pulitino: ['Neat', 'Gets dirty less and loves bath time.'],
    secchione: ['Bookworm', 'Learns twice as much when studying.'],
    coccolone: ['Cuddly', 'Cuddles make them super happy.'],
    robusto: ['Sturdy', 'Rarely gets sick.'],
    artista: ['Artist', 'Loves it when you sing to them.'],
    avventuroso: ['Adventurous', 'More surprises happen to them.'],
    timido: ['Shy', 'Gets nervous, but cuddles help a lot.'],
  },
  foods: {
    latte: 'Bottle of milk', pappa: 'Baby food', mela: 'Apple', minestrone: 'Vegetable soup', pasta: 'Pasta with tomato sauce',
    pizza: 'Pizza', sushi: 'Sushi', gelato: 'Ice cream', torta: 'Slice of cake', canederli: 'Bread dumplings',
  },
  items: {
    'maglia-base': 'Little T-shirt', 'maglia-righe': 'Striped shirt', 'felpa-cuore': 'Heart hoodie', salopette: 'Overalls',
    'vestito-fiori': 'Flowery dress', 'pigiama-stelle': 'Starry pajamas', 'maglia-sport': 'Team jersey', 'grembiule-chef': 'Chef apron',
    'tuta-astronauta': 'Astronaut suit', 'maglione-natale': 'Christmas sweater', berretto: 'Wool beanie', fiocco: 'Bow',
    baseball: 'Cap', cowboy: 'Cowboy hat', 'coroncina-fiori': 'Flower crown', cuffie: 'Headphones', mago: 'Wizard hat',
    corona: 'Royal crown', 'casco-bici': 'Bike helmet', 'occhiali-sole': 'Sunglasses', 'occhiali-tondi': 'Round glasses',
    sciarpa: 'Scarf', papillon: 'Bow tie', ciuccio: 'Pacifier', collana: 'Pearl necklace', mantello: 'Hero cape',
    'ali-fata': 'Fairy wings', zainetto: 'Little backpack',
  },
  jobs: {
    ufficio: ['Office', 'spent an hour sorting paperwork'],
    pizzeria: ['Pizzeria', 'baked pizza after pizza'],
    giardino: ['Gardening', "tended the neighbor's flower beds"],
    baby: ['Tutoring', 'gave math lessons'],
  },
  wheel: { c20: '20 🪙', c50: '50 🪙', c120: '120 🪙', item: 'Gift 🎁', happy: 'Party 🎉', harmony: 'Love 💞', xp: 'Growth 🌱', none: 'Retry 🙃' },
  achievements: {
    'primo-cucciolo': ["It's born!", 'Welcome your first little one.'],
    'in-due': ['Team of two', 'The second parent joins the family.'],
    'famiglia-numerosa': ['Big family', 'Raise three little ones together.'],
    'primo-imprevisto': ['First decision', 'Solve your first event.'],
    'dieci-imprevisti': ['Seasoned parents', 'Solve 10 events.'],
    accordo: ['On the same wavelength', 'Vote for the same choice 5 times.'],
    bambino: ['First steps', 'A little one becomes a child.'],
    ragazzo: ['Teenage years!', 'A little one becomes a teen.'],
    grande: ['Graduation!', 'A little one grows up.'],
    'cento-cure': ['A hundred hugs', 'Take care of the little ones 100 times.'],
    chef: ['Star chefs', 'Serve 30 meals.'],
    fashion: ['Fashion family', 'Own 8 items in the wardrobe.'],
    'look-completo': ['Full outfit', 'A little one with shirt, hat and accessory.'],
    paperone: ['Full piggy bank', 'Save up 500 coins.'],
    armonia: ['Endless love', 'Couple harmony at 100%.'],
    perfetto: ['Top little one', 'All stats of a little one above 80.'],
    campione: ['Cookie champion', 'Score at least 30 in the minigame.'],
    postino: ['Love mail', 'Leave 10 notes on the noticeboard.'],
    fortunelli: ['Lucky ones', 'Spin the wheel 7 times.'],
    genio: ['Little genius', 'A little one reaches 80 smarts.'],
  },
  events: {
    'pianto-notte': { t: 'Crying in the night', x: '{kid} woke up at 3 a.m. and is crying their eyes out. Who gets up?', o: {
      ninna: ['Sweetest lullaby', "{kid} falls back asleep holding a parent's finger."],
      latte: ['Emergency bottle', 'Full tummy, full sleep. Works every time!'],
      aspetta: ['Wait for them to calm down', 'Incredible: they calmed down on their own!', 'They cried for an hour. Nobody slept.'] } },
    'primo-dente': { t: 'The first tooth!', x: "{kid}'s first tooth is coming in! It hurts a bit and they bite everything.", o: {
      anello: ['Teething ring', 'Happily chewing the ring. What a relief!'],
      foto: ['Photo for the album', "Beautiful photo. Too bad they're a bit grumpy."] } },
    'prima-parola': { t: 'The first word', x: '{kid} is about to say their first word... What do you try to make them say?', o: {
      mamma: ['"Mommy!"', '{kid} says... "YUMMY"! Well, almost.'],
      papa: ['"Daddy!"', '{kid} says... "WOOF"! They saw a dog.'],
      libero: ['Let them choose', '{kid} says your family name! Goosebumps.'] } },
    pozzanghera: { t: 'Giant puddle', x: "At the park {kid} spotted the world's biggest puddle. Their eyes are sparkling.", o: {
      salta: ['Go ahead and jump!', 'SPLASH! Endless joy, zero cleanliness.'],
      stivali: ['Only with rain boots', 'Perfect compromise: jumping and dry feet.'],
      no: ["No, let's go home", 'Sulking the whole way back.'] } },
    'muro-disegnato': { t: 'Masterpiece on the wall', x: '{kid} drew a huge dinosaur on the living room wall. With permanent markers.', o: {
      cornice: ['Put a frame around it', "Now it's the family artwork. {kid} is super proud."],
      pulisci: ['Clean it up together', 'An afternoon of scrubbing. Lesson learned (maybe).'],
      pittore: ['Call the painter', 'Wall like new, wallet a bit less so.'] } },
    'cane-randagio': { t: 'A puppy!', x: '{kid} comes home with a puppy found on the street and gives you puppy eyes.', o: {
      tieni: ["We're keeping it!", 'Welcome Cookie! {kid} has never been this happy.'],
      canile: ['Take it to the shelter', "At the shelter they'll find it a family. {kid} is sad but understands."],
      vicina: ['Give it to the neighbor', 'Mrs. Pina adores it. And {kid} can visit!'] } },
    'brutto-voto': { t: 'A bad grade', x: '{kid} came home from school with an F in math and a long face.', o: {
      aiuto: ['Study together', 'Two hours of exercises and fractions finally make sense!'],
      gelato: ['Comfort ice cream', 'Spirits are back up. The grade, not so much.'],
      punizione: ['No tablet for 3 days', 'They read two books out of boredom. Unexpected!', 'Slammed door and radio silence.'] } },
    'gita-scolastica': { t: 'School trip', x: "{kid}'s school is organizing a trip to the Science Museum in Trento. It costs 25 coins.", o: {
      si: ['Of course they go!', '{kid} came back talking only about dinosaurs and planets.'],
      no: ['Not this time', 'A day at home. The others talk about the trip for weeks...'] } },
    'talent-show': { t: 'School talent show', x: "{kid} wants to take part in the school talent show. With which act?", o: {
      canto: ['Song', 'Standing ovation! {kid} wins first prize.', 'A bit off-key... but everyone clapped anyway.'],
      magia: ['Magic act', 'The rabbit came out of the hat! The crowd goes wild.', 'The trick went wrong, but it made everyone laugh.'],
      pubblico: ['Better in the audience', 'Popcorn and cheering for friends. A quiet evening.'] } },
    febbre: { t: 'Little fever', x: '{kid} is warm and a bit droopy. Maybe they caught a chill.', o: {
      dottore: ['To the pediatrician', 'Quick checkup and strawberry syrup. Already better!'],
      brodo: ['Broth and a blanket', "Grandma's broth works miracles.", "Getting a bit worse... they'll need medicine."] } },
    'compleanno-amico': { t: 'Birthday party', x: "{kid} is invited to their best friend's party. What gift do we bring?", o: {
      costoso: ['Big present', 'The friend is over the moon. So is {kid}.'],
      'fatto-mano': ['A handmade drawing', "The drawing ended up on the friend's bedroom wall. So sweet!"] } },
    'mostro-armadio': { t: 'The monster in the closet', x: "{kid} swears there's a monster in the closet. They won't sleep.", o: {
      spray: ['Anti-monster spray', 'Two sprays of scented water and the monster ran away!'],
      lettone: ['Into our big bed', "They sleep like a log. You, not so much, between kicks and knees."],
      spiega: ["Explain that monsters don't exist", 'Flashlight inspection: no monsters. Courage gained!'] } },
    sport: { t: 'Which sport?', x: '{kid} wants to start a sport. Which one do you choose?', o: {
      calcio: ['Soccer', 'Scraped knees and a goal in the first game!'],
      sci: ['Skiing in Val di Fiemme', 'First run down the blue slope without falling!'],
      scacchi: ['Chess', "Beat grandpa in 14 moves. Grandpa doesn't talk about it."] } },
    cotta: { t: 'A crush!', x: '{kid} writes little notes and sighs at their phone. They have a crush!', o: {
      consigli: ['Give them advice', 'The advice worked: an ice cream date!', '"You\'re so embarrassing!" Door closed.'],
      privacy: ['Respect their privacy', '{kid} really appreciates the trust.'] } },
    telefono: { t: 'The first phone', x: 'All their classmates have a phone. {kid} asks for one.', o: {
      si: ['New phone', 'Happiness through the roof (and endless notifications).'],
      usato: ['The old family phone', 'A bit slow, but it works! And they learned to fix it.'],
      aspetta: ["Let's wait another year", 'Disappointment... but they rediscovered comics.'] } },
    patente: { t: 'Driving lesson', x: '{kid} wants to practice with the family car. Who sits next to them?', o: {
      coraggio: ["Let's go!", 'Perfect parking on the first try. So proud!', 'Mirror against the dumpster. Oops.'],
      scuola: ['Driving school is better', "Patient instructor, parents' nerves saved."] } },
    lavoretto: { t: 'Summer job', x: 'The café in the square is looking for a helper for the summer. {kid} would be up for it.', o: {
      si: ['Useful experience!', '{kid} brings home their first paycheck and treats everyone to pizza!'],
      vacanza: ['Vacation first', 'A summer of total relaxation.'] } },
    bolletta: { t: 'Surprise bill', x: 'An electricity bill arrived, higher than expected. How do you handle it?', o: {
      paga: ['Just pay it', 'Paid. But from now on, lights off!'],
      risparmio: ['Savings week', 'Candlelight dinners: romantic and cheap.'] } },
    nonna: { t: "Grandma's visit", x: 'Grandma arrives with a tray of lasagna and a big wish to cuddle the grandkids.', o: {
      pranzo: ['Big lunch together', 'Full tummy, full heart. Grandma even left some pocket money!'],
      babysitter: ['A night out for you two', 'Grandma watches the little ones and you go out to dinner. How lovely!'] } },
    lotteria: { t: 'Lottery ticket', x: 'The café sells tickets for the village lottery. 10 coins each.', o: {
      compra: ["Let's try our luck", 'WON! 100 coins! Time to celebrate!', 'No luck. We will try again.'],
      no: ['No, thanks', 'Money safe. Wise choice!'] } },
    'trasloco-mobili': { t: 'New sofa?', x: "The old sofa has been creaking for months. There's a deal at the store.", o: {
      compra: ['Super soft sofa', 'Afternoons of movies and hugs. Everyone more relaxed.'],
      aggiusta: ["We'll fix it ourselves", 'Fixed! DIY champions.', 'Now it creaks AND leans to the left.'] } },
    nevicata: { t: 'Big snowfall!', x: '40 cm of snow fell last night. Schools are closed!', o: {
      pupazzo: ['Snowman in the garden', 'The snowman has your scarf and a carrot. Beautiful!'],
      cioccolata: ['Hot chocolate and a movie', 'Blankets, chocolate and cartoons. Perfect day.'] } },
    'festa-paese': { t: 'Village fair', x: "There's a fair in the square: rides, cotton candy and music.", o: {
      giostre: ['Rides for everyone!', 'Bumper cars and belly laughs.'],
      pesca: ['Charity raffle', 'You won a special prize!', 'You won... a salami-shaped keychain.'] } },
    'pacco-misterioso': { t: 'Mystery package', x: "There's a package with no sender and a red bow on the doormat.", o: {
      apri: ["Let's open it!", 'A gift from the uncle in America! A new accessory.', 'It was for the neighbor. How embarrassing.'],
      vicini: ['Ask the neighbors', "It was the neighbor's, and to thank you they bring you a cake!"] } },
    'litigio-fratelli': { t: 'Sibling fight', x: 'The kids are fighting over the remote. Pillows are flying!', o: {
      turni: ['Take turns with a timer', 'Justice is served. Peace restored (until tomorrow).'],
      fuori: ['Everyone outside to play', 'At the park they became best friends again.'] } },
    vacanza: { t: 'Weekend away?', x: 'How about a camping weekend at Lake Tovel?', o: {
      campeggio: ['Tent and marshmallows', 'Stars, campfire and scary stories. Unforgettable!'],
      hotel: ['Hotel with a pool', 'Total relaxation for the whole family.'],
      casa: ["Let's stay home", "Pizza and board games. That's lovely too."] } },
    cucinare: { t: 'Little chefs', x: '{kid} wants to cook dinner alone tonight.', o: {
      si: ['Total trust!', 'Perfect pasta! A star chef in the family.', 'Overcooked pasta and an exploded kitchen. But they put their heart into it.'],
      aiuto: ["Let's cook together", 'Lasagna made by six hands. Delicious!'] } },
    bugia: { t: 'A little lie', x: '{kid} says they did their homework... but the backpack is still closed.', o: {
      parla: ["Let's talk calmly", 'They confessed and apologized. A nice moment.'],
      finta: ['Pretend nothing happened', 'The next day, a note from school. Oops.'] } },
  },
  lists: {
    game: ['hide and seek', 'with building blocks', 'ball', 'doctor', 'tag', 'with kinetic sand', 'with soap bubbles'],
    subj: ['times tables', 'geography', 'English', 'science', 'dinosaur history', 'reading', 'coding'],
    song: ['a lullaby', 'the crocodile song', 'a made-up song', 'a cartoon theme song', 'a song in dialect'],
  },
  kidNames: ['Cookie', 'Cloud', 'Pepper', 'Blueberry', 'Sugar', 'Meatball', 'Leo', 'Luna', 'Gnocchi', 'Crumb', 'Tofu', 'Star', 'Pistachio', 'Apple', 'Biscuit'],
}
