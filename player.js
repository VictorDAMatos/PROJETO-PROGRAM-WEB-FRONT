document.addEventListener('DOMContentLoaded', () => {
    let currentSongIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    let lastVolume = 1;

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

    // --- FUNÇÃO MESTRE GLOBAL PARA ATUALIZAR DADOS DO UTILIZADOR ---
     window.updateGlobalUserData = () => {
        const topBarUsername = document.getElementById('top-bar-username');
        const topBarProfilePic = document.getElementById('top-bar-profile-pic');
        if (topBarUsername) topBarUsername.textContent = getUsername();
        if (topBarProfilePic) topBarProfilePic.src = getProfilePic();
    };

    // --- OUVINTE GLOBAL PARA SINCRONIZAR ABAS ---
    // Este código avisa as outras abas quando a foto ou o nome mudam
        window.addEventListener('storage', (event) => {
        if (event.key === 'sonora_profile_pic' || event.key === 'sonora_username') {
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
        const songRow = event.target.closest('.song-list-row');
        if (songRow) {
            const songId = songRow.getAttribute('data-song-id');
            if (songId) playSongById(songId);
        }
    });

    // --- FUNÇÃO GLOBAL PARA TOCAR MÚSICAS DAS LISTAS ---
    window.playSongById = (songId) => {
        const songIndex = songDatabase.findIndex(s => s.id === songId);
        if (songIndex !== -1) {
            currentSongIndex = songIndex;
            loadSong(songDatabase[currentSongIndex]);
            playSong();
        }
    };
    
    // Listener de clique para as listas de músicas em qualquer página
    document.addEventListener('click', (event) => {
        const songRow = event.target.closest('.song-list-row');
        if (songRow) {
            const songId = songRow.getAttribute('data-song-id');
            if (songId) {
                playSongById(songId);
            }
        }
    });

    // --- Funções ---
    function updateSliderFill(slider) {
        const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        const tealColor = getComputedStyle(document.documentElement).getPropertyValue('--cor-primaria-teal');
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--cor-texto-secundario');
        slider.style.background = `linear-gradient(to right, ${tealColor} ${percentage}%, ${secondaryColor} ${percentage}%)`;
    }

    function updateLikeButtonState() {
        if (!likeBtn) return;
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
        currentSongIndex = (currentSongIndex + 1) % songDatabase.length;
        loadSong(songDatabase[currentSongIndex]);
        playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songDatabase.length) % songDatabase.length;
        loadSong(songDatabase[currentSongIndex]);
        playSong();
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
            card.innerHTML = `<img src="${song.cover}" alt="${song.title}"><h4>${song.title}</h4><p><a href="artista.html?nome=${encodeURIComponent(song.artist)}">${song.artist}</a></p>`;
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return;
                playSongById(song.id);
            });
            container.appendChild(card);
        });
    }
    
    function renderRecentSongs() {
        const recentSongIds = getRecentSongs();
        const recentSongs = recentSongIds.map(id => songDatabase.find(s => s.id === id)).filter(Boolean);
        renderCards(recentesGrid, recentSongs);
    }
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
        nextBtn.addEventListener('click', nextSong);
        prevBtn.addEventListener('click', prevSong);
        likeBtn.addEventListener('click', () => {
            const currentSong = songDatabase[currentSongIndex];
            toggleLike(currentSong.id);
            updateLikeButtonState();
        });
        volumeIcon.addEventListener('click', toggleMute);
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        audioPlayer.addEventListener('loadedmetadata', () => {
            durationSpan.textContent = formatTime(audioPlayer.duration);
        });
        progressBar.addEventListener('input', () => {
            if(audioPlayer.duration) {
                audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
                updateSliderFill(progressBar);
            }
        });
        volumeSlider.addEventListener('input', (e) => {
            const volumeValue = e.target.value / 100;
            audioPlayer.volume = volumeValue;
            lastVolume = volumeValue;
            if (volumeValue === 0) {
                isMuted = true;
                volumeIcon.classList.replace('fa-volume-up', 'fa-volume-xmark');
            } else {
                isMuted = false;
                volumeIcon.classList.replace('fa-volume-xmark', 'fa-volume-up');
            }
            updateSliderFill(e.target);
        });
    }
    
    // --- Inicialização ---
    window.updateGlobalUserData();
    if(foryouGrid) renderCards(foryouGrid, songDatabase);
    if(recentesGrid) renderRecentSongs();
    if(playPauseBtn) {
        loadSong(songDatabase[currentSongIndex]);
        audioPlayer.volume = volumeSlider.value / 100;
        lastVolume = audioPlayer.volume;
        updateSliderFill(progressBar);
        updateSliderFill(volumeSlider);
    }
});