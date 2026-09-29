# GiftSwipe – Mein Lerntagebuch

## Projektidee

Ich entwickle eine kleine Web-App, mit der eine Person auf ihrem Smartphone Geschenkideen durchgehen kann: rechts für „Ja“, links für „Nein“. Die Entscheidungen sollen später online gespeichert und auf einer separaten Auswertungsseite angezeigt werden.

## Meine Lernziele

- HTML, CSS und Vanilla JavaScript an einem eigenen Projekt verstehen und anwenden.
- Eine responsive Oberfläche mit Karten, Buttons und Swipe-Gesten entwickeln.
- Daten mit Supabase speichern und Zugriffe sicher gestalten.
- Git und GitHub während der gesamten Entwicklung bewusst nutzen.
- Fehler selbst nachvollziehen und schrittweise beheben.
- Das fertige Projekt auf GitHub dokumentieren und seine Entwicklung erklären können.

Geplant sind HTML, CSS, Vanilla JavaScript, Supabase, Git und GitHub. Zunächst verwende ich kein React, kein TypeScript und keine Swipe-Bibliothek. Das Hosting entscheiden wir später.

## So möchte ich lernen

1. Wir bearbeiten immer nur einen überschaubaren Schritt.
2. Vor jeder Änderung wird erklärt, was entsteht, warum es gebraucht wird und welche Dateien betroffen sind.
3. Ich führe die Befehle selbst aus und schicke das Ergebnis, bevor wir weitermachen.
4. Neue Konzepte werden am aktuellen Beispiel erklärt. Bei Git überlege ich regelmäßig zuerst selbst, was ein Befehl bewirkt.
5. Vor einem neuen Feature muss der aktuelle Stand testbar und funktionsfähig sein.
6. Nach einem sinnvollen Entwicklungsschritt besprechen wir, ob ein Commit sinnvoll ist, welche Dateien geprüft und gestaged werden und welche Commit-Message passt.
7. Nach größeren Abschnitten beantworte ich zwei bis vier Verständnisfragen.
8. Dieses Lerntagebuch wird um bestätigte Ergebnisse, Erkenntnisse, Fehler und offene Fragen ergänzt. Geplante Inhalte gelten noch nicht als gelernt.

## Lernplan und Fortschritt

| Phase                      | Inhalt                                                                                        | Status |
| -------------------------- | --------------------------------------------------------------------------------------------- | ------ |
| 0 – Git & Projektstart     | Git und GitHub unterscheiden; Projektordner, Repository, `.gitignore`, erster Commit und Push | In Arbeit |
| 1 – Grundgerüst            | Responsive Geschenk-Karte mit Bild, Titel, Preis und Ja-/Nein-Buttons                         | Offen  |
| 2 – Geschenkideen          | JavaScript-Array, Kartenwechsel und Fortschrittsanzeige                                       | Offen  |
| 3 – Abstimmungen           | Entscheidungen zunächst im JavaScript-Zustand speichern und rückgängig machen                 | Offen  |
| 4 – Swipe-Funktion         | Maus- und Touch-Gesten, Animation und erster sinnvoller Feature-Branch                        | Offen  |
| 5 – Supabase               | Datenmodell, Online-Speicherung, Teilnehmer-Link und sichere Zugriffsregeln                   | Offen  |
| 6 – Auswertung             | Entscheidungen anzeigen, filtern und mit Produktlinks sowie Zeitpunkten darstellen            | Offen  |
| 7 – Qualität               | Mobile-Design, Lade- und Fehlerzustände, Abschluss, Neustart und Accessibility                | Offen  |
| 8 – GitHub-Qualität        | README, Screenshots, Setup, Architektur und „What I learned“                                  | Offen  |
| 9 – GitHub-Fortgeschritten | Issues, Pull Requests, Branches, Merge, Tags und Releases am echten Projekt                   | Offen  |

## Git und GitHub als durchgehender Lernbereich

- **Grundlagen:** Repository, Working Directory, Staging Area und Commit.
- **Änderungen prüfen:** `git status`, `git diff` und Commit-Historie.
- **Fortschritt sichern:** `git add`, `git commit` und kleine, aussagekräftige Commits.
- **Mit GitHub arbeiten:** Remote-Repository, `git push` und `git pull`.
- **Änderungen organisieren:** Branches, Merge, Konflikte und Änderungen zurücknehmen.
- **Veröffentlichung vorbereiten:** `.gitignore`, Umgang mit Secrets, README, Issues, Pull Requests, Tags und Releases.

