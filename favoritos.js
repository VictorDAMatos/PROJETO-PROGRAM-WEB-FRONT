// favoritos.js

document.addEventListener('DOMContentLoaded', () => {
    const likedSongsContainer = document.getElementById('liked-songs-container');
    const playFavoritesBtn = document.getElementById('play-favorites-btn');

    // Passo 2: Torne a função acessível globalmente com "window."
    window.renderLikedSongs = function() {
        likedSongsContainer.innerHTML = '';
        const likedSongs = getLikedSongs();

        if (likedSongs.length === 0) {
            playFavoritesBtn.style.display = 'none';
            likedSongsContainer.innerHTML = '<p class="empty-list-message">Você ainda não curtiu nenhuma música.</p>';
            return;
        } else {
            playFavoritesBtn.style.display = 'block';
        }

        likedSongs.forEach((likedSong, index) => {
            const song = songDatabase.find(s => s.id === likedSong.id);
            if (song) {
                const songRow = document.createElement('div');
                songRow.classList.add('song-list-row');
                songRow.setAttribute('data-song-id', song.id);
                
                // Nota: O seu player.js já tem um listener global que toca a música.
                // Este listener local não é mais estritamente necessário, mas não prejudica.
                songRow.addEventListener('click', () => {
                    if (window.playSongById) {
                        window.playSongById(song.id);
                    }
                });

                // Lembre-se de adicionar a propriedade 'duration' no seu songDatabase em data.js
                // Ex: duration: "4:50"
                songRow.innerHTML = `
                    <span class="song-col-num">${index + 1}</span>
                    <div class="song-col-title">
                        <img src="${song.cover}" alt="${song.album}">
                        <div class="title-details">
                            <h4>${song.title}</h4>
                            <p>${song.artist}</p>
                        </div>
                    </div>
                    <span class="song-col-album">${song.album}</span>
                    <span class="song-col-date">${likedSong.dateAdded}</span>
                    <span class="song-col-duration">${song.duration || 'N/A'}</span>
                `;
                likedSongsContainer.appendChild(songRow);
            }
        });
    }

    playFavoritesBtn.addEventListener('click', () => {
        const likedSongs = getLikedSongs();
        if (likedSongs.length > 0 && window.playSongById) {
            window.playSongById(likedSongs[0].id);
        }
    });

    // Renderiza as músicas quando a página carrega
    renderLikedSongs();
});