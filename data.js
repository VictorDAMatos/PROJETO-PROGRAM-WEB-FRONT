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
    },
    
];

// USER
function getUsername() {
    return localStorage.getItem('sonora_username') || "Frey";
}
function saveUsername(newName) {
    localStorage.setItem('sonora_username', newName);
}

// PFP
const DEFAULT_PROFILE_PIC = "assets/images/profile.jpg";
function getProfilePic() {
    return localStorage.getItem('sonora_profile_pic') || DEFAULT_PROFILE_PIC;
}
function saveProfilePic(newPicUrl) {
    localStorage.setItem('sonora_profile_pic', newPicUrl);
}

// FAVORITAS
function getLikedSongs() {
    const liked = localStorage.getItem('sonora_liked_songs');
    return liked ? JSON.parse(liked) : [];
}
function saveLikedSongs(likedList) {
    localStorage.setItem('sonora_liked_songs', JSON.stringify(likedList));
}
function isSongLiked(songId) {
    return getLikedSongs().includes(songId);
}
function toggleLike(songId) {
    let likedSongs = getLikedSongs();
    if (isSongLiked(songId)) {
        likedSongs = likedSongs.filter(id => id !== songId);
    } else {
        likedSongs.push(songId);
    }
    saveLikedSongs(likedSongs);
}

// RECENTES
function getRecentSongs() {
    const recent = localStorage.getItem('sonora_recent_songs');
    return recent ? JSON.parse(recent) : [];
}
function saveRecentSongs(recentList) {
    localStorage.setItem('sonora_recent_songs', JSON.stringify(recentList));
}
function addSongToRecents(songId) {
    let recentSongs = getRecentSongs();
    recentSongs = recentSongs.filter(id => id !== songId);
    recentSongs.unshift(songId);
    if (recentSongs.length > 10) {
        recentSongs = recentSongs.slice(0, 10);
    }
    saveRecentSongs(recentSongs);
}