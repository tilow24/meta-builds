// Meta-Builds je Archetyp. Quellen: Pro11 (Pro Clubs HQ), Dexerto, RealSport101. Stand 04.11.2026.
// prioritaet = Reihenfolge, in der AP ausgegeben werden: {a: Attribut, b: Zielwert}

const P = (a, b) => ({ a, b });

export const META = {
  'Shot Stopper': {
    lauftyp: 'Controlled', groesseStd: 196, gewichtStd: 92,
    gruppe: 'Tor', positionen: 'TW', icon: 'glove', farbe: '#39ff8b',
    kurz: 'Linientorhüter. Hält, was auf den Kasten kommt.',
    koerper: { groesse: '196–197 cm', gewicht: '92–96 kg' },
    signature: ['Weite Reichweite+ (ab L20)', 'Abpraller+ (L55)'],
    slots: ['Beinarbeit', '1-gegen-1', 'Flankenfänger', 'Weiter Abwurf'],
    stand: '01.11.2026', quelle: 'Pro11 / Pro Clubs HQ', sicherheit: 'mittel',
    spezialisierungen: {
      'Shot Stopper+': {
        meta: true, ap: 455, ziele: { Fangsicherheit: 92, Sprungkraft: 90, 'TW-Stellungsspiel': 90 },
        prioritaet: [P('Fangsicherheit', 92), P('Sprungkraft', 90), P('TW-Stellungsspiel', 90), P('Reflexe', 96), P('Hechten', 96), P('Reaktion', 85), P('Beschleunigung', 80), P('Reflexe', 99), P('Hechten', 99)],
      },
      'Octopus': {
        ap: 503, ziele: { Hechten: 92, 'Stärke': 90, 'TW-Stellungsspiel': 90 },
        prioritaet: [P('Hechten', 92), P('Stärke', 90), P('TW-Stellungsspiel', 90), P('Reflexe', 92), P('Fangsicherheit', 90), P('Reaktion', 85), P('Sprungkraft', 85), P('Hechten', 99)],
      },
      'Spider': {
        ap: 559, ziele: { Reflexe: 92, Beschleunigung: 90, Beweglichkeit: 90 },
        prioritaet: [P('Reflexe', 92), P('Beschleunigung', 90), P('Beweglichkeit', 90), P('Hechten', 92), P('Fangsicherheit', 88), P('TW-Stellungsspiel', 88), P('Reaktion', 85)],
      },
    },
  },

  'Sweeper Keeper': {
    lauftyp: 'Controlled', groesseStd: 198, gewichtStd: 86,
    gruppe: 'Tor', positionen: 'TW', icon: 'glove-run', farbe: '#39ff8b',
    kurz: 'Mitspielender Torwart. Startet den Angriff selbst.',
    koerper: { groesse: '197–200 cm', gewicht: '80–92 kg' },
    signature: ['Beinarbeit+ (ab L20)'],
    slots: ['Weite Reichweite', 'Abpraller', 'Weiter Abwurf'],
    stand: '20.10.2026 (vor Patch)', quelle: 'Pro11 / Pro Clubs HQ', sicherheit: 'niedrig',
    spezialisierungen: {
      'Sweeper Keeper+': {
        meta: true, ap: 380, ziele: { Hechten: 92, 'Übersicht': 90, Abschlag: 90 },
        prioritaet: [P('Hechten', 92), P('Übersicht', 90), P('Abschlag', 90), P('Reflexe', 92), P('TW-Stellungsspiel', 90), P('Fangsicherheit', 88), P('Langer Pass', 85), P('Ballkontrolle', 80), P('Reflexe', 96)],
      },
      'Launcher': {
        ap: 428, ziele: { Abschlag: 92, 'Langer Pass': 90, Reflexe: 90 },
        prioritaet: [P('Abschlag', 92), P('Langer Pass', 90), P('Reflexe', 90), P('Hechten', 90), P('Übersicht', 85), P('TW-Stellungsspiel', 88), P('Fangsicherheit', 85)],
      },
      'Extra': {
        ap: 559, ziele: { 'TW-Stellungsspiel': 92, 'Kurzer Pass': 90, Ruhe: 90 },
        prioritaet: [P('TW-Stellungsspiel', 92), P('Kurzer Pass', 90), P('Ruhe', 90), P('Hechten', 90), P('Reflexe', 90), P('Übersicht', 85)],
      },
    },
  },

  'Progressor': {
    lauftyp: 'Lengthy', groesseStd: 188, gewichtStd: 78,
    gruppe: 'Verteidigung', positionen: 'IV', icon: 'shield-pass', farbe: '#39d0ff',
    kurz: 'Ballspielender Innenverteidiger. Verteidigt und eröffnet.',
    koerper: { groesse: '186–190 cm', gewicht: '75–80 kg' },
    signature: ['Weiter Pass+ (ab L20)', 'Antizipation+ (L55)'],
    slots: ['Abfangen', 'Luftherrschaft', 'Grätsche', 'Abdrängen'],
    stand: '01.11.2026', quelle: 'Pro11 / Pro Clubs HQ', sicherheit: 'mittel',
    spezialisierungen: {
      'Progressor+': {
        meta: true, ap: 401, ziele: { 'Fairer Zweikampf': 92, 'Langer Pass': 90, 'Def.-Bewusstsein': 90 },
        prioritaet: [P('Fairer Zweikampf', 92), P('Langer Pass', 90), P('Def.-Bewusstsein', 90), P('Def.-Bewusstsein', 99), P('Fairer Zweikampf', 99), P('Abfangen', 90), P('Ruhe', 90), P('Stärke', 85), P('Kopfballpräzision', 85), P('Sprungkraft', 85), P('Beweglichkeit', 75), P('Aggressivität', 75)],
      },
      'Pioneer': {
        ap: 543, ziele: { Dribbling: 92, 'Kurzer Pass': 90, 'Langer Pass': 90 },
        prioritaet: [P('Dribbling', 92), P('Kurzer Pass', 90), P('Langer Pass', 90), P('Def.-Bewusstsein', 90), P('Fairer Zweikampf', 90), P('Ruhe', 88), P('Abfangen', 85), P('Stärke', 80)],
      },
      'Janitor': {
        ap: 575, ziele: { Beschleunigung: 92, Sprinttempo: 90, 'Grätsche': 90 },
        prioritaet: [P('Beschleunigung', 92), P('Sprinttempo', 90), P('Grätsche', 90), P('Def.-Bewusstsein', 90), P('Fairer Zweikampf', 90), P('Abfangen', 85), P('Stärke', 80)],
      },
    },
  },

  'Boss': {
    lauftyp: 'Lengthy', groesseStd: 196, gewichtStd: 86,
    gruppe: 'Verteidigung', positionen: 'IV', icon: 'shield-wall', farbe: '#39d0ff',
    kurz: 'Wuchtiger Innenverteidiger. Gewinnt jeden Zweikampf.',
    koerper: { groesse: '196 cm', gewicht: '80–92 kg (Lengthy)' },
    signature: ['Kante+ (ab L20)'],
    slots: ['Luftherrschaft', 'Antizipation', 'Abfangen', 'Block'],
    stand: '20.10.2026 (vor Patch)', quelle: 'Pro11 / Dexerto', sicherheit: 'niedrig',
    spezialisierungen: {
      'Boss+': {
        meta: true, ap: 316, ziele: { 'Grätsche': 92, 'Stärke': 90, 'Aggressivität': 90 },
        prioritaet: [P('Grätsche', 92), P('Stärke', 90), P('Aggressivität', 90), P('Def.-Bewusstsein', 96), P('Fairer Zweikampf', 96), P('Abfangen', 90), P('Kopfballpräzision', 92), P('Sprungkraft', 88), P('Beschleunigung', 80), P('Sprinttempo', 80)],
      },
      'Capitano': {
        ap: 519, ziele: { 'Def.-Bewusstsein': 92, Beweglichkeit: 90, Reaktion: 90 },
        prioritaet: [P('Def.-Bewusstsein', 92), P('Beweglichkeit', 90), P('Reaktion', 90), P('Fairer Zweikampf', 92), P('Abfangen', 90), P('Stärke', 85), P('Kopfballpräzision', 85), P('Sprungkraft', 85)],
      },
      'Enforcer': {
        ap: 548, ziele: { Ruhe: 92, 'Übersicht': 90, Ballkontrolle: 90 },
        prioritaet: [P('Ruhe', 92), P('Übersicht', 90), P('Ballkontrolle', 90), P('Def.-Bewusstsein', 90), P('Fairer Zweikampf', 90), P('Stärke', 85), P('Kurzer Pass', 85)],
      },
    },
  },

  'Marauder': {
    lauftyp: 'Explosive', groesseStd: 178, gewichtStd: 72,
    gruppe: 'Verteidigung', positionen: 'LV / RV / LAV / RAV', icon: 'bolt-shield', farbe: '#39d0ff',
    kurz: 'Offensiver Außenverteidiger. Rauf und runter, die ganze Partie.',
    koerper: { groesse: '175–180 cm', gewicht: '70–75 kg (Explosive)' },
    signature: ['Schnellstart+ (ab L20)', 'Scharfe Flanke+ (L55)'],
    slots: ['Abdrängen', 'Abfangen', 'Antizipation', 'Grätsche'],
    stand: '01.11.2026', quelle: 'Pro11 / Pro Clubs HQ', sicherheit: 'mittel',
    spezialisierungen: {
      'Marauder+': {
        meta: true, ap: 353, ziele: { Sprinttempo: 92, 'Grätsche': 90, 'Aggressivität': 90 },
        prioritaet: [P('Beschleunigung', 80), P('Sprinttempo', 92), P('Grätsche', 90), P('Aggressivität', 90), P('Ausdauer', 88), P('Flanken', 90), P('Beschleunigung', 90), P('Def.-Bewusstsein', 90), P('Abfangen', 90), P('Fairer Zweikampf', 90), P('Beweglichkeit', 75), P('Balance', 80)],
      },
      'Athlete': {
        ap: 462, ziele: { 'Stärke': 92, 'Def.-Bewusstsein': 90, 'Aggressivität': 90 },
        prioritaet: [P('Beschleunigung', 80), P('Stärke', 92), P('Def.-Bewusstsein', 90), P('Aggressivität', 90), P('Sprinttempo', 90), P('Grätsche', 88), P('Ausdauer', 88), P('Flanken', 85)],
      },
      'Speedster': {
        ap: 545, ziele: { Sprinttempo: 92, Beschleunigung: 90, Dribbling: 90 },
        prioritaet: [P('Sprinttempo', 92), P('Beschleunigung', 90), P('Dribbling', 90), P('Flanken', 90), P('Ausdauer', 88), P('Grätsche', 85), P('Def.-Bewusstsein', 85)],
      },
    },
  },

  'Disruptor': {
    lauftyp: 'Controlled', groesseStd: 182, gewichtStd: 75,
    gruppe: 'Mittelfeld', positionen: 'ZDM', icon: 'anchor', farbe: '#ff4fd8',
    kurz: 'Zerstörer vor der Abwehr. Räumt alles ab.',
    koerper: { groesse: '178–188 cm', gewicht: '70–80 kg' },
    signature: ['Abdrängen+ (ab L20)'],
    slots: ['Abfangen', 'Antizipation', 'Kante', 'Unerbittlich'],
    stand: '20.10.2026 (vor Patch)', quelle: 'Pro11 / AOEAH', sicherheit: 'niedrig',
    spezialisierungen: {
      'Destroyer': {
        meta: true, ap: 497, ziele: { 'Stärke': 92, Sprinttempo: 90, 'Grätsche': 90 },
        prioritaet: [P('Stärke', 92), P('Sprinttempo', 90), P('Grätsche', 90), P('Abfangen', 92), P('Def.-Bewusstsein', 90), P('Fairer Zweikampf', 90), P('Ausdauer', 90), P('Reaktion', 85), P('Aggressivität', 85), P('Kurzer Pass', 80)],
      },
      'Disruptor+': {
        ap: 454, ziele: { Abfangen: 92, Balance: 90, Reaktion: 90 },
        prioritaet: [P('Abfangen', 92), P('Balance', 90), P('Reaktion', 90), P('Def.-Bewusstsein', 90), P('Fairer Zweikampf', 90), P('Ausdauer', 88), P('Stärke', 85), P('Sprinttempo', 85), P('Kurzer Pass', 80)],
      },
      'Anchor': {
        ap: 618, ziele: { 'Kurzer Pass': 92, Ballkontrolle: 90, Dribbling: 90 },
        prioritaet: [P('Kurzer Pass', 92), P('Ballkontrolle', 90), P('Dribbling', 90), P('Abfangen', 90), P('Def.-Bewusstsein', 88), P('Fairer Zweikampf', 85)],
      },
    },
  },

  'Recycler': {
    lauftyp: 'Lengthy', groesseStd: 187, gewichtStd: 80,
    gruppe: 'Mittelfeld', positionen: 'ZDM / ZM', icon: 'recycle', farbe: '#ff4fd8',
    kurz: 'Ballgewinner mit sauberem Aufbau. Nimmt und verteilt.',
    koerper: { groesse: '185–190 cm', gewicht: '77–82 kg' },
    signature: ['Abfangen+ (ab L20)', 'Durchsetzungskraft+ (L55)'],
    slots: ['Antizipation', 'Harter Pass', 'Tiki-Taka', 'Weiter Pass'],
    stand: '01.11.2026', quelle: 'Pro11 / RealSport101', sicherheit: 'mittel-hoch',
    spezialisierungen: {
      'Thief': {
        meta: true, ap: 438, ziele: { 'Fairer Zweikampf': 92, Abfangen: 90, 'Def.-Bewusstsein': 90 },
        prioritaet: [P('Abfangen', 90), P('Def.-Bewusstsein', 90), P('Fairer Zweikampf', 92), P('Balance', 80), P('Langer Pass', 85), P('Kurzer Pass', 80), P('Reaktion', 80), P('Ballkontrolle', 80), P('Ruhe', 90), P('Stärke', 90), P('Übersicht', 85), P('Kurzer Pass', 90), P('Langer Pass', 90), P('Beschleunigung', 80)],
      },
      'Recycler+': {
        ap: 412, ziele: { 'Kurzer Pass': 92, 'Langer Pass': 90, 'Stärke': 90 },
        prioritaet: [P('Kurzer Pass', 92), P('Langer Pass', 90), P('Stärke', 90), P('Abfangen', 90), P('Def.-Bewusstsein', 90), P('Ruhe', 88), P('Reaktion', 85), P('Übersicht', 85), P('Fairer Zweikampf', 85)],
      },
      'Driver': {
        ap: 470, ziele: { Balance: 92, Sprinttempo: 90, 'Stärke': 90 },
        prioritaet: [P('Balance', 92), P('Sprinttempo', 90), P('Stärke', 90), P('Abfangen', 90), P('Kurzer Pass', 88), P('Def.-Bewusstsein', 88), P('Ausdauer', 85)],
      },
    },
  },

  'Maestro': {
    lauftyp: 'Explosive', groesseStd: 175, gewichtStd: 68,
    gruppe: 'Mittelfeld', positionen: 'ZM / ZOM', icon: 'baton', farbe: '#ff4fd8',
    kurz: 'Taktgeber im Zentrum. Diktiert das Tempo.',
    koerper: { groesse: '170–175 cm', gewicht: '65–72 kg' },
    signature: ['Harter Pass+ (ab L20)', 'Weiter Pass+ (L55)'],
    slots: ['Tiki-Taka', 'Entscheidender Pass', 'First Touch', 'Technik'],
    stand: '01.11.2026', quelle: 'Pro11 / Dexerto / RealSport101', sicherheit: 'mittel',
    spezialisierungen: {
      'Maestro+': {
        meta: true, ap: 544, ziele: { 'Übersicht': 92, Balance: 90, Dribbling: 90 },
        prioritaet: [P('Reaktion', 80), P('Ballkontrolle', 80), P('Langer Pass', 80), P('Effet', 80), P('Übersicht', 92), P('Balance', 90), P('Dribbling', 90), P('Ruhe', 88), P('Kurzer Pass', 90), P('Ballkontrolle', 90), P('Reaktion', 90), P('Langer Pass', 90), P('Beweglichkeit', 85)],
      },
      'Heartbeat': {
        ap: 397, ziele: { Beweglichkeit: 92, Ausdauer: 90, 'Aggressivität': 90 },
        prioritaet: [P('Reaktion', 80), P('Ballkontrolle', 80), P('Beweglichkeit', 92), P('Ausdauer', 90), P('Aggressivität', 90), P('Übersicht', 88), P('Kurzer Pass', 88), P('Abfangen', 85), P('Def.-Bewusstsein', 85), P('Langer Pass', 85)],
      },
      'Crasher': {
        ap: 485, ziele: { Ruhe: 92, Ballkontrolle: 90, Abschluss: 90 },
        prioritaet: [P('Reaktion', 80), P('Langer Pass', 80), P('Ruhe', 92), P('Ballkontrolle', 90), P('Abschluss', 90), P('Übersicht', 88), P('Stellungsspiel', 85), P('Effet', 85), P('Kurzer Pass', 85)],
      },
    },
  },

  'Creator': {
    lauftyp: 'Explosive', groesseStd: 171, gewichtStd: 65,
    gruppe: 'Mittelfeld', positionen: 'ZOM / ZM', icon: 'spark-pass', farbe: '#ff4fd8',
    kurz: 'Der letzte Pass. Öffnet jede Abwehr.',
    koerper: { groesse: '170–172 cm', gewicht: '65 kg (Explosive)' },
    signature: ['Entscheidender Pass+ (ab L20)', 'Einfallsreich+ (L55)'],
    slots: ['Tiki-Taka', 'First Touch', 'Harter Pass', 'Angeschnittener Schuss'],
    stand: '01.11.2026', quelle: 'Pro11 / Dexerto', sicherheit: 'mittel-hoch',
    spezialisierungen: {
      'Creator+': {
        meta: true, ap: 372, ziele: { 'Übersicht': 92, Flanken: 90, 'Langer Pass': 90 },
        prioritaet: [P('Reaktion', 80), P('Ballkontrolle', 80), P('Langer Pass', 90), P('Übersicht', 92), P('Flanken', 90), P('Ruhe', 80), P('Beschleunigung', 80), P('Kurzer Pass', 80), P('Ballkontrolle', 90), P('Reaktion', 90), P('Ballkontrolle', 92), P('Reaktion', 92), P('Effet', 92), P('Ruhe', 90), P('Dribbling', 90), P('Abschluss', 75)],
      },
      'Architect': {
        ap: 394, ziele: { Flanken: 92, Schusskraft: 90, 'Freistoßpräzision': 90 },
        prioritaet: [P('Reaktion', 80), P('Ballkontrolle', 80), P('Flanken', 92), P('Schusskraft', 90), P('Freistoßpräzision', 90), P('Übersicht', 90), P('Langer Pass', 88), P('Effet', 88), P('Ruhe', 85)],
      },
      'Sniper': {
        ap: 509, ziele: { Schusskraft: 92, Abschluss: 90, 'Weitschüsse': 90 },
        prioritaet: [P('Reaktion', 80), P('Ballkontrolle', 80), P('Schusskraft', 92), P('Abschluss', 90), P('Weitschüsse', 90), P('Übersicht', 88), P('Effet', 88), P('Ruhe', 85)],
      },
    },
  },

  'Spark': {
    lauftyp: 'Explosive', groesseStd: 173, gewichtStd: 62,
    gruppe: 'Sturm', positionen: 'LA / RA / LM / RM', icon: 'bolt', farbe: '#ffd93d',
    kurz: 'Flügelflitzer. Geht außen vorbei, immer.',
    koerper: { groesse: '170–175 cm', gewicht: '60–65 kg (Explosive)' },
    signature: ['Tricks+ (ab L20)', 'Blitzschnell+ (L55)'],
    slots: ['Schnellstart', 'Technik', 'Angeschnittener Schuss', 'Scharfe Flanke'],
    stand: '01.11.2026', quelle: 'Pro11 / Dexerto', sicherheit: 'hoch',
    spezialisierungen: {
      'Spark+': {
        meta: true, ap: 465, ziele: { Beweglichkeit: 92, Beschleunigung: 90, Sprinttempo: 90 },
        prioritaet: [P('Beschleunigung', 80), P('Beweglichkeit', 92), P('Beschleunigung', 90), P('Sprinttempo', 90), P('Dribbling', 90), P('Ballkontrolle', 90), P('Balance', 90), P('Abschluss', 90), P('Flanken', 85), P('Effet', 85), P('Ausdauer', 80), P('Übersicht', 80), P('Langer Pass', 75)],
      },
      'Joker': {
        ap: 326, ziele: { Flanken: 92, 'Langer Pass': 90, Effet: 90 },
        prioritaet: [P('Beschleunigung', 80), P('Flanken', 92), P('Langer Pass', 90), P('Effet', 90), P('Sprinttempo', 90), P('Dribbling', 88), P('Beweglichkeit', 88), P('Ballkontrolle', 85)],
      },
      'Ace': {
        ap: 495, ziele: { Abschluss: 92, Reaktion: 90, Ballkontrolle: 90 },
        prioritaet: [P('Beschleunigung', 80), P('Abschluss', 92), P('Reaktion', 90), P('Ballkontrolle', 90), P('Beweglichkeit', 90), P('Sprinttempo', 88), P('Dribbling', 88), P('Stellungsspiel', 85)],
      },
    },
  },

  'Magician': {
    lauftyp: 'Explosive', groesseStd: 173, gewichtStd: 64,
    gruppe: 'Sturm', positionen: 'LA / RA / ZOM', icon: 'hat', farbe: '#ffd93d',
    kurz: 'Dribbelkünstler. Tanzt durch die Abwehr.',
    koerper: { groesse: '170–175 cm', gewicht: '60–68 kg (Explosive)' },
    signature: ['Technik+ (ab L20)', 'Angeschnittener Schuss+ (L55)'],
    slots: ['First Touch', 'Blitzschnell', 'Schnellstart', 'Tricks'],
    stand: '01.11.2026', quelle: 'Pro11 / RealSport101', sicherheit: 'hoch',
    spezialisierungen: {
      'Magician+': {
        meta: true, ap: 386, ziele: { Ballkontrolle: 92, Beschleunigung: 90, Ruhe: 90 },
        prioritaet: [P('Ballkontrolle', 92), P('Beschleunigung', 90), P('Ruhe', 90), P('Balance', 90), P('Beweglichkeit', 92), P('Dribbling', 90), P('Abschluss', 90), P('Sprinttempo', 85), P('Effet', 85), P('Ausdauer', 80)],
      },
      'Invader': {
        ap: 348, ziele: { 'Langer Pass': 92, 'Übersicht': 90, Dribbling: 90 },
        prioritaet: [P('Langer Pass', 92), P('Übersicht', 90), P('Dribbling', 90), P('Ballkontrolle', 90), P('Beschleunigung', 88), P('Abschluss', 88), P('Beweglichkeit', 85)],
      },
      'Hotshot': {
        ap: 525, ziele: { Schusskraft: 92, Abschluss: 90, 'Weitschüsse': 90 },
        prioritaet: [P('Schusskraft', 92), P('Abschluss', 90), P('Weitschüsse', 90), P('Ballkontrolle', 90), P('Beschleunigung', 88), P('Effet', 88), P('Ruhe', 85)],
      },
    },
  },

  'Finisher': {
    lauftyp: 'Explosive', groesseStd: 177, gewichtStd: 71,
    gruppe: 'Sturm', positionen: 'ST', icon: 'target-goal', farbe: '#ffd93d',
    kurz: 'Strafraumjäger. Eine Chance reicht ihm.',
    koerper: { groesse: '173–180 cm', gewicht: '70–73 kg (Explosive)' },
    signature: ['Flacher Schuss+ (ab L20)', 'First Touch+ (L55)'],
    slots: ['Schnellstart', 'Blitzschnell', 'Lupfer', 'Angeschnittener Schuss'],
    stand: '01.11.2026', quelle: 'Pro11 / RealSport101 / Skycoach', sicherheit: 'hoch',
    spezialisierungen: {
      'Finisher+': {
        meta: true, ap: 308, ziele: { Ruhe: 92, Reaktion: 90, Ballkontrolle: 90 },
        prioritaet: [P('Beschleunigung', 80), P('Beweglichkeit', 75), P('Ruhe', 92), P('Reaktion', 90), P('Ballkontrolle', 90), P('Abschluss', 90), P('Stellungsspiel', 90), P('Sprinttempo', 80), P('Ausdauer', 80), P('Dribbling', 80), P('Abschluss', 99), P('Stellungsspiel', 92), P('Schusskraft', 85), P('Übersicht', 80), P('Effet', 80), P('Beschleunigung', 85), P('Sprinttempo', 85)],
      },
      'Hunter': {
        ap: 388, ziele: { Effet: 92, Abschluss: 90, Balance: 90 },
        prioritaet: [P('Beschleunigung', 80), P('Effet', 92), P('Abschluss', 90), P('Balance', 90), P('Ruhe', 90), P('Ballkontrolle', 88), P('Stellungsspiel', 88), P('Sprinttempo', 85)],
      },
      'Presser': {
        ap: 457, ziele: { Ausdauer: 92, Beweglichkeit: 90, 'Aggressivität': 90 },
        prioritaet: [P('Beschleunigung', 80), P('Ausdauer', 92), P('Beweglichkeit', 90), P('Aggressivität', 90), P('Abschluss', 90), P('Ruhe', 88), P('Stellungsspiel', 88), P('Sprinttempo', 85)],
      },
    },
  },

  'Target': {
    lauftyp: 'Lengthy', groesseStd: 192, gewichtStd: 82,
    gruppe: 'Sturm', positionen: 'ST', icon: 'tower', farbe: '#ffd93d',
    kurz: 'Wandspieler. Oben drüber und drauf.',
    koerper: { groesse: '190–195 cm', gewicht: '80–85 kg (Lengthy)' },
    signature: ['Präziser Kopfball+ (ab L20)', 'Durchsetzungskraft+ (L55)'],
    slots: ['Powerschuss', 'First Touch', 'Ruhepol', 'Schnellstart'],
    stand: '01.11.2026', quelle: 'Pro11 / Dexerto / AOEAH', sicherheit: 'hoch',
    spezialisierungen: {
      'Target+': {
        meta: true, ap: 392, ziele: { Sprungkraft: 92, Beweglichkeit: 90, Volleys: 90 },
        prioritaet: [P('Beschleunigung', 80), P('Sprungkraft', 92), P('Beweglichkeit', 90), P('Volleys', 90), P('Stärke', 94), P('Kopfballpräzision', 92), P('Abschluss', 90), P('Schusskraft', 85), P('Ballkontrolle', 85), P('Ruhe', 80), P('Weitschüsse', 80), P('Sprinttempo', 80), P('Ausdauer', 80)],
      },
      'Runner': {
        ap: 485, ziele: { Sprinttempo: 92, 'Stärke': 90, 'Aggressivität': 90 },
        prioritaet: [P('Beschleunigung', 80), P('Sprinttempo', 92), P('Stärke', 90), P('Aggressivität', 90), P('Abschluss', 90), P('Kopfballpräzision', 90), P('Sprungkraft', 88), P('Ballkontrolle', 85)],
      },
      'Roamer': {
        ap: 573, ziele: { 'Kurzer Pass': 92, 'Übersicht': 90, 'Langer Pass': 90 },
        prioritaet: [P('Kurzer Pass', 92), P('Übersicht', 90), P('Langer Pass', 90), P('Stärke', 90), P('Abschluss', 88), P('Kopfballpräzision', 88), P('Ballkontrolle', 85)],
      },
    },
  },
};

