const geschenkideen = [
    {
        titel: 'Gemütliche Leselampe',
        preis: '24,99 €',
        beschreibung: 'Eine stilvolle Leselampe für gemütliche Abende mit einem guten Buch.'
    },
    {
        titel: 'Isolierflasche',
        preis: '19,99 €',
        beschreibung: 'Eine wiederverwendbare Flasche, die Getränke unterwegs warm oder kalt hält.'
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

zeigeGeschenkidee(1);

console.log('GiftSwipe wurde geladen.');
console.log(`${geschenkideen.length} Geschenkidee ist vorbereitet.`);

neinButton.addEventListener('click', function () {
    console.log('Entscheidung: Nein');
});

jaButton.addEventListener('click', function () {
    console.log('Entscheidung: Ja');
});
