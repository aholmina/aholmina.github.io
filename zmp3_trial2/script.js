const apiKey = '37aa41d428ba409f88344c523895f32d';
const apiUrl = 'https://newsapi.org/v2/everything?q=keyword&apiKey=37aa41d428ba409f88344c523895f32d';
let bookmarks = JSON.parse(localStorage.getItem('newsBookmarks')) || [];

async function fetchNews(query = '') {
    showLoading(true);
    try {
        const url = query 
            ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}` 
            : `${apiUrl}&apiKey=${apiKey}`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles);
        } else {
            throw new Error('Unexpected API response format');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        displayError(`Error: ${error.message}. Please check your network connection.`);
    } finally {
        showLoading(false);
    }
}

function displayNews(newsItems) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';

    if (newsItems.length === 0) {
        newsContainer.innerHTML = '<p class="text-center">No news found.</p>';
        return;
    }

    newsItems.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'col-md-4 mb-4';
        const isBookmarked = bookmarks.some(bookmark => bookmark.url === item.url);
        newsCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${item.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'}" class="card-img-top skeleton" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description || 'No description available.'}</p>
                    <a href="${item.url}" class="btn btn-primary" target="_blank">Read More</a>
                    <button class="btn btn-outline-primary bookmark-btn" data-url="${item.url}" data-title="${item.title}" data-image="${item.urlToImage || ''}">
                        <i class="fas ${isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
                    </button>
                </div>
                <div class="card-footer text-muted">
                    Published: ${new Date(item.publishedAt).toLocaleDateString()}
                </div>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });

    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', toggleBookmark);
    });

    document.querySelectorAll('.card-img-top').forEach(img => {
        img.onload = () => {
            img.classList.remove('skeleton');
        };
    });
}

function toggleBookmark(event) {
    const btn = event.currentTarget;
    const url = btn.dataset.url;
    const title = btn.dataset.title;
    const image = btn.dataset.image;
    const icon = btn.querySelector('i');

    const index = bookmarks.findIndex(bookmark => bookmark.url === url);
    if (index === -1) {
        bookmarks.push({ url, title, image });
        icon.classList.replace('fa-regular', 'fa-solid');
        showToast('Bookmark added!', 'success');
    } else {
        bookmarks.splice(index, 1);
        icon.classList.replace('fa-solid', 'fa-regular');
        showToast('Bookmark removed!', 'warning');
    }

    localStorage.setItem('newsBookmarks', JSON.stringify(bookmarks));
    updateBookmarksList();
}

function updateBookmarksList() {
    const bookmarksList = document.getElementById('bookmarksList');
    bookmarksList.innerHTML = '';

    if (bookmarks.length === 0) {
        bookmarksList.innerHTML = '<li class="list-group-item">No bookmarks yet.</li>';
        return;
    }

    bookmarks.forEach(bookmark => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${bookmark.image || 'https://via.placeholder.com/50x50?text=No+Image'}" alt="${bookmark.title}" class="mr-3" style="width: 50px; height: 50px; object-fit: cover;">
                <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
            </div>
            <button class="btn btn-sm btn-danger remove-bookmark" data-url="${bookmark.url}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        bookmarksList.appendChild(li);
    });

    document.querySelectorAll('.remove-bookmark').forEach(btn => {
        btn.addEventListener('click', removeBookmark);
    });
}

function removeBookmark(event) {
    const url = event.currentTarget.dataset.url;
    bookmarks = bookmarks.filter(bookmark => bookmark.url !== url);
    localStorage.setItem('newsBookmarks', JSON.stringify(bookmarks));
    updateBookmarksList();

    const bookmarkBtn = document.querySelector(`.bookmark-btn[data-url="${url}"]`);
    if (bookmarkBtn) {
        bookmarkBtn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
    }
    showToast('Bookmark removed!', 'warning');
}

function displayError(message) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
}

function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.classList.toggle('d-none', !isLoading);
}

function toggleBookmarksSidebar() {
    document.getElementById('bookmarksSidebar').classList.toggle('show');
}

function closeBookmarksSidebar() {
    document.getElementById('bookmarksSidebar').classList.remove('show');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

// Update the current time every second
function updateCurrentTime() {
    const currentTimeElem = document.getElementById('time');
    const now = new Date();
    currentTimeElem.textContent = now.toLocaleTimeString();
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // Initial call to set the time immediately

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-light');
    const darkModeBtn = document.getElementById('toggleDarkMode');
    darkModeBtn.textContent = document.body.classList.contains('bg-dark') ? 'Light Mode' : 'Dark Mode';
}

// Event Listeners
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    fetchNews(query);
});

document.getElementById('toggleBookmarks').addEventListener('click', toggleBookmarksSidebar);
document.getElementById('closeBookmarks').addEventListener('click', closeBookmarksSidebar);
document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

// Close sidebar when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('bookmarksSidebar');
    const toggleBtn = document.getElementById('toggleBookmarks');
    if (!sidebar.contains(event.target) && event.target !== toggleBtn && sidebar.classList.contains('show')) {
        closeBookmarksSidebar();
    }
});

// Initial news fetch and bookmarks update
fetchNews();
updateBookmarksList();
