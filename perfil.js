document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('profile-name-input');
    const likedSongsCountEl = document.getElementById('liked-songs-count');
    const playlistsCountEl = document.getElementById('playlists-count');
    const followersCountEl = document.getElementById('followers-count');
    const likedSongsContainer = document.getElementById('liked-songs-container');
    const profilePicLarge = document.getElementById('profile-picture-large');
    const profilePicUpload = document.getElementById('profile-pic-upload');

    function loadProfileData() {
        profilePicLarge.src = getProfilePic();
        nameInput.value = getUsername();

        const likedSongs = getLikedSongs();
        const playlists = getPlaylists();

        likedSongsCountEl.textContent = likedSongs.length;
        playlistsCountEl.textContent = playlists.length;
        followersCountEl.textContent = '0';

        likedSongsContainer.innerHTML = '';
        if (likedSongs.length === 0) {
            likedSongsContainer.innerHTML = '<p class="empty-list-message">Curta uma música para vê-la aqui.</p>';
            return;
        }

        const header = `<div class="song-list-header">
                            <span class="song-col-num">#</span>
                            <span class="song-col-title">Título</span>
                            <span class="song-col-album">Álbum</span>
                            <span class="song-col-date">Adicionado em</span>
                            <span class="song-col-duration"><i class="far fa-clock"></i></span>
                        </div>`;
        likedSongsContainer.innerHTML = header;

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

    nameInput.addEventListener('blur', () => {
        const newName = nameInput.value.trim();
        if (newName) {
            saveUsername(newName);
            window.updateGlobalUserData();
        } else {
            nameInput.value = getUsername();
        }
    });
    
    profilePicUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPicUrl = e.target.result;
                saveProfilePic(newPicUrl);
                profilePicLarge.src = newPicUrl;
                window.updateGlobalUserData();
            };
            reader.readAsDataURL(file);
        }
    });

    loadProfileData();
    window.updateGlobalUserData();
});