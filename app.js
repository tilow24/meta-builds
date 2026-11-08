/* Meta Builds Pro Clubs
   Daten liegen getrennt in meta.json. Die App lädt sie beim Start, legt sie lokal ab
   und arbeitet offline mit der letzten gespeicherten Fassung. */

const QUELLE = 'meta.json';
const SPEICHER = 'mbpc.daten.v2';
const EINST = 'mbpc.einst.v2';

let D = null;
let E = { level: 25, archetyp: null, spez: null, menschen: '4-7', koerper: {} };

const $ = (s, w = document) => w.querySelector(s);
const el = (t, k, h) => { const n = document.createElement(t); if (k) n.className = k; if (h != null) n.innerHTML = h; return n; };
const ic = (id, s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><use href="#${id}"/></svg>`;
const tick = () => { try { navigator.vibrate && navigator.vibrate(8); } catch {} };

/* ---------- Daten ---------- */
async function ladeDaten() {
  const lokal = (() => { try { return JSON.parse(localStorage.getItem(SPEICHER)); } catch { return null; } })();
  try {
    const r = await fetch(QUELLE, { cache: 'no-cache' });
    if (r.ok) {
      const neu = await r.json();
      if (!lokal || neu.version >= lokal.version) {
        try { localStorage.setItem(SPEICHER, JSON.stringify(neu)); } catch {}
        return neu;
      }
    }
  } catch {}
  return lokal || window.MBPC_DATEN || null;
}
function ladeEinst() { try { Object.assign(E, JSON.parse(localStorage.getItem(EINST)) || {}); } catch {} }
function merkeEinst() { try { localStorage.setItem(EINST, JSON.stringify(E)); } catch {} }

/* ---------- Kosten ---------- */
const maxWert = (a, attr) => D.archetypen[a].max[attr] ?? 99;
const basisWerte = a => ({ ...D.archetypen[a].basis });

function stufeFuer(a, attr) {
  const g = D.stufenGemessen[a]?.[attr];
  if (g) return { stufe: g, gemessen: true };
  const k = (D.archetypen[a].schluessel || []).includes(attr);
  return { stufe: k ? D.standardStufe.schluessel : D.standardStufe.normal, gemessen: false };
}
function punktKosten(stufe, v) {
  if (v >= 99) return Infinity;
  const k = D.kurven[stufe];
  return (k && k[v]) ?? (v < 40 ? 1 : 50);
}
function kostenVon(a, attr, von, bis) {
  const { stufe } = stufeFuer(a, attr);
  let s = 0;
  for (let v = von; v < bis; v++) s += punktKosten(stufe, v);
  return s;
}

/* ---------- Lauftyp ---------- */
function lauftypVon(werte, groesse) {
  const b = werte.Beweglichkeit ?? 0, s = werte['Stärke'] ?? 0, a = werte.Beschleunigung ?? 0;
  if (groesse <= 182 && b >= 65 && b - s >= 10 && a >= 80) return 'Explosive';
  if (groesse >= 183 && s >= 65 && s - b >= 4 && a >= 40) return 'Lengthy';
  return 'Controlled';
}
function koerperVon(a) {
  const d = D.archetypen[a];
  return E.koerper[a] || { groesse: d.groesseStd, gewicht: d.gewichtStd };
}

/* ---------- Schrittfolge (Phasenmodell) ---------- */
function schrittfolge(a, sn, zielLauftyp) {
  const d = D.archetypen[a], spez = d.spezialisierungen[sn];
  const werte = basisWerte(a);
  const schritte = [];
  const setze = (attr, ziel, phase, grund) => {
    if (werte[attr] === undefined) return;
    const z = Math.min(ziel, maxWert(a, attr));
    if (werte[attr] >= z) return;
    schritte.push({ attr, von: werte[attr], ziel: z, phase, grund, kosten: kostenVon(a, attr, werte[attr], z) });
    werte[attr] = z;
  };

  if (zielLauftyp === 'Explosive') {
    setze('Beschleunigung', 80, 1, 'Explosive braucht Beschleunigung 80');
    setze('Beweglichkeit', 65, 1, 'Explosive braucht Beweglichkeit 65');
    setze('Beweglichkeit', (werte['Stärke'] ?? 0) + 10, 1, 'Beweglichkeit muss 10 über Stärke liegen');
  } else if (zielLauftyp === 'Lengthy') {
    setze('Stärke', 65, 1, 'Lengthy braucht Stärke 65');
    setze('Beschleunigung', 40, 1, 'Lengthy braucht Beschleunigung 40');
    setze('Stärke', (werte.Beweglichkeit ?? 0) + 4, 1, 'Stärke muss 4 über Beweglichkeit liegen');
  }

  const empfohlen = new Set((d.slots || []).map(x => x.split(' (')[0]));
  D.playstyles.filter(p => empfohlen.has(p.n)).map(p => {
    let ap = 0, ok = true;
    for (const [attr, v] of Object.entries(p.v)) {
      if (werte[attr] === undefined || v > maxWert(a, attr)) { ok = false; break; }
      ap += kostenVon(a, attr, werte[attr], v);
    }
    return { p, ap, ok };
  }).filter(g => g.ok && g.ap > 0).sort((x, y) => x.ap - y.ap)
    .forEach(g => { for (const [attr, v] of Object.entries(g.p.v)) setze(attr, v, 2, 'Schaltet ' + g.p.n + ' frei'); });

  const ausbau = [];
  for (const { a: attr, b } of spez.prioritaet) {
    const v = ausbau.find(x => x.attr === attr);
    if (v) v.ziel = Math.max(v.ziel, b); else ausbau.push({ attr, ziel: b });
  }

  for (const { attr, ziel } of ausbau) setze(attr, Math.min(ziel, 85), 3, 'Grundniveau');
  for (const [attr, v] of Object.entries(spez.ziele)) setze(attr, v, 4, 'Spezialisierung ' + sn);
  for (const { attr, ziel } of ausbau) setze(attr, Math.min(ziel, 90), 5, 'Ausbau');
  for (const { attr, ziel } of ausbau) setze(attr, ziel, 5, 'Feinschliff');

  const z = [];
  for (const s of schritte) {
    const v = z[z.length - 1];
    if (v && v.attr === s.attr && v.ziel === s.von) {
      v.ziel = s.ziel; v.kosten += s.kosten;
      if (s.phase > v.phase) { v.phase = s.phase; v.grund = s.grund; }
    } else z.push({ ...s });
  }
  let k = 0;
  return z.map(s => { k += s.kosten; return { ...s, kumuliert: k, level: levelFuerAp(k) }; });
}

function levelFuerAp(ap) {
  for (let l = 1; l <= 55; l++) if (D.apKumuliert[l] >= ap) return l;
  return null;
}

/* ---------- Build berechnen ---------- */
function berechne(a, sn, level) {
  const k = koerperVon(a);
  const zielLauftyp = D.archetypen[a].lauftyp;
  const erreichbar = (zielLauftyp === 'Explosive' && k.groesse > 182) ? 'Controlled'
    : (zielLauftyp === 'Lengthy' && k.groesse < 183) ? 'Controlled' : zielLauftyp;
  const schritte = schrittfolge(a, sn, erreichbar);
  const werte = basisWerte(a), basis = basisWerte(a);
  let rest = level > 0 ? D.apKumuliert[level] : 0;

  for (const s of schritte) {
    if (s.kosten <= rest) { rest -= s.kosten; werte[s.attr] = s.ziel; continue; }
    // teilweise machbar
    const { stufe } = stufeFuer(a, s.attr);
    let w = s.von, k2 = 0;
    while (w < s.ziel && punktKosten(stufe, w) <= rest - k2) { k2 += punktKosten(stufe, w); w++; }
    rest -= k2; werte[s.attr] = w;
    break;
  }

  const ap = level > 0 ? D.apKumuliert[level] : 0;
  const lt = lauftypVon(werte, k.groesse);
  return {
    level, werte, basis, schritte, koerper: k, erreichbar,
    apGesamt: ap, apGenutzt: ap - rest, apRest: rest,
    lauftyp: lt, zielLauftyp, lauftypOk: lt === zielLauftyp,
    spezOk: Object.entries(D.archetypen[a].spezialisierungen[sn].ziele).every(([x, v]) => (werte[x] ?? 0) >= v),
  };
}

/* Werte für alle Level 0 bis 55 (zwischengespeichert) */
const VERLAUF = {};
function verlauf(a, sn) {
  const k = koerperVon(a);
  const key = a + '|' + sn + '|' + k.groesse;
  if (!VERLAUF[key]) {
    const v = [];
    for (let l = 0; l <= 55; l++) v.push(berechne(a, sn, l));
    VERLAUF[key] = v;
  }
  return VERLAUF[key];
}
const erfuellt = (werte, ziele) => Object.entries(ziele).every(([x, v]) => (werte[x] ?? 0) >= v);
function abLevel(v, test) {
  for (let l = 1; l <= 55; l++) if (test(v[l].werte, v[l])) return l;
  return null;
}

function karteFuer(level) {
  let n = 'Bronze 1';
  for (const [l, name] of D.karten) if (level >= l) n = name;
  return n;
}
const KARTENFARBEN = {
  'Bronze 1': ['#d9a06a', '#8a5a2b', '#241709'], 'Bronze 2': ['#e8b67e', '#9a6630', '#2a1b0b'],
  'Silber 1': ['#dfe8f5', '#8899ad', '#141922'], 'Silber 2': ['#f0f6ff', '#9aabc0', '#161c26'],
  'Gold 1': ['#ffd86b', '#b8860b', '#241d0c'], 'Gold 2': ['#ffe9a3', '#d4a017', '#2a2210'],
};

/* ---------- Navigation ---------- */
const SCREENS = { start: 's-start', wahl: 's-wahl', build: 's-build', form: 's-form', einr: 's-einr' };
let aktuell = 'start';

function zeige(name, opt = {}) {
  aktuell = name;
  for (const [k, id] of Object.entries(SCREENS)) $('#' + id).classList.toggle('an', k === name);
  const nz = { wahl: 'tree', build: 'tree', form: 'form', einr: 'einr' }[name];
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('an', b.dataset.ziel === nz));
  $('#btnZurueck').hidden = (name === 'start');
  window.scrollTo({ top: 0, behavior: opt.sofort ? 'auto' : 'smooth' });
  ({ start: zeichneStart, wahl: zeichneWahl, build: zeichneBuild, form: zeichneForm, einr: zeichneEinr })[name]();
}
const kopf = (t, u) => { $('#kTitel').textContent = t; $('#kUnter').textContent = u || ''; };
const zurueck = () => zeige(aktuell === 'build' ? 'wahl' : 'start');

/* ---------- Start ---------- */
function zeichneStart() {
  kopf('Meta Builds', 'Stand ' + datum(D.stand));
  const s = $('#s-start');
  s.innerHTML = `
    <div class="gross">Die App<br><em>für Clubs</em></div>
    <div class="kacheln">
      <button class="kachel" data-z="wahl"><span class="glanz"></span>
        <span class="ic" style="color:var(--gruen)">${ic('i-tree', 27)}</span>
        <span class="tx"><h3>Skilltree</h3><p>Mach deinen Spieler unschlagbar</p></span>
        <span class="pfeil">${ic('i-pfeil', 20)}</span></button>
      <button class="kachel" data-z="form"><span class="glanz"></span>
        <span class="ic" style="color:var(--pink)">${ic('i-form', 27)}</span>
        <span class="tx"><h3>Formation</h3><p>Passend zur Zahl eurer Spieler</p></span>
        <span class="pfeil">${ic('i-pfeil', 20)}</span></button>
      <button class="kachel" data-z="einr"><span class="glanz"></span>
        <span class="ic" style="color:var(--gelb)">${ic('i-haus', 27)}</span>
        <span class="tx"><h3>Einrichtungen</h3><p>Wohin das Club-Budget gehört</p></span>
        <span class="pfeil">${ic('i-pfeil', 20)}</span></button>
    </div>`;
  s.querySelectorAll('.kachel').forEach(b => b.onclick = () => { tick(); zeige(b.dataset.z); });
}

/* ---------- Archetyp-Wahl ---------- */
function zeichneWahl() {
  kopf('Skilltree', 'Wähle deinen Archetyp');
  const s = $('#s-wahl');
  s.innerHTML = '';
  for (const g of ['Tor', 'Verteidigung', 'Mittelfeld', 'Sturm']) {
    const liste = Object.entries(D.archetypen).filter(([, d]) => d.gruppe === g);
    if (!liste.length) continue;
    s.append(el('div', 'gruppe', `<h3>${g}</h3><i></i>`));
    const r = el('div', 'raster');
    for (const [name, d] of liste) {
      const meta = Object.entries(d.spezialisierungen).find(([, x]) => x.meta)?.[0] || '';
      const b = el('button', 'at', `<span class="aura"></span><span class="glanz"></span>
        <span class="ring">${ic('a-' + d.icon, 26)}</span>
        <h4>${name}</h4><div class="pos">${d.positionen}</div><span class="spz">${meta}</span>`);
      b.style.color = d.farbe; b.style.setProperty('--c', d.farbe);
      b.onclick = () => { tick(); E.archetyp = name; E.spez = meta; merkeEinst(); zeige('build'); };
      r.append(b);
    }
    s.append(r);
  }
  s.append(el('div', 'quelle', '13 Archetypen · Meta-Spezialisierung ist vorausgewählt'));
}

/* ---------- Build ---------- */
function zeichneBuild() {
  const a = E.archetyp, d = D.archetypen[a];
  if (!d) return zeige('wahl');
  if (!d.spezialisierungen[E.spez]) E.spez = Object.entries(d.spezialisierungen).find(([, x]) => x.meta)?.[0] || Object.keys(d.spezialisierungen)[0];
  const sn = E.spez;
  kopf(a, `${sn} · Level ${E.level}`);
  const s = $('#s-build');
  s.innerHTML = `<div id="pk"></div>
    <div class="karte" id="reglerK"></div>
    <div id="rest"></div>`;

  const k = koerperVon(a);
  $('#reglerK').innerHTML = `
    <div class="lvKopf">
      <span class="lv">DEIN LEVEL</span>
      <span class="stepper">
        <button id="lvMinus" aria-label="Ein Level zurück">−</button>
        <b id="lvZahl">${E.level}</b>
        <button id="lvPlus" aria-label="Ein Level weiter">+</button>
      </span>
    </div>
    <div class="schienenBox">
      <div class="schiene"><div class="fuell" id="fuell"></div><div id="meilen"></div></div>
      <input type="range" id="lv" min="1" max="55" value="${E.level}" aria-label="Level">
    </div>
    <div class="meilenTxt"><span>1</span><span>15</span><span>30</span><span>45</span><span>55</span></div>
    <div class="koerperRegler">
      <div class="krZeile"><span>Größe</span><b id="grW">${k.groesse} cm</b></div>
      <input type="range" class="einfach" id="grR" min="160" max="205" value="${k.groesse}" aria-label="Größe">
      <div class="krZeile" style="margin-top:8px"><span>Gewicht</span><b id="gwW">${k.gewicht} kg</b></div>
      <input type="range" class="einfach" id="gwR" min="55" max="105" value="${k.gewicht}" aria-label="Gewicht">
    </div>
    <div id="laufInfo"></div>`;

  const mb = $('#meilen');
  for (const l of [5, 15, 20, 30, 40, 55]) {
    const m = el('span', 'meilen'); m.style.left = ((l - 1) / 54 * 100) + '%'; m.dataset.l = l; mb.append(m);
  }

  const lv = $('#lv');
  const aktualisiere = (voll) => {
    const v = verlauf(a, sn);
    const r = v[E.level];
    lv.value = E.level;
    $('#lvZahl').textContent = E.level;
    $('#fuell').style.width = ((E.level - 1) / 54 * 100) + '%';
    document.querySelectorAll('.meilen').forEach(m => m.classList.toggle('auf', +m.dataset.l <= E.level));
    $('#kUnter').textContent = `${sn} · Level ${E.level}`;
    zeichneKarte(a, sn, r);
    zeichneLauf(a, sn, v, r);
    if (voll) zeichneRest(a, sn, v);
  };
  const setzeLevel = (l) => {
    l = Math.max(1, Math.min(55, l));
    if (l === E.level) return;
    tick(); E.level = l; merkeEinst(); aktualisiere(true);
  };
  $('#lvMinus').onclick = () => setzeLevel(E.level - 1);
  $('#lvPlus').onclick = () => setzeLevel(E.level + 1);
  lv.oninput = () => {
    E.level = +lv.value;
    aktualisiere(false);
    clearTimeout(lv._t); lv._t = setTimeout(() => { merkeEinst(); aktualisiere(true); }, 140);
  };
  lv.onchange = () => { E.level = +lv.value; merkeEinst(); aktualisiere(true); };

  const fuellK = () => {
    for (const [id, min, max] of [['grR', 160, 205], ['gwR', 55, 105]]) {
      const r2 = $('#' + id); if (r2) r2.style.setProperty('--p', ((r2.value - min) / (max - min) * 100) + '%');
    }
  };
  fuellK();
  const setzeK = () => {
    fuellK();
    E.koerper[a] = { groesse: +$('#grR').value, gewicht: +$('#gwR').value };
    $('#grW').textContent = E.koerper[a].groesse + ' cm';
    $('#gwW').textContent = E.koerper[a].gewicht + ' kg';
    merkeEinst();
    aktualisiere(false);
    clearTimeout(setzeK._t); setzeK._t = setTimeout(() => aktualisiere(true), 220);
  };
  $('#grR').oninput = setzeK; $('#gwR').oninput = setzeK;

  aktualisiere(true);
}

/* Lauftyp: kurzer Hinweis unter den Reglern */
function zeichneLauf(a, sn, v, r) {
  const g = r.koerper.groesse, ziel = r.zielLauftyp;
  let txt, warn = false;
  if (ziel === 'Explosive' && g > 182) { txt = 'Über 182 cm ist <b>Explosive</b> nicht möglich. Geplant wird ohne Lauftyp-Vorgabe.'; warn = true; }
  else if (ziel === 'Lengthy' && g < 183) { txt = 'Unter 183 cm ist <b>Lengthy</b> nicht möglich. Geplant wird ohne Lauftyp-Vorgabe.'; warn = true; }
  else if (r.lauftypOk) txt = ziel === 'Controlled' ? 'Empfohlen ist Controlled. Passt.' : `<b>${ziel}</b> ist aktiv. Passt zur Empfehlung.`;
  else {
    const ab = abLevel(v, w => lauftypVon(w, g) === ziel);
    txt = ab ? `Empfohlen ist <b>${ziel}</b>, aktiv ab Level ${ab}.` : `Empfohlen ist <b>${ziel}</b>, mit diesem Plan nicht erreichbar.`;
  }
  $('#laufInfo').innerHTML = `<div class="laufZeile${warn ? ' warn' : ''}">
    <span class="laufBadge ${r.lauftyp}">${r.lauftyp}</span><span class="t">${txt}</span></div>
    <div class="laufEmpf">Empfehlung für ${a}: ${D.archetypen[a].koerper.groesse} · ${D.archetypen[a].koerper.gewicht}</div>`;
}

function zeichneKarte(a, sn, r) {
  const d = D.archetypen[a], spez = d.spezialisierungen[sn];
  const stufe = karteFuer(E.level);
  const [hell, dunkel, bg] = KARTENFARBEN[stufe];
  const ziele = Object.entries(spez.ziele);
  $('#pk').innerHTML = `
    <div class="pkarte" style="background:linear-gradient(150deg,${hell},${dunkel} 42%,${bg} 70%,${hell});
      box-shadow:0 0 34px -10px ${hell}aa,0 8px 24px rgba(0,0,0,.6)">
      <div class="pkInner" style="background:linear-gradient(165deg,${bg} 0%,#0d1016 52%,#0b0d12 100%)">
        <div class="pkIcon" style="color:${hell}">${ic('a-' + d.icon, 76)}</div>
        <div class="pkTop">
          <div class="pkLv">
            <div class="z" style="color:${hell};text-shadow:0 0 18px ${hell}99">${E.level}</div>
            <div class="l" style="color:${hell}">LEVEL</div>
            <div class="stufe" style="background:linear-gradient(160deg,${hell},${dunkel});color:#221a05">${stufe.toUpperCase()}</div>
          </div>
          <div class="pkMitte" style="border-left:1px solid ${hell}33">
            <h2>${a}</h2>
            <div class="rolle" style="color:${hell}">${d.positionen} · ${sn.toUpperCase()}</div>
            <div class="pkWerte">
              ${ziele.map(([x, v]) => `<div class="pw" style="background:${hell}12;border:1px solid ${hell}2b">
                <b>${r.werte[x] ?? '–'}</b><span style="color:${hell}bb">${kurzAttr(x)}</span></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
const kurzAttr = x => ({
  'Fangsicherheit': 'FANGS.', 'TW-Stellungsspiel': 'TW-POS', 'Kopfballpräzision': 'KOPFB.',
  'Def.-Bewusstsein': 'DEF.BEW', 'Fairer Zweikampf': 'ZWEIK.', 'Beschleunigung': 'BESCHL.',
  'Beweglichkeit': 'BEWEGL.', 'Ballkontrolle': 'BALLK.', 'Freistoßpräzision': 'FS-PRÄZ',
  'Weitschüsse': 'WEITSCH', 'Stellungsspiel': 'STELLG.', 'Übersicht': 'ÜBERS.', 'Sprinttempo': 'SPRINT',
  'Aggressivität': 'AGGR.', 'Dribbling': 'DRIBB.', 'Abschluss': 'ABSCHL.', 'Schusskraft': 'SCHUSS', 'Sprungkraft': 'SPRUNG', 'Kurzer Pass': 'K.PASS', 'Langer Pass': 'L.PASS',
}[x] || x.toUpperCase().slice(0, 7));

/* Grund eines Schritts für einen Wert */
function grundFuer(r, attr, wert) {
  const s = r.schritte.find(x => x.attr === attr && x.von < wert && wert <= x.ziel);
  return s ? s.grund : '';
}

function zeichneRest(a, sn, v) {
  const d = D.archetypen[a];
  const r = v[E.level], vor = v[E.level - 1];
  const box = $('#rest');
  box.innerHTML = '';

  /* Änderungen dieses Levels */
  const aend = [];
  for (const lst of Object.values(D.kategorien)) for (const x of lst) {
    if (r.werte[x] === undefined) continue;
    const alt = vor.werte[x], neu = r.werte[x];
    if (neu !== alt) aend.push({ attr: x, alt, neu, ap: kostenVon(a, x, alt, neu), grund: grundFuer(r, x, neu) });
  }
  const neuAp = r.apGesamt - vor.apGesamt;
  const ausgegeben = aend.reduce((x, y) => x + y.ap, 0);
  const ereignis = D.ereignisse[E.level];
  const titel = E.level === 1 ? 'Start → Level 1' : `Level ${E.level - 1} → ${E.level}`;
  const schritt = el('div', 'karte schritt', `
    <div class="schrittKopf"><h3>${ic('i-blitz', 15)}${titel}</h3><span class="apNeu">+${neuAp} AP</span></div>
    ${aend.length ? `<div class="aendListe">${aend.map(x => `
      <div class="aend"><span class="n">${x.attr}</span>
        <span class="vw"><s>${x.alt}</s> → <b>${x.neu}</b></span>
        ${x.grund ? `<span class="g">${x.grund}</span>` : ''}</div>`).join('')}</div>
      <div class="schrittFuss">${aend.length} ${aend.length === 1 ? 'Wert' : 'Werte'} ändern · ${ausgegeben} AP${r.apRest > 0 ? ` · ${r.apRest} AP bleiben für später` : ''}</div>`
    : `<div class="nix">Nichts zu setzen. Die ${r.apRest} AP sparst du für den nächsten teuren Punkt.</div>`}
    ${ereignis ? `<div class="ereignis">${ic('i-stern', 14)}<span>Level ${E.level} schaltet frei: <b>${ereignis}</b></span></div>` : ''}`);
  box.append(schritt);

  /* Alle Attribute, zwei pro Zeile */
  const geaendert = new Set(aend.map(x => x.attr));
  const kat = el('div', 'karte', `<h3>${ic('i-attr', 15)}Deine Werte auf Level ${E.level}</h3>`);
  for (const [kn, lst] of Object.entries(D.kategorien)) {
    const liste = lst.filter(x => r.werte[x] !== undefined);
    if (!liste.length) continue;
    kat.append(el('div', 'kat', kn));
    const raster = el('div', 'werteRaster');
    for (const attr of liste) {
      const w = r.werte[attr], b = r.basis[attr];
      const neu = geaendert.has(attr);
      const key = (d.schluessel || []).includes(attr);
      const x = neu ? aend.find(y => y.attr === attr) : null;
      raster.append(el('div', 'zelle' + (neu ? ' neu' : w === b ? ' basis' : ''), `
        <span class="n">${key ? '<i title="Schlüsselattribut"></i>' : ''}${attr}</span>
        <span class="w">${neu ? `<span class="vor">${x.alt} →</span>` : ''}<b>${w}</b>${neu ? `<span class="ap">${x.ap} AP</span>` : ''}</span>
        <span class="bar"><span style="width:${w}%"></span></span>`));
    }
    kat.append(raster);
  }
  kat.append(el('div', 'quelle', '<span class="lg neu"></span> ändert sich auf diesem Level &nbsp; <span class="lg key"></span> Schlüsselattribut &nbsp; blass = Startwert'));
  box.append(kat);

  /* Spezialisierung */
  const sp = el('div', 'karte', `<h3>${ic('i-stern', 15)}Spezialisierung</h3>`);
  const spListe = el('div', 'spezListe');
  for (const [n, x] of Object.entries(d.spezialisierungen)) {
    const ab = abLevel(verlauf(a, n), w => erfuellt(w, x.ziele));
    const frei = ab !== null && E.level >= ab;
    const an = n === sn;
    const b = el('button', 'spez' + (an ? ' an' : '') + (frei ? ' frei' : ' zu'), `
      <span class="kopf"><b>${x.meta ? '★ ' : ''}${n}</b>
        <span class="stat">${an ? 'Gewählt' : frei ? 'Wählbar' : ab ? 'ab Level ' + ab : 'nicht bis L55'}</span></span>
      <span class="zz">${Object.entries(x.ziele).map(([y, z]) => `${y} ${z}`).join(' · ')}</span>
      ${an && ab ? `<span class="zz" style="color:var(--txt2)">${frei ? 'Freigeschaltet seit' : 'Freigeschaltet ab'} Level ${ab}</span>` : ''}`);
    b.disabled = !frei && !an;
    if (frei && !an) b.onclick = () => { tick(); E.spez = n; merkeEinst(); zeichneBuild(); };
    spListe.append(b);
  }
  sp.append(spListe);
  sp.append(el('div', 'quelle', '★ = Meta. Wählbar wird eine Spezialisierung, sobald ihre drei Werte erreicht sind.'));
  box.append(sp);

  /* PlayStyles mit Level */
  const slotLevel = [5, 15, 40, 55];
  const empf = (d.slots || []).map(x => x.split(' (')[0]);
  const daten = empf.map(n => {
    const p = D.playstyles.find(q => q.n === n);
    return { n, p, ab: p ? abLevel(v, w => erfuellt(w, p.v)) : null };
  });
  const sortiert = [...daten].sort((x, y) => (x.ab ?? 99) - (y.ab ?? 99));
  sortiert.forEach((x, i) => {
    const platz = slotLevel[i] ?? 55;
    x.wann = x.p ? (x.ab === null ? null : Math.max(x.ab, platz)) : platz;
    x.platz = i + 1;
  });
  const ps = el('div', 'karte', `<h3>${ic('i-blitz', 15)}PlayStyles</h3>`);
  const pl = el('div', 'psListe');
  for (const x of sortiert) {
    const da = x.wann !== null && E.level >= x.wann;
    const jetzt = x.wann === E.level;
    pl.append(el('div', 'ps' + (da ? ' da' : '') + (jetzt ? ' jetzt' : ''), `
      <span class="lvl">${x.wann ? 'L' + x.wann : '–'}</span>
      <span class="was"><b>${x.n}</b><span>${x.p
        ? (x.wann === null ? 'Schwelle mit diesem Plan nicht erreicht' : `Platz ${x.platz} · ${Object.entries(x.p.v).map(([y, z]) => y + ' ' + z).join(', ')}`)
        : `Platz ${x.platz} · keine Attribut-Schwelle hinterlegt`}</span></span>
      <span class="stat">${jetzt ? 'JETZT' : da ? ic('i-check', 15) : ''}</span>`));
  }
  ps.append(pl);
  if (d.signature?.length) {
    ps.append(el('div', 'kat', 'Signature'));
    ps.append(el('div', 'tags', d.signature.map(x => `<span class="tag pk">${x}</span>`).join('')));
  }
  ps.append(el('div', 'quelle', 'Plätze öffnen sich bei Level 5, 15, 40 und 55. Ein PlayStyle passt in den Platz, sobald seine Werte erreicht sind.'));
  box.append(ps);

  /* Meisterung und Quelle */
  const sicher = { 'hoch': ['var(--gruen)', 'Gut belegt'], 'mittel-hoch': ['var(--gruen)', 'Gut belegt'],
    'mittel': ['var(--gelb)', 'Teils abgeleitet'], 'niedrig': ['var(--pink)', 'Quelle vor dem Patch'] }[d.sicherheit] || ['var(--txt2)', d.sicherheit];
  box.append(el('div', 'karte', `<h3>${ic('i-info', 15)}Meisterung und Quelle</h3>
    <div class="zeile"><span class="k">Meisterung L10</span><span class="v">+1 ${d.meisterung[0]}, +1 ${d.meisterung[1]}</span></div>
    <div class="zeile"><span class="k">Meisterung L30</span><span class="v">+1 ${d.meisterung[1]}</span></div>
    <div class="zeile"><span class="k">Spezialbewegungen</span><span class="v">${'★'.repeat(d.sterne[0])}</span></div>
    <div class="zeile"><span class="k">Schwacher Fuß</span><span class="v">${'★'.repeat(d.sterne[1])}</span></div>
    <div class="zeile"><span class="k">Quelle</span><span class="v">${d.quelle}</span></div>
    <div class="zeile"><span class="k">Stand</span><span class="v">${d.stand} · <span style="color:${sicher[0]}">${sicher[1]}</span></span></div>`));
}

/* ---------- Formation ---------- */
function zeichneForm() {
  kopf('Formation', 'Nach Zahl eurer Spieler');
  const F = D.formationen;
  const aktiv = F.menschen.find(m => m.id === E.menschen) || F.menschen[1];
  const s = $('#s-form');
  s.innerHTML = `<div class="wahl" id="wahl"></div><div id="formOut"></div>`;
  for (const m of F.menschen) {
    const b = el('button', 'wahlB' + (m.id === aktiv.id ? ' an' : ''), `
      <span class="num">${m.id}</span><span><h4>${m.titel}</h4><p>${m.unter}</p></span>`);
    b.onclick = () => { tick(); E.menschen = m.id; merkeEinst(); zeichneForm(); };
    $('#wahl').append(b);
  }
  const AUF = {
    '4-2-2-2': [[50, 92, 1], [18, 74, 0], [38, 76, 1], [62, 76, 1], [82, 74, 0], [34, 52, 1], [66, 52, 1], [22, 32, 0], [78, 32, 0], [40, 14, 1], [60, 14, 1]],
    '4-2-1-3': [[50, 92, 1], [16, 74, 0], [38, 77, 1], [62, 77, 1], [84, 74, 0], [36, 55, 1], [64, 55, 1], [50, 38, 1], [18, 18, 1], [50, 12, 1], [82, 18, 1]],
    '4-3-3 Attack': [[50, 92, 1], [16, 74, 1], [38, 77, 1], [62, 77, 1], [84, 74, 1], [50, 56, 1], [26, 46, 1], [74, 46, 1], [18, 18, 1], [50, 12, 1], [82, 18, 1]],
  };
  const pkt = (AUF[aktiv.formation] || []).map(([x, y, h]) =>
    `<span class="sp${h ? '' : ' ki'}" style="left:${x}%;top:${y}%">${h ? '' : 'KI'}</span>`).join('');
  $('#formOut').innerHTML = `
    <div class="pitch"><div class="form">${aktiv.formation}</div><div class="ti">${aktiv.tiefe}</div>
      <div class="feld">${pkt}</div>
      <div class="quelle" style="margin-top:14px"><span style="color:var(--gruen)">●</span> Mensch &nbsp;
        <span style="color:#5d7a99">●</span> KI</div></div>
    <div class="karte"><h3>${ic('i-info', 15)}Warum diese</h3>
      <p style="margin:0;font-size:14px;color:var(--txt2)">${aktiv.warum}</p></div>
    <div class="karte"><h3>${ic('i-liste', 15)}So besetzt ihr</h3>
      <ul class="punkte">${aktiv.besetzen.map((b, i) => `<li><b style="color:var(--txt)">${i + 1}.</b> ${b}</li>`).join('')}</ul>
      <div style="margin-top:13px" class="hinweis">${ic('i-info', 16)}<span>${aktiv.ki}</span></div></div>
    <div class="karte"><h3>${ic('i-stern', 15)}Feste Regeln</h3>
      <ul class="punkte">${F.regeln.map(x => `<li>${x}</li>`).join('')}</ul></div>
    <div class="karte"><h3>${ic('i-form', 15)}Weitere Meta-Formationen</h3>
      <div class="tags">${F.alternativen.map(x => `<span class="tag">${x}</span>`).join('')}</div></div>
    <div class="quelle">Formationen aus Pro Clubs HQ und Dexerto. Die Zuordnung zur Spielerzahl ist eine abgeleitete Empfehlung.</div>`;
}

/* ---------- Einrichtungen ---------- */
function zeichneEinr() {
  kopf('Einrichtungen', 'Wohin das Budget gehört');
  const G = D.einrichtungen;
  $('#s-einr').innerHTML = `
    <div class="karte"><h3>${ic('i-haus', 15)}So funktioniert es</h3>
      <ul class="punkte">${G.grundlagen.map(x => `<li>${x}</li>`).join('')}</ul></div>
    <div class="karte"><h3>${ic('i-stern', 15)}Empfehlung</h3>
      ${G.empfehlung.map((x, i) => `<div class="ek"><span class="ic">${ic(['i-koerper', 'i-blitz', 'i-form'][i] || 'i-haus', 19)}</span>
        <span><h4>${x.titel}</h4><p>${x.text}</p></span></div>`).join('')}</div>
    <div class="karte"><h3>${ic('i-liste', 15)}Bekannte Beispiele</h3>
      ${G.beispiele.map(x => `<div class="zeile"><span class="k">${x.n}</span><span class="v">${x.e}</span></div>`).join('')}
      <div style="margin-top:13px" class="hinweis">${ic('i-info', 16)}<span>${G.hinweis}</span></div></div>`;
}

const datum = s => { if (!s) return ''; const [j, m, t] = s.split('-'); return `${t}.${m}.${j}`; };

/* ---------- Start ---------- */
(async function () {
  ladeEinst();
  D = await ladeDaten();
  if (!D) {
    $('#app').hidden = false;
    $('#s-start').innerHTML = '<div class="leer">Die Daten konnten nicht geladen werden.<br>Prüfe die Verbindung und lade die Seite neu.</div>';
    return;
  }
  $('#datenStand').textContent = 'Daten vom ' + datum(D.stand) + ' · Version ' + D.version;
  document.querySelectorAll('#nav button').forEach(b => {
    b.onclick = () => { tick(); zeige({ tree: 'wahl', form: 'form', einr: 'einr' }[b.dataset.ziel]); };
  });
  $('#btnZurueck').onclick = () => { tick(); zurueck(); };
  $('#app').hidden = false; $('#nav').hidden = false;
  zeige('start', { sofort: true });
})();
