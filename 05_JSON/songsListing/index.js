// Elements
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const cardView = document.getElementById('cardView');
const toggleBtn = document.getElementById('toggleViewBtn');
const toggleIcon = document.getElementById('toggleIcon');
const sortRadios = document.getElementsByName("sortOption");

const hiddenId = document.getElementById('songId');
const submitBtn = document.getElementById('submitBtn');

// View mode
let viewMode = localStorage.getItem("viewMode") || "table";

// Load data
let songs = [];
document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('playlist');
    songs = stored ? JSON.parse(stored) : [];

    updateViewMode();
    renderSongs();
});

// Toggle view
toggleBtn.addEventListener('click', () => {
    viewMode = (viewMode === "table") ? "cards" : "table";
    localStorage.setItem("viewMode", viewMode);
    updateViewMode();
    renderSongs();
});

// Update UI based on mode
function updateViewMode() {
    if (viewMode === "cards") {
        toggleIcon.className = "fas fa-table";
        document.getElementById("tableView").classList.add("d-none");
        document.getElementById("cardView").classList.remove("d-none");
    } else {
        toggleIcon.className = "fas fa-th-large";
        document.getElementById("tableView").classList.remove("d-none");
        document.getElementById("cardView").classList.add("d-none");
    }
}

// Save and render
function saveAndRender() {
    localStorage.setItem('playlist', JSON.stringify(songs));
    renderSongs();
}

/* -------------------- YOUTUBE HELPERS ------------------- */
function extractYouTubeID(url) {
    const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w\-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function fetchYouTubeData(id) {
    try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/* -------------------- RENDER ------------------- */

// MAIN render function
function renderSongs() {
    if (viewMode === "table") renderTable();
    else renderCards();
}

/* TABLE VIEW */
function renderTable() {
    list.innerHTML = "";

    songs.forEach(song => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${song.thumbnail}" width="90" class="rounded"></td>
            <td><strong>${song.userTitle}</strong></td>
            <td class="text-info">${song.youtubeTitle}</td>
            <td>${song.rating}/10</td>

            <td>
                <button class="btn btn-sm btn-info" onclick="playSong('${song.videoId}')">
                    <i class="fas fa-play"></i> Play
                </button>
            </td>

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

/* CARDS VIEW */
function renderCards() {
    cardView.innerHTML = "";

    songs.forEach(song => {
        const card = document.createElement('div');
        card.className = "col-6 col-md-3 mb-3";

        card.innerHTML = `
            <div class="card bg-dark border-secondary h-100">
                <img src="${song.thumbnail}" class="card-img-top">

                <div class="card-body">
                    <h5 class="card-title text-white">${song.userTitle}</h5>
                    <p class="text-info">${song.youtubeTitle}</p>
                    <p class="text-warning">Rating: ${song.rating}/10</p>

                    <button class="btn btn-info btn-sm mb-2" onclick="playSong('${song.videoId}')">
                        <i class="fas fa-play"></i> Play
                    </button>

                    <a href="${song.url}" target="_blank" class="btn btn-sm btn-primary mb-2">Watch</a>

                    <div>
                        <button class="btn btn-warning btn-sm me-1" onclick="editSong(${song.id})">
                            <i class="fas fa-edit"></i>
                        </button>

                        <button class="btn btn-danger btn-sm" onclick="deleteSong(${song.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        cardView.appendChild(card);
    });
}

/* -------------------- PLAYER ------------------- */
function playSong(id) {
    const modal = new bootstrap.Modal(document.getElementById("playerModal"));
    const frame = document.getElementById("playerFrame");

    frame.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    modal.show();

    document.getElementById("playerModal").addEventListener("hidden.bs.modal", () => {
        frame.src = "";
    });
}

/* -------------------- DELETE ------------------- */
function deleteSong(id) {
    if (!confirm("Delete this item?")) return;
    songs = songs.filter(s => s.id !== id);
    saveAndRender();
}

/* -------------------- EDIT ------------------- */
function editSong(id) {
    const s = songs.find(x => x.id === id);

    document.getElementById('title').value = s.userTitle;
    document.getElementById('url').value = s.url;
    document.getElementById('rating').value = s.rating;
    document.getElementById('youtubeTitle').value = s.youtubeTitle;
    hiddenId.value = s.id;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success','btn-warning');
}

/* -------------------- ADD / UPDATE ------------------- */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userTitle = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = Number(document.getElementById('rating').value);
    const id = Number(hiddenId.value);

    const videoId = extractYouTubeID(url);
    if (!videoId) return alert("Invalid YouTube URL");

    const data = await fetchYouTubeData(videoId);
    const youtubeTitle = data ? data.title : "Unknown Title";
    const thumbnail = data ? data.thumbnail_url : "";

    document.getElementById('youtubeTitle').value = youtubeTitle;

    if (id) {
        const i = songs.findIndex(s => s.id === id);
        songs[i] = {
            ...songs[i],
            userTitle,
            youtubeTitle,
            url,
            rating,
            thumbnail,
            videoId
        };

        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning','btn-success');
        hiddenId.value = "";

    } else {
        songs.push({
            id: Date.now(),
            userTitle,
            youtubeTitle,
            url,
            rating,
            thumbnail,
            videoId,
            dateAdded: Date.now()
        });
    }

    saveAndRender();
    form.reset();
});

/* -------------------- SORTING ------------------- */
function applySorting() {
    let type = [...sortRadios].find(r => r.checked).value;

    if (type === "title") songs.sort((a, b) => a.userTitle.localeCompare(b.userTitle));
    if (type === "rating") songs.sort((a, b) => b.rating - a.rating);
    if (type === "date") songs.sort((a, b) => b.dateAdded - a.dateAdded);

    renderSongs();
}

sortRadios.forEach(r => r.addEventListener("change", applySorting));
