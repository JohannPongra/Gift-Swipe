# GiftSwipe

GiftSwipe ist eine kleine mobile Web-App fuer Geschenkentscheidungen. **Sie wurde fast komplett gevibecoded.** Eine Person bewertet Geschenkideen per Button oder Swipe mit Ja/Nein. Die Entscheidungen werden in Supabase gespeichert und koennen auf einer geschuetzten Auswertungsseite betrachtet werden.

## Funktionen

- Mobile Kartenansicht mit Touch-/Maus-Swipe und Ja-/Nein-Buttons
- Normale Sessions mit direkten Geschenkideen
- Optionaler Kategorie-Modus: erst Kategorien bewerten, danach passende Geschenkideen anzeigen
- Teilnehmerzugriff ueber einen privaten Session-Link
- Admin-Login mit Supabase Auth
- Admin-Bereich fuer Kategorien und Geschenkideen
- Produktseiten-Import ueber OpenGraph-/Meta-Daten
- Fallback fuer Seiten wie Amazon, die automatischen Abruf blockieren
- Datei-Upload mit clientseitiger 4:3-Normalisierung und WebP-Kompression
- Mehrere Produktbilder mit Galerie-Navigation
- Loeschen einzelner oder mehrerer Geschenkideen
- Auswertung mit Ja-/Nein-Zaehlung, Zeitpunkten und Produktlinks

## Technologie

- HTML, CSS und Vanilla JavaScript
- Supabase Database, Auth, Storage und Edge Functions
- GitHub Actions und GitHub Pages
- Keine Frameworks und keine Swipe-Bibliothek

## Lokaler Start

1. `config.example.js` als `config.js` kopieren.
2. In `config.js` die Supabase-Projekt-URL und den oeffentlichen `anon`-Key eintragen.
3. Einen lokalen HTTP-Server starten, zum Beispiel:

```powershell
py -m http.server 8000
```

4. Teilnehmerseite mit einem Session-Token oeffnen:

```text
http://localhost:8000/?token=DEIN_ACCESS_TOKEN
```

Weitere Seiten:

- `http://localhost:8000/admin.html`
- `http://localhost:8000/auswertung.html`

`config.js` ist absichtlich in `.gitignore` und darf nicht committed werden.

## Supabase-Einrichtung

Die SQL-Dateien werden in dieser Reihenfolge im Supabase SQL Editor ausgefuehrt:

1. `supabase-schema.sql` - Grundtabellen und RLS
2. `supabase-erweiterung.sql` - Kategorien, Session-Modi, Storage und RPCs
3. `supabase-bilder.sql` - mehrere Bilder pro Geschenkidee und Galerie-RPC
4. `supabase-seed.sql` - optionale Testdaten und eine Test-Session

Danach in Supabase unter **Authentication** einen Admin-Benutzer anlegen.

Der Storage-Bucket `gift-images` wird durch `supabase-erweiterung.sql` angelegt. RLS erlaubt oeffentliches Lesen der veroeffentlichten Bilder, aber Upload, Aenderung und Loeschung nur fuer eingeloggte Admins.

## Produktseiten-Import

Im Admin-Bereich kann eine normale Produktseiten-URL eingegeben werden. Die Edge Function `fetch-product-metadata` liest serverseitig:

- `og:title`
- `og:description`
- `og:image`
- Twitter-Meta-Tags
- HTML-`title` und normale Beschreibung
- mehrere Bilder aus JSON-LD-Produktdaten

Die importierten Werte sind Vorschlaege und koennen vor dem Speichern bearbeitet werden. Shops wie Amazon koennen automatisierte Abrufe blockieren. In diesem Fall bleibt die URL als Produkt-Link nutzbar; Titel, Beschreibung und Bild werden manuell eingetragen.

Die Edge Function wird mit der Supabase CLI deployed:

```powershell
supabase functions deploy fetch-product-metadata
```

## GitHub Pages

Das Repository enthaelt den Workflow `.github/workflows/deploy-pages.yml`.

Vor dem Push muessen im GitHub-Repository unter **Settings -> Secrets and variables -> Actions** angelegt werden:

- `SUPABASE_URL` - nur die Projekt-URL ohne `/rest/v1/`
- `SUPABASE_ANON_KEY` - der oeffentliche `anon`-Key

Der Workflow erzeugt daraus beim Deployment die lokale `config.js`. In GitHub Pages muss als Quelle **GitHub Actions** ausgewahlt werden.

Die erwartete Adresse lautet:

```text
https://johannpongra.github.io/Gift-Swipe/
```

Die Pfade fuer Admin und Auswertung sind `/admin.html` und `/auswertung.html`.

## Sicherheit

- Der Browser verwendet nur den oeffentlichen Supabase-Anon-Key.
- Service-Role-Keys, Datenbankpasswoerter und echte Session-Tokens gehoeren niemals in den Browsercode oder das Repository.
- `config.js`, `.env`-Dateien, Supabase-Temp-Dateien und Editorartefakte sind ignoriert.
- RLS schuetzt Admin-Inhalte und Entscheidungen; die Benutzeroberflaeche ist keine Sicherheitsgrenze.
- Teilnehmer-Links enthalten einen privaten Zugriffstoken und sollten nur an die vorgesehene Person weitergegeben werden.
- Die Produkt-Metadaten-Function akzeptiert nur HTTP(S)-URLs, begrenzt die Seitengroesse und benoetigt einen Admin-Login.

## Datenmodell

- `gift_ideas` - veroeffentlichte Geschenkideen/Endprodukte
- `categories` - optionale Kategorien
- `gift_idea_categories` - Zuordnung von Produkten zu Kategorien
- `swipe_sessions` - private Session und Ablaufmodus
- `decisions` - Produktentscheidungen
- `category_decisions` - Kategorieentscheidungen
- `gift_idea_images` - sortierte Produktbilder

## Projektstruktur

- `index.html`, `app.js`, `style.css` - Teilnehmerseite
- `admin.html`, `admin.js`, `admin.css` - Admin-Bereich
- `auswertung.html`, `auswertung.js`, `auswertung.css` - geschuetzte Auswertung
- `supabase-client.js` - gemeinsamer Datenbankclient
- `supabase/functions/fetch-product-metadata/index.ts` - Produktseiten-Import
- `supabase-*.sql` - Datenbankeinrichtung und Migrationen
- `GiftSwipe_Lernen.md` - Lerntagebuch

## Entwicklung

Vor einem Commit:

```powershell
git status
git diff --check
git diff --stat
```

Keine Konfigurationsdateien, Tokens oder Passwoerter committen. Aenderungen in kleinen, nachvollziehbaren Commits speichern.
