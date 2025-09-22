// Simulação de uma base de dados de músicas
const songDatabase = [
    {
        id: '01',
        title: "ICARUS",
        artist: "STARSET",
        album: "HORIZONS",
        cover: "assets/images/covers/Horizons.jpg",
        audio: "assets/audio/ICARUS.mp3"
    },
    {
        id: '02',
        title: "My Demons",
        artist: "STARSET",
        album: "Transmissions",
        cover: "assets/images/covers/Transmissions.jpg",
        audio: "assets/audio/My Demons.mp3"
    },
    {
        id: '03',
        title: "dark things",
        artist: "STARSET",
        album: "dark things",
        cover: "assets/images/covers/Dark Things.jpg",
        audio: "assets/audio/dark things.mp3"
    },
    {
        id: '04',
        title: "Die For You",
        artist: "STARSET",
        album: "Vessels 2.0",
        cover: "assets/images/covers/Vessels 2.0.jpg",
        audio: "assets/audio/Die For You.mp3"
    },
    {
        id: '05',
        title: "Bury the Light",
        artist: "Casey Edwards",
        album: "Bury the Light",
        cover: "assets/images/covers/Bury the Light.jpg",
        audio: "assets/audio/Bury the Light.mp3"
    },
    {
        id: '06',
        title: "Square Hammer",
        artist: "Ghost",
        album: "Meliora (Deluxe Edition)",
        cover: "assets/images/covers/Meliora (Deluxe Edition).jpg",
        audio: "assets/audio/Square Hammer.mp3"
    }
];
    
const artistDatabase = {
    "STARSET": {
        banner: "assets/images/banners/STARSET.jpg"
    },
    "Ghost": {
        banner: "assets/images/banners/Ghost.png"
    },
    "Casey Edwards": {
        banner: "assets/images/banners/Casey Edwards.png"
    },
    "Santiano": {
        banner: "assets/images/banners/Santiano.jpg"
    }
};

// contagem de vezes que a música tocou
function getPlayCounts() {
    const counts = localStorage.getItem('sonora_play_counts');
    return counts ? JSON.parse(counts) : {};
}
function savePlayCounts(counts) {
    localStorage.setItem('sonora_play_counts', JSON.stringify(counts));
}
function incrementPlayCount(songId) {
    const counts = getPlayCounts();
    counts[songId] = (counts[songId] || 0) + 1;
    savePlayCounts(counts);
}

// user
function getUsername() { return localStorage.getItem('sonora_username') || "Frey"; }
function saveUsername(newName) { localStorage.setItem('sonora_username', newName); }
const DEFAULT_PROFILE_PIC = "assets/images/profile.jpg";
function getProfilePic() { return localStorage.getItem('sonora_profile_pic') || DEFAULT_PROFILE_PIC; }
function saveProfilePic(newPicUrl) { localStorage.setItem('sonora_profile_pic', newPicUrl); }

// Favoritos
function getLikedSongs() {
    const liked = localStorage.getItem('sonora_liked_songs');
    return liked ? JSON.parse(liked) : [];
}
function saveLikedSongs(likedList) {
    localStorage.setItem('sonora_liked_songs', JSON.stringify(likedList));
}
function isSongLiked(songId) {
    const likedSongs = getLikedSongs();
    return likedSongs.some(song => song.id === songId);
}
function toggleLike(songId) {
    let likedSongs = getLikedSongs();
    const songIndex = likedSongs.findIndex(song => song.id === songId);
    
    if (songIndex > -1) {
        likedSongs.splice(songIndex, 1);
    } else {
        const today = new Date();
        const dateAdded = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
        likedSongs.unshift({ id: songId, dateAdded: dateAdded });
    }
    saveLikedSongs(likedSongs);
}

// Contagem de reproduções
function getPlayCounts() {
    const counts = localStorage.getItem('sonora_play_counts');
    return counts ? JSON.parse(counts) : {};
}
function savePlayCounts(counts) { localStorage.setItem('sonora_play_counts', JSON.stringify(counts)); }
function incrementPlayCount(songId) {
    const counts = getPlayCounts();
    counts[songId] = (counts[songId] || 0) + 1;
    savePlayCounts(counts);
}
function getRecentSongs() {
    const recents = localStorage.getItem('sonora_recent_songs');
    return recents ? JSON.parse(recents) : [];
}
function saveRecentSongs(recentsList) { localStorage.setItem('sonora_recent_songs', JSON.stringify(recentsList)); }
function addSongToRecents(songId) {
    let recents = getRecentSongs();
    recents = recents.filter(id => id !== songId);
    recents.unshift(songId);
    if (recents.length > 20) recents.pop();
    saveRecentSongs(recents);
}