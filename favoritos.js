document.addEventListener('DOMContentLoaded', () => {
    const likedSongsContainer = document.getElementById('liked-songs-container');
    const playFavoritesBtn = document.getElementById('play-favorites-btn');
    
    function renderLikedSongs() {
        const likedSongs = getLikedSongs(); 
        likedSongsContainer.innerHTML = ''; // Limpa o container

        if (likedSongs.length === 0) {
            playFavoritesBtn.style.display = 'none';
            likedSongsContainer.innerHTML = '<p class="empty-list-message">Você ainda não curtiu nenhuma música.</p>';
            return;
        }

        // Adiciona o cabeçalho dinamicamente
        const header = `<div class="song-list-header">
                            <span class="song-col-num">#</span>
                            <span class="song-col-title">Título</span>
                            <span class="song-col-album">Álbum</span>
                            <span class="song-col-date">Adicionado em</span>
                            <span class="song-col-duration"><i class="far fa-clock"></i></span>
                        </div>`;
        likedSongsContainer.innerHTML = header;

        // Adiciona as músicas
        likedSongs.forEach((likedSong, index) => {
            const song = getSongById(likedSong.id);
            if (song) {
                const songRow = document.createElement('div');
                songRow.classList.add('song-list-row');
                songRow.setAttribute('data-song-id', song.id);
                songRow.innerHTML = `
                    <span class="song-col-num">${index + 1}</span>
                    <div class="song-col-title">
                        <img src="${song.cover}" alt="${song.album}">
                        <div class="title-details">
                            <h4>${song.title}</h4>
                            <p><a href="artista.html?nome=${encodeURIComponent(song.artist)}">${song.artist}</a></p>
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
        if (likedSongs.length > 0) {
            window.playSongById(likedSongs[0].id);
        }
    });

    renderLikedSongs();
    window.updateGlobalUserData();
});