const gnewsApiKey = '4988606c6d8bc0074715b7701b85f8dc';
const gnewsApiUrl = 'https://gnews.io/api/v4/search?lang=en&country=us&max=10';
const weatherApiKey = '91c55f5aa1c412f7068fa589ae99b46a';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
let bookmarks = JSON.parse(localStorage.getItem('newsBookmarks')) || [];

async function fetchNews(query = '') {
    showLoading(true);
    try {
        const url = query
            ? `${gnewsApiUrl}&q=${encodeURIComponent(query)}&apikey=${gnewsApiKey}`
            : `${gnewsApiUrl}&apikey=${gnewsApiKey}`;

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

async function fetchWeather(city = 'Olongapo', country = 'ph') {
  try {
      const url = `${weatherApiUrl}?q=${encodeURIComponent(city)},${country}&APPID=${weatherApiKey}&units=metric`;
      console.log('Fetching weather from URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Weather data received:', data);
      displayWeather(data);
  } catch (error) {
      console.error('Error fetching weather:', error);
      displayError(`Error fetching weather: ${error.message}. Please check the console for more details.`);
  }
}
function displayWeather(weatherData) {
    const weatherWidget = document.getElementById('weatherWidget');
    const temperature = Math.round(weatherData.main.temp);
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;

    weatherWidget.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}" class="me-2">
            <div>
                <h6 class="mb-0">${weatherData.name}</h6>
                <p class="mb-0">${temperature}°C, ${description}</p>
            </div>
        </div>
    `;
}

function displayNews(newsItems) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';

    if (newsItems.length === 0) {
        newsContainer.innerHTML = '<p class="text-center">No news found.</p>';
        return;
    }

    newsItems.forEach(item => {
        const imageUrl = item.image || 'https://via.placeholder.com/300x200?text=No+Image';

        const newsCard = document.createElement('div');
        newsCard.className = 'col-md-4 mb-4';
        const isBookmarked = bookmarks.some(bookmark => bookmark.url === item.url);
        newsCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${imageUrl}" class="card-img-top" alt="${item.title}"> 
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description || 'No description available.'}</p>
                    <a href="${item.url}" class="btn btn-primary" target="_blank">Read More</a>
                    <button class="btn btn-outline-primary bookmark-btn" data-url="${item.url}" data-title="${item.title}" data-image="${imageUrl}">
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
        showToast('Bookmark added!', 'secondary');
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

function updateCurrentTime() {
    const currentTimeElem = document.getElementById('time');
    const now = new Date();
    currentTimeElem.textContent = now.toLocaleTimeString();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeBtn = document.getElementById('toggleDarkMode');
    darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    fetchNews(query);
});

document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
});

document.getElementById('toggleBookmarks').addEventListener('click', toggleBookmarksSidebar);
document.getElementById('closeBookmarks').addEventListener('click', closeBookmarksSidebar);
document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('bookmarksSidebar');
    const toggleBtn = document.getElementById('toggleBookmarks');
    if (!sidebar.contains(event.target) && event.target !== toggleBtn && sidebar.classList.contains('show')) {
        closeBookmarksSidebar();
    }
});


setInterval(updateCurrentTime, 1000);
updateCurrentTime();
fetchNews();
fetchWeather(); // Fetch weather for default city (London)
updateBookmarksList();