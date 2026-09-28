const geschenkideen = [
    {
        titel: 'Gemütliche Leselampe',
        preis: '39,99 €'
    }
];

const neinButton = document.querySelector('#nein-button');
const jaButton = document.querySelector('#ja-button');

console.log('GiftSwipe wurde geladen.');
console.log(`${geschenkideen.length} Geschenkidee ist vorbereitet.`);

neinButton.addEventListener('click', function () {
    console.log('Entscheidung: Nein');
});

jaButton.addEventListener('click', function () {
    console.log('Entscheidung: Ja');
});
