// Elements
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const sortSelect = document.getElementById('sort');
const hiddenId = document.getElementById('songId');

// Data array
let songs = [];

// Load existing data on page load
document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('playlist');
    songs = stored ? JSON.parse(stored) : [];
    renderSongs(songs);
});

// Save to localStorage + re-render
function saveAndRender() {
    localStorage.setItem('playlist', JSON.stringify(songs));
    renderSongs(songs);
}

// Render table rows
function renderSongs(songArray) {
    list.innerHTML = "";

    songArray.forEach(song => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${song.title}</td>
            <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        list.appendChild(row);
    });
}

// Delete song
function deleteSong(id) {
    if (confirm("Are you sure?")) {
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

// Edit song
function editSong(id) {
    const song = songs.find(s => s.id === id);

    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    hiddenId.value = song.id;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success', 'btn-warning');
}

// Handle Add / Update
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const id = hiddenId.value;

    if (id) {
        // Update mode
        const i = songs.findIndex(s => s.id == id);
        songs[i].title = title;
        songs[i].url = url;

        hiddenId.value = "";
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');

    } else {
        // Add mode
        songs.push({
            id: Date.now(),
            title: title,
            url: url,
            dateAdded: Date.now()
        });
    }

    saveAndRender();
    form.reset();
});

// Sorting
sortSelect.addEventListener('change', () => {
    if (sortSelect.value === "az") {
        songs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        songs.sort((a, b) => b.dateAdded - a.dateAdded);
    }

    saveAndRender();
});
