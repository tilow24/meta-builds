/* Meta Builds Pro Clubs
   Daten liegen getrennt in meta.json. Die App lädt sie beim Start, legt sie lokal ab
   und arbeitet offline mit der letzten gespeicherten Fassung. */

const QUELLE = 'meta.json';
const SPEICHER = 'mbpc.daten.v2';
const EINST = 'mbpc.einst.v2';

let D = null;
let E = { level: 25, archetyp: null, spez: null, menschen: '4-7', filter: 'plan', koerper: {}, erledigt: {} };

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
  let rest = D.apKumuliert[level];
  const erl = E.erledigt[a + '|' + sn] || {};
  const offen = [];
  let laufend = null;

  for (const s of schritte) {
    if (s.kosten <= rest) {
      rest -= s.kosten; werte[s.attr] = s.ziel;
      if (!erl[s.attr + '>' + s.ziel]) offen.push({ ...s, teil: false });
    } else if (!laufend) {
      // teilweise machbar
      const { stufe } = stufeFuer(a, s.attr);
      let w = s.von, k2 = 0;
      while (w < s.ziel && punktKosten(stufe, w) <= rest - k2) { k2 += punktKosten(stufe, w); w++; }
      rest -= k2; werte[s.attr] = w;
      laufend = { ...s, erreicht: w, teilKosten: k2 };
      if (!erl[s.attr + '>' + s.ziel]) offen.push({ ...s, teil: true, erreicht: w, teilKosten: k2 });
      break;
    }
  }

  const ap = D.apKumuliert[level];
  const lt = lauftypVon(werte, k.groesse);
  return {
    level, werte, basis, schritte, offen, laufend, koerper: k,
    apGesamt: ap, apGenutzt: ap - rest, apRest: rest,
    lauftyp: lt, zielLauftyp, lauftypOk: lt === zielLauftyp,
    spezOk: Object.entries(D.archetypen[a].spezialisierungen[sn].ziele).every(([x, v]) => (werte[x] ?? 0) >= v),
    playstyles: D.playstyles.map(p => {
      const teile = Object.entries(p.v).map(([x, v]) => ({ a: x, v, ok: (werte[x] ?? 0) >= v }));
      return { name: p.n, teile, ok: teile.every(t => t.ok), fehlt: teile.filter(t => !t.ok).length };
    }),
  };
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
    <div class="gross">Wer wirst<br><em>du heute?</em></div>
    <div class="unter">Alles in zwei Tipps. Wähle einen Bereich.</div>
    <div class="kacheln">
      <button class="kachel" data-z="wahl"><span class="glanz"></span>
        <span class="ic" style="color:var(--gruen)">${ic('i-tree', 27)}</span>
        <span class="tx"><h3>Skilltree</h3><p>Fertige Verteilung für dein Level</p></span>
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
        <h4>${name}</h4><div class="pos">${d.positionen}</div><span class="sp">${meta}</span>`);
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
  if (!d.spezialisierungen[E.spez]) E.spez = Object.keys(d.spezialisierungen)[0];
  const sn = E.spez;
  kopf(a, `${sn} · Level ${E.level}`);
  const s = $('#s-build');
  s.innerHTML = `<div id="pk"></div>
    <div class="chips" id="chips"></div>
    <div class="karte" id="reglerK"></div>
    <div id="rest"></div>`;

  const chips = $('#chips', s);
  for (const [n, x] of Object.entries(d.spezialisierungen)) {
    const c = el('button', 'chip' + (n === sn ? ' an' : ''), (x.meta ? '★ ' : '') + n);
    c.onclick = () => { tick(); E.spez = n; merkeEinst(); zeichneBuild(); };
    chips.append(c);
  }

  const r = berechne(a, sn, E.level);
  $('#reglerK').innerHTML = `
    <div class="reglerZeile"><span class="lv">DEIN LEVEL</span>
      <span class="ap"><b id="apZahl">${r.apGenutzt}</b> / <span id="apMax">${r.apGesamt}</span> AP verteilt
      <span id="apRest" style="display:block;color:var(--txt3);font-size:11px"></span></span></div>
    <div class="schienenBox">
      <div class="schiene"><div class="fuell" id="fuell"></div><div id="meilen"></div></div>
      <input type="range" id="lv" min="1" max="55" value="${E.level}">
    </div>
    <div class="meilenTxt"><span>1</span><span>15</span><span>30</span><span>45</span><span>55</span></div>
    <div id="ereignis"></div>`;

  const mb = $('#meilen');
  for (const l of [5, 15, 20, 30, 40, 55]) {
    const m = el('span', 'meilen'); m.style.left = ((l - 1) / 54 * 100) + '%'; m.dataset.l = l; mb.append(m);
  }

  const lv = $('#lv');
  const aktualisiere = (voll) => {
    const n = berechne(a, sn, E.level);
    $('#fuell').style.width = ((E.level - 1) / 54 * 100) + '%';
    document.querySelectorAll('.meilen').forEach(m => m.classList.toggle('auf', +m.dataset.l <= E.level));
    $('#apZahl').textContent = n.apGenutzt; $('#apMax').textContent = n.apGesamt;
    $('#apRest').textContent = n.apRest > 0 ? n.apRest + ' AP frei' : '';
    $('#kUnter').textContent = `${sn} · Level ${E.level}`;
    const t = D.ereignisse[E.level];
    $('#ereignis').innerHTML = t ? `<div class="hinweis" style="margin-top:12px;background:rgba(255,79,216,.09);
      border-color:rgba(255,79,216,.25);color:#f3c6e9">${ic('i-stern', 16)}
      <span>Level ${E.level} schaltet frei: <b style="color:#fff">${t}</b></span></div>` : '';
    zeichneKarte(a, sn, n);
    if (voll) zeichneRest(a, sn, n);
  };
  lv.oninput = () => {
    E.level = +lv.value;
    aktualisiere(false);
    clearTimeout(lv._t); lv._t = setTimeout(() => { merkeEinst(); aktualisiere(true); }, 170);
  };
  lv.onchange = () => { merkeEinst(); aktualisiere(true); };
  aktualisiere(true);
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

function zeichneRest(a, sn, r) {
  const d = D.archetypen[a], spez = d.spezialisierungen[sn];
  const box = $('#rest');
  box.innerHTML = '';
  const erlKey = a + '|' + sn;
  const erl = E.erledigt[erlKey] || {};

  /* Freischalt-Banner */
  if (r.spezOk) {
    box.append(el('div', 'frei', `<div class="haken">${ic('i-check', 19)}</div>
      <div><div class="t">FREIGESCHALTET</div><div class="w">${sn}</div></div>`));
  }

  /* Als Nächstes */
  const naechst = r.offen.find(x => x.teil) || r.offen[0];
  if (naechst) {
    const hat = (naechst.erreicht ?? naechst.von) - naechst.von, ges = naechst.ziel - naechst.von;
    box.append(el('div', 'karte jetzt', `
      <h3>${ic('i-blitz', 15)}Als Nächstes</h3>
      <div class="ziel">${naechst.attr} auf <b>${naechst.ziel}</b></div>
      <div class="mini">${naechst.grund}. Steht bei ${naechst.erreicht ?? naechst.von}.</div>
      <div class="fort"><i style="width:${Math.round(hat / ges * 100)}%"></i></div>`));
  } else {
    box.append(el('div', 'karte jetzt', `<h3>${ic('i-stern', 15)}Fertig</h3>
      <div class="ziel">Alles abgehakt</div>
      <div class="mini">${r.apRest > 0 ? r.apRest + ' AP sind übrig. Steck sie in Reaktion oder Ausdauer.' : 'Der Plan ist umgesetzt.'}</div>`));
  }

  /* Lauftyp */
  const k = r.koerper;
  const lk = el('div', 'karte', `<h3>${ic('i-lauf', 15)}Lauftyp und Körper</h3>
    <div class="lauf">
      <span class="laufBadge ${r.lauftyp}">${r.lauftyp}</span>
      <span class="t">${r.lauftypOk ? 'Passt zur Empfehlung für ' + a + '.' : 'Empfohlen ist <b style="color:var(--txt)">' + r.zielLauftyp + '</b>.'}</span>
    </div>
    <div class="koerperRegler">
      <div class="krZeile"><span>Größe</span><b id="grW">${k.groesse} cm</b></div>
      <input type="range" class="einfach" id="grR" min="160" max="205" value="${k.groesse}">
      <div class="krZeile" style="margin-top:8px"><span>Gewicht</span><b id="gwW">${k.gewicht} kg</b></div>
      <input type="range" class="einfach" id="gwR" min="55" max="105" value="${k.gewicht}">
    </div>
    <div class="zeile" style="margin-top:10px"><span class="k">Empfehlung</span><span class="v">${d.koerper.groesse} · ${d.koerper.gewicht}</span></div>
    <div id="laufWarn"></div>`);
  box.append(lk);

  const warnung = () => {
    const w = [];
    const g = r.koerper.groesse;
    const b = r.werte.Beweglichkeit ?? 0, st = r.werte['Stärke'] ?? 0;
    if (r.zielLauftyp === 'Explosive') {
      if (g > 182) w.push('Über 182 cm ist Explosive nicht möglich. Die App plant jetzt ohne Lauftyp-Vorgabe.');
      else {
        if (b - st < 10) w.push(`Beweglichkeit muss 10 über Stärke liegen, steht bei ${b} zu ${st}. Stärke nicht weiter steigern.`);
        if ((r.werte.Beschleunigung ?? 0) < 80) w.push('Beschleunigung muss auf 80, sonst bleibt der Pro Controlled.');
      }
    } else if (r.zielLauftyp === 'Lengthy') {
      if (g < 183) w.push('Unter 183 cm ist Lengthy nicht möglich. Die App plant jetzt ohne Lauftyp-Vorgabe.');
      else if (st - b < 4) w.push(`Stärke muss 4 über Beweglichkeit liegen, steht bei ${st} zu ${b}. Beweglichkeit nicht weiter steigern.`);
    }
    $('#laufWarn').innerHTML = w.length
      ? `<div class="warnung">${ic('i-warn', 16)}<span>${w.join('<br>')}</span></div>` : '';
  };
  const fuell = () => {
    for (const [id, min, max] of [['grR', 160, 205], ['gwR', 55, 105]]) {
      const r2 = $('#' + id, lk); if (r2) r2.style.setProperty('--p', ((r2.value - min) / (max - min) * 100) + '%');
    }
  };
  warnung(); fuell();
  const setzeK = () => {
    fuell();
    E.koerper[a] = { groesse: +$('#grR').value, gewicht: +$('#gwR').value };
    $('#grW').textContent = E.koerper[a].groesse + ' cm';
    $('#gwW').textContent = E.koerper[a].gewicht + ' kg';
    merkeEinst();
    const n = berechne(a, sn, E.level);
    const bd = lk.querySelector('.laufBadge');
    bd.className = 'laufBadge ' + n.lauftyp; bd.textContent = n.lauftyp;
    lk.querySelector('.lauf .t').innerHTML = n.lauftypOk ? 'Passt zur Empfehlung für ' + a + '.'
      : 'Empfohlen ist <b style="color:var(--txt)">' + n.zielLauftyp + '</b>.';
    Object.assign(r, n); warnung();
    clearTimeout(setzeK._t);
    setzeK._t = setTimeout(() => zeichneRest(a, sn, berechne(a, sn, E.level)), 260);
  };
  $('#grR', lk).oninput = setzeK; $('#gwR', lk).oninput = setzeK;

  /* Einkaufsliste */
  const liste = el('div', 'karte', `<h3>${ic('i-liste', 15)}Das musst du setzen</h3>`);
  if (!r.offen.length) {
    liste.append(el('div', 'quelle', 'Für Level ' + E.level + ' ist alles erledigt.'));
  } else {
    let phase = null;
    for (const o of r.offen) {
      if (o.phase !== phase) {
        phase = o.phase;
        const p = D.phasen[phase];
        const ph = el('div', 'phase', p.kurz);
        ph.style.cssText = `background:${p.farbe}1f;color:${p.farbe};border:1px solid ${p.farbe}44`;
        liste.append(ph);
      }
      const bis = o.teil ? o.erreicht : o.ziel;
      const punkte = bis - o.von;
      const ap = o.teil ? (o.teilKosten ?? 0) : o.kosten;
      const z = el('div', 'ekz' + (erl[o.attr + '>' + o.ziel] ? ' ok' : ''), `
        <span class="hk">${ic('i-check', 15)}</span>
        <span class="was"><b>${o.attr} auf ${bis}</b><span>${o.grund}${o.teil ? ` · Ziel ${o.ziel}, mehr geht auf diesem Level nicht` : ''}</span></span>
        <span class="zahl"><b style="color:${punkte > 0 ? 'var(--gruen)' : 'var(--txt3)'}">+${punkte}</b>
          <span>${ap} AP</span></span>`);
      z.onclick = () => {
        tick();
        const kk = o.attr + '>' + o.ziel;
        E.erledigt[erlKey] = E.erledigt[erlKey] || {};
        if (E.erledigt[erlKey][kk]) delete E.erledigt[erlKey][kk]; else E.erledigt[erlKey][kk] = 1;
        merkeEinst(); z.classList.toggle('ok');
        const n = liste.querySelectorAll('.ekz:not(.ok)').length;
        $('#summeOffen').textContent = n;
      };
      liste.append(z);
    }
    const summeAp = r.offen.reduce((x, o) => x + (o.teil ? (o.teilKosten ?? 0) : o.kosten), 0);
    liste.append(el('div', 'summe', `<span><span id="summeOffen">${r.offen.filter(o => !erl[o.attr + '>' + o.ziel]).length}</span> offene Schritte</span><b>${summeAp} AP</b>`));
    liste.append(el('div', 'quelle', 'Tipp an einen Schritt, um ihn abzuhaken. Die App merkt es sich.'));
  }
  box.append(liste);

  /* Attribute */
  const imPlan = new Set(r.schritte.map(x => x.attr));
  const kat = el('div', 'karte', `<h3 style="justify-content:space-between">
      <span style="display:flex;align-items:center;gap:8px">${ic('i-attr', 15)}Attribute</span>
      <span class="filter"><button data-f="plan" class="${E.filter !== 'alle' ? 'an' : ''}">Mein Plan</button><button data-f="alle" class="${E.filter === 'alle' ? 'an' : ''}">Alle</button></span>
    </h3>`);
  kat.querySelectorAll('.filter button').forEach(b => b.onclick = () => { E.filter = b.dataset.f; merkeEinst(); zeichneRest(a, sn, r); });
  for (const [kn, lst] of Object.entries(D.kategorien)) {
    let v = lst.filter(x => r.werte[x] !== undefined);
    if (E.filter !== 'alle') v = v.filter(x => imPlan.has(x) || r.werte[x] !== r.basis[x]);
    if (!v.length) continue;
    kat.append(el('div', 'kat', kn));
    for (const attr of v) {
      const w = r.werte[attr], b = r.basis[attr], zu = w - b;
      const ziel = r.schritte.filter(x => x.attr === attr).map(x => x.ziel).pop();
      const key = (d.schluessel || []).includes(attr);
      kat.append(el('div', 'attr' + (zu ? '' : ' nix'), `
        <div class="attrTop"><span class="n">${key ? '<i></i>' : ''}${attr}</span>
          <span class="v">${w}${zu ? `<u>+${zu}</u>` : ''}</span></div>
        <div class="bar"><span class="alt" style="width:${b}%"></span>
          ${zu ? `<span class="neu" style="width:${w}%"></span>` : ''}
          ${ziel && ziel > w ? `<span class="ziel" style="left:${ziel}%"></span>` : ''}</div>`));
    }
  }
  kat.append(el('div', 'quelle', '<i style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--gelb)"></i> Schlüsselattribut · <span style="color:var(--pink)">|</span> nächstes Ziel'));
  box.append(kat);

  /* PlayStyles */
  const frei = r.playstyles.filter(p => p.ok);
  const nah = r.playstyles.filter(p => !p.ok && p.fehlt === 1).slice(0, 4);
  box.append(el('div', 'karte', `<h3>${ic('i-blitz', 15)}PlayStyles</h3>
    <div class="tags">${frei.length ? frei.map(p => `<span class="tag ok">${p.name}</span>`).join('') : '<span class="tag">Noch keiner frei</span>'}</div>
    ${nah.length ? `<div class="kat" style="margin-top:15px">Fast geschafft</div><div class="tags">${nah.map(p => {
      const f = p.teile.find(t => !t.ok);
      return `<span class="tag">${p.name} <span style="color:var(--txt3)">· ${f.a} ${f.v}</span></span>`;
    }).join('')}</div>` : ''}
    <div class="kat" style="margin-top:15px">Signature</div>
    <div class="tags">${d.signature.map(x => `<span class="tag pk">${x}</span>`).join('')}</div>`));

  /* Strecke */
  const plan = el('div', 'karte', `<h3>${ic('i-uhr', 15)}Deine Strecke</h3>`);
  const pl = el('div', 'strecke');
  const anzahl = r.schritte.length;
  let fertigAnz = 0;
  for (const p of r.schritte) {
    const fertig = p.kumuliert <= r.apGenutzt;
    const hier = !fertig && r.laufend && r.laufend.attr === p.attr && r.laufend.ziel === p.ziel;
    if (fertig) fertigAnz++;
    const ph = D.phasen[p.phase];
    pl.append(el('div', 'st' + (fertig ? ' ok' : hier ? ' hier' : ''), `
      <span class="w"><b>${p.attr}</b> auf ${p.ziel}</span>
      <span class="l" style="${fertig || hier ? '' : 'color:' + ph.farbe + '99'}">${hier ? 'JETZT' : p.level ? 'ab L' + p.level : '> L55'}</span>`));
  }
  const leucht = el('span', 'leucht');
  leucht.style.height = (anzahl ? (fertigAnz / anzahl * 100) : 0) + '%';
  pl.append(leucht);
  plan.append(pl);
  const ges = r.schritte.reduce((x, y) => x + y.kosten, 0);
  plan.append(el('div', 'quelle', `${r.schritte.length} Schritte · ${ges} AP${levelFuerAp(ges) ? ' · fertig ab Level ' + levelFuerAp(ges) : ' · passt nicht ganz in 1419 AP'}`));
  box.append(plan);

  /* Meisterung + Quelle */
  const sicher = { 'hoch': ['var(--gruen)', 'Gut belegt'], 'mittel-hoch': ['var(--gruen)', 'Gut belegt'],
    'mittel': ['var(--gelb)', 'Teils abgeleitet'], 'niedrig': ['var(--pink)', 'Quelle vor dem Patch'] }[d.sicherheit] || ['var(--txt2)', d.sicherheit];
  box.append(el('div', 'karte', `<h3>${ic('i-info', 15)}Meisterung und Quelle</h3>
    <div class="zeile"><span class="k">Meisterung L10</span><span class="v">+1 ${d.meisterung[0]}, +1 ${d.meisterung[1]}</span></div>
    <div class="zeile"><span class="k">Meisterung L30</span><span class="v">+1 ${d.meisterung[1]}</span></div>
    <div class="zeile"><span class="k">Spezialbewegungen</span><span class="v">${'★'.repeat(d.sterne[0])}</span></div>
    <div class="zeile"><span class="k">Schwacher Fuß</span><span class="v">${'★'.repeat(d.sterne[1])}</span></div>
    <div class="zeile"><span class="k">Quelle</span><span class="v">${d.quelle}</span></div>
    <div class="zeile"><span class="k">Stand</span><span class="v">${d.stand}</span></div>
    <div class="zeile"><span class="k">Verlässlichkeit</span><span class="v" style="color:${sicher[0]}">${sicher[1]}</span></div>
    <div style="margin-top:13px" class="hinweis">${ic('i-info', 16)}<span>Die Quellen nennen nur Meilensteine. Die Reihenfolge rechnet die App aus Lauftyp, PlayStyle-Schwellen und Punktkosten.</span></div>`));
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
