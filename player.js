document.addEventListener('DOMContentLoaded', () => {
    let currentSongIndex = 0;
    let isPlaying = false;

    // Elementos do DOM
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
    const foryouGrid = document.getElementById('foryou-grid');
    const recentesGrid = document.getElementById('recentes-grid'); // NOVO
    const likeBtn = document.getElementById('like-btn');

    function updateSliderFill(slider) {
        const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        const tealColor = getComputedStyle(document.documentElement).getPropertyValue('--cor-primaria-teal');
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--cor-texto-secundario');
        slider.style.background = `linear-gradient(to right, ${tealColor} ${percentage}%, ${secondaryColor} ${percentage}%)`;
    }

    function updateLikeButtonState() {
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
            playerArtist.textContent = song.artist;
            playerAlbum.textContent = song.album;
            playerCover.src = song.cover;
            updateLikeButtonState();
        }
    }

    function playSong() {
        isPlaying = true;
        playPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        audioPlayer.play();
        // Adiciona a música aos recentes quando ela começa a tocar
        addSongToRecents(songDatabase[currentSongIndex].id);
        // Atualiza a secção de recentes na interface
        renderRecentSongs();
    }

    function pauseSong() {
        isPlaying = false;
        playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
        audioPlayer.pause();
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
            const progressValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progressValue;
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

    // Função para desenhar os cards na secção "Feito Para Você"
    function renderForYouCards() {
        if (!foryouGrid) return;
        foryouGrid.innerHTML = '';
        songDatabase.forEach((song, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `<img src="${song.cover}" alt="${song.title}"><h4>${song.title}</h4><p>${song.artist}</p>`;
            card.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(songDatabase[currentSongIndex]);
                playSong();
            });
            foryouGrid.appendChild(card);
        });
    }
    
    // NOVA FUNÇÃO para desenhar os cards na secção "Recentes"
    function renderRecentSongs() {
        if (!recentesGrid) return;
        recentesGrid.innerHTML = '';
        const recentSongIds = getRecentSongs();
        
        recentSongIds.forEach(songId => {
            const song = songDatabase.find(s => s.id === songId);
            if (song) {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `<img src="${song.cover}" alt="${song.title}"><h4>${song.title}</h4><p>${song.artist}</p>`;
                card.addEventListener('click', () => {
                    currentSongIndex = songDatabase.findIndex(s => s.id === song.id);
                    loadSong(song);
                    playSong();
                });
                recentesGrid.appendChild(card);
            }
        });
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    likeBtn.addEventListener('click', () => {
        const currentSong = songDatabase[currentSongIndex];
        toggleLike(currentSong.id);
        updateLikeButtonState();
    });

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
        audioPlayer.volume = e.target.value / 100;
        updateSliderFill(e.target);
    });

    // Inicialização
    renderForYouCards();
    renderRecentSongs(); // Carrega os recentes ao iniciar a página
    loadSong(songDatabase[currentSongIndex]);
    audioPlayer.volume = volumeSlider.value / 100;
    
    updateSliderFill(progressBar);
    updateSliderFill(volumeSlider);
});