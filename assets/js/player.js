document.addEventListener('DOMContentLoaded', () => {

 
    const songList = [
        {
            title: "ICARUS",
            artist: "STARSET",
            album: "HORIZONS",
            cover: "assets/images/Horizons.jpg",
            audio: "assets/audio/ICARUS.mp3"
        },
        {
            title: "Seal the Deal",
            artist: "Volbeat",
            album: "Seal the Deal & Let's Boogie",
            cover: "assets/images/covers/volbeat.jpg",
            audio: "assets/audio/volbeat.mp3"
        },
        {
            title: "Van Liebe, Tod und Freiheit",
            artist: "Santiano",
            album: "Mit den Gezeiten",
            cover: "assets/images/covers/santiano.jpg",
            audio: "assets/audio/santiano.mp3"
        }
    ];

    // --- VARIÁVEIS DE ESTADO ---
    let currentSongIndex = 0;
    let isPlaying = false;

    // --- ELEMENTOS DO DOM ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerCover = document.getElementById('player-cover');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const recentesGrid = document.getElementById('recentes-grid');

    // --- FUNÇÕES DO PLAYER ---
    function loadSong(song) {
        audioPlayer.src = song.audio;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        playerCover.src = song.cover;
        audioPlayer.load();
    }

    function playSong() {
        isPlaying = true;
        playPauseBtn.querySelector('i').classList.remove('fa-play');
        playPauseBtn.querySelector('i').classList.add('fa-pause');
        audioPlayer.play();
    }

    function pauseSong() {
        isPlaying = false;
        playPauseBtn.querySelector('i').classList.remove('fa-pause');
        playPauseBtn.querySelector('i').classList.add('fa-play');
        audioPlayer.pause();
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songList.length;
        loadSong(songList[currentSongIndex]);
        playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
        loadSong(songList[currentSongIndex]);
        playSong();
    }

    function updateProgress() {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        
        // Atualiza o tempo atual
        const minutes = Math.floor(audioPlayer.currentTime / 60);
        const seconds = Math.floor(audioPlayer.currentTime % 60);
        currentTimeSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function renderMusicCards() {
        recentesGrid.innerHTML = '';
        songList.forEach((song, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-index', index);
            
            card.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            `;
            
            recentesGrid.appendChild(card);
            
            // Adiciona evento de clique para tocar a música
            card.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(songList[currentSongIndex]);
                playSong();
            });
        });
    }

    // --- EVENT LISTENERS ---
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong); // Toca a próxima quando a atual acabar

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
    });

    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // --- INICIALIZAÇÃO ---
    renderMusicCards();
    loadSong(songList[currentSongIndex]);
});