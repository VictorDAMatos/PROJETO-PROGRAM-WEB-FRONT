document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('profile-name-input');
    const likedSongsCount = document.getElementById('liked-songs-count');
    const likedSongsContainer = document.getElementById('liked-songs-container');
    const profilePicLarge = document.getElementById('profile-picture-large');
    const profilePicUpload = document.getElementById('profile-pic-upload');
    const topBarProfilePic = document.getElementById('top-bar-profile-pic');

    function loadProfileData() {
        nameInput.value = getUsername();
        
        const picUrl = getProfilePic();
        profilePicLarge.src = picUrl;
        if(topBarProfilePic) topBarProfilePic.src = picUrl;

        const likedIds = getLikedSongs();
        likedSongsCount.textContent = likedIds.length;
        
        likedSongsContainer.innerHTML = '';

        likedIds.forEach((songId, index) => {
            const song = songDatabase.find(s => s.id === songId);
            if (song) {
                const songRow = document.createElement('div');
                songRow.classList.add('song-list-row');
                songRow.innerHTML = `
                    <span class="song-col-num">${index + 1}</span>
                    <div class="song-col-title">
                        <img src="${song.cover}" alt="${song.album}">
                        <div class="title-details">
                            <h4>${song.title}</h4>
                            <p>${song.artist}</p>
                        </div>
                    </div>
                    <span class="song-col-album">${song.album}</span>
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
            document.getElementById('top-bar-username').textContent = newName; 
        } else {
            nameInput.value = getUsername();
        }
    });
    
    // Event listener para quando uma nova foto é escolhida
    profilePicUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPicUrl = e.target.result;
                saveProfilePic(newPicUrl); // Salva a foto no localStorage
                profilePicLarge.src = newPicUrl; // Atualiza a foto grande
                if(topBarProfilePic) topBarProfilePic.src = newPicUrl; // Atualiza a foto pequena
            };
            reader.readAsDataURL(file); // Converte a imagem para um URL
        }
    });

    loadProfileData();
});