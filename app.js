let geschenkideen = [];

const geschenkkarte = document.querySelector('.geschenkekarte');
const neinButton = document.querySelector('#nein-button');
const jaButton = document.querySelector('#ja-button');
const titelElement = document.querySelector('#geschenk-titel');
const preisElement = document.querySelector('.preis');
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
    const geschenkidee = geschenkideen[index];

    titelElement.textContent = geschenkidee.titel;
    preisElement.textContent = geschenkidee.preis;
    beschreibungElement.textContent = geschenkidee.beschreibung;
    if (geschenkidee.bildUrl) {
        bildElement.src = geschenkidee.bildUrl;
    }
    bildElement.alt = geschenkidee.bildAlt;
    fortschrittElement.textContent = `${index + 1} / ${geschenkideen.length}`;
    fortschrittElement.setAttribute(
        'aria-label',
        `Fortschritt: Geschenk ${index + 1} von ${geschenkideen.length}`
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

function zeigeAbschluss() {
    geschenkkarte.hidden = true;
    fortschrittElement.hidden = true;
    abschlussElement.hidden = false;
    abschlussElement.textContent = `Danke! ${entscheidungen.length} Geschenkideen wurden bewertet.`;
}

async function verarbeiteEntscheidung(entscheidung) {
    if (istVerarbeitung || aktuelleIndex >= geschenkideen.length) {
        return;
    }

    istVerarbeitung = true;
    setzeButtonsAktiv(false);
    setzeStatus('Entscheidung wird gespeichert ...');

    const geschenkidee = geschenkideen[aktuelleIndex];

    try {
        await window.giftSwipeApi.speichereEntscheidung(geschenkidee.id, entscheidung);
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
        geschenkidee: geschenkidee.titel,
        entscheidung
    });
    aktuelleIndex += 1;
    istVerarbeitung = false;
    setzeButtonsAktiv(true);
    setzeStatus('');

    if (aktuelleIndex === geschenkideen.length) {
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
        !geschenkideen.length ||
        aktuelleIndex >= geschenkideen.length ||
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
        geschenkideen = await window.giftSwipeApi.ladeGeschenkideen();

        if (!geschenkideen.length) {
            throw new Error('KEINE_GESCHENKIDEEN');
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
