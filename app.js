let geschenkideen = [];
let karten = [];
let kategorieModus = false;
let aktuellePhase = 'produkte';

const geschenkkarte = document.querySelector('.geschenkekarte');
const neinButton = document.querySelector('#nein-button');
const jaButton = document.querySelector('#ja-button');
const kartenLabelElement = document.querySelector('.karten-label');
const titelElement = document.querySelector('#geschenk-titel');
const beschreibungElement = document.querySelector('.beschreibung');
const produktLinkElement = document.querySelector('#produkt-link');
const bildgalerie = document.querySelector('.bildgalerie');
const bildElement = document.querySelector('.bildplatzhalter');
const bildZurueckButton = document.querySelector('#bild-zurueck');
const bildVorButton = document.querySelector('#bild-vor');
const bildzaehlerElement = document.querySelector('#bildzaehler');
const fortschrittElement = document.querySelector('.fortschritt');
const abschlussElement = document.querySelector('#abschlussmeldung');
const weiterButton = document.querySelector('#weiter-button');
const statusElement = document.querySelector('#statusmeldung');
const seitenElement = document.body;

let aktuelleIndex = 0;
let produktRunde = 1;
const entscheidungen = [];
const ausstehendeSpeicherungen = new Set();
let speicherfehlerAufgetreten = false;
let pointerStartX = 0;
let pointerStartY = 0;
let istGezogen = false;
let istVerarbeitung = false;
let aktuelleBildUrls = [];
let aktuellesBildIndex = 0;

function mischeKarten(kartenListe) {
    const gemischteKarten = [...kartenListe];

    for (let index = gemischteKarten.length - 1; index > 0; index -= 1) {
        const zufallsIndex = Math.floor(Math.random() * (index + 1));
        [gemischteKarten[index], gemischteKarten[zufallsIndex]] = [
            gemischteKarten[zufallsIndex],
            gemischteKarten[index]
        ];
    }

    return gemischteKarten;
}

function aktualisiereBild() {
    bildgalerie.classList.remove(
        'galerie-mehrfach',
        'einzelbild-hochformat',
        'einzelbild-querformat',
        'einzelbild-quadratisch'
    );
    if (aktuelleBildUrls.length > 1) {
        bildgalerie.classList.add('galerie-mehrfach');
    }

    bildElement.onload = function () {
        if (aktuelleBildUrls.length > 1) {
            return;
        }
        const seitenverhaeltnis = bildElement.naturalWidth / bildElement.naturalHeight;
        bildgalerie.classList.add(
            seitenverhaeltnis < 0.85
                ? 'einzelbild-hochformat'
                : seitenverhaeltnis > 1.2
                    ? 'einzelbild-querformat'
                    : 'einzelbild-quadratisch'
        );
    };

    if (aktuelleBildUrls[aktuellesBildIndex]) {
        bildElement.src = aktuelleBildUrls[aktuellesBildIndex];
    }
    const hatGalerie = aktuelleBildUrls.length > 1;
    bildZurueckButton.hidden = !hatGalerie;
    bildVorButton.hidden = !hatGalerie;
    bildzaehlerElement.hidden = !hatGalerie;
    bildzaehlerElement.textContent = hatGalerie
        ? `${aktuellesBildIndex + 1} / ${aktuelleBildUrls.length}`
        : '';
}

function zeigeGeschenkidee(index) {
    const karte = karten[index];

    kartenLabelElement.textContent = aktuellePhase === 'kategorien'
        ? 'Kategorie'
        : 'Geschenkidee';
    titelElement.textContent = karte.titel;
    beschreibungElement.textContent = karte.beschreibung || '';
    produktLinkElement.hidden = !karte.produktUrl;
    produktLinkElement.href = karte.produktUrl || '#';
    aktuelleBildUrls = karte.bildUrls?.length
        ? karte.bildUrls
        : (karte.bildUrl ? [karte.bildUrl] : []);
    aktuellesBildIndex = 0;
    aktualisiereBild();
    bildElement.alt = karte.bildAlt;
    fortschrittElement.textContent = `${index + 1} / ${karten.length}`;
    fortschrittElement.setAttribute(
        'aria-label',
        `Fortschritt: ${aktuellePhase === 'kategorien' ? 'Kategorie' : 'Geschenkidee'} ${index + 1} von ${karten.length}`
    );
}

function setzeStatus(nachricht) {
    statusElement.textContent = nachricht;
    statusElement.hidden = !nachricht;
}

function setzeButtonsAktiv(aktiv) {
    neinButton.disabled = !aktiv;
    jaButton.disabled = !aktiv;
}

function setzeSwipeVorschau(richtung) {
    seitenElement.classList.toggle('swipe-vorschau-ja', richtung === 'ja');
    seitenElement.classList.toggle('swipe-vorschau-nein', richtung === 'nein');
}

function zeigeAbschluss(nachricht) {
    geschenkkarte.hidden = true;
    fortschrittElement.hidden = true;
    weiterButton.hidden = true;
    weiterButton.disabled = false;
    abschlussElement.hidden = false;
    abschlussElement.textContent = nachricht || `Danke! ${entscheidungen.length} Geschenkideen wurden bewertet.`;
}

