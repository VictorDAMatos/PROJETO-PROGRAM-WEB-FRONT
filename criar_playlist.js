document.addEventListener('DOMContentLoaded', () => {
    const coverImg = document.getElementById('playlist-cover-img');
    const coverUpload = document.getElementById('playlist-cover-upload');
    const nameInput = document.getElementById('playlist-name-input');
    const userPic = document.getElementById('playlist-user-pic');
    const userNameEl = document.getElementById('playlist-user-name');
    const songsContainer = document.getElementById('playlist-songs-container');
    const searchInput = document.getElementById('add-song-search-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const playlistDurationEl = document.getElementById('playlist-duration');
    const playlistSongCountEl = document.getElementById('playlist-song-count');
    const deleteBtn = document.getElementById('delete-playlist-btn');
    
    let currentPlaylistId = null;

    function loadPlaylistPage() {
        const urlParams = new URLSearchParams(window.location.search);
       userPic.src = getProfilePic();
        currentPlaylistId = urlParams.get('id');

        if (!currentPlaylistId) {
            const newPlaylist = createNewPlaylist();
            window.location.href = `criar_playlist.html?id=${newPlaylist.id}`;
            return;
        }

        const playlist = getPlaylistById(currentPlaylistId);
        if (!playlist) {
            alert('Playlist não encontrada!');
            window.location.href = 'index.html';
            return;
        }

        coverImg.src = playlist.cover;
        nameInput.value = playlist.name;
        // Foto de perfil do usuário agora é exibida aqui
        userPic.src = getProfilePic();
        userNameEl.textContent = getUsername();

        renderPlaylistSongs();
    }

    function renderPlaylistSongs() {
        songsContainer.innerHTML = '';
        const playlist = getPlaylistById(currentPlaylistId);

        if (!playlist || playlist.songs.length === 0) {
            songsContainer.innerHTML = '<p class="empty-list-message">Adicione músicas à sua playlist.</p>';
            playlistDurationEl.textContent = ''; 
            playlistSongCountEl.textContent = '0 músicas';
        } else {
            playlistDurationEl.textContent = getPlaylistTotalDuration(currentPlaylistId);
            playlistSongCountEl.textContent = `${playlist.songs.length} músicas`;

            const header = `<div class="song-list-header">
                                <span class="song-col-num">#</span>
                                <span class="song-col-title">Título</span>
                                <span class="song-col-album">Álbum</span>
                                <span class="song-col-date">Adicionado em</span>
                                <span class="song-col-duration"><i class="far fa-clock"></i></span>
                            </div>`;
            songsContainer.innerHTML = header;

            playlist.songs.forEach((songEntry, index) => {
                const songId = typeof songEntry === 'object' ? songEntry.id : songEntry;
                const dateAdded = typeof songEntry === 'object' ? songEntry.dateAdded : 'N/A';
                const song = getSongById(songId);

                if (song) {
                    const songRow = document.createElement('div');
                    songRow.classList.add('song-list-row');
                    songRow.setAttribute('data-song-id', song.id);
                    
                    // Link do artista restaurado
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
                        <span class="song-col-date">${dateAdded}</span>
                        <span class="song-col-duration">${song.duration}</span>
                    `;
                    songsContainer.appendChild(songRow);
                }
            });
        }
    }
    
    function renderSearchResults(query) {
        searchResultsContainer.innerHTML = '';
        if (query.length < 2) return;

        const playlist = getPlaylistById(currentPlaylistId);
        const songsInPlaylist = playlist ? playlist.songs.map(s => typeof s === 'object' ? s.id : s) : [];

        const results = songDatabase.filter(s => 
            (s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query))
            && !songsInPlaylist.includes(s.id)
        );

        results.forEach(song => {
            const songRow = document.createElement('div');
            songRow.classList.add('song-list-row', 'search-result-item');
            
            // Link do artista restaurado
            songRow.innerHTML = `
                <div class="song-col-title">
                    <img src="${song.cover}" alt="${song.album}">
                    <div class="title-details">
                        <h4>${song.title}</h4>
                        <p><a href="artista.html?nome=${encodeURIComponent(song.artist)}">${song.artist}</a></p>
                    </div>
                </div>
                <button class="add-btn">Adicionar</button>
            `;
            songRow.querySelector('.add-btn').addEventListener('click', () => {
                addSongToPlaylist(currentPlaylistId, song.id);
                renderPlaylistSongs();
                renderSearchResults(searchInput.value.toLowerCase());
            });
            searchResultsContainer.appendChild(songRow);
        });
    }

    nameInput.addEventListener('blur', () => {
        updatePlaylistDetails(currentPlaylistId, { name: nameInput.value });
        window.updateGlobalUserData();
    });

    coverUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newCoverUrl = e.target.result;
                updatePlaylistDetails(currentPlaylistId, { cover: newCoverUrl });
                coverImg.src = newCoverUrl;
            };
            reader.readAsDataURL(file);
        }
    });
    
    searchInput.addEventListener('input', () => {
        renderSearchResults(searchInput.value.toLowerCase());
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja deletar esta playlist?')) {
            deletePlaylist(currentPlaylistId);
            alert('Playlist deletada.');
            window.location.href = 'index.html';
        }
    });
    
    loadPlaylistPage();
    window.updateGlobalUserData();
});