Die Begriffe werden dann vertieft, wenn wir sie im Projekt brauchen. Zugangsdaten, geheime Teilnehmer-Links und private Schlüssel gehören nicht in dieses Lerntagebuch oder ein öffentliches Repository.

## Lernprotokoll

### 28.09.2026 – Projektidee und Lernablauf festgehalten

**Ziel dieses Schritts:** Den Lernprozess für GiftSwipe an einem festen Ort dokumentieren.

**Ergebnis:** Projektidee, Lernziele, Arbeitsweise und geplante Phasen sind in dieser Datei festgehalten.

**Bisheriger Stand:** Die technische Umsetzung und Phase 0 stehen noch aus. Eine Git-Installation, ein eigenes GiftSwipe-Repository und ein GitHub-Repository sind noch nicht durch meine Rückmeldung bestätigt.

**Nächster Lernschritt:** Zuerst klären wir, was Git, GitHub und ein Repository sind und wie unser Entwicklungsablauf aussieht. Danach führe ich den ersten kleinen praktischen Schritt selbst aus und teile das Ergebnis.

### 28.09.2026 – Entwicklungswerkzeuge geprüft

- **Ziel:** Prüfen, welche Werkzeuge bereits installiert sind.
- **Selbst ausgeführt:** `git --version` in PowerShell.
- **Bestätigtes Ergebnis:** `git version 2.55.0.windows.5`. VS Code ist ebenfalls installiert.
- **Besprochen:** Git verwaltet die Versionsgeschichte lokal; GitHub stellt Git-Projekte online bereit. Ein Repository enthält das Projekt und seine Versionsgeschichte. Mein Verständnis dieser Begriffe wurde noch nicht überprüft.
- **Git-Schritt:** Noch kein Commit; ein eigenes GiftSwipe-Repository wurde noch nicht angelegt bzw. bestätigt.
- **Nächster Schritt:** Einen eigenen Projektordner anlegen und in diesen wechseln. PowerShell befindet sich aktuell in `C:\windows\System32`.

### 28.09.2026 – Projektordner geöffnet

- **Bestätigtes Ergebnis:** Mein PowerShell-Prompt zeigt `C:\Users\jopos\Desktop\Johann\Schule\Projekte\gift-swipe>` an. Ich befinde mich im vorgesehenen Projektordner.
- **Besprochen:** `mkdir` erstellt einen Ordner; `cd` wechselt in einen Ordner.
- **Dokumentation:** Das Lerntagebuch liegt inzwischen als `GiftSwipe_Lernen.md` im Projektordner.
- **Git-Schritt:** Noch kein Commit bestätigt. Die Initialisierung des Git-Repositories ist der nächste geplante Schritt.
- **Verständnisfrage vor dem nächsten Schritt:** Was bewirkt `git init` vermutlich? Meine Antwort steht noch aus.

### 28.09.2026 – Erstes Git-Repository und erster Commit

- **Ziel:** Den bisherigen Lernstand als nachvollziehbaren Git-Entwicklungsstand speichern.
- **Umsetzung:** `git init` initialisierte das lokale Repository. Mit `git status` wurde die zunächst nicht verfolgte Datei erkannt. `git add GiftSwipe_Lernen.md` nahm sie in die Staging Area auf.
- **Hinweis:** Git meldete eine LF/CRLF-Zeilenendenwarnung. Das ist unter Windows eine normale Formatierungsumwandlung und kein inhaltlicher Fehler.
- **Fehler und Lösungsweg:** Der erste Commitversuch scheiterte, weil Git noch keine Benutzeridentität kannte. Nach dem Setzen von `user.name` und `user.email` konnte der Commit erstellt werden.
- **Ergebnis:** Commit `5a8e9e5` mit der Nachricht `Document GiftSwipe learning plan` wurde erfolgreich erstellt. Er enthält 95 Zeilen in `GiftSwipe_Lernen.md`.
- **Verstanden:** `git add` bereitet Änderungen für einen Commit vor; `git commit` speichert sie dauerhaft in der lokalen Git-Historie. `git init` erstellt die lokale Versionsverwaltung, veröffentlicht aber nichts online.
- **Nächster Schritt:** Den sauberen Zustand mit `git status` prüfen und anschließend die Projektdateien für die erste Web-App-Struktur planen.