export const MEISTERUNGEN = {
  'Shot Stopper': ['TW-Stellungsspiel', 'Reflexe'], 'Sweeper Keeper': ['Fangsicherheit', 'Hechten'],
  'Progressor': ['Langer Pass', 'Fairer Zweikampf'], 'Boss': ['Aggressivität', 'Stärke'],
  'Marauder': ['Grätsche', 'Sprinttempo'], 'Disruptor': ['Ausdauer', 'Abfangen'],
  'Recycler': ['Def.-Bewusstsein', 'Kurzer Pass'], 'Maestro': ['Reaktion', 'Ballkontrolle'],
  'Creator': ['Freistoßpräzision', 'Übersicht'], 'Spark': ['Flanken', 'Dribbling'],
  'Magician': ['Effet', 'Beschleunigung'], 'Finisher': ['Ruhe', 'Abschluss'], 'Target': ['Balance', 'Sprungkraft'],
};

export const PLAYSTYLES = [
  { n: 'Abdrängen', v: { Beweglichkeit: 75, 'Def.-Bewusstsein': 80, 'Fairer Zweikampf': 80 } },
  { n: 'Abfangen', v: { 'Aggressivität': 80, Abfangen: 80 } },
  { n: 'Grätsche', v: { 'Aggressivität': 80, 'Grätsche': 75 } },
  { n: 'Luftherrschaft', v: { Sprungkraft: 75, 'Kopfballpräzision': 75 } },
  { n: 'Antizipation', v: { Balance: 80, 'Def.-Bewusstsein': 75, 'Fairer Zweikampf': 80 } },
  { n: 'Schnellstart', v: { Beschleunigung: 75, Sprinttempo: 80, Ausdauer: 80 } },
  { n: 'Blitzschnell', v: { Beschleunigung: 75, Sprinttempo: 80, Dribbling: 80 } },
  { n: 'Technik', v: { Balance: 80, Ballkontrolle: 75, Dribbling: 80 } },
  { n: 'Tiki-Taka', v: { Reaktion: 80, Ballkontrolle: 80, 'Kurzer Pass': 75 } },
  { n: 'Entscheidender Pass', v: { 'Übersicht': 75, 'Langer Pass': 80, Effet: 80 } },
  { n: 'First Touch', v: { Ruhe: 80, Ballkontrolle: 75 } },
  { n: 'Harter Pass', v: { 'Langer Pass': 85, 'Kurzer Pass': 80 } },
  { n: 'Weiter Pass', v: { 'Übersicht': 85, 'Langer Pass': 80 } },
  { n: 'Scharfe Flanke', v: { Flanken: 80, 'Langer Pass': 75 } },
  { n: 'Angeschnittener Schuss', v: { 'Übersicht': 80, Abschluss: 75, Effet: 80 } },
  { n: 'Powerschuss', v: { Abschluss: 80, Schusskraft: 75, 'Weitschüsse': 80 } },
  { n: 'Lupfer', v: { Reaktion: 75, Ruhe: 80, Ballkontrolle: 80 } },
  { n: 'Durchsetzungskraft', v: { 'Stärke': 75, Ruhe: 80, Ballkontrolle: 80 } },
  { n: 'Unerbittlich', v: { Beweglichkeit: 80, Ausdauer: 80 } },
  { n: 'Kante', v: { 'Stärke': 75, 'Aggressivität': 80, 'Def.-Bewusstsein': 80 } },
];

