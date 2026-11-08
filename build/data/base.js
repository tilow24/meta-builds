// Basiswerte (Grundzustand nach Reset) aller 13 Archetypen, Quelle: Spiel-Aufnahmen Tilo 04.11.2026
// Attributnamen deutsch wie im Spiel.

export const KATEGORIEN = {
  Torwart: ['Hechten', 'Fangsicherheit', 'Abschlag', 'Reflexe', 'TW-Stellungsspiel'],
  Tempo: ['Beschleunigung', 'Sprinttempo'],
  Dribbling: ['Beweglichkeit', 'Balance', 'Reaktion', 'Ballkontrolle', 'Dribbling', 'Ruhe'],
  Schuss: ['Stellungsspiel', 'Abschluss', 'Schusskraft', 'Weitschüsse', 'Volleys', 'Elfmeter'],
  Passen: ['Übersicht', 'Flanken', 'Freistoßpräzision', 'Kurzer Pass', 'Langer Pass', 'Effet'],
  Verteidigung: ['Abfangen', 'Kopfballpräzision', 'Def.-Bewusstsein', 'Fairer Zweikampf', 'Grätsche'],
  Physis: ['Sprungkraft', 'Ausdauer', 'Stärke', 'Aggressivität'],
};

export const EN_DE = {
  'Agility': 'Beweglichkeit', 'Balance': 'Balance', 'Reactions': 'Reaktion', 'Ball Control': 'Ballkontrolle',
  'Dribbling': 'Dribbling', 'Composure': 'Ruhe', 'Att. Positioning': 'Stellungsspiel', 'Finishing': 'Abschluss',
  'Shot Power': 'Schusskraft', 'Long Shots': 'Weitschüsse', 'Volleys': 'Volleys', 'Penalties': 'Elfmeter',
  'Vision': 'Übersicht', 'Crossing': 'Flanken', 'FK Accuracy': 'Freistoßpräzision', 'Short Pass': 'Kurzer Pass',
  'Long Pass': 'Langer Pass', 'Curve': 'Effet', 'Interceptions': 'Abfangen', 'Heading Accuracy': 'Kopfballpräzision',
  'Def. Awareness': 'Def.-Bewusstsein', 'Standing Tackle': 'Fairer Zweikampf', 'Slide Tackle': 'Grätsche',
  'Acceleration': 'Beschleunigung', 'Sprint Speed': 'Sprinttempo', 'Jumping': 'Sprungkraft', 'Stamina': 'Ausdauer',
  'Strength': 'Stärke', 'Aggression': 'Aggressivität', 'GK Diving': 'Hechten', 'GK Handling': 'Fangsicherheit',
  'GK Kicking': 'Abschlag', 'GK Reflexes': 'Reflexe', 'GK Positioning': 'TW-Stellungsspiel',
};

const f = (dribbling, schuss, passen, vert, tempo, physis, sterne) => ({
  Beweglichkeit: dribbling[0], Balance: dribbling[1], Reaktion: dribbling[2], Ballkontrolle: dribbling[3], Dribbling: dribbling[4], Ruhe: dribbling[5],
  Stellungsspiel: schuss[0], Abschluss: schuss[1], Schusskraft: schuss[2], 'Weitschüsse': schuss[3], Volleys: schuss[4], Elfmeter: schuss[5],
  'Übersicht': passen[0], Flanken: passen[1], 'Freistoßpräzision': passen[2], 'Kurzer Pass': passen[3], 'Langer Pass': passen[4], Effet: passen[5],
  Abfangen: vert[0], 'Kopfballpräzision': vert[1], 'Def.-Bewusstsein': vert[2], 'Fairer Zweikampf': vert[3], 'Grätsche': vert[4],
  Beschleunigung: tempo[0], Sprinttempo: tempo[1],
  Sprungkraft: physis[0], Ausdauer: physis[1], 'Stärke': physis[2], 'Aggressivität': physis[3],
  _sterne: sterne,
});
const gk = (tw, rest) => ({ Hechten: tw[0], Fangsicherheit: tw[1], Abschlag: tw[2], Reflexe: tw[3], 'TW-Stellungsspiel': tw[4], ...rest });

