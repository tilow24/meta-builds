// Phasenmodell für die AP-Verteilung.
// Begründung in claude/recherche-skillreihenfolge-2026-11-04.md:
// Pro Clubs HQ gibt selbst an: Tempo-Untergrenze -> PlayStyle-Schwellen -> Rest des Profils.
// Dazu die Kostenkurve: früh maxen zahlt Höchstpreise, während billige Punkte liegenbleiben.

import { BASIS, SCHLUESSEL, MAX_AUSNAHMEN } from './base.js';
import { stufeFuer, punktKosten } from './kosten.js';
import { META, PLAYSTYLES } from './meta.js';

export const LAUFTYP = {
  Explosive: { maxGroesse: 182, bedingungen: { Beweglichkeit: 65, Beschleunigung: 80 }, diff: ['Beweglichkeit', 'Stärke', 10] },
  Lengthy: { minGroesse: 183, bedingungen: { 'Stärke': 65, Beschleunigung: 40 }, diff: ['Stärke', 'Beweglichkeit', 4] },
};

export function lauftypVon(werte, groesse) {
  const b = werte.Beweglichkeit ?? 0, s = werte['Stärke'] ?? 0, a = werte.Beschleunigung ?? 0;
  if (groesse <= 182 && b >= 65 && b - s >= 10 && a >= 80) return 'Explosive';
  if (groesse >= 183 && s >= 65 && s - b >= 4 && a >= 40) return 'Lengthy';
  return 'Controlled';
}

const maxW = (a, attr) => MAX_AUSNAHMEN[a]?.[attr] ?? 99;

/** Kosten, um ein Attribut von seinem aktuellen Wert auf ein Ziel zu bringen. */
function kosten(archetyp, attr, von, bis) {
  const { stufe } = stufeFuer(archetyp, attr, SCHLUESSEL[archetyp] || []);
  let s = 0;
  for (let v = von; v < bis; v++) s += punktKosten(stufe, v);
  return s;
}

/**
 * Baut die Schrittfolge für einen Archetyp und eine Spezialisierung.
 * Jeder Schritt: {attr, ziel, phase, grund}
 */
export function schrittfolge(archetyp, spezName, zielLauftyp) {
  const d = META[archetyp];
  const spez = d.spezialisierungen[spezName];
  const werte = { ...BASIS[archetyp] }; delete werte._sterne;
  const schritte = [];
  const setze = (attr, ziel, phase, grund) => {
    if (werte[attr] === undefined) return;
    const z = Math.min(ziel, maxW(archetyp, attr));
    if (werte[attr] >= z) return;
    schritte.push({ attr, von: werte[attr], ziel: z, phase, grund, kosten: kosten(archetyp, attr, werte[attr], z) });
    werte[attr] = z;
  };

  /* ---- Phase 1: Lauftyp sichern ---- */
  if (zielLauftyp === 'Explosive') {
    setze('Beschleunigung', 80, 1, 'Explosive braucht Beschleunigung 80');
    setze('Beweglichkeit', 65, 1, 'Explosive braucht Beweglichkeit 65');
    const noetig = (werte['Stärke'] ?? 0) + 10;
    if ((werte.Beweglichkeit ?? 0) < noetig) setze('Beweglichkeit', noetig, 1, 'Beweglichkeit muss 10 über Stärke liegen');
  } else if (zielLauftyp === 'Lengthy') {
    setze('Stärke', 65, 1, 'Lengthy braucht Stärke 65');
    setze('Beschleunigung', 40, 1, 'Lengthy braucht Beschleunigung 40');
    const noetig = (werte.Beweglichkeit ?? 0) + 4;
    if ((werte['Stärke'] ?? 0) < noetig) setze('Stärke', noetig, 1, 'Stärke muss 4 über Beweglichkeit liegen');
  }

  /* ---- Phase 2: PlayStyle-Schwellen, billigste zuerst ---- */
  const empfohlen = new Set((d.slots || []).map(x => x.split(' (')[0]));
  const gates = PLAYSTYLES
    .filter(p => empfohlen.has(p.n))
    .map(p => {
      let ap = 0, machbar = true;
      for (const [attr, v] of Object.entries(p.v)) {
        if (werte[attr] === undefined) { machbar = false; break; }
        if (v > maxW(archetyp, attr)) { machbar = false; break; }
        ap += kosten(archetyp, attr, werte[attr], v);
      }
      return { p, ap, machbar };
    })
    .filter(g => g.machbar && g.ap > 0)
    .sort((a, b) => a.ap - b.ap);
  for (const g of gates) {
    for (const [attr, v] of Object.entries(g.p.v)) setze(attr, v, 2, 'Schaltet ' + g.p.n + ' frei');
  }

  /* ---- Ausbauziele aus der Prioritätsliste ableiten ---- */
  const ausbau = [];
  for (const { a: attr, b } of spez.prioritaet) {
    const vorhanden = ausbau.find(x => x.attr === attr);
    if (vorhanden) vorhanden.ziel = Math.max(vorhanden.ziel, b);
    else ausbau.push({ attr, ziel: b });
  }

  /* ---- Phase 3: Grundniveau (alles Wichtige auf 85) ---- */
  for (const { attr, ziel } of ausbau) setze(attr, Math.min(ziel, 85), 3, 'Grundniveau');

  /* ---- Phase 4: Spezialisierung freischalten ---- */
  for (const [attr, v] of Object.entries(spez.ziele)) setze(attr, v, 4, 'Spezialisierung ' + spezName);

  /* ---- Phase 5: Spitzen in zwei Wellen ---- */
  for (const { attr, ziel } of ausbau) setze(attr, Math.min(ziel, 90), 5, 'Ausbau');
  for (const { attr, ziel } of ausbau) setze(attr, ziel, 5, 'Feinschliff');

  // Direkt aufeinanderfolgende Schritte desselben Attributs zusammenfassen
  const zusammen = [];
  for (const s of schritte) {
    const v = zusammen[zusammen.length - 1];
    if (v && v.attr === s.attr && v.ziel === s.von) {
      v.ziel = s.ziel; v.kosten += s.kosten;
      if (s.phase > v.phase) { v.phase = s.phase; v.grund = s.grund; }
    } else zusammen.push({ ...s });
  }
  return zusammen;
}

export const PHASEN = {
  1: { name: 'Lauftyp sichern', kurz: 'Lauftyp', farbe: '#39d0ff' },
  2: { name: 'PlayStyles freischalten', kurz: 'PlayStyles', farbe: '#ffd93d' },
  3: { name: 'Grundniveau aufbauen', kurz: 'Grundniveau', farbe: '#3dffa0' },
  4: { name: 'Spezialisierung', kurz: 'Spezialisierung', farbe: '#ff4fd8' },
  5: { name: 'Spitzenwerte', kurz: 'Spitzen', farbe: '#a78bfa' },
};
