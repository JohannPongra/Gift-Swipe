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