function zeigeWeiterentscheidung() {
    geschenkkarte.hidden = true;
    fortschrittElement.hidden = true;
    abschlussElement.hidden = false;
    abschlussElement.textContent = `Runde ${produktRunde} ist abgeschlossen. Möchtest du deine Ja-Auswahl noch einmal ansehen?`;
    weiterButton.hidden = false;
    weiterButton.disabled = false;
}

function speichereEntscheidungImHintergrund(karte, entscheidung) {
    const speicherung = (async function () {
        try {
            if (aktuellePhase === 'kategorien') {
                await window.giftSwipeApi.speichereKategorieEntscheidung(karte.id, entscheidung);
            } else {
                await window.giftSwipeApi.speichereEntscheidung(karte.id, entscheidung);
            }
        } catch (fehler) {
            speicherfehlerAufgetreten = true;
            setzeStatus('Eine Entscheidung konnte nicht gespeichert werden.');
            console.error(fehler);
        }
    })();

    ausstehendeSpeicherungen.add(speicherung);
    speicherung.finally(function () {
        ausstehendeSpeicherungen.delete(speicherung);
    });
}

async function warteAufSpeicherungen() {
    if (ausstehendeSpeicherungen.size) {
        setzeStatus('Entscheidungen werden abgeschlossen ...');
        await Promise.all(ausstehendeSpeicherungen);
    }

    return !speicherfehlerAufgetreten;
}

async function starteNaechsteProduktRunde() {
    weiterButton.disabled = true;
    const speicherungenErfolgreich = await warteAufSpeicherungen();
    if (!speicherungenErfolgreich) {
        zeigeAbschluss('Mindestens eine Entscheidung konnte nicht gespeichert werden.');
        return;
    }

    const vorherigeRunde = produktRunde;
    karten = karten.filter(function (karte) {
        return entscheidungen.some(function (entscheidung) {
            return entscheidung.phase === 'produkte'
                && entscheidung.runde === vorherigeRunde
                && entscheidung.id === karte.id
                && entscheidung.entscheidung === 'Ja';
        });
    });
    produktRunde += 1;
    aktuelleIndex = 0;
    abschlussElement.hidden = true;
    weiterButton.hidden = true;
    geschenkkarte.hidden = false;
    fortschrittElement.hidden = false;
    setzeButtonsAktiv(true);
    zeigeGeschenkidee(aktuelleIndex);
}

async function verarbeiteEntscheidung(entscheidung) {
    if (istVerarbeitung || aktuelleIndex >= karten.length) {
        return;
    }

    istVerarbeitung = true;
    setzeButtonsAktiv(false);

    const karte = karten[aktuelleIndex];
    speichereEntscheidungImHintergrund(karte, entscheidung);

    entscheidungen.push({
        id: karte.id,
        titel: karte.titel,
        entscheidung,
        phase: aktuellePhase,
        runde: aktuellePhase === 'produkte' ? produktRunde : 0
    });
    aktuelleIndex += 1;

    if (aktuellePhase === 'kategorien' && aktuelleIndex === karten.length) {
        const speicherungenErfolgreich = await warteAufSpeicherungen();
        if (!speicherungenErfolgreich) {
            zeigeAbschluss('Mindestens eine Entscheidung konnte nicht gespeichert werden.');
            return;
        }

        setzeStatus('Passende Geschenkideen werden geladen ...');

        try {
            geschenkideen = mischeKarten(await window.giftSwipeApi.ladeGeschenkideen());
        } catch (fehler) {
            zeigeAbschluss('Die passenden Geschenkideen konnten nicht geladen werden.');
            console.error(fehler);
            return;
        }

        if (!geschenkideen.length) {
            zeigeAbschluss('Für deine Auswahl wurden keine passenden Geschenkideen gefunden.');
            return;
        }

        aktuellePhase = 'produkte';
        karten = geschenkideen;
        aktuelleIndex = 0;
        istVerarbeitung = false;
        setzeButtonsAktiv(true);
        setzeStatus('');
        zeigeGeschenkidee(aktuelleIndex);
        return;
    }

    istVerarbeitung = false;
    setzeButtonsAktiv(true);
    setzeStatus('');

    if (aktuelleIndex === karten.length) {
        const speicherungenErfolgreich = await warteAufSpeicherungen();
        if (!speicherungenErfolgreich) {
            zeigeAbschluss('Mindestens eine Entscheidung konnte nicht gespeichert werden.');
            return;
        }

        if (aktuellePhase === 'produkte' && produktRunde < 3) {
            const gibtJaAuswahl = entscheidungen.some(function (eintrag) {
                return eintrag.phase === 'produkte'
                    && eintrag.runde === produktRunde
                    && eintrag.entscheidung === 'Ja';
            });

            if (gibtJaAuswahl) {
                zeigeWeiterentscheidung();
                return;
            }
        }

        zeigeAbschluss();
        return;
    }

    zeigeGeschenkidee(aktuelleIndex);
}

