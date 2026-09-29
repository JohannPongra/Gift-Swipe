const loginBereich = document.querySelector('#loginbereich');
const loginForm = document.querySelector('#login-form');
const dashboard = document.querySelector('#admin-dashboard');
const abmeldenButton = document.querySelector('#abmelden-button');
const seitenstatus = document.querySelector('#seitenstatus');
const statusElement = document.querySelector('#statusmeldung');
const ideenForm = document.querySelector('#ideen-form');
const kategorienForm = document.querySelector('#kategorien-form');
const sessionForm = document.querySelector('#session-form');
const kategorienAuswahl = document.querySelector('#kategorien-auswahl');
const kategorienListe = document.querySelector('#kategorien-liste');
const ideenListe = document.querySelector('#ideen-liste');
const alleIdeenCheckbox = document.querySelector('#ideen-alle-auswaehlen');
const mehrereIdeenLoeschenButton = document.querySelector('#ideen-mehrere-loeschen');
const bildDateiInput = document.querySelector('#ideen-bild');
const bildvorschau = document.querySelector('#ideen-bildvorschau');
const bildvorschauGalerie = document.querySelector('#ideen-bildvorschau-galerie');
const produktUrlInput = document.querySelector('#ideen-link');
const metadatenLadenButton = document.querySelector('#metadaten-laden-button');
const linkErgebnis = document.querySelector('#link-ergebnis');
const teilnehmerLink = document.querySelector('#teilnehmer-link');
const linkKopieren = document.querySelector('#link-kopieren');
let importierteBildUrls = [];

function zeigeStatus(element, nachricht) {
    element.textContent = nachricht;
    element.hidden = !nachricht;
}

function getClient() {
    return window.giftSwipeSupabaseClient;
}

function leseDatei(formData, feldname) {
    const datei = formData.get(feldname);
    return datei && datei.size ? datei : null;
}

function zeigeBildvorschau(url) {
    const urls = Array.isArray(url) ? url : (url ? [url] : []);
    bildvorschauGalerie.replaceChildren();

    if (!urls.length) {
        bildvorschau.hidden = true;
        return;
    }

    urls.forEach(function (url) {
        const bild = document.createElement('img');
        bild.alt = 'Vorschau der Geschenkidee';
        bild.src = url;
        bild.onerror = function () {
            bild.remove();
        };
        bildvorschauGalerie.append(bild);
    });
    bildvorschau.hidden = false;
}

function normalisiereBild(datei) {
    return new Promise(function (resolve, reject) {
        const bild = new Image();
        const objektUrl = URL.createObjectURL(datei);

        bild.onload = function () {
            URL.revokeObjectURL(objektUrl);
            const zielBreite = 1200;
            const zielHoehe = 900;
            const zielSeitenverhaeltnis = zielBreite / zielHoehe;
            const bildSeitenverhaeltnis = bild.naturalWidth / bild.naturalHeight;
            let quellBreite = bild.naturalWidth;
            let quellHoehe = bild.naturalHeight;
            let quellX = 0;
            let quellY = 0;

            if (bildSeitenverhaeltnis > zielSeitenverhaeltnis) {
                quellBreite = bild.naturalHeight * zielSeitenverhaeltnis;
                quellX = (bild.naturalWidth - quellBreite) / 2;
            } else {
                quellHoehe = bild.naturalWidth / zielSeitenverhaeltnis;
                quellY = (bild.naturalHeight - quellHoehe) / 2;
            }

            const canvas = document.createElement('canvas');
            canvas.width = zielBreite;
            canvas.height = zielHoehe;
            const context = canvas.getContext('2d');
            context.drawImage(
                bild,
                quellX,
                quellY,
                quellBreite,
                quellHoehe,
                0,
                0,
                zielBreite,
                zielHoehe
            );
            canvas.toBlob(function (blob) {
                if (!blob) {
                    reject(new Error('Das Bild konnte nicht optimiert werden.'));
                    return;
                }
                resolve(blob);
            }, 'image/webp', 0.82);
        };

        bild.onerror = function () {
            URL.revokeObjectURL(objektUrl);
            reject(new Error('Das Bild konnte nicht gelesen werden.'));
        };
        bild.src = objektUrl;
    });
}

