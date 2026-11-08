# Meta Builds für Clubs (EA FC 27)

Statische Web-App auf GitHub Pages. Inoffizielle Fan-App. Besitzer: Tilo. Sprache in App und Berichten: Deutsch, präzise und direkt. Spezialisierungsnamen bleiben englisch.

## Aufbau
- `index.html`, `app.js`, `app.css`: App. Rechnet die Verteilung live aus `meta.json`.
- `meta.json`: alle Daten mit `version` und `stand`. Die App lädt sie beim Start und übernimmt sie, wenn `version` ≥ der gespeicherten ist.
- `meta-fallback.js`: Kopie von `meta.json` für den Offline-Start. Nie von Hand bearbeiten.
- `build/data/*.js`: Quelldaten. `build/data/meta.js` enthält Meta-Builds, PlayStyles, Formationen, Einrichtungen, Sterne-Ziele. `build/data/kosten.js` Kostenkurven, `build/data/base.js` Basiswerte.
- `build/build-meta.js`: erzeugt `meta.json` und `meta-fallback.js`. Version und Stand stehen dort (`version: …, stand: '…'`).
- `build/pruefen.mjs`: Regressionstest über alle Kombinationen.

## Daten ändern
1. Nur `build/data/*.js` ändern, nie `meta.json` direkt.
2. In `build/build-meta.js` die Version um 1 erhöhen und `stand` auf das heutige Datum setzen.
3. `node build/build-meta.js` aus dem Repo-Wurzelordner ausführen.
4. `node build/pruefen.mjs` muss mit `ERGEBNIS: OK` enden. Sonst nicht pushen.
5. Commit auf `main` mit klarer Nachricht, was sich geändert hat und aus welcher Quelle.

## Regeln für Meta-Änderungen
- Keine eigene Meta. Übernehmen nur, was in den EA-Patchnotes steht oder von mindestens zwei unabhängigen Quellen bestätigt ist (Pro Clubs HQ/Pro11, Dexerto, RealSport101, AOEAH, EA). Einzelmeinungen nur im Bericht nennen.
- AP-Kosten stehen in keiner Quelle; sie stammen aus Tilos Messungen im Spiel. Kosten nie aus dem Web übernehmen. Ändert ein Patch die Kosten, im Bericht gezielt nach Messfotos fragen.
- Bei Widersprüchen zwischen Quellen nichts ändern, sondern im Bericht zur Entscheidung vorlegen.
- App-Code (`app.js`, `app.css`, `index.html`) nur ändern, wenn Tilo es ausdrücklich verlangt.
