// Erzeugt meta.json: alle Daten der App in einer Datei, mit Version und Stand.
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
import { BASIS, KATEGORIEN, SCHLUESSEL, AP_PRO_LEVEL, EREIGNISSE, MAX_AUSNAHMEN } from './data/base.js';
import { KURVEN, STUFEN_GEMESSEN, STANDARD_STUFE } from './data/kosten.js';
import { META, MEISTERUNGEN, PLAYSTYLES, FORMATIONEN, EINRICHTUNGEN, KOERPER_EFFEKT, STERNE, STERN_ZIEL } from './data/meta.js';
import { AP_KUMULIERT } from './data/engine.js';
import { schrittfolge, PHASEN, LAUFTYP } from './data/plan.js';

const archetypen = {};
for (const [name, d] of Object.entries(META)) {
  const spez = {};
  for (const [sn, sp] of Object.entries(d.spezialisierungen)) {
    // Die App rechnet die Schrittfolge live, weil Größe und Gewicht sie verändern.
    // Hier nur eine Referenzrechnung für den empfohlenen Lauftyp.
    const s = schrittfolge(name, sn, d.lauftyp);
    const gesamt = s.reduce((x, y) => x + y.kosten, 0);
    spez[sn] = { ...sp, gesamtAp: gesamt };
  }
  const basis = { ...BASIS[name] };
  delete basis._sterne;
  for (const [n, x] of Object.entries(STERNE)) basis[n] = x.start;
  const sterne = [STERNE['Spezialbewegungen'].start, STERNE['Schwacher Fuß'].start];
  const { spezialisierungen, ...rd } = d;
  archetypen[name] = {
    ...rd, spezialisierungen: spez, basis, sterne,
    schluessel: SCHLUESSEL[name], meisterung: MEISTERUNGEN[name],
    max: { ...(MAX_AUSNAHMEN[name] || {}), 'Spezialbewegungen': 5, 'Schwacher Fuß': 5 },
    sternZiel: STERN_ZIEL[name] || null,
    torwart: d.gruppe === 'Tor',
  };
}

const meta = {
  version: 3, stand: '2026-11-08',
  hinweis: 'Daten für Meta Builds Pro Clubs. Keine offiziellen EA-Daten.',
  kategorien: { ...KATEGORIEN, Weitere: Object.keys(STERNE) }, sterne: STERNE, apProLevel: AP_PRO_LEVEL, apKumuliert: AP_KUMULIERT, ereignisse: EREIGNISSE,
  kurven: KURVEN, stufenGemessen: STUFEN_GEMESSEN, standardStufe: STANDARD_STUFE,
  playstyles: PLAYSTYLES, archetypen, formationen: FORMATIONEN, einrichtungen: EINRICHTUNGEN,
  koerper: KOERPER_EFFEKT, phasen: PHASEN, lauftyp: LAUFTYP,
  karten: [[1, 'Bronze 1'], [10, 'Bronze 2'], [20, 'Silber 1'], [30, 'Silber 2'], [40, 'Gold 1'], [50, 'Gold 2']],
};

writeFileSync(join(WURZEL, 'meta.json'), JSON.stringify(meta));
writeFileSync(join(WURZEL, 'meta-fallback.js'), 'window.MBPC_DATEN=' + JSON.stringify(meta) + ';');
console.log('meta.json und meta-fallback.js geschrieben,', (JSON.stringify(meta).length / 1024).toFixed(0), 'KB');
