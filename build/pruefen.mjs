// Prüft die App mit der aktuellen meta.json: alle Archetypen × Spezialisierungen × Level 1–55.
// Aufruf aus dem Repo-Wurzelordner: node build/pruefen.mjs
// Erwartet Playwright unter /opt/npm-tools (Cloud-Umgebung) und Python für einen lokalen Server.
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from '/opt/npm-tools/node_modules/playwright/index.js';
const { chromium } = pkg;

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8931;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: WURZEL, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 900));

let fehlerGesamt = 0;
try {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 412, height: 915 } });
  const seitenfehler = []; p.on('pageerror', e => seitenfehler.push(e.message));
  await p.goto(`http://localhost:${PORT}/index.html`);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const out = { version: D.version, stand: D.stand, kombis: 0, fehler: [], spezNie: [] };
    for (const [a, d] of Object.entries(D.archetypen)) for (const sn of Object.keys(d.spezialisierungen)) {
      const v = verlauf(a, sn);
      for (let l = 1; l <= 55; l++) {
        out.kombis++;
        for (const [x, z] of Object.entries(v[l].werte)) {
          if (!Number.isFinite(z)) out.fehler.push(`${a}/${sn}/L${l}: ${x} ungültig`);
          else if (z < v[l - 1].werte[x]) out.fehler.push(`${a}/${sn}/L${l}: ${x} sinkt`);
          else if (z > (istStern(x) ? 5 : 99)) out.fehler.push(`${a}/${sn}/L${l}: ${x} zu hoch`);
        }
        if (v[l].apRest < 0) out.fehler.push(`${a}/${sn}/L${l}: AP negativ`);
      }
      if (abLevel(v, w => erfuellt(w, d.spezialisierungen[sn].ziele)) === null) out.spezNie.push(`${a}/${sn}`);
    }
    return out;
  });
  // Oberfläche einmal je Archetyp zeichnen
  for (const a of await p.evaluate(() => Object.keys(D.archetypen))) {
    await p.evaluate(a => { E.archetyp = a; E.spez = null; E.level = 30; zeige('build', { sofort: true }); }, a);
  }
  await p.evaluate(() => { zeige('form', { sofort: true }); zeige('einr', { sofort: true }); });
  await b.close();

  console.log(`meta.json Version ${r.version}, Stand ${r.stand}`);
  console.log(`${r.kombis} Kombinationen geprüft`);
  console.log(`Rechenfehler: ${r.fehler.length}`, r.fehler.slice(0, 10));
  console.log(`Spezialisierung nie erreichbar: ${r.spezNie.length}`, r.spezNie);
  console.log(`Seitenfehler: ${seitenfehler.length}`, seitenfehler.slice(0, 5));
  fehlerGesamt = r.fehler.length + seitenfehler.length;
} finally {
  server.kill();
}
console.log(fehlerGesamt ? 'ERGEBNIS: FEHLER' : 'ERGEBNIS: OK');
process.exit(fehlerGesamt ? 1 : 0);