async function ladeBildUrl(datei) {
    if (!datei) {
        return null;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(datei.type)) {
        throw new Error('Bitte nur JPG-, PNG- oder WebP-Bilder verwenden.');
    }

    if (datei.size > 5 * 1024 * 1024) {
        throw new Error('Das Bild darf höchstens 5 MB groß sein.');
    }

    const optimiertesBild = await normalisiereBild(datei);
    const dateiname = `${crypto.randomUUID()}.webp`;
    const client = getClient();
    const { error } = await client.storage.from('gift-images').upload(dateiname, optimiertesBild, {
        contentType: 'image/webp',
        upsert: false
    });

    if (error) {
        throw error;
    }

    const { data } = client.storage.from('gift-images').getPublicUrl(dateiname);
    return data.publicUrl;
}

bildDateiInput.addEventListener('change', function () {
    const datei = bildDateiInput.files[0];
    if (datei) {
        importierteBildUrls = [];
        zeigeBildvorschau(URL.createObjectURL(datei));
    }
});

produktUrlInput.addEventListener('input', function () {
    importierteBildUrls = [];
    bildDateiInput.value = '';
    zeigeBildvorschau('');
});

metadatenLadenButton.addEventListener('click', async function () {
    const url = produktUrlInput.value.trim();

    if (!url) {
        zeigeStatus(statusElement, 'Bitte zuerst eine Produktseiten-URL eingeben.');
        return;
    }

    metadatenLadenButton.disabled = true;
    zeigeStatus(statusElement, 'Produktdaten werden geladen ...');

    try {
        const { data, error } = await getClient().functions.invoke('fetch-product-metadata', {
            body: { url }
        });

        if (error) {
            throw error;
        }

        if (data.title) {
            document.querySelector('#ideen-titel-input').value = data.title;
        }
        if (data.description) {
            document.querySelector('#ideen-beschreibung').value = data.description;
        }
        importierteBildUrls = data.imageUrls || (data.imageUrl ? [data.imageUrl] : []);
        zeigeBildvorschau(importierteBildUrls);
        zeigeStatus(
            statusElement,
            importierteBildUrls.length
                ? `${importierteBildUrls.length} Produktbilder wurden als Vorschlag geladen.`
                : 'Produktdaten wurden geladen; für das Bild bitte eine Datei auswählen.'
        );
    } catch (fehler) {
        zeigeStatus(statusElement, `Produktdaten konnten nicht geladen werden: ${fehler.message}`);
    } finally {
        metadatenLadenButton.disabled = false;
    }
});

function renderCheckboxen(kategorien) {
    kategorienAuswahl.replaceChildren();

    if (!kategorien.length) {
        const hinweis = document.createElement('p');
        hinweis.textContent = 'Lege zuerst eine Kategorie an.';
        kategorienAuswahl.append(hinweis);
        return;
    }

    kategorien.forEach(function (kategorie) {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'categoryIds';
        checkbox.value = kategorie.id;
        label.className = 'checkbox-option';
        label.append(checkbox, document.createTextNode(kategorie.title));
        kategorienAuswahl.append(label);
    });
}

function renderListe(container, eintraege, istKategorie) {
    container.replaceChildren();

    if (!eintraege.length) {
        const hinweis = document.createElement('p');
        hinweis.textContent = istKategorie ? 'Noch keine Kategorien vorhanden.' : 'Noch keine Geschenkideen vorhanden.';
        container.append(hinweis);
        return;
    }

    eintraege.forEach(function (eintrag) {
        const element = document.createElement('div');
        const bild = document.createElement('img');
        const text = document.createElement('div');
        const titel = document.createElement('strong');
        const beschreibung = document.createElement('span');
        const loeschenButton = document.createElement('button');

        element.className = 'eintrag';
        bild.src = eintrag.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23dce8e5"/%3E%3C/svg%3E';
        bild.alt = eintrag.title;
        titel.textContent = eintrag.title;
        beschreibung.textContent = eintrag.description || 'Keine Beschreibung';
        text.className = 'eintrag-text';
        if (!istKategorie) {
            const auswahl = document.createElement('input');
            auswahl.className = 'ideen-auswahl';
            auswahl.type = 'checkbox';
            auswahl.value = eintrag.id;
            auswahl.setAttribute('aria-label', `${eintrag.title} auswählen`);
            element.append(auswahl);
        }
        text.append(titel, beschreibung);
        element.append(bild, text);
        if (!istKategorie) {
            loeschenButton.className = 'loeschen-button';
            loeschenButton.type = 'button';
            loeschenButton.textContent = 'Löschen';
            loeschenButton.dataset.id = eintrag.id;
            loeschenButton.dataset.titel = eintrag.title;
            element.append(loeschenButton);
        }
        container.append(element);
    });
}