export const FORMATIONEN = {
  menschen: [
    {
      id: '2-3', titel: '2–3 Player', unter: 'Kleiner Kader, viel KI',
      formation: '4-2-2-2', tiefe: 'Tiefe 5 · Breite 5',
      besetzen: ['Innenverteidiger', 'Zentrales Mittelfeld', 'Stürmer'],
      ki: 'KI übernimmt Außen und Tor. Defensive Mentalität, damit die KI nicht aufrückt.',
      warum: 'Die zwei Spitzen und die kompakte Mitte halten das Feld eng. Zu zweit oder zu dritt verliert man sonst die Außenbahnen.',
    },
    {
      id: '4-7', titel: '4–7 Player', unter: 'Halbvoller Club',
      formation: '4-2-1-3', tiefe: 'Tiefe 6 · Breite 6',
      besetzen: ['Innenverteidiger', 'Zentrales defensives Mittelfeld', 'Stürmer', 'Flügel'],
      ki: 'KI auf Außenverteidiger und Tor. Ausgeglichene Mentalität.',
      warum: 'Meta-Formation zum Start. Die Doppel-Sechs deckt die Mitte ab, die drei vorne laufen die Tiefe an.',
    },
    {
      id: '8+', titel: '8+ Player', unter: 'Fast volle Mannschaft',
      formation: '4-3-3 Attack', tiefe: 'Tiefe 7 · Breite 7',
      besetzen: ['Alle Feldpositionen', 'Tor zuletzt'],
      ki: 'Kaum KI. Falls doch: Außenverteidiger.',
      warum: 'Mit voller Besetzung lohnt sich die breitere Aufstellung. Mehr Passwege, mehr Raum für Läufe.',
    },
  ],
  regeln: [
    'Besetze zuerst die Innenverteidiger, dann das defensive Mittelfeld, dann den Sturm.',
    'Den Torwart zuletzt mit einem Player besetzen. Clubs mit Player im Tor gewinnen seltener.',
    'Die KI spielt Außenverteidiger zuverlässiger als die Mitte.',
  ],
  alternativen: ['4-4-1-1 Midfield', '4-1-2-1-2 Narrow'],
};

