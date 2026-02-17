// ============= VARIABLES =============
let isMusicPlaying = false;
let currentStoryIndex = 0;
let currentPostIndex = 0;
let storyInterval;
let totalLikes = 0;
let loveMessages = JSON.parse(localStorage.getItem('loveMessages')) || [];
let currentPage = 1;
const postsPerPage = 9;

// Array 3 lagu
const playlist = [
    { file: 'sempurna.mp3', title: 'Sempurna', artist: 'Andra & The Backbone' },
    { file: 'bergema.mp3', title: 'Bergema Sampai Selamanya', artist: 'Nadhif Basalamah' },
    { file: 'jadikekasihku.mp3', title: 'Jadi Kekasihku Saja', artist: 'Keisya Levronka' }
];
let currentSongIndex = 1; // Default ke Bergema

// DOM Elements
const audio = document.getElementById('bgMusic');
const playIcon = document.getElementById('playIcon');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('currentSongTitle');
const artistName = document.getElementById('currentArtist');
const playlistMenu = document.getElementById('playlistMenu');

// Array foto (18 foto)
const photos = [
    'foto1.jpg', 'foto2.jpg', 'foto3.jpg',
    'foto4.jpg', 'foto5.jpg', 'foto6.jpg',
    'foto7.jpg', 'foto8.jpg', 'foto9.jpg',
    'foto10.jpg', 'foto11.jpg', 'foto12.jpg',
    'foto13.jpg', 'foto14.jpg', 'foto15.jpg',
    'foto16.jpg', 'foto17.jpg', 'foto18.jpg'
];

// Captions (18 captions)
const captions = [
    "NV coffe ☕",
    "Sarangan with you ❤️",
    "Momen kondangan bersmamu 💋",
    "Kedai si mail 😋",
    "Lagi santai kawan ✌🏻",
    "Merengut no 1 😤",
    "Hiling ke pantai 💋",
    "No caption 😘",
    "Kehujanan 🥶",
    "Foto random yang lucu 😄",
    "Sarangan lagii 😘",
    "Melet duluu 😝",
    "Melet lagi 😝",
    "Dan lagii 😝",
    "Lamar gacoan 🍜",
    "photo after playing football ⚽",
    "Masih sama ⚽",
    "Football lagi ⚽"
];

// ============= MUSIC CONTROL =============
function toggleMusic() {
    if (isMusicPlaying) {
        audio.pause();
        playIcon.className = 'fas fa-play';
        document.querySelector('.music-player-modern').classList.remove('playing');
    } else {
        audio.play().catch(e => console.log('Audio play failed:', e));
        playIcon.className = 'fas fa-pause';
        document.querySelector('.music-player-modern').classList.add('playing');
        
        // Update album art
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        albumArt.src = randomPhoto;
    }
    isMusicPlaying = !isMusicPlaying;
}

function selectSong(index, file, title, artist) {
    currentSongIndex = index;
    audio.src = file;
    songTitle.textContent = title;
    artistName.textContent = artist;
    
    // Update active state
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    if (isMusicPlaying) {
        audio.play().catch(e => console.log('Play error:', e));
    }
    
    playlistMenu.classList.remove('show');
}

function togglePlaylistMenu() {
    playlistMenu.classList.toggle('show');
}

// Volume control
volumeSlider.addEventListener('input', function() {
    const volume = this.value;
    audio.volume = volume;
    
    if (volume == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
});

// Update time
audio.addEventListener('timeupdate', function() {
    document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
    document.getElementById('duration').textContent = '-' + formatTime(audio.duration);
});

audio.addEventListener('ended', function() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    const next = playlist[currentSongIndex];
    selectSong(currentSongIndex, next.file, next.title, next.artist);
    audio.play().catch(e => console.log('Play error:', e));
});

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============= LOAD POSTS =============
function loadPosts(page = 1) {
    const feed = document.getElementById('instagramFeed');
    const start = (page - 1) * postsPerPage;
    const end = Math.min(start + postsPerPage, photos.length);
    
    for (let i = start; i < end; i++) {
        feed.appendChild(createPost(i));
    }
    
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = end >= photos.length ? 'none' : 'inline-flex';
    }
}

