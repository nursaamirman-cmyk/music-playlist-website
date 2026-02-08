const API_URL = 'http://localhost:5000/api'; // Укажи свой URL, если развернул на Render
let token = localStorage.getItem('token');
let isLogin = true;

// DOM Elements
const authForm = document.getElementById('auth-form');
const authToggle = document.getElementById('auth-toggle');
const songsGrid = document.getElementById('songs-grid');
const songForm = document.getElementById('song-form');

// Toggle Login/Register
authToggle.onclick = () => {
    isLogin = !isLogin;
    document.getElementById('auth-title').innerText = isLogin ? 'Войти в MusicFlow' : 'Регистрация';
    document.getElementById('username-group').style.display = isLogin ? 'none' : 'block';
    authToggle.innerHTML = isLogin ? 'Нет аккаунта? <span>Зарегистрироваться</span>' : 'Уже есть аккаунт? <span>Войти</span>';
};

// Auth Handler
authForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin ? { email, password } : { username, email, password };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            location.reload();
        } else {
            alert(data.message);
        }
    } catch (err) { alert('Ошибка соединения'); }
};

// Load Songs
async function loadSongs() {
    if (!token) return;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    document.getElementById('display-username').innerText = localStorage.getItem('username');

    const res = await fetch(`${API_URL}/resource`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const songs = await res.json();
    
    songsGrid.innerHTML = songs.map(song => `
        <div class="song-card">
        <div class="card-actions">
            <i class="fas fa-edit edit-btn" onclick="openEditModal('${song._id}')"></i>
            <i class="fas fa-trash delete-btn" onclick="deleteSong('${song._id}')"></i>
        </div>
        
        <img src="${song.coverUrl}" alt="Обложка">
        
        <div class="song-info">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        </div>

        ${song.previewUrl ? `
            <div class="audio-player">
                <audio id="audio-${song._id}" src="${song.previewUrl}"></audio>
                <button class="play-btn" onclick="togglePlay('${song._id}')">
                    <i class="fas fa-play" id="icon-${song._id}"></i>
                </button>
            </div>
        ` : '<p class="no-preview">Нет аудио</p>'}
    </div>

    `).join('');
}

// Add Song
songForm.onsubmit = async (e) => {
    e.preventDefault();
    const songData = {
        title: document.getElementById('song-title').value,
        artist: document.getElementById('song-artist').value,
        album: document.getElementById('song-album').value
    };

    await fetch(`${API_URL}/resource`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(songData)
    });
    songForm.reset();
    loadSongs();
};

// Delete Song
async function deleteSong(id) {
    if(confirm('Удалить песню?')) {
        await fetch(`${API_URL}/resource/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadSongs();
    }
}

// Logout
document.getElementById('logout-btn').onclick = () => {
    localStorage.clear();
    location.reload();
};

if (token) loadSongs();
function togglePlay(id) {
    const audio = document.getElementById(`audio-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    
    // Остановить все остальные играющие песни
    document.querySelectorAll('audio').forEach(el => {
        if (el !== audio) {
            el.pause();
            const otherId = el.id.replace('audio-', '');
            const otherIcon = document.getElementById(`icon-${otherId}`);
            if (otherIcon) otherIcon.className = 'fas fa-play';
        }
    });

    if (audio.paused) {
        audio.play();
        icon.className = 'fas fa-pause';
    } else {
        audio.pause();
        icon.className = 'fas fa-play';
    }
    async function openEditModal(id) {
    const res = await fetch(`${API_URL}/resource/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const song = await res.json();

    if (res.ok) {
        document.getElementById('edit-title').value = song.title;
        document.getElementById('edit-artist').value = song.artist;
        document.getElementById('edit-album').value = song.album || '';
        
        document.getElementById('edit-modal').style.display = 'flex';
        
        // Назначаем сохранение (использует PUT /api/resource/:id)
        document.getElementById('save-edit-btn').onclick = () => updateSong(id);
    }
}

async function updateSong(id) {
    const updatedData = {
        title: document.getElementById('edit-title').value,
        artist: document.getElementById('edit-artist').value,
        album: document.getElementById('edit-album').value
    };

    const res = await fetch(`${API_URL}/resource/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });

    if (res.ok) {
        closeEditModal();
        loadSongs();
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// --- ФУНКЦИИ ДЛЯ ПРОФИЛЯ ---

// Получение данных профиля (GET /api/users/profile)
async function fetchUserProfile() {
    const res = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const user = await res.json();
    
    if (res.ok) {
        // Теперь имя берется из БД, а не из localStorage
        document.getElementById('display-username').innerText = user.username;
    }
}

// Обновление профиля (PUT /api/users/profile)
async function changeNickname(newUsername) {
    const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername })
    });
    
    if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('username', updatedUser.username);
        fetchUserProfile();
    }
}
}