export const EINRICHTUNGEN = {
  grundlagen: [
    'Es gibt zwei Arten: Profi-Einrichtungen für echte Clubmitglieder und KI-Einrichtungen für die Bots.',
    'Bezahlt wird aus einem eigenen Club-Budget, nicht mit Grounds Coins.',
    'Das Budget wird nie dauerhaft verbraucht. Du kannst jederzeit umbauen, wie bei einem Loadout.',
    'Das Budget wächst mit Fans und Club-Ruf.',
  ],
  empfehlung: [
    { titel: 'Profi-Einrichtungen', text: 'Richte sie nach den Positionen aus, die eure Player wirklich spielen. Spielt ihr meistens mit zwei Innenverteidigern, zieht Verteidigungs-Einrichtungen vor.' },
    { titel: 'KI-Einrichtungen', text: 'Zuerst das Mittelfeld, zuletzt der Torwart. Die KI im Mittelfeld profitiert am stärksten.' },
    { titel: 'Budget aufteilen', text: 'Teile nach eurer typischen Lobbygröße. Spielt ihr meist zu viert, geht der größere Teil in KI-Einrichtungen.' },
  ],
  beispiele: [
    { n: 'Laufbahn', e: '+2 Sprinttempo, +3 Ausdauer' },
    { n: 'Leistungsanalyse', e: '+5 Übersicht, +5 Kurzer Pass (ungeprüft)' },
  ],
  hinweis: 'Für FC 27 gibt es noch wenig belastbare Daten. Die Beispiele stammen aus der Beta und aus Creator-Videos.',
};