async function loescheGeschenkidee(id, titel) {
    if (!window.confirm(`Geschenkidee „${titel}“ wirklich löschen?`)) {
        return;
    }

    zeigeStatus(statusElement, 'Geschenkidee wird gelöscht ...');
    const { error } = await getClient().from('gift_ideas').delete().eq('id', id);

    if (error) {
        zeigeStatus(statusElement, `Geschenkidee konnte nicht gelöscht werden: ${error.message}`);
        return;
    }

    await ladeInhalte();
    zeigeStatus(statusElement, 'Geschenkidee wurde gelöscht.');
}

function aktualisiereMehrfachLoeschen() {
    const ausgewaehlte = ideenListe.querySelectorAll('.ideen-auswahl:checked');
    mehrereIdeenLoeschenButton.disabled = ausgewaehlte.length === 0;
    alleIdeenCheckbox.checked = ausgewaehlte.length > 0 &&
        ausgewaehlte.length === ideenListe.querySelectorAll('.ideen-auswahl').length;
}

async function loescheAusgewaehlteGeschenkideen() {
    const auswahl = [...ideenListe.querySelectorAll('.ideen-auswahl:checked')];
    const ids = auswahl.map(function (checkbox) {
        return checkbox.value;
    });

    if (!ids.length || !window.confirm(`${ids.length} Geschenkideen wirklich löschen?`)) {
        return;
    }

    mehrereIdeenLoeschenButton.disabled = true;
    zeigeStatus(statusElement, 'Ausgewählte Geschenkideen werden gelöscht ...');
    const { error } = await getClient().from('gift_ideas').delete().in('id', ids);

    if (error) {
        zeigeStatus(statusElement, `Geschenkideen konnten nicht gelöscht werden: ${error.message}`);
        aktualisiereMehrfachLoeschen();
        return;
    }

    alleIdeenCheckbox.checked = false;
    await ladeInhalte();
    zeigeStatus(statusElement, 'Ausgewählte Geschenkideen wurden gelöscht.');
}

ideenListe.addEventListener('click', function (ereignis) {
    const button = ereignis.target.closest('.loeschen-button');
    if (button) {
        loescheGeschenkidee(button.dataset.id, button.dataset.titel);
    }
});

ideenListe.addEventListener('change', function (ereignis) {
    if (ereignis.target.matches('.ideen-auswahl')) {
        aktualisiereMehrfachLoeschen();
    }
});

alleIdeenCheckbox.addEventListener('change', function () {
    ideenListe.querySelectorAll('.ideen-auswahl').forEach(function (checkbox) {
        checkbox.checked = alleIdeenCheckbox.checked;
    });
    aktualisiereMehrfachLoeschen();
});

mehrereIdeenLoeschenButton.addEventListener('click', loescheAusgewaehlteGeschenkideen);

async function ladeInhalte() {
    const client = getClient();
    const [kategorienErgebnis, ideenErgebnis] = await Promise.all([
        client.from('categories').select('id, title, description, image_url, is_published').order('created_at'),
        client.from('gift_ideas').select('id, title, description, image_url, product_url, is_published').order('created_at')
    ]);

    if (kategorienErgebnis.error) {
        throw kategorienErgebnis.error;
    }

    if (ideenErgebnis.error) {
        throw ideenErgebnis.error;
    }

    renderCheckboxen(kategorienErgebnis.data);
    renderListe(kategorienListe, kategorienErgebnis.data, true);
    renderListe(ideenListe, ideenErgebnis.data, false);
}

async function zeigeDashboard() {
    loginBereich.hidden = true;
    dashboard.hidden = false;
    try {
        await ladeInhalte();
        zeigeStatus(seitenstatus, '');
    } catch (fehler) {
        zeigeStatus(seitenstatus, `Inhalte konnten nicht geladen werden: ${fehler.message}`);
        console.error(fehler);
    }
}

loginForm.addEventListener('submit', async function (ereignis) {
    ereignis.preventDefault();
    const client = getClient();
    const daten = new FormData(loginForm);
    const button = loginForm.querySelector('button');
    button.disabled = true;
    zeigeStatus(seitenstatus, 'Login wird geprüft ...');

    const { error } = await client.auth.signInWithPassword({
        email: daten.get('email'),
        password: daten.get('passwort')
    });
    button.disabled = false;

    if (error) {
        zeigeStatus(seitenstatus, `Login fehlgeschlagen: ${error.message}`);
        return;
    }

    await zeigeDashboard();
});

