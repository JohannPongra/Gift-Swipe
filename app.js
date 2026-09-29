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
const bildElement = document.querySelector('.bildplatzhalter');
const fortschrittElement = document.querySelector('.fortschritt');
const abschlussElement = document.querySelector('#abschlussmeldung');
const statusElement = document.querySelector('#statusmeldung');

let aktuelleIndex = 0;
const entscheidungen = [];
let pointerStartX = 0;
let pointerStartY = 0;
let istGezogen = false;
let istVerarbeitung = false;

function zeigeGeschenkidee(index) {
    const karte = karten[index];

    kartenLabelElement.textContent = aktuellePhase === 'kategorien'
        ? 'Kategorie'
        : 'Geschenkidee';
    titelElement.textContent = karte.titel;
    beschreibungElement.textContent = karte.beschreibung || '';
    if (karte.bildUrl) {
        bildElement.src = karte.bildUrl;
    }
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

function zeigeAbschluss(nachricht) {
    geschenkkarte.hidden = true;
    fortschrittElement.hidden = true;
    abschlussElement.hidden = false;
    abschlussElement.textContent = nachricht || `Danke! ${entscheidungen.length} Geschenkideen wurden bewertet.`;
}

async function verarbeiteEntscheidung(entscheidung) {
    if (istVerarbeitung || aktuelleIndex >= karten.length) {
        return;
    }

    istVerarbeitung = true;
    setzeButtonsAktiv(false);
    setzeStatus('Entscheidung wird gespeichert ...');

    const karte = karten[aktuelleIndex];

    try {
        if (aktuellePhase === 'kategorien') {
            await window.giftSwipeApi.speichereKategorieEntscheidung(karte.id, entscheidung);
        } else {
            await window.giftSwipeApi.speichereEntscheidung(karte.id, entscheidung);
        }
    } catch (fehler) {
        istVerarbeitung = false;
        setzeButtonsAktiv(true);
        const fehlertext = [
            fehler.message,
            fehler.details,
            fehler.hint,
            fehler.code
        ].filter(Boolean).join(' | ') || 'Unbekannter Supabase-Fehler';
        setzeStatus(`Speichern fehlgeschlagen: ${fehlertext}`);
        console.error(fehler);
        return;
    }

    entscheidungen.push({
        titel: karte.titel,
        entscheidung
    });
    aktuelleIndex += 1;

    if (aktuellePhase === 'kategorien' && aktuelleIndex === karten.length) {
        setzeStatus('Passende Geschenkideen werden geladen ...');

        try {
            geschenkideen = await window.giftSwipeApi.ladeGeschenkideen();
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

    geschenkkarte.style.transform = `translateX(${horizontaleDistanz}px) rotate(${horizontaleDistanz / 18}deg)`;
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
        geschenkkarte.style.transform = '';
        return;
    }

    istVerarbeitung = true;
    geschenkkarte.classList.add(
        horizontaleDistanz > 0 ? 'swipe-rechts' : 'swipe-links'
    );
    window.setTimeout(function () {
        geschenkkarte.classList.remove('swipe-rechts', 'swipe-links');
        geschenkkarte.style.transform = '';
        verarbeiteEntscheidung(horizontaleDistanz > 0 ? 'Ja' : 'Nein');
    }, 220);
});

geschenkkarte.addEventListener('pointercancel', function () {
    istGezogen = false;
    geschenkkarte.classList.remove('wird-gezogen');
    geschenkkarte.style.transform = '';
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
            : await window.giftSwipeApi.ladeGeschenkideen();

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
