document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DAS MÚSICAS (Simulando um banco de dados) ---
    const musicData = {
        currentTrack: 0,
        isPlaying: false,
        currentTime: 0,
        tracks: [
            {
                title: "ICARUS",
                artist: "STARSET",
                album: "HORIZONS",
                duration: "4:00",
                cover: "_imagens/Horizons.jpg",
                audio: "_audio/ICARUS.mp3"
            },
            {
                title: "Seal the Deal",
                artist: "Volbeat",
                album: "Seal the Deal & Let's Boogie",
                duration: "5:06",
                cover: "_imagens/covers/volbeat.jpg",
                audio: "_audio/volbeat.mp3"
            },
            {
                title: "Van Liebe, Tod und Freiheit",
                artist: "Santiano",
                album: "Mit den Gezeiten",
                duration: "4:15",
                cover: "_imagens/covers/santiano.jpg",
                audio: "_audio/santiano.mp3"
            },
            {
                title: "Heathens",
                artist: "Twenty One Pilots",
                album: "Suicide Squad: The Album",
                duration: "3:15",
                cover: "_imagens/covers/heathens.jpg",
                audio: "_audio/heathens.mp3"
            },
            {
                title: "Radioactive",
                artist: "Imagine Dragons",
                album: "Night Visions",
                duration: "3:07",
                cover: "_imagens/covers/radioactive.jpg",
                audio: "_audio/radioactive.mp3"
            }
        ],
        recentes: [
            {
                title: "Heathens",
                artist: "Twenty One Pilots",
                cover: "_imagens/covers/heathens.jpg"
            },
            {
                title: "Radioactive",
                artist: "Imagine Dragons",
                cover: "_imagens/covers/radioactive.jpg"
            }
        ],
        albums: [
            {
                title: "HORIZONS",
                artist: "STARSET",
                cover: "_imagens/covers/starset.jpg"
            },
            {
                title: "Seal the Deal & Let's Boogie",
                artist: "Volbeat",
                cover: "_imagens/covers/volbeat.jpg"
            },
            {
                title: "Mit den Gezeiten",
                artist: "Santiano",
                cover: "_imagens/covers/santiano.jpg"
            }
        ],
        artists: [
            {
                name: "STARSET",
                cover: "_imagens/artists/starset_artist.jpg"
            },
            {
                name: "Volbeat",
                cover: "_imagens/artists/volbeat_artist.jpg"
            },
            {
                name: "Santiano",
                cover: "_imagens/artists/santiano_artist.jpg"
            }
        ],
        followed: [
            {
                cover: "_imagens/artists/starset_artist.jpg",
                title: "STARSET",
                subtitle: "ARTISTA",
                date: "20 FEV 2025"
            },
            {
                cover: "_imagens/artists/volbeat_artist.jpg",
                title: "Volbeat",
                subtitle: "ARTISTA",
                date: "15 JAN 2025"
            },
            {
                cover: "_imagens/covers/radioactive.jpg",
                title: "Night Visions",
                subtitle: "ÁLBUM",
                date: "12 MAR 2025"
            }
        ],
        favorites: [
            {
                title: "ICARUS",
                artist: "STARSET",
                album: "HORIZONS",
                duration: "4:00"
            },
            {
                title: "Seal the Deal",
                artist: "Volbeat",
                album: "Seal the Deal & Let's Boogie",
                duration: "5:06"
            },
            {
                title: "Heathens",
                artist: "Twenty One Pilots",
                album: "Suicide Squad: The Album",
                duration: "3:15"
            },
            {
                title: "Radioactive",
                artist: "Imagine Dragons",
                album: "Night Visions",
                duration: "3:07"
            }
        ]
    };
    
    // --- ELEMENTOS DO DOM DO PLAYER ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    // --- FUNÇÕES DO PLAYER ---
    function loadSong(song) {
        audioPlayer.src = song.audio;
        playerCover.src = song.cover;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        
        audioPlayer.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audioPlayer.duration);
            progressBar.max = audioPlayer.duration;
        });
    }

    function playSong() {
        musicData.isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audioPlayer.play();
    }

    function pauseSong() {
        musicData.isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        audioPlayer.pause();
    }

    function nextSong() {
        musicData.currentTrack = (musicData.currentTrack + 1) % musicData.tracks.length;
        loadSong(musicData.tracks[musicData.currentTrack]);
        playSong();
    }

    function prevSong() {
        musicData.currentTrack = (musicData.currentTrack - 1 + musicData.tracks.length) % musicData.tracks.length;
        loadSong(musicData.tracks[musicData.currentTrack]);
        playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO DE CONTEÚDO ---
    function renderMusicCards(data, gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        grid.innerHTML = '';
        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-index', index);
            
            card.innerHTML = `
                <img src="${item.cover}" alt="${item.title || item.name}">
                <h4>${item.title || item.name}</h4>
                <p>${item.artist || (item.title ? '...' : 'Artista')}</p>
            `;
            
            grid.appendChild(card);
            
            card.addEventListener('click', () => {
                // Lógica para tocar a música/abrir a página do artista/álbum
                if (item.audio) {
                    musicData.currentTrack = musicData.tracks.indexOf(item);
                    loadSong(item);
                    playSong();
                } else if (item.name) {
                    window.location.href = `artista_${item.name.toLowerCase()}.html`;
                }
            });
        });
    }

    function renderFavoritesList() {
        const list = document.getElementById('favorites-list');
        if (!list) return;

        list.innerHTML = '';
        musicData.favorites.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.classList.add('track-item');
            trackItem.innerHTML = `
                <p class="track-number">${index + 1}</p>
                <div class="track-details">
                    <img src="${musicData.tracks.find(t => t.title === track.title).cover}" alt="Capa da música">
                    <div class="track-info">
                        <h4>${track.title}</h4>
                        <p>${track.artist}</p>
                    </div>
                </div>
                <p>${track.album}</p>
                <p>${track.duration}</p>
            `;
            list.appendChild(trackItem);
        });
    }

    function renderFollowedList() {
        const list = document.getElementById('followed-list');
        if (!list) return;

        list.innerHTML = '';
        musicData.followed.forEach(item => {
            const followedItem = document.createElement('div');
            followedItem.classList.add('followed-item');
            followedItem.innerHTML = `
                <img src="${item.cover}" alt="${item.title}">
                <div class="followed-info">
                    <h4>${item.title}</h4>
                    <p>${item.subtitle}</p>
                </div>
                <p class="followed-date">${item.date}</p>
            `;
            list.appendChild(followedItem);
        });
    }

    // --- EVENT LISTENERS GERAIS ---
    if (playPauseBtn) playPauseBtn.addEventListener('click', () => musicData.isPlaying ? pauseSong() : playSong());
    if (nextBtn) nextBtn.addEventListener('click', nextSong);
    if (prevBtn) prevBtn.addEventListener('click', prevSong);
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        progressBar.addEventListener('input', () => audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration);
    }

    // --- INICIALIZAÇÃO DAS PÁGINAS ---
    const page = document.querySelector('body').classList[0]; // Pega a classe do body para identificar a página

    switch (document.title) {
        case 'SONORA - Início':
            renderMusicCards(musicData.tracks, 'for-you-grid');
            renderMusicCards(musicData.recentes, 'recentes-grid');
            renderMusicCards(musicData.albums, 'albums-grid');
            renderMusicCards(musicData.artists, 'artists-grid');
            break;
        case 'SONORA - Seguidos':
            renderFollowedList();
            break;
        case 'SONORA - Favoritos':
            renderFavoritesList();
            break;
        case 'SONORA - STARSET':
            // Renderiza os álbuns do artista Starset
            const starsetAlbums = [
                {
                    title: "HORIZONS",
                    artist: "STARSET",
                    cover: "_imagens/covers/starset.jpg",
                    audio: "_audio/starset.mp3"
                }
            ];
            renderMusicCards(starsetAlbums, 'starset-albums-grid');
            break;
        default:
            break;
    }
});