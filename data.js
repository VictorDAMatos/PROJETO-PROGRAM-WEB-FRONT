// Simulação de uma base de dados de músicas
const songDatabase = [
    {
        id: '01',
        title: "ICARUS",
        artist: "STARSET",
        album: "HORIZONS",
        duration: "4:48",
        cover: "assets/images/covers/Horizons.jpg",
        audio: "assets/audio/ICARUS.mp3"
    },
    {
        id: '02',
        title: "My Demons",
        artist: "STARSET",
        album: "Transmissions",
        duration: "4:48",
        cover: "assets/images/covers/Transmissions.jpg",
        audio: "assets/audio/My Demons.mp3"
    },
    {
        id: '03',
        title: "dark things",
        artist: "STARSET",
        album: "dark things",
        duration: "4:37",
        cover: "assets/images/covers/Dark Things.jpg",
        audio: "assets/audio/dark things.mp3"
    },
    {
        id: '04',
        title: "Die For You",
        artist: "STARSET",
        album: "Vessels 2.0",
        duration: "5:17",
        cover: "assets/images/covers/Vessels 2.0.jpg",
        audio: "assets/audio/Die For You.mp3"
    },
    {
        id: '05',
        title: "Bury the Light",
        artist: "Casey Edwards",
        album: "Bury the Light",
        duration: "9:42",
        cover: "assets/images/covers/Bury the Light.jpg",
        audio: "assets/audio/Bury the Light.mp3"
    },
    {
        id: '06',
        title: "Square Hammer",
        artist: "Ghost",
        album: "Meliora (Deluxe Edition)",
        duration: "3:59",
        cover: "assets/images/covers/Meliora (Deluxe Edition).jpg",
        audio: "assets/audio/Square Hammer.mp3"
    },
    {
        id: '07',
        title: "Johnny Boy",
        artist: "Santiano",
        album: "Von Liebe, Tod und Freiheit",
        duration: "3:32",
        cover: "assets/images/covers/Von Liebe, Tod und Freiheit.jpg",
        audio: "assets/audio/Johnny Boy.mp3"
    }
];

function getSongById(songId) { return songDatabase.find(song => song.id === songId); }

function getPlaylistTotalDuration(playlistId) {
    const playlist = getPlaylistById(playlistId);
    if (!playlist || playlist.songs.length === 0) return "0 s";
    let totalSeconds = 0;
    playlist.songs.forEach(songEntry => {
        const songId = typeof songEntry === 'object' ? songEntry.id : songEntry;
        const song = getSongById(songId);
        if (song && song.duration) {
            const timeParts = song.duration.split(':');
            totalSeconds += (parseInt(timeParts[0], 10) * 60) + parseInt(timeParts[1], 10);
        }
    });
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let durationString = '';
    if (hours > 0) durationString += `${hours} h `;
    if (minutes > 0 || hours > 0) durationString += `${minutes} min `;
    durationString += `${seconds} s`;
    return durationString.trim();
}

// user
function getUsername() { return localStorage.getItem('sonora_username') || 'Frey'; }
function saveUsername(name) { localStorage.setItem('sonora_username', name); }
function getProfilePic() { return localStorage.getItem('sonora_profile_pic') || 'assets/images/profile.jpg'; }
function saveProfilePic(picUrl) { localStorage.setItem('sonora_profile_pic', picUrl); }

const artistDatabase = {
    "STARSET": {
        banner: "assets/images/banners/STARSET.jpg"
    },
    "Ghost": {
        banner: "assets/images/banners/GHOST.jpg"
    },
    "Santiano": {
        banner: "assets/images/banners/Santiano.jpg"
    },
    "Casey Edwards": {
        banner: "assets/images/banners/Casey Edwards.jpg"
    }
};


// liked songs
function getLikedSongs() { const liked = localStorage.getItem('sonora_liked_songs'); return liked ? JSON.parse(liked) : []; }
function saveLikedSongs(liked) { localStorage.setItem('sonora_liked_songs', JSON.stringify(liked)); }
function isSongLiked(songId) { return getLikedSongs().some(s => s.id === songId); }
function toggleLikeSong(songId) {
    let liked = getLikedSongs();
    if (isSongLiked(songId)) {
        liked = liked.filter(s => s.id !== songId);
    } else {
        liked.unshift({ id: songId, dateAdded: new Date().toLocaleDateString('pt-BR') });
    }
    saveLikedSongs(liked);
}

