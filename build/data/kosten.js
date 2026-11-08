// AP-Kosten je Preisstufe für den nächsten Punkt (von v auf v+1).
// Quelle: Pro Clubs HQ Summen + Messungen Tilo 02.-04.11.2026 (nach Patch 22.10.).

const reihe = (von, bis, wert) => { const o = {}; for (let v = von; v <= bis; v++) o[v] = wert; return o; };

export const KURVEN = {
  Cheap: { ...reihe(40, 59, 1), ...reihe(60, 64, 1), ...reihe(65, 74, 2), ...reihe(75, 83, 3), ...reihe(84, 88, 6), 89: 8, 90: 8, 91: 9, 92: 9, 93: 10, 94: 15, 95: 20, 96: 25, 97: 30, 98: 35 },
  Low: { ...reihe(40, 62, 1), ...reihe(63, 68, 2), ...reihe(69, 73, 3), ...reihe(74, 78, 4), ...reihe(79, 81, 5), 82: 6, 83: 6, 84: 7, 85: 7, 86: 8, 87: 8, 88: 9, 89: 10, 90: 11, 91: 11, 92: 15, 93: 15, 94: 20, 95: 25, 96: 30, 97: 35, 98: 40 },
  Mid: { ...reihe(40, 57, 1), ...reihe(58, 62, 2), ...reihe(63, 67, 3), ...reihe(68, 71, 4), 72: 5, 73: 5, 74: 5, ...reihe(75, 78, 6), ...reihe(79, 84, 7), 85: 8, 86: 9, 87: 11, 88: 11, 89: 13, 90: 13, 91: 13, 92: 18, 93: 18, 94: 22, 95: 26, 96: 31, 97: 35, 98: 40 },
  High: { ...reihe(40, 59, 1), ...reihe(60, 62, 2), ...reihe(63, 68, 3), ...reihe(69, 72, 4), 73: 5, 74: 5, ...reihe(75, 84, 7), 85: 9, 86: 10, 87: 12, 88: 13, 89: 15, 90: 15, 91: 15, 92: 20, 93: 20, 94: 25, 95: 30, 96: 35, 97: 40, 98: 45 },
  Exp: { ...reihe(40, 59, 2), ...reihe(60, 62, 3), 63: 4, 64: 4, ...reihe(65, 69, 5), ...reihe(70, 72, 6), 73: 7, 74: 7, ...reihe(75, 78, 8), 79: 9, 80: 10, 81: 11, 82: 12, 83: 13, 84: 13, 85: 14, 86: 14, 87: 14, 88: 15, 89: 20, 90: 20, 91: 20, 92: 25, 93: 25, 94: 30, 95: 35, 96: 40, 97: 45, 98: 50 },
};

// Gemessene Preisstufe je Archetyp und Attribut (Fünf-Punkt-Messungen Tilo 04.11.).
export const STUFEN_GEMESSEN = {
  'Shot Stopper': { Beschleunigung: 'Mid', 'Kurzer Pass': 'High', 'TW-Stellungsspiel': 'Exp', Reflexe: 'Mid', Reaktion: 'Cheap' },
  'Sweeper Keeper': { 'Übersicht': 'Low', Ballkontrolle: 'Low', Reflexe: 'Exp', 'TW-Stellungsspiel': 'Mid', Hechten: 'Mid' },
  'Progressor': { 'Def.-Bewusstsein': 'Low', 'Fairer Zweikampf': 'Exp', Ruhe: 'Low' },
  'Boss': { 'Stärke': 'Low', 'Grätsche': 'Mid', 'Kopfballpräzision': 'Low' },
  'Marauder': { Beschleunigung: 'Exp', Abfangen: 'Exp', Flanken: 'Low' },
  'Disruptor': { Sprinttempo: 'Exp', 'Grätsche': 'Mid', 'Fairer Zweikampf': 'High' },
  'Recycler': { 'Fairer Zweikampf': 'Exp', Beschleunigung: 'Exp', Abfangen: 'Mid' },
  'Maestro': { 'Übersicht': 'High', Beweglichkeit: 'High', Reaktion: 'Cheap', Ballkontrolle: 'Low', 'Langer Pass': 'Low', Dribbling: 'Exp', 'Kurzer Pass': 'Exp' },
  'Creator': { Ruhe: 'Mid', Ballkontrolle: 'Mid', Reaktion: 'Low', 'Übersicht': 'Low' },
  'Spark': { Dribbling: 'Mid', Beweglichkeit: 'Mid', Sprinttempo: 'Mid' },
  'Magician': { Balance: 'Mid', Beschleunigung: 'Mid', Ruhe: 'Mid', Ballkontrolle: 'Low' },
  'Finisher': { Abschluss: 'Mid', Ruhe: 'Low', Reaktion: 'Cheap' },
  'Target': { Beschleunigung: 'Exp', Sprungkraft: 'Cheap', 'Stärke': 'Low', Abschluss: 'Exp', Balance: 'Low' },
};

// Standard-Stufe für nicht gemessene Attribute: Schlüsselattribute günstiger, Rest teurer.
export const STANDARD_STUFE = { schluessel: 'Mid', normal: 'High' };

export function stufeFuer(archetyp, attribut, schluesselListe) {
  const g = STUFEN_GEMESSEN[archetyp]?.[attribut];
  if (g) return { stufe: g, gemessen: true };
  const s = schluesselListe.includes(attribut) ? STANDARD_STUFE.schluessel : STANDARD_STUFE.normal;
  return { stufe: s, gemessen: false };
}

export function punktKosten(stufe, vonWert) {
  const k = KURVEN[stufe];
  if (!k) return 99;
  if (vonWert >= 99) return Infinity;
  return k[vonWert] ?? (vonWert < 40 ? 1 : 50);
}

export function kostenBis(stufe, von, bis) {
  let s = 0;
  for (let v = von; v < bis; v++) s += punktKosten(stufe, v);
  return s;
}