### 28.09.2026 – `.gitignore` angelegt und committen gelernt

- **Umsetzung:** Eine `.gitignore` mit Regeln für `.env`-Dateien sowie Betriebssystem- und Editor-Dateien wurde erstellt.
- **Prüfung:** `git status` zeigte zunächst die neue `.gitignore` und die aktualisierte Dokumentation. Beide Dateien wurden gemeinsam gestaged.
- **Ergebnis:** Commit `7573efe` mit der Nachricht `Add Git ignore rules and update learning log` wurde erfolgreich erstellt. Danach meldete `git status`: `nothing to commit, working tree clean`.
- **Verstanden:** `git status` unterscheidet nicht verfolgte, geänderte und bereits für den Commit vorgemerkte Dateien. Ein sauberer Arbeitsstand bedeutet, dass keine ungesicherten Änderungen vorliegen.
- **Nächster Schritt:** Das lokale Repository mit einem GitHub-Repository verbinden. Dafür brauchen wir zuerst einen GitHub-Account bzw. müssen prüfen, ob bereits einer vorhanden ist.

### 28.09.2026 – Lokales Repository mit GitHub verbunden

- **Umsetzung:** Das GitHub-Repository `JohannPongra/Gift-Swipe` wurde als Remote mit dem Namen `origin` eingetragen. `git remote -v` bestätigte die Fetch- und Push-Adresse.
- **Ergebnis:** `git push -u origin master` übertrug die bisherigen Commits erfolgreich zu GitHub. Der lokale Branch `master` verfolgt nun `origin/master`.
- **Verstanden:** Git kann lokal arbeiten, ohne online verbunden zu sein. `git push` überträgt lokale Commits; `-u` speichert die Standardverbindung für spätere Pushes. Die Browser-Anmeldung dient nur der Authentifizierung.
- **Nächster Schritt:** Einen ersten kleinen Web-App-Grundaufbau mit `index.html`, `style.css` und `app.js` planen und anschließend lokal testen.

### 28.09.2026 – Grundgerüst gelesen und Commit in VS Code vorbereitet

- **Vorhandener Code:** `index.html` enthält eine feste Geschenkekarte mit Titel, Preis, SVG-Platzhalter und Ja-/Nein-Buttons. `style.css` gestaltet die Seite für verschiedene Bildschirmgrößen. `app.js` registriert Klicks und gibt Entscheidungen in der Browser-Konsole aus.
- **Besprochen:** HTML beschreibt den Inhalt, CSS das Aussehen und JavaScript das Verhalten. `defer` verzögert die Skriptausführung bis nach dem Einlesen des HTML. `querySelector` findet Elemente; `addEventListener` reagiert auf Klicks.
- **Aktuelle Grenze:** Das Array `geschenkideen` wird bisher nur für die Anzahl in einer Konsolenmeldung verwendet. Karteninhalte und Fortschritt stehen fest im HTML. Entscheidungen werden noch nicht gespeichert.
- **Prüfstand:** Die drei Quelldateien wurden gelesen; ein erfolgreicher Browsertest ist noch nicht bestätigt. Alle drei Dateien waren beim Prüfen noch untracked.
- **Geplanter Git-Schritt:** Nach dem Browsertest die drei Quelldateien und diesen Lernprotokolleintrag in VS Code prüfen und stagen. Passende Commit-Message: `Add initial gift card layout and button handlers`. Commit und Push sind noch nicht bestätigt.

### 28.09.2026 – Grundgerüst getestet und gespeichert

- **Bestätigt:** Ich habe den Browsertest und den Commit erfolgreich durchgeführt. Die Buttons geben die erwarteten Entscheidungen in der Konsole aus.
- **Git-Prüfung:** Der aktuelle Commit ist `84d97c4` (`Add initial gift card layout and button handlers`). Das Arbeitsverzeichnis war vor diesem Protokolleintrag sauber.
- **Nächster kleiner Schritt:** In `app.js` Titel, Preis und Beschreibung aus dem ersten Array-Eintrag in die vorhandene HTML-Karte übertragen. Die Umsetzung und der Test dieses nächsten Schritts stehen noch aus.

### 28.09.2026 – Fehlersuche: Preis bleibt unverändert