// play count
function getPlayCounts() { const counts = localStorage.getItem('sonora_play_counts'); return counts ? JSON.parse(counts) : {}; }
function incrementPlayCount(songId) {
    const counts = getPlayCounts();
    counts[songId] = (counts[songId] || 0) + 1;
    localStorage.setItem('sonora_play_counts', JSON.stringify(counts));
}

// recent songs
function getRecentSongs() { const recents = localStorage.getItem('sonora_recent_songs'); return recents ? JSON.parse(recents) : []; }
function saveRecentSongs(recents) { localStorage.setItem('sonora_recent_songs', JSON.stringify(recents)); }
function addSongToRecents(songId) {
    let recents = getRecentSongs();
    recents = recents.filter(id => id !== songId);
    recents.unshift(songId);
    if (recents.length > 20) recents.pop();
    saveRecentSongs(recents);
}

// playlists
function getPlaylists() { const playlists = localStorage.getItem('sonora_playlists'); return playlists ? JSON.parse(playlists) : []; }
function savePlaylists(playlists) { localStorage.setItem('sonora_playlists', JSON.stringify(playlists)); }
function getPlaylistById(playlistId) { return getPlaylists().find(p => p.id === playlistId); }
function createNewPlaylist() {
    const playlists = getPlaylists();
    const newPlaylist = { id: `playlist_${Date.now()}`, name: `Minha playlist nº${playlists.length + 1}`, cover: "assets/images/covers/placeholder_playlist.png", songs: [] };
    playlists.push(newPlaylist);
    savePlaylists(playlists);
    return newPlaylist;
}
function updatePlaylistDetails(playlistId, details) {
    const playlists = getPlaylists();
    const index = playlists.findIndex(p => p.id === playlistId);
    if (index > -1) {
        playlists[index] = { ...playlists[index], ...details };
        savePlaylists(playlists);
    }
}
function addSongToPlaylist(playlistId, songId) {
    const playlists = getPlaylists();
    const index = playlists.findIndex(p => p.id === playlistId);
    if (index > -1) {
        const songExists = playlists[index].songs.some(songEntry => (typeof songEntry === 'object' ? songEntry.id : songEntry) === songId);
        if (!songExists) {
            const date = new Date();
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            playlists[index].songs.push({ id: songId, dateAdded: formattedDate });
            savePlaylists(playlists);
            alert(`Música adicionada à playlist "${playlists[index].name}"`);
        } else {
            alert('Essa música já está na playlist.');
        }
    }
}
function deletePlaylist(playlistId) {
    let playlists = getPlaylists();
    playlists = playlists.filter(p => p.id !== playlistId);
    savePlaylists(playlists);
}

function getFollowedArtists() {
    const followed = localStorage.getItem('sonora_followed_artists');

    if (!followed) {
        const defaultFollowed = ["STARSET", "Ghost", "Casey Edwards"];
        localStorage.setItem('sonora_followed_artists', JSON.stringify(defaultFollowed));
        return defaultFollowed;
    }
    return JSON.parse(followed);
}

/**
 * Encontra a música mais recente de um artista no banco de dados.
 * "Mais recente" é definida como a última entrada do artista na songDatabase.
* @param {string} artistName - O nome do artista.
 * @returns {object|null} - Um objeto com o nome do álbum e a lista de músicas, ou null.
 */
function getLatestAlbumForArtist(artistName) {

    const latestSong = songDatabase.slice().reverse().find(song => song.artist === artistName);

    if (!latestSong) {
        return null; 
    }

    const latestAlbumName = latestSong.album;


    const albumSongs = songDatabase.filter(song =>
        song.artist === artistName && song.album === latestAlbumName
    );

    if (albumSongs.length > 0) {
        return {
            albumName: latestAlbumName,
            songs: albumSongs
        };
    }

    return null;
}