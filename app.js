const geschenkideen = [
    {
        titel: 'Gemütlicheee Leselampe',
        preis: '24,99 €',
        beschreibung: 'Eine rstilvolle Leselampe für gemütliche Abende mit einem guten Buch.'
    }
];

const neinButton = document.querySelector('#nein-button');
const jaButton = document.querySelector('#ja-button');
const titelElement = document.querySelector('#geschenk-titel');
const preisElement = document.querySelector('.preis');
const beschreibungElement = document.querySelector('.beschreibung');


function zeigeGeschenkidee(index) {
    const geschenkidee = geschenkideen[index];
    titelElement.textContent = geschenkidee.titel;
    preisElement.textContent = geschenkidee.preis;
    beschreibungElement.textContent = geschenkidee.beschreibung;
}

zeigeGeschenkidee(0);

console.log('GiftSwipe wurde geladen.');
console.log(`${geschenkideen.length} Geschenkidee ist vorbereitet.`);

neinButton.addEventListener('click', function () {
    console.log('Entscheidung: Nein');
});

jaButton.addEventListener('click', function () {
    console.log('Entscheidung: Ja');
});