export const BASIS = {
  'Shot Stopper': gk([75, 75, 65, 75, 75],
    f([50, 65, 75, 65, 45, 55], [50, 40, 50, 40, 40, 40], [65, 40, 40, 65, 65, 40], [65, 40, 40, 40, 50], [75, 55], [65, 65, 65, 65], [1, 1])),
  'Sweeper Keeper': gk([75, 65, 75, 75, 75],
    f([65, 70, 75, 65, 65, 75], [50, 40, 50, 45, 40, 55], [75, 40, 40, 50, 75, 40], [75, 65, 40, 50, 65], [75, 65], [75, 75, 70, 75], [1, 1])),
  'Progressor': f([70, 70, 65, 70, 65, 75], [70, 50, 65, 50, 50, 65], [75, 50, 45, 75, 75, 50], [75, 75, 75, 75, 75], [70, 72], [75, 65, 70, 65], [2, 3]),
  'Boss': f([65, 75, 60, 65, 60, 65], [75, 45, 70, 60, 60, 65], [55, 45, 50, 65, 65, 50], [75, 75, 75, 75, 75], [70, 70], [75, 70, 75, 75], [2, 2]),
  'Marauder': f([70, 65, 70, 70, 70, 65], [65, 55, 65, 60, 65, 65], [60, 75, 60, 65, 65, 75], [70, 65, 70, 70, 75], [75, 75], [60, 75, 60, 72], [2, 3]),
  'Disruptor': f([68, 75, 70, 65, 65, 70], [70, 50, 70, 65, 65, 65], [65, 65, 50, 75, 70, 65], [75, 65, 70, 70, 75], [75, 70], [65, 75, 75, 70], [2, 3]),
  'Recycler': f([68, 75, 65, 65, 65, 72], [70, 55, 70, 65, 65, 65], [75, 65, 50, 70, 75, 65], [75, 60, 75, 75, 75], [70, 70], [65, 72, 72, 75], [2, 3]),
  'Maestro': f([75, 70, 65, 75, 65, 75], [80, 65, 70, 70, 65, 70], [75, 75, 75, 75, 75, 70], [75, 50, 65, 72, 50], [70, 65], [60, 65, 65, 65], [2, 3]),
  'Creator': f([72, 65, 75, 75, 75, 72], [80, 65, 72, 72, 72, 75], [75, 75, 75, 75, 75, 75], [55, 50, 50, 65, 50], [70, 65], [60, 65, 65, 55], [2, 3]),
  'Spark': f([75, 75, 75, 75, 75, 72], [80, 65, 65, 65, 72, 75], [75, 75, 65, 75, 65, 75], [55, 50, 50, 55, 45], [75, 75], [55, 65, 65, 50], [3, 3]),
  'Magician': f([72, 75, 75, 75, 75, 72], [80, 75, 70, 65, 72, 75], [75, 65, 65, 75, 50, 75], [50, 65, 45, 40, 40], [75, 70], [60, 65, 65, 55], [3, 3]),
  'Finisher': f([72, 75, 75, 75, 70, 75], [80, 75, 75, 60, 75, 75], [65, 55, 65, 70, 50, 70], [60, 75, 55, 50, 40], [75, 70], [65, 65, 70, 65], [3, 3]),
  'Target': f([70, 75, 75, 70, 70, 72], [80, 72, 75, 65, 72, 75], [65, 50, 65, 75, 50, 55], [50, 75, 50, 45, 40], [70, 65], [75, 60, 75, 65], [2, 2]),
};

// MAX-Werte (Cap) je Archetyp und Attribut, soweit gemessen. Default 99.
export const MAX_AUSNAHMEN = {
  'Disruptor': { 'Fairer Zweikampf': 92 },
  'Magician': { Ballkontrolle: 96 },
  'Target': { Balance: 92 },
  'Maestro': { Dribbling: 96 },
  'Shot Stopper': { Reaktion: 96 },
};

export const SCHLUESSEL = {
  'Shot Stopper': ['Reflexe', 'Reaktion', 'Kurzer Pass', 'Beschleunigung'],
  'Sweeper Keeper': ['Abschlag', 'Ballkontrolle', 'Übersicht', 'Langer Pass'],
  'Progressor': ['Ruhe', 'Langer Pass', 'Def.-Bewusstsein', 'Fairer Zweikampf'],
  'Boss': ['Kopfballpräzision', 'Sprungkraft', 'Stärke', 'Aggressivität'],
  'Marauder': ['Flanken', 'Grätsche', 'Sprinttempo', 'Ausdauer'],
  'Disruptor': ['Beschleunigung', 'Ausdauer', 'Aggressivität', 'Fairer Zweikampf'],
  'Recycler': ['Kurzer Pass', 'Abfangen', 'Def.-Bewusstsein', 'Stärke'],
  'Maestro': ['Beweglichkeit', 'Reaktion', 'Ballkontrolle', 'Langer Pass'],
  'Creator': ['Dribbling', 'Weitschüsse', 'Übersicht', 'Effet'],
  'Spark': ['Beweglichkeit', 'Dribbling', 'Übersicht', 'Sprinttempo'],
  'Magician': ['Ballkontrolle', 'Kurzer Pass', 'Effet', 'Beschleunigung'],
  'Finisher': ['Reaktion', 'Ruhe', 'Abschluss', 'Volleys'],
  'Target': ['Balance', 'Kopfballpräzision', 'Sprungkraft', 'Stärke'],
};

export const AP_PRO_LEVEL = { 1: 100, 2: 9, 3: 9, 4: 9, 5: 19, 6: 10, 7: 10, 8: 10, 9: 10, 10: 38, 11: 13, 12: 13, 13: 13, 14: 13, 15: 25, 16: 13, 17: 13, 18: 13, 19: 13, 20: 44, 21: 19, 22: 19, 23: 19, 24: 19, 25: 38, 26: 25, 27: 25, 28: 25, 29: 25, 30: 63, 31: 25, 32: 25, 33: 25, 34: 25, 35: 38, 36: 25, 37: 25, 38: 25, 39: 25, 40: 50, 41: 25, 42: 25, 43: 25, 44: 25, 45: 44, 46: 25, 47: 25, 48: 25, 49: 25, 50: 63, 51: 25, 52: 25, 53: 25, 54: 25, 55: 50 };

export const EREIGNISSE = {
  5: 'PlayStyle-Platz 1', 10: 'Signature Perk + Meisterung', 15: 'PlayStyle-Platz 2',
  20: 'Signature PlayStyle+ (Silber)', 30: 'Meisterung', 40: 'PlayStyle-Platz 3 (Gold)',
  45: 'Signature Perk', 55: 'PlayStyle-Platz 4 + PlayStyle+ + Meisterung',
};
