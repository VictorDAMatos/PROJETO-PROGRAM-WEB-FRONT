// seguindo.js

document.addEventListener('DOMContentLoaded', () => {
    const followedArtistsGrid = document.getElementById('followed-artists-grid');

    function renderFollowedArtists() {
        followedArtistsGrid.innerHTML = '';
        const followedArtists = getFollowedArtists(); // Pega os artistas do localStorage

        if (followedArtists.length === 0) {
            followedArtistsGrid.innerHTML = '<p class="empty-list-message">Você ainda não segue nenhum artista.</p>';
            return;
        }

        // Para cada artista seguido, cria um card
        followedArtists.forEach(artistName => {
            const artistInfo = artistDatabase[artistName];
            if (artistInfo) {
                const artistCard = document.createElement('a');
                artistCard.className = 'card';
                artistCard.href = `artista.html?nome=${encodeURIComponent(artistName)}`;

                artistCard.innerHTML = `
                    <img src="${artistInfo.banner}" alt="${artistName}">
                    <h4>${artistName}</h4>
                    <p>Artista</p>
                `;
                followedArtistsGrid.appendChild(artistCard);
            }
        });
    }

    renderFollowedArtists();
});