function createPost(index) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${photos[0]}" class="post-profile" onerror="this.src='foto1.jpg'">
            <div class="post-info">
                <span class="post-username">kita_berdua</span>
                <span class="post-location">Kenangan #${index + 1}</span>
            </div>
            <i class="fas fa-ellipsis-h"></i>
        </div>
        <img src="${photos[index]}" class="post-image" onclick="openLightbox(${index})" onerror="this.src='foto1.jpg'">
        <div class="post-actions">
            <div class="post-actions-left">
                <i class="far fa-heart like-btn" onclick="toggleLike(this)"></i>
                <i class="far fa-comment" onclick="focusComment(this)"></i>
                <i class="far fa-paper-plane"></i>
            </div>
            <i class="far fa-bookmark"></i>
        </div>
        <div class="post-likes">
            <span class="likes-count">${Math.floor(Math.random() * 100 + 50)}</span> likes
        </div>
        <div class="post-caption">
            <span class="caption-username">kita_berdua</span>
            ${captions[index % captions.length]}
        </div>
        <div class="post-comments" id="comments-${index}">
            ${generateRandomComments()}
        </div>
        <div class="post-time">${getRandomTime()}</div>
        <div class="add-comment">
            <i class="far fa-smile"></i>
            <input type="text" placeholder="Tambahkan komentar..." onkeypress="addComment(event, this, ${index})">
            <button class="post-btn" onclick="postComment(this, ${index})">Post</button>
        </div>
    `;
    return postDiv;
}

function generateRandomComments() {
    const comments = [
        { user: 'teman_kita', text: 'Sweet banget! 💕' },
        { user: 'saudara_kita', text: 'Semoga langgeng ya!' },
        { user: 'bestie', text: 'Cute couple 🥰' },
        { user: 'fans_setia', text: 'Romantis abis!' },
        { user: 'adik_kelas', text: 'Ih gemes 😍' }
    ];
    
    let html = '';
    const numComments = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numComments; i++) {
        const comment = comments[Math.floor(Math.random() * comments.length)];
        html += `<div class="comment"><span class="comment-username">${comment.user}:</span> ${comment.text}</div>`;
    }
    return html;
}

function getRandomTime() {
    const times = ['Baru saja', '5 menit lalu', '1 jam lalu', '3 jam lalu'];
    return times[Math.floor(Math.random() * times.length)];
}

// ============= LIKE FUNCTION =============
function toggleLike(element) {
    element.classList.toggle('far');
    element.classList.toggle('fas');
    element.classList.toggle('liked');
    
    const likesSpan = element.closest('.post').querySelector('.likes-count');
    let likes = parseInt(likesSpan.textContent);
    
    if (element.classList.contains('liked')) {
        likes++;
        totalLikes++;
        createFloatingHeart(event);
    } else {
        likes--;
        totalLikes--;
    }
    
    likesSpan.textContent = likes;
    // Total cinta tetap 100%
    document.getElementById('totalLikesWelcome').textContent = '100%';
}

function createFloatingHeart(event) {
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.innerHTML = '❤️';
    heart.style.left = (event?.clientX || window.innerWidth / 2) + 'px';
    heart.style.top = (event?.clientY || window.innerHeight / 2) + 'px';
    document.getElementById('floatingHearts').appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}

// ============= COMMENT FUNCTIONS =============
function focusComment(element) {
    element.closest('.post').querySelector('.add-comment input').focus();
}

function addComment(event, input, postId) {
    if (event.key === 'Enter' && input.value.trim()) {
        submitComment(input, postId);
    }
}

function postComment(button, postId) {
    const input = button.closest('.add-comment').querySelector('input');
    if (input.value.trim()) submitComment(input, postId);
}

function submitComment(input, postId) {
    const commentText = input.value.trim();
    const commentsDiv = document.getElementById(`comments-${postId}`);
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `<span class="comment-username">kita_berdua:</span> ${commentText}`;
    commentsDiv.appendChild(newComment);
    input.value = '';
}

// ============= LOAD MORE POSTS =============
function loadMorePosts() {
    currentPage++;
    loadPosts(currentPage);
}

// ============= SINGLE STORY FUNCTIONS =============
let storyPhotoIndex = 0;

function openSingleStory() {
    storyPhotoIndex = 0;
    const lightbox = document.getElementById('storyLightbox');
    const storyImg = document.getElementById('storyImg');
    
    storyImg.src = photos[storyPhotoIndex];
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Buat counter jika belum ada
    let counter = document.getElementById('storyCounter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'story-counter';
        counter.id = 'storyCounter';
        document.querySelector('.story-container').appendChild(counter);
    }
    updateStoryCounter();
    
    startStoryProgress();
}

function startStoryProgress() {
    const progress = document.getElementById('storyProgress');
    if (progress) {
        progress.style.animation = 'none';
        progress.offsetHeight;
        progress.style.animation = 'progress 5s linear';
    }
    
    if (storyInterval) clearTimeout(storyInterval);
    storyInterval = setTimeout(() => {
        nextStoryPhoto();
    }, 5000);
}

function updateStoryCounter() {
    const counter = document.getElementById('storyCounter');
    if (counter) {
        counter.innerHTML = `${storyPhotoIndex + 1} / ${photos.length}`;
    }
}

function nextStoryPhoto() {
    storyPhotoIndex++;
    if (storyPhotoIndex >= photos.length) {
        closeStory();
        return;
    }
    document.getElementById('storyImg').src = photos[storyPhotoIndex];
    updateStoryCounter();
    startStoryProgress();
}

function prevStoryPhoto() {
    storyPhotoIndex--;
    if (storyPhotoIndex < 0) {
        storyPhotoIndex = 0;
    }
    document.getElementById('storyImg').src = photos[storyPhotoIndex];
    updateStoryCounter();
    startStoryProgress();
}

// Override fungsi story yang lama
function openStory(index) {
    openSingleStory();
}

function nextStory() {
    nextStoryPhoto();
}

function prevStory() {
    prevStoryPhoto();
}

function closeStory() {
    document.getElementById('storyLightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
    if (storyInterval) clearTimeout(storyInterval);
}

// ============= LIGHTBOX FUNCTIONS =============
function openLightbox(index) {
    currentPostIndex = index;
    document.getElementById('lightboxImg').src = photos[currentPostIndex];
    document.getElementById('postLightbox').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePostLightbox() {
    document.getElementById('postLightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changePostLightbox(n) {
    currentPostIndex = (currentPostIndex + n + photos.length) % photos.length;
    document.getElementById('lightboxImg').src = photos[currentPostIndex];
}

// ============= LOVE MESSAGE FUNCTIONS =============
function showLoveMessage() {
    document.getElementById('loveMessageModal').style.display = 'block';
    displayLoveMessages();
}

function closeLoveMessage() {
    document.getElementById('loveMessageModal').style.display = 'none';
}

function sendLoveMessage(event) {
    event.preventDefault();
    
    const name = document.getElementById('senderName').value;
    const message = document.getElementById('messageText').value;
    const time = new Date().toLocaleTimeString();
    
    loveMessages.push({ name, message, time });
    localStorage.setItem('loveMessages', JSON.stringify(loveMessages));
    
    document.getElementById('loveMessageForm').reset();
    displayLoveMessages();
}

function displayLoveMessages() {
    const container = document.getElementById('loveMessages');
    container.innerHTML = '';
    
    loveMessages.slice(-5).reverse().forEach(msg => {
        container.innerHTML += `
            <div class="message-item">
                <strong>${msg.name}</strong> <small>${msg.time}</small>
                <p>${msg.message}</p>
            </div>
        `;
    });
}

// ============= COUNTDOWN FUNCTIONS =============
function countdownToDate() {
    document.getElementById('countdownModal').style.display = 'block';
    startCountdown();
}

function closeCountdown() {
    document.getElementById('countdownModal').style.display = 'none';
}

function startCountdown() {
    const targetDate = document.getElementById('targetDate').value;
    if (!targetDate) return;
    
    const target = new Date(targetDate).getTime();
    
    setInterval(() => {
        const now = new Date().getTime();
        const distance = target - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '🎉';
            document.getElementById('hours').textContent = '🎉';
            document.getElementById('minutes').textContent = '🎉';
            document.getElementById('seconds').textContent = '🎉';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// ============= PLAYLIST FUNCTIONS =============
function togglePlaylist() {
    const modal = document.getElementById('playlistModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function closePlaylist() {
    document.getElementById('playlistModal').style.display = 'none';
}

function playSong(songFile) {
    audio.src = songFile;
    audio.play().catch(e => console.log('Play error:', e));
    if (!isMusicPlaying) toggleMusic();
}

// ============= SCROLL TO TOP =============
function scrollToTop() {
    document.querySelector('.scroll-container').scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= UPDATE DAYS TOGETHER =============
function updateDaysTogether() {
    const startDate = new Date('2025-12-05');
    const today = new Date();
    const diffDays = Math.ceil(Math.abs(today - startDate) / (1000 * 60 * 60 * 24));
    document.getElementById('daysTogether').textContent = diffDays;
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
    // Set default song ke Bergema (index 1)
    audio.src = playlist[1].file;
    songTitle.textContent = playlist[1].title;
    artistName.textContent = playlist[1].artist;
    
    // Set active state di playlist
    document.querySelectorAll('.playlist-item')[1].classList.add('active');
    
    // Load posts
    loadPosts(1);
    
    // Update stats
    updateDaysTogether();
    setInterval(updateDaysTogether, 3600000);
    
    // Set volume
    audio.volume = volumeSlider.value;
    
    // Load love messages
    displayLoveMessages();
    
    // Update total photos
    document.getElementById('totalPhotos').textContent = photos.length;
    document.getElementById('gallerySubtitle').textContent = 
        `${photos.length} kenangan indah yang telah kita lalui bersama`;
    
    // Total cinta 100%
    document.getElementById('totalLikesWelcome').textContent = '100%';
    
    // Close playlist when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.playlist-dropdown')) {
            playlistMenu.classList.remove('show');
        }
    });
    
    console.log(`✅ Website siap dengan ${photos.length} foto dan 3 lagu!`);
    console.log(`✅ Background biru dongker, total cinta 100%`);
    console.log(`✅ Stories: SATU stories berisi semua foto`);
});

// ============= KEYBOARD NAVIGATION =============
document.addEventListener('keydown', (e) => {
    const storyLightbox = document.getElementById('storyLightbox');
    const postLightbox = document.getElementById('postLightbox');
    
    if (storyLightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') prevStoryPhoto();
        if (e.key === 'ArrowRight') nextStoryPhoto();
        if (e.key === 'Escape') closeStory();
    } else if (postLightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') changePostLightbox(-1);
        if (e.key === 'ArrowRight') changePostLightbox(1);
        if (e.key === 'Escape') closePostLightbox();
    }
});

// ============= AUTO FLOATING HEARTS =============
setInterval(() => {
    if (isMusicPlaying) {
        createFloatingHeart({ 
            clientX: Math.random() * window.innerWidth, 
            clientY: Math.random() * window.innerHeight 
        });
    }
}, 2000);

// ============= EXPOSE FUNCTIONS TO GLOBAL =============
window.toggleMusic = toggleMusic;
window.selectSong = selectSong;
window.togglePlaylistMenu = togglePlaylistMenu;
window.togglePlaylist = togglePlaylist;
window.closePlaylist = closePlaylist;
window.playSong = playSong;
window.showLoveMessage = showLoveMessage;
window.closeLoveMessage = closeLoveMessage;
window.sendLoveMessage = sendLoveMessage;
window.countdownToDate = countdownToDate;
window.closeCountdown = closeCountdown;
window.startCountdown = startCountdown;
window.loadMorePosts = loadMorePosts;
window.openSingleStory = openSingleStory;
window.closeStory = closeStory;
window.nextStoryPhoto = nextStoryPhoto;
window.prevStoryPhoto = prevStoryPhoto;
window.openLightbox = openLightbox;
window.closePostLightbox = closePostLightbox;
window.changePostLightbox = changePostLightbox;
window.toggleLike = toggleLike;
window.focusComment = focusComment;
window.addComment = addComment;
window.postComment = postComment;
window.scrollToTop = scrollToTop;

// Untuk kompatibilitas dengan HTML lama
window.openStory = openSingleStory;
window.nextStory = nextStoryPhoto;
window.prevStory = prevStoryPhoto;