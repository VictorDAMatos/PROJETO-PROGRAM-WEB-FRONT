document.addEventListener('DOMContentLoaded', () => {
    const likedSongsContainer = document.getElementById('liked-songs-container');
    const playFavoritesBtn = document.getElementById('play-favorites-btn');

    function renderLikedSongs() {
        likedSongsContainer.innerHTML = '';
        const likedSongs = getLikedSongs(); 

        if (likedSongs.length === 0) {
            playFavoritesBtn.style.display = 'none';
            likedSongsContainer.innerHTML = '<p class="empty-list-message">Você ainda não curtiu nenhuma música.</p>';
            return;
        }

        likedSongs.forEach((likedSong, index) => {
            const song = songDatabase.find(s => s.id === likedSong.id);
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
        if (likedSongs.length > 0) {
            window.playSongById(likedSongs[0].id);
        }
    });

    renderLikedSongs();
});