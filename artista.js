// artista.js

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const artistHeader = document.getElementById('artist-header');
    const artistNameEl = document.getElementById('artist-name');
    const discographyContainer = document.getElementById('discography-container');
    const mostPlayedContainer = document.getElementById('most-played-container');
    const playArtistBtn = document.querySelector('.play-btn-large');
    const followBtn = document.getElementById('follow-artist-btn'); // <-- ADICIONADO

    // --- OBTENDO DADOS DA URL E DO BANCO DE DADOS ---
    const urlParams = new URLSearchParams(window.location.search);
    const artistName = decodeURIComponent(urlParams.get('nome'));

    const artistData = artistDatabase[artistName];
    const artistSongs = songDatabase.filter(song => song.artist === artistName);
    const artistAlbums = [...new Set(artistSongs.map(song => song.album))];

    // --- FUNÇÃO PARA ATUALIZAR O BOTÃO SEGUIR --- (ADICIONADO)
    function updateFollowButton() {
        if (isArtistFollowed(artistName)) {
            followBtn.textContent = 'SEGUINDO';
            followBtn.classList.add('following'); // Adiciona classe para estilização opcional
        } else {
            followBtn.textContent = 'SEGUIR';
            followBtn.classList.remove('following');
        }
    }

    // --- LÓGICA PRINCIPAL PARA RENDERIZAR A PÁGINA ---
    if (artistData && artistSongs.length > 0) {
        // Preenche o cabeçalho
        artistNameEl.textContent = artistName;
        artistHeader.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url(${artistData.banner})`;

        // Renderiza a discografia
        discographyContainer.innerHTML = '';
        artistAlbums.forEach(albumName => {
            const albumSong = artistSongs.find(s => s.album === albumName);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `<img src="${albumSong.cover}" alt="${albumName}"><h4>${albumName}</h4><p>Álbum</p>`;
            discographyContainer.appendChild(card);
        });
        
        // Renderiza as músicas mais tocadas
        mostPlayedContainer.innerHTML = '';
        const playCounts = getPlayCounts();
        const sortedSongs = artistSongs
            .sort((a, b) => (playCounts[b.id] || 0) - (playCounts[a.id] || 0))
            .slice(0, 5);

        sortedSongs.forEach((song, index) => {
            const songRow = document.createElement('div');
            songRow.classList.add('song-list-row');
            songRow.setAttribute('data-song-id', song.id);
            
            songRow.innerHTML = `
                <span class="song-col-num">${index + 1}</span>
                <div class="song-col-title">
                    <img src="${song.cover}" alt="${song.album}">
                    <div class="title-details"><h4>${song.title}</h4></div>
                </div>
                <span class="song-col-album">${playCounts[song.id] || 0} reproduções</span>
                <span class="song-col-duration">${song.duration || 'N/A'}</span>
            `;
            mostPlayedContainer.appendChild(songRow);
        });

        // --- EVENT LISTENERS DOS BOTÕES ---
        playArtistBtn.addEventListener('click', () => {
            if (artistSongs.length > 0) {
                window.playSongById(artistSongs[0].id);
            }
        });

        // Event listener para o botão Seguir (ADICIONADO)
        followBtn.addEventListener('click', () => {
            toggleFollowArtist(artistName);
            updateFollowButton();
        });

        // Define o estado inicial do botão Seguir (ADICIONADO)
        updateFollowButton();

    } else {
        // Caso o artista não seja encontrado
        artistNameEl.textContent = "Artista não encontrado";
        document.querySelector('.page-actions').style.display = 'none';
        document.querySelector('.music-section').style.display = 'none';
    }
});