neinButton.addEventListener('click', function () {
    verarbeiteEntscheidung('Nein');
});

jaButton.addEventListener('click', function () {
    verarbeiteEntscheidung('Ja');
});

weiterButton.addEventListener('click', starteNaechsteProduktRunde);

bildZurueckButton.addEventListener('click', function () {
    aktuellesBildIndex = (aktuellesBildIndex - 1 + aktuelleBildUrls.length) % aktuelleBildUrls.length;
    aktualisiereBild();
});

bildVorButton.addEventListener('click', function () {
    aktuellesBildIndex = (aktuellesBildIndex + 1) % aktuelleBildUrls.length;
    aktualisiereBild();
});

geschenkkarte.addEventListener('pointerdown', function (ereignis) {
    if (
        istVerarbeitung ||
        !karten.length ||
        aktuelleIndex >= karten.length ||
        ereignis.target.closest('button')
    ) {
        return;
    }

    pointerStartX = ereignis.clientX;
    pointerStartY = ereignis.clientY;
    istGezogen = true;
    geschenkkarte.classList.add('wird-gezogen');
    geschenkkarte.setPointerCapture(ereignis.pointerId);
});

geschenkkarte.addEventListener('pointermove', function (ereignis) {
    if (!istGezogen || istVerarbeitung) {
        return;
    }

    const horizontaleDistanz = ereignis.clientX - pointerStartX;
    const vertikaleDistanz = ereignis.clientY - pointerStartY;

    if (Math.abs(horizontaleDistanz) < Math.abs(vertikaleDistanz)) {
        return;
    }

    setzeSwipeVorschau(horizontaleDistanz > 0 ? 'ja' : 'nein');
    const begrenzteDistanz = Math.max(-geschenkkarte.offsetWidth, Math.min(geschenkkarte.offsetWidth, horizontaleDistanz));
    geschenkkarte.style.transform = `translateX(${begrenzteDistanz}px) rotate(${begrenzteDistanz / 22}deg)`;
    geschenkkarte.style.opacity = `${1 - Math.min(0.22, Math.abs(begrenzteDistanz) / geschenkkarte.offsetWidth * 0.22)}`;
});

geschenkkarte.addEventListener('pointerup', function (ereignis) {
    if (!istGezogen || istVerarbeitung) {
        return;
    }

    const horizontaleDistanz = ereignis.clientX - pointerStartX;
    const swipeGrenze = Math.min(140, geschenkkarte.offsetWidth * 0.3);
    istGezogen = false;
    geschenkkarte.classList.remove('wird-gezogen');

    if (Math.abs(horizontaleDistanz) < swipeGrenze) {
        setzeSwipeVorschau('');
        window.requestAnimationFrame(function () {
            geschenkkarte.style.transform = '';
            geschenkkarte.style.opacity = '';
        });
        return;
    }

    istVerarbeitung = true;
    const swipeRichtung = horizontaleDistanz > 0 ? 'ja' : 'nein';
    geschenkkarte.style.transform = '';
    geschenkkarte.style.opacity = '';
    setzeSwipeVorschau(swipeRichtung);
    geschenkkarte.classList.add(
        swipeRichtung === 'ja' ? 'swipe-rechts' : 'swipe-links'
    );
    window.setTimeout(function () {
        geschenkkarte.classList.remove('swipe-rechts', 'swipe-links');
        setzeSwipeVorschau('');
        geschenkkarte.style.transform = '';
        istVerarbeitung = false;
        verarbeiteEntscheidung(horizontaleDistanz > 0 ? 'Ja' : 'Nein');
    }, 220);
});

geschenkkarte.addEventListener('pointercancel', function () {
    istGezogen = false;
    geschenkkarte.classList.remove('wird-gezogen');
    setzeSwipeVorschau('');
    geschenkkarte.style.transform = '';
    geschenkkarte.style.opacity = '';
});

async function initialisiereApp() {
    setzeButtonsAktiv(false);
    setzeStatus('Geschenkideen werden geladen ...');

    try {
        const session = await window.giftSwipeApi.ladeSessionKonfiguration();
        kategorieModus = session.modus === 'categories';
        aktuellePhase = kategorieModus ? 'kategorien' : 'produkte';
        karten = kategorieModus
            ? await window.giftSwipeApi.ladeKategorien()
            : mischeKarten(await window.giftSwipeApi.ladeGeschenkideen());

        if (!karten.length) {
            throw new Error('KEINE_KARTEN');
        }

        setzeButtonsAktiv(true);
        setzeStatus('');
        zeigeGeschenkidee(aktuelleIndex);
    } catch (fehler) {
        geschenkkarte.hidden = true;
        fortschrittElement.hidden = true;
        setzeStatus(
            fehler.message === 'SESSION_TOKEN_FEHLT'
                ? 'Bitte öffne deinen persönlichen GiftSwipe-Link.'
                : 'Die Geschenkideen konnten nicht geladen werden. Prüfe die Supabase-Konfiguration.'
        );
        console.error(fehler);
    }
}

initialisiereApp();