kategorienForm.addEventListener('submit', async function (ereignis) {
    ereignis.preventDefault();
    const client = getClient();
    const daten = new FormData(kategorienForm);
    const button = kategorienForm.querySelector('button');
    button.disabled = true;
    zeigeStatus(statusElement, 'Kategorie wird gespeichert ...');

    try {
        const bildUrl = await ladeBildUrl(leseDatei(daten, 'image'));
        const { error } = await client.from('categories').insert({
            title: daten.get('title'),
            description: daten.get('description') || null,
            image_url: bildUrl,
            is_published: daten.get('isPublished') === 'on'
        });
        if (error) {
            throw error;
        }
        kategorienForm.reset();
        await ladeInhalte();
        zeigeStatus(statusElement, 'Kategorie gespeichert.');
    } catch (fehler) {
        zeigeStatus(statusElement, `Kategorie konnte nicht gespeichert werden: ${fehler.message}`);
    } finally {
        button.disabled = false;
    }
});

ideenForm.addEventListener('submit', async function (ereignis) {
    ereignis.preventDefault();
    const client = getClient();
    const daten = new FormData(ideenForm);
    const button = ideenForm.querySelector('button');
    button.disabled = true;
    zeigeStatus(statusElement, 'Geschenkidee wird gespeichert ...');

    try {
        const hochgeladeneBildUrl = await ladeBildUrl(leseDatei(daten, 'image'));
        const bildUrls = importierteBildUrls.length
            ? importierteBildUrls
            : (hochgeladeneBildUrl ? [hochgeladeneBildUrl] : []);
        const bildUrl = bildUrls[0] || null;
        const { data: idee, error: ideenFehler } = await client
            .from('gift_ideas')
            .insert({
                title: daten.get('title'),
                description: daten.get('description'),
                image_url: bildUrl,
                product_url: daten.get('productUrl') || null,
                is_published: daten.get('isPublished') === 'on'
            })
            .select('id')
            .single();
        if (ideenFehler) {
            throw ideenFehler;
        }

        if (bildUrls.length) {
            const { error: bildFehler } = await client.from('gift_idea_images').insert(
                bildUrls.map(function (imageUrl, index) {
                    return { gift_idea_id: idee.id, image_url: imageUrl, sort_order: index };
                })
            );
            if (bildFehler) {
                throw bildFehler;
            }
        }

        const categoryIds = daten.getAll('categoryIds');
        if (categoryIds.length) {
            const { error: linkFehler } = await client.from('gift_idea_categories').insert(
                categoryIds.map(function (categoryId) {
                    return { gift_idea_id: idee.id, category_id: categoryId };
                })
            );
            if (linkFehler) {
                throw linkFehler;
            }
        }

        ideenForm.reset();
        await ladeInhalte();
        zeigeStatus(statusElement, 'Geschenkidee gespeichert.');
    } catch (fehler) {
        zeigeStatus(statusElement, `Geschenkidee konnte nicht gespeichert werden: ${fehler.message}`);
    } finally {
        button.disabled = false;
    }
});

sessionForm.addEventListener('submit', async function (ereignis) {
    ereignis.preventDefault();
    const client = getClient();
    const daten = new FormData(sessionForm);
    const button = sessionForm.querySelector('button');
    button.disabled = true;
    zeigeStatus(statusElement, 'Teilnehmer-Link wird erzeugt ...');

    try {
        const { data, error } = await client.rpc('create_swipe_session', {
            p_mode: daten.get('mode')
        });
        if (error) {
            throw error;
        }

        const session = data[0];
        teilnehmerLink.value = new URL(
            `./?token=${encodeURIComponent(session.access_token)}`,
            window.location.href
        ).toString();
        linkErgebnis.hidden = false;
        zeigeStatus(statusElement, 'Teilnehmer-Link wurde erzeugt.');
    } catch (fehler) {
        zeigeStatus(statusElement, `Link konnte nicht erzeugt werden: ${fehler.message}`);
    } finally {
        button.disabled = false;
    }
});

linkKopieren.addEventListener('click', async function () {
    await navigator.clipboard.writeText(teilnehmerLink.value);
    zeigeStatus(statusElement, 'Link wurde kopiert.');
});

document.querySelectorAll('.tab-button').forEach(function (tabButton) {
    tabButton.addEventListener('click', function () {
        document.querySelectorAll('.tab-button').forEach(function (button) {
            button.classList.toggle('aktiv', button === tabButton);
        });
        document.querySelectorAll('.admin-panel').forEach(function (panel) {
            panel.hidden = panel.id !== tabButton.dataset.tab;
            panel.classList.toggle('aktiv', panel.id === tabButton.dataset.tab);
        });
    });
});

abmeldenButton.addEventListener('click', async function () {
    await getClient().auth.signOut();
    dashboard.hidden = true;
    loginBereich.hidden = false;
    loginForm.reset();
});

async function initialisiereAdmin() {
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

initialisiereAdmin();