export const KOERPER_EFFEKT = {
  feld: ['Beschleunigung', 'Beweglichkeit', 'Balance', 'Sprungkraft', 'Sprinttempo', 'Stärke'],
  tor: ['Hechten', 'Fangsicherheit', 'Reflexe', 'Beschleunigung', 'Sprinttempo', 'Stärke'],
  text: 'Größe und Gewicht verändern beim Spielstart sechs Attribute. Klein und leicht gibt Tempo und Beweglichkeit, groß und schwer gibt Sprungkraft und Stärke. Beim Torwart sind die Ausschläge deutlich größer (bis ±5).',
};

/* Spezialbewegungen und Schwacher Fuß (Messung Tilo, 08.11.2026):
   Start bei allen Archetypen 2 / 3 Sterne, Preise überall gleich, max. 5 Sterne.
   kosten[n] = AP für den Schritt von n auf n+1 Sterne. */
export const STERNE = {
  'Spezialbewegungen': { start: 2, max: 5, kosten: { 2: 10, 3: 20, 4: 35 } },
  'Schwacher Fuß': { start: 3, max: 5, kosten: { 3: 35, 4: 50 } },
};

/* Zielsterne je Archetyp aus Meta-Quellen (Stand 08.11.2026).
   Bei einer Spanne in der Quelle gilt der untere Wert. Fehlt eine Angabe, plant die App keinen Stern ein. */
