document.addEventListener('DOMContentLoaded', () => {
    let currentSongIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let lastVolume = 1;
    let activeQueue = null;


    // --- Elementos do DOM ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerAlbum = document.getElementById('player-album');
    const playerCover = document.getElementById('player-cover');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    const foryouGrid = document.getElementById('foryou-grid');
    const recentesGrid = document.getElementById('recentes-grid');
    const likeBtn = document.getElementById('like-btn');
    const addPlaylistBtn = document.querySelector('.add-playlist-btn');

    // --- FUNÇÃO MESTRE GLOBAL PARA ATUALIZAR DADOS DO UTILIZADOR ---
    window.updateGlobalUserData = () => {
        const topBarUsername = document.getElementById('top-bar-username');
        const topBarProfilePic = document.getElementById('top-bar-profile-pic');
        if (topBarUsername) topBarUsername.textContent = getUsername();
        if (topBarProfilePic) topBarProfilePic.src = getProfilePic();
        renderSidebarPlaylists();
    };

    function renderSidebarPlaylists() {
        const sidebarList = document.getElementById('sidebar-playlists-list');
        if (!sidebarList) return;

        sidebarList.innerHTML = '';
        const playlists = getPlaylists();
        playlists.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="criar_playlist.html?id=${p.id}">${p.name}</a>`;
            sidebarList.appendChild(li);
        });
    }

    // --- OUVINTE GLOBAL PARA SINCRONIZAR ABAS ---
    window.addEventListener('storage', (event) => {
        if (['sonora_profile_pic', 'sonora_username', 'sonora_playlists'].includes(event.key)) {
            window.updateGlobalUserData();
        }
    });

    window.playSongById = (songId) => {
        const songIndex = songDatabase.findIndex(s => s.id === songId);
        if (songIndex !== -1) {
            currentSongIndex = songIndex;
            loadSong(songDatabase[currentSongIndex]);
            playSong();
        }
    };

    document.addEventListener('click', (event) => {
        const clickableRow = event.target.closest('.song-list-row[data-song-id], .card[data-song-id]');
        if (clickableRow) {
            if (event.target.closest('a')) return;
            const songId = clickableRow.getAttribute('data-song-id');
            if (songId) playSongById(songId);
        }
    });

    function updateSliderFill(slider) {
        const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, var(--cor-primaria-teal) ${percentage}%, var(--cor-texto-secundario) ${percentage}%)`;
    }

    function updateLikeButtonState() {
        if (!likeBtn || !songDatabase[currentSongIndex]) return;
        const currentSong = songDatabase[currentSongIndex];
        if (isSongLiked(currentSong.id)) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').classList.replace('far', 'fas');
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('i').classList.replace('fas', 'far');
        }
    }

    function loadSong(song) {
        if (song) {
            audioPlayer.src = song.audio;
            playerTitle.textContent = song.title;
            playerArtist.innerHTML = `<a href="artista.html?nome=${encodeURIComponent(song.artist)}">${song.artist}</a>`;
            playerAlbum.textContent = song.album;
            playerCover.src = song.cover;
            updateLikeButtonState();
        }
    }

    function playSong() {
        if (!audioPlayer.src || !songDatabase[currentSongIndex]) return;
        isPlaying = true;
        playPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        audioPlayer.play();
        const currentSong = songDatabase[currentSongIndex];
        incrementPlayCount(currentSong.id);
        addSongToRecents(currentSong.id);
        if (document.getElementById('recentes-grid')) {
            renderRecentSongs();
        }
    }

    function pauseSong() {
        isPlaying = false;
        playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
        audioPlayer.pause();
    }

    function toggleMute() {
        isMuted = !isMuted;
        if (isMuted) {
            lastVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeIcon.classList.replace('fa-volume-up', 'fa-volume-xmark');
            volumeSlider.value = 0;
        } else {
            audioPlayer.volume = lastVolume;
            volumeIcon.classList.replace('fa-volume-xmark', 'fa-volume-up');
            volumeSlider.value = lastVolume * 100;
        }
        updateSliderFill(volumeSlider);
    }

    function nextSong() {
        if (activeQueue) {

            currentQueueIndex = (currentQueueIndex + 1) % activeQueue.length;
            const nextSongId = activeQueue[currentQueueIndex];
            const songData = songDatabase.find(s => s.id === nextSongId);
            loadSong(songData);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songDatabase.length;
            loadSong(songDatabase[currentSongIndex]);
        }
        playAudio();
    }

    function prevSong() {
        if (activeQueue) {
            currentQueueIndex = (currentQueueIndex - 1 + activeQueue.length) % activeQueue.length;
            const prevSongId = activeQueue[currentQueueIndex];
            const songData = songDatabase.find(s => s.id === prevSongId);
            loadSong(songData);
        } else {
            currentSongIndex = (currentSongIndex - 1 + songDatabase.length) % songDatabase.length;
            loadSong(songDatabase[currentSongIndex]);
        }
        playAudio();
    }

    function updateProgress() {
        if (audioPlayer.duration) {
            progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            updateSliderFill(progressBar);
        }
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function renderCards(container, songs) {
        if (!container) return;
        container.innerHTML = '';
        songs.forEach(song => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-song-id', song.id);
            card.innerHTML = `<img src="${song.cover}" alt="${song.title}"><h4>${song.title}</h4><p><a href="artista.html?nome=${encodeURIComponent(song.artist)}">${song.artist}</a></p>`;
            container.appendChild(card);
        });
    }

    function renderRecentSongs() {
        const recentSongIds = getRecentSongs();
        const recentSongs = recentSongIds.map(id => songDatabase.find(s => s.id === id)).filter(Boolean);
        renderCards(recentesGrid, recentSongs);
    }

    function showPlaylistMenu(event) {
        closePlaylistMenu();
        const buttonRect = addPlaylistBtn.getBoundingClientRect();
        const menu = document.createElement('div');
        menu.className = 'playlist-context-menu';

        const playlists = getPlaylists();
        if (playlists.length === 0) {
            menu.innerHTML = '<span class="context-menu-item">Nenhuma playlist.</span>';
        } else {
            playlists.forEach(p => {
                const item = document.createElement('div');
                item.className = 'context-menu-item';
                item.textContent = p.name;
                item.onclick = () => {
                    addSongToPlaylist(p.id, songDatabase[currentSongIndex].id);
                    closePlaylistMenu();
                };
                menu.appendChild(item);
            });
        }

        document.body.appendChild(menu);
        menu.style.right = `${window.innerWidth - buttonRect.right}px`;
        menu.style.top = `${buttonRect.top - menu.offsetHeight - 10}px`;

        setTimeout(() => {
            document.addEventListener('click', closePlaylistMenuOnClickOutside, { capture: true });
        }, 0);
        event.stopPropagation();
    }

    function closePlaylistMenu() {
        const existingMenu = document.querySelector('.playlist-context-menu');
        if (existingMenu) existingMenu.remove();
        document.removeEventListener('click', closePlaylistMenuOnClickOutside, { capture: true });
    }

    function closePlaylistMenuOnClickOutside(event) {
        if (event.target.closest('.playlist-context-menu')) return;
        closePlaylistMenu();
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
        nextBtn.addEventListener('click', nextSong);
        prevBtn.addEventListener('click', prevSong);
        likeBtn.addEventListener('click', () => {
            const currentSong = songDatabase[currentSongIndex];
            toggleLikeSong(currentSong.id);
            updateLikeButtonState();
        });
        volumeIcon.addEventListener('click', toggleMute);
        addPlaylistBtn.addEventListener('click', showPlaylistMenu);

        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        audioPlayer.addEventListener('loadedmetadata', () => {
            durationSpan.textContent = formatTime(audioPlayer.duration);
        });
        progressBar.addEventListener('input', () => {
            if (audioPlayer.duration) {
                audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
                updateSliderFill(progressBar);
            }
        });
        volumeSlider.addEventListener('input', (e) => {
            const volumeValue = e.target.value / 100;
            audioPlayer.volume = volumeValue;
            lastVolume = volumeValue;
            isMuted = volumeValue === 0;
            volumeIcon.classList.toggle('fa-volume-xmark', isMuted);
            volumeIcon.classList.toggle('fa-volume-up', !isMuted);
            updateSliderFill(e.target);
        });
    }
    /**
 * 
 * @param {string[]} songIdArray 
 * @param {number} [startIndex=0] 
 */
    window.playQueue = (songIdArray, startIndex = 0) => {
        if (!songIdArray || songIdArray.length === 0) {
            console.error("Tentativa de tocar uma fila vazia.");
            return;
        }

        activeQueue = [...songIdArray];
        currentQueueIndex = startIndex;

        const songToPlayId = activeQueue[currentQueueIndex];
        const songData = songDatabase.find(s => s.id === songToPlayId);

        if (songData) {
            loadSong(songData);
            playAudio();
        }
    };

    // --- Inicialização ---
    window.updateGlobalUserData();
    if (foryouGrid) renderCards(foryouGrid, songDatabase);
    if (recentesGrid) renderRecentSongs();
    if (playPauseBtn) {
        if (songDatabase.length > 0) {
            loadSong(songDatabase[currentSongIndex]);
            audioPlayer.volume = volumeSlider.value / 100;
            lastVolume = audioPlayer.volume;
            updateSliderFill(progressBar);
            updateSliderFill(volumeSlider);
        }
    }
});
