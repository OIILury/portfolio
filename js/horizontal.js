// Cibler la colonne de défilement horizontal
const horizontalScroll = document.getElementById('horizontal-scroll');

// Ajouter un écouteur pour l'événement 'wheel'
horizontalScroll.addEventListener('wheel', (event) => {
    event.preventDefault(); // Empêche le défilement vertical par défaut
    horizontalScroll.scrollLeft += event.deltaY; // Défiler horizontalement
});