export const STERN_ZIEL = {
  'Finisher': { 'Schwacher Fuß': 5, 'Spezialbewegungen': 4, quelle: 'AOEAH, RealSport101, Khel Now' },
  'Target': { 'Schwacher Fuß': 4, 'Spezialbewegungen': 3, quelle: 'AOEAH (SB 3–4)' },
  'Spark': { 'Schwacher Fuß': 4, 'Spezialbewegungen': 5, quelle: 'AOEAH' },
  'Magician': { 'Schwacher Fuß': 4, 'Spezialbewegungen': 5, quelle: 'RealSport101 (AOEAH: SF 5)' },
  'Maestro': { 'Schwacher Fuß': 4, 'Spezialbewegungen': 4, quelle: 'AOEAH' },
  'Creator': { 'Schwacher Fuß': 4, 'Spezialbewegungen': 4, quelle: 'AOEAH' },
  'Disruptor': { 'Schwacher Fuß': 3, 'Spezialbewegungen': 4, quelle: 'AOEAH (SF 3–4)' },
  'Boss': { 'Schwacher Fuß': 3, 'Spezialbewegungen': 4, quelle: 'AOEAH' },
  'Marauder': { 'Schwacher Fuß': 3, 'Spezialbewegungen': 4, quelle: 'AOEAH' },
};
