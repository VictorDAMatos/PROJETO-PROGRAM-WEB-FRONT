document.addEventListener('DOMContentLoaded', () => {
    const artistHeader = document.getElementById('artist-header');
    const artistNameEl = document.getElementById('artist-name');
    const discographyContainer = document.getElementById('discography-container');
    const mostPlayedContainer = document.getElementById('most-played-container');
    const playArtistBtn = document.querySelector('.play-btn-large');

    const urlParams = new URLSearchParams(window.location.search);
    const artistName = decodeURIComponent(urlParams.get('nome'));

    const artistData = artistDatabase[artistName];
    const artistSongs = songDatabase.filter(song => song.artist === artistName);
    const artistAlbums = [...new Set(artistSongs.map(song => song.album))];

    if (artistData && artistSongs.length > 0) {
        artistNameEl.textContent = artistName;
        artistHeader.style.backgroundImage = `url(${artistData.banner})`;

        discographyContainer.innerHTML = '';
        artistAlbums.forEach(albumName => {
            const albumSong = artistSongs.find(s => s.album === albumName);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `<img src="${albumSong.cover}" alt="${albumName}"><h4>${albumName}</h4><p>Álbum</p>`;
            discographyContainer.appendChild(card);
        });
        
        mostPlayedContainer.innerHTML = '';
        const playCounts = getPlayCounts();
        const sortedSongs = artistSongs
            .sort((a, b) => (playCounts[b.id] || 0) - (playCounts[a.id] || 0))
            .slice(0, 5);

        sortedSongs.forEach((song, index) => {
            const songRow = document.createElement('div');
            songRow.classList.add('song-list-row');
            songRow.setAttribute('data-song-id', song.id);
            
            songRow.innerHTML = `
                <span class="song-col-num">${index + 1}</span>
                <div class="song-col-title">
                    <img src="${song.cover}" alt="${song.album}">
                    <div class="title-details"><h4>${song.title}</h4><p>${song.artist}</p></div>
                </div>
                <span class="song-col-album">${song.album}</span>
                <span class="song-col-duration">${song.duration || 'N/A'}</span>
            `;
            mostPlayedContainer.appendChild(songRow);
        });

        playArtistBtn.addEventListener('click', () => {
            if (artistSongs.length > 0) {
                window.playSongById(artistSongs[0].id);
            }
        });

    } else {
        artistNameEl.textContent = "Artista não encontrado";
    }
});