- **Beobachtung:** Obwohl im JavaScript-Array `29,99 €` gespeichert ist, zeigt die Seite weiterhin `39,99 €` aus dem HTML.
- **Gefundene Ursache:** Die Selektoren `#titel`, `#preis` und `#beschreibung` passen nicht zum HTML. Dort gibt es die ID `geschenk-titel` und die Klassen `preis` sowie `beschreibung`.
- **Erklärung:** `querySelector` liefert bei fehlendem Treffer `null`. Der Zugriff auf `titelElement.textContent` bricht deshalb die laufende Skriptausführung ab, bevor der Preis aktualisiert wird.
- **Vorgeschlagene Korrektur:** Die Selektoren in `app.js` auf `#geschenk-titel`, `.preis` und `.beschreibung` ändern. `#` steht für eine ID, `.` für eine Klasse.
- **Prüfstand:** Ursache anhand der gespeicherten Dateien festgestellt. Korrektur und erneuter Browsertest stehen noch aus; noch kein Commit für diesen Schritt.

### 28.09.2026 – Sichtbares Ergebnis und tatsächliche Funktion unterscheiden

- **Beobachtung:** Die Karte zeigt jetzt `29,99 €`; allerdings wurden Preis und Beschreibung auch direkt im HTML geändert.
- **Codeprüfung:** `.preis` und `.beschreibung` passen inzwischen zum HTML. Der Titel-Selektor lautet noch `#titel`, obwohl die HTML-ID weiterhin `geschenk-titel` ist. Damit besteht die Fehlerursache beim Titel noch.
- **Lernpunkt:** Ein erwarteter sichtbarer Text allein beweist nicht, dass JavaScript funktioniert, wenn derselbe Text bereits im HTML steht.
- **Nächster Test:** Titel-Selektor korrigieren, ausschließlich im JavaScript einen anderen Preis setzen und nach dem Neuladen sowohl den sichtbaren Preis als auch die Klickmeldungen prüfen. Ergebnis noch offen.

### 28.09.2026 – Dynamische Kartentexte erfolgreich getestet

- **Bestätigtes Testergebnis:** Nach der Korrektur des Titel-Selektors wird der ausschließlich in JavaScript geänderte Preis auf der Karte angezeigt. Der Test einschließlich der Klickmeldungen wurde als erfolgreich zurückgemeldet.
- **Codeprüfung:** `#geschenk-titel`, `.preis` und `.beschreibung` stimmen jetzt mit dem HTML überein. `zeigeGeschenkidee(0)` überträgt die Daten des ersten Array-Eintrags in die Karte.
- **Vor dem Commit:** Testtexte in Titel und Beschreibung bereinigen, anschließend `app.js`, `index.html` und dieses Lerntagebuch in VS Code prüfen und stagen.
- **Vorgeschlagene Commit-Message:** `Render gift card text from JavaScript data`. Der Commit ist noch nicht bestätigt.

### 28.09.2026 – Array-Index verstanden und dynamische Texte committed

- **Eigene Erklärung:** Index `0` steuert die erste Geschenkidee im Array an. Damit wurde die Verständnisfrage richtig beantwortet.
- **Bestätigter Commit:** `49ea5d9` mit der Nachricht `Render gift card text from JavaScript data`. Das Arbeitsverzeichnis war vor diesem Eintrag sauber.
- **Nächster kleiner Schritt:** Eine zweite Geschenkidee ergänzen und mit `zeigeGeschenkidee(1)` gezielt anzeigen. Danach folgen Kartenwechsel per Button und dynamischer Fortschritt. Umsetzung und Test stehen noch aus.

## Vorlage für weitere Einträge

### Datum – Schritt / Thema

- **Ziel:** Was wollte ich erreichen?
- **Umsetzung:** Was habe ich selbst gemacht? Welche Dateien waren betroffen?
- **Ergebnis und Prüfung:** Was funktioniert, und wie habe ich es überprüft?
- **Verstanden:** Welche neuen Konzepte kann ich in eigenen Worten erklären?
- **Fehler und Lösungsweg:** Was ging schief, und wie habe ich die Ursache gefunden?
- **Git-Schritt:** Ist ein Commit sinnvoll und warum? Welche Dateien prüfe und stage ich? Welche Commit-Message passt? Wurde tatsächlich committed oder gepusht?
- **Verständnisfragen:** Welche Fragen habe ich beantwortet, und wo bin ich noch unsicher?
- **Offene Fragen / nächster Schritt:** Was kommt als Nächstes?
