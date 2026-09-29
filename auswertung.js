const loginBereich = document.querySelector('#loginbereich');
const loginForm = document.querySelector('#login-form');
const dashboard = document.querySelector('#dashboard');
const abmeldenButton = document.querySelector('#abmelden-button');
const seitenstatus = document.querySelector('#seitenstatus');
const statusElement = document.querySelector('#statusmeldung');
const entscheidungenListe = document.querySelector('#entscheidungen-liste');
const gesamtzahl = document.querySelector('#gesamtzahl');
const jazahl = document.querySelector('#jazahl');
const neinzahl = document.querySelector('#neinzahl');

function zeigeStatus(element, nachricht) {
    element.textContent = nachricht;
    element.hidden = !nachricht;
}

function getClient() {
    return window.giftSwipeSupabaseClient;
}

function formatiereZeitpunkt(zeitpunkt) {
    return new Intl.DateTimeFormat('de-DE', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(zeitpunkt));
}

function zeigeEntscheidungen(entscheidungen) {
    const jaEntscheidungen = entscheidungen.filter(function (eintrag) {
        return eintrag.choice === 'Ja';
    });
    const neinEntscheidungen = entscheidungen.filter(function (eintrag) {
        return eintrag.choice === 'Nein';
    });

    gesamtzahl.textContent = entscheidungen.length;
    jazahl.textContent = jaEntscheidungen.length;
    neinzahl.textContent = neinEntscheidungen.length;
    entscheidungenListe.replaceChildren();

    entscheidungen.forEach(function (eintrag) {
        const zeile = document.createElement('tr');
        const idee = eintrag.gift_ideas;
        const titelZelle = document.createElement('td');
        const preisZelle = document.createElement('td');
        const entscheidungZelle = document.createElement('td');
        const zeitpunktZelle = document.createElement('td');
        const entscheidungMarkierung = document.createElement('span');

        titelZelle.textContent = idee?.title || 'Unbekannte Geschenkidee';
        preisZelle.textContent = idee?.price || '-';
        entscheidungMarkierung.className = eintrag.choice === 'Ja'
            ? 'entscheidung ja'
            : 'entscheidung nein';
        entscheidungMarkierung.textContent = eintrag.choice;
        entscheidungZelle.append(entscheidungMarkierung);
        zeitpunktZelle.textContent = formatiereZeitpunkt(eintrag.created_at);

        zeile.append(titelZelle, preisZelle, entscheidungZelle, zeitpunktZelle);
        entscheidungenListe.append(zeile);
    });

    if (!entscheidungen.length) {
        zeigeStatus(statusElement, 'Bisher wurden noch keine Entscheidungen gespeichert.');
    } else {
        zeigeStatus(statusElement, '');
    }
}

async function ladeAuswertung() {
    const client = getClient();
    if (!client) {
        throw new Error('Supabase ist nicht konfiguriert.');
    }

    zeigeStatus(statusElement, 'Auswertung wird geladen ...');
    const { data, error } = await client
        .from('decisions')
        .select('id, choice, created_at, gift_ideas(title, price, product_url)')
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    zeigeEntscheidungen(data);
}

async function zeigeDashboard() {
    loginBereich.hidden = true;
    dashboard.hidden = false;
    zeigeStatus(seitenstatus, '');

    try {
        await ladeAuswertung();
    } catch (fehler) {
        zeigeStatus(seitenstatus, `Die Auswertung konnte nicht geladen werden: ${fehler.message}`);
        console.error(fehler);
    }
}

loginForm.addEventListener('submit', async function (ereignis) {
    ereignis.preventDefault();
    const client = getClient();

    if (!client) {
        zeigeStatus(seitenstatus, 'Supabase ist nicht konfiguriert.');
        return;
    }

    const email = new FormData(loginForm).get('email');
    const passwort = new FormData(loginForm).get('passwort');
    const button = loginForm.querySelector('button');
    button.disabled = true;
    zeigeStatus(seitenstatus, 'Login wird geprüft ...');

    const { error } = await client.auth.signInWithPassword({ email, password: passwort });
    button.disabled = false;

    if (error) {
        zeigeStatus(seitenstatus, 'Login fehlgeschlagen. Bitte Zugangsdaten prüfen.');
        return;
    }

    await zeigeDashboard();
});

abmeldenButton.addEventListener('click', async function () {
    await getClient().auth.signOut();
    dashboard.hidden = true;
    loginBereich.hidden = false;
    loginForm.reset();
    zeigeStatus(seitenstatus, '');
});

async function initialisiereAuswertung() {
    const client = getClient();
    if (!client) {
        zeigeStatus(seitenstatus, 'Supabase ist nicht konfiguriert.');
        return;
    }

    const { data } = await client.auth.getSession();
    if (data.session) {
        await zeigeDashboard();
    }
}

initialisiereAuswertung();
