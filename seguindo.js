// seguindo.js

document.addEventListener('DOMContentLoaded', () => {
    if (window.updateGlobalUserData) {
        window.updateGlobalUserData();
    }

    // O container principal onde todas as seções de artistas entrarão
    const mainContainer = document.getElementById('followed-artists-grid');

    function renderArtistReleases() {
        const mainContainer = document.getElementById('followed-artists-grid');

        if (!mainContainer) {
            console.error('Elemento "followed-artists-grid" não encontrado.');
            return;
        }

        mainContainer.innerHTML = '';
        mainContainer.classList.remove('music-grid');

        const followedArtists = getFollowedArtists();

        if (!followedArtists || followedArtists.length === 0) {
            mainContainer.innerHTML = '<p class="empty-list-message">Você ainda não segue nenhum artista.</p>';
            return;
        }

        followedArtists.forEach(artistName => {
            const latestAlbum = getLatestAlbumForArtist(artistName);

            if (latestAlbum && latestAlbum.songs.length > 0) {
                const artistSection = document.createElement('section');
                artistSection.className = 'artist-release-section';

                const title = document.createElement('h2');
                title.className = 'section-title';
                title.innerHTML = `${artistName} - <span class="album-highlight">${latestAlbum.albumName}</span>`;
                artistSection.appendChild(title);

                const songsGrid = document.createElement('div');
                songsGrid.className = 'music-grid';

                // 4. Cria um card para cada música do álbum

                latestAlbum.songs.forEach((song, index) => {
                    const cardLink = document.createElement('a');
                    cardLink.className = 'card';
                    cardLink.href = `artista.html?nome=${encodeURIComponent(artistName)}`;

                    // Se for a primeira música (index === 0), adiciona o selo. Senão, string vazia.
                    const badgeHTML = (index === 0) ? '<span class="card-badge">Lançamento</span>' : '';

                    // A estrutura do card agora inclui um container para a imagem,
                    // permitindo a sobreposição do selo.
                    cardLink.innerHTML = `
                    <div class="card-image-container">
                        <img src="${song.cover}" alt="${song.title}">
                        ${badgeHTML}
                    </div>
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                `;
                    songsGrid.appendChild(cardLink);
                });

                artistSection.appendChild(songsGrid);
                mainContainer.appendChild(artistSection);
            }
        });
    }


    renderArtistReleases();
});