import { BASIS, MAX_AUSNAHMEN, SCHLUESSEL, AP_PRO_LEVEL } from './base.js';
import { stufeFuer, punktKosten } from './kosten.js';
import { META, PLAYSTYLES } from './meta.js';

export const AP_KUMULIERT = (() => {
  const o = {}; let s = 0;
  for (let l = 1; l <= 55; l++) { s += AP_PRO_LEVEL[l]; o[l] = s; }
  return o;
})();

export function maxWert(archetyp, attribut) {
  return MAX_AUSNAHMEN[archetyp]?.[attribut] ?? 99;
}

export function basisWerte(archetyp) {
  const b = { ...BASIS[archetyp] };
  delete b._sterne;
  return b;
}

/**
 * Berechnet die Attributverteilung für ein Level.
 * Gibt Werte, Restpunkte, erledigte/offene Schritte und den Fahrplan zurück.
 */
export function berechne(archetyp, spezName, level) {
  const spez = META[archetyp].spezialisierungen[spezName];
  const schluessel = SCHLUESSEL[archetyp] || [];
  const werte = basisWerte(archetyp);
  const basis = basisWerte(archetyp);
  let rest = AP_KUMULIERT[level];
  const ausgegeben = {};
  const schritte = [];

  for (const { a, b } of spez.prioritaet) {
    const ziel = Math.min(b, maxWert(archetyp, a));
    if (werte[a] === undefined || werte[a] >= ziel) continue;
    const { stufe, gemessen } = stufeFuer(archetyp, a, schluessel);
    const von = werte[a];
    let kosten = 0, fertig = true;
    while (werte[a] < ziel) {
      const k = punktKosten(stufe, werte[a]);
      if (k > rest) { fertig = false; break; }
      rest -= k; kosten += k; werte[a]++;
      ausgegeben[a] = (ausgegeben[a] || 0) + k;
    }
    schritte.push({ attribut: a, von, ziel, erreicht: werte[a], kosten, fertig, stufe, gemessen });
    if (!fertig) break;
  }

  const offen = spez.prioritaet
    .map(({ a, b }) => ({ a, b: Math.min(b, maxWert(archetyp, a)) }))
    .filter(({ a, b }) => werte[a] !== undefined && werte[a] < b && !schritte.some(s => s.attribut === a && !s.fertig));

  return {
    archetyp, spezialisierung: spezName, level,
    apGesamt: AP_KUMULIERT[level], apGenutzt: AP_KUMULIERT[level] - rest, apRest: rest,
    werte, basis, ausgegeben, schritte, offen,
    spezErfuellt: Object.entries(spez.ziele).every(([a, v]) => (werte[a] ?? 0) >= v),
    playstyles: playstylesFuer(werte),
  };
}

/** Ab welchem Level ist jeder Schritt der Prioritätsliste abgeschlossen? */
export function fahrplan(archetyp, spezName) {
  const spez = META[archetyp].spezialisierungen[spezName];
  const schluessel = SCHLUESSEL[archetyp] || [];
  const werte = basisWerte(archetyp);
  let kosten = 0;
  const plan = [];
  for (const { a, b } of spez.prioritaet) {
    const ziel = Math.min(b, maxWert(archetyp, a));
    if (werte[a] === undefined || werte[a] >= ziel) continue;
    const { stufe } = stufeFuer(archetyp, a, schluessel);
    const von = werte[a];
    let k = 0;
    while (werte[a] < ziel) { k += punktKosten(stufe, werte[a]); werte[a]++; }
    kosten += k;
    plan.push({ attribut: a, von, ziel, kosten: k, kumuliert: kosten, level: levelFuerAp(kosten) });
  }
  return { plan, gesamtAp: kosten, fertigLevel: levelFuerAp(kosten) };
}

export function levelFuerAp(ap) {
  for (let l = 1; l <= 55; l++) if (AP_KUMULIERT[l] >= ap) return l;
  return null; // mehr als 1419 AP nötig
}

export function playstylesFuer(werte) {
  return PLAYSTYLES.map(p => {
    const teile = Object.entries(p.v).map(([a, v]) => ({ a, v, ok: (werte[a] ?? 0) >= v }));
    return { name: p.n, teile, ok: teile.every(t => t.ok) };
  });
}
