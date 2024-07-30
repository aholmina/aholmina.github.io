// API Keys and URLs
const gnewsApiKey = '4988606c6d8bc0074715b7701b85f8dc';
const gnewsApiUrl = 'https://gnews.io/api/v4/search?lang=en&country=us&max=6';
const weatherApiKey = '91c55f5aa1c412f7068fa589ae99b46a';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCUsPd1SlVjJ03Tu8K5HQBEIRYAfgTEnsc';
const youtubeApiKey = 'AIzaSyDjILBZ96SsOURt-undwkPWTSNsD2jnwkc';
const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search';

// Global Variables
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentPage = 1;
let isLoading = false;
let isDarkMode = false;

// Helper Functions
function updateCurrentTime() {
    const navbarTimeElem = document.getElementById('navbarTime');
    const navbarDateElem = document.getElementById('navbarDate');
    const now = new Date();
    
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    if (navbarTimeElem) navbarTimeElem.textContent = timeString;
    if (navbarDateElem) navbarDateElem.textContent = dateString;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeBtn = document.getElementById('toggleDarkMode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
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

function displayError(message) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// News Functions
async function fetchNews(query = '', page = 1) {
    if (isLoading) return;
    isLoading = true;
    showLoading(true);
    try {
        const url = `${gnewsApiUrl}&q=${encodeURIComponent(query)}&apikey=${gnewsApiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles.slice(0, 6), true); // Display only the first 6 articles
        } else {
            throw new Error('Unexpected API response format');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        displayError(`Error: ${error.message}. Please check your network connection.`);
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

function displayNews(newsItems) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = ''; // Always clear existing content

    if (newsItems.length === 0) {
        newsContainer.innerHTML = '<p class="text-center">No news found.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    newsItems.forEach(item => {
        const newsCard = createNewsCard(item);
        fragment.appendChild(newsCard);
    });
    newsContainer.appendChild(fragment);

    // Implement lazy loading for images
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy');
                observer.unobserve(lazyImage);
            }
        });
    });
    lazyImages.forEach(image => lazyImageObserver.observe(image));
}

function createNewsCard(item) {
    const newsCard = document.createElement('div');
    newsCard.className = 'col-md-6 col-lg-4 mb-4';
    const imageUrl = item.image || 'https://via.placeholder.com/300x300?text=No+Image';
    const isFavorite = favorites.some(fav => fav.url === item.url);
    
    newsCard.innerHTML = `
        <div class="card h-100 w-100 shadow-sm">
            <img data-src="${imageUrl}" class="card-img-top lazy" alt="${item.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description || 'No description available.'}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <a href="${item.url}" class="btn btn-primary btn-sm" target="_blank">Read More</a>
                    <button class="btn btn-outline-secondary btn-sm favorite-btn" data-url="${item.url}">
                        <i class="fas ${isFavorite ? 'fa-star' : 'fa-star-o'}"></i>
                    </button>
                </div>
            </div>
            <div class="card-footer text-muted">
                Published: ${new Date(item.publishedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    `;
    const favoriteBtn = newsCard.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => toggleFavorite(item));

    return newsCard;
}





// Weather Functions
async function fetchWeather(city = 'Olongapo', country = 'ph') {
    try {
        const currentWeatherUrl = `${weatherApiUrl}?q=${encodeURIComponent(city)},${country}&APPID=${weatherApiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},${country}&APPID=${weatherApiKey}&units=metric`;

        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
            throw new Error(`HTTP error! status: ${currentWeatherResponse.status || forecastResponse.status}`);
        }

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayError(`Error fetching weather: ${error.message}. Please check the console for more details.`);
    }
}

function displayCurrentWeather(weatherData) {
    const weatherWidget = document.getElementById('weatherWidget');
    const temperature = Math.round(weatherData.main.temp);
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const date = new Date(weatherData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    weatherWidget.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Current Weather in ${weatherData.name}</h5>
                <div class="d-flex align-items-center">
                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}" class="me-2">
                    <div>
                        <h6 class="mb-0">${temperature}°C, ${description}</h6>
                        <p class="mb-0">Humidity: ${weatherData.main.humidity}%</p>
                        <p class="mb-0">Wind: ${weatherData.wind.speed} m/s</p>
                        <small>${date}</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '<h5 class="mb-3">5-Day Forecast</h5>';

    const dailyForecasts = groupForecastsByDay(forecastData.list);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = forecast.weather[0].icon;
        const description = forecast.weather[0].description;
        const tempMin = Math.round(forecast.temp.min);
        const tempMax = Math.round(forecast.temp.max);
        const precipitation = Math.round(forecast.pop * 100);

        const forecastCard = document.createElement('div');
        forecastCard.className = 'card mb-2';
        forecastCard.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">${dayName}</h6>
                <div class="d-flex align-items-center">
                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}" class="me-2">
                    <div>
                        <p class="mb-0">${tempMin}°C - ${tempMax}°C</p>
                        <p class="mb-0">${description}</p>
                        <p class="mb-0">Precipitation: ${precipitation}%</p>
                    </div>
                </div>
            </div>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function groupForecastsByDay(forecastList) {
    const dailyForecasts = [];
    const groupedForecasts = {};

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toDateString();
        if (!groupedForecasts[date]) {
            groupedForecasts[date] = [];
        }
        groupedForecasts[date].push(forecast);
    });

    for (const date in groupedForecasts) {
        const dayForecasts = groupedForecasts[date];
        const averageForecast = {
            dt: dayForecasts[0].dt,
            temp: {
                min: Math.min(...dayForecasts.map(f => f.main.temp_min)),
                max: Math.max(...dayForecasts.map(f => f.main.temp_max))
            },
            weather: [dayForecasts[Math.floor(dayForecasts.length / 2)].weather[0]],
            pop: Math.max(...dayForecasts.map(f => f.pop))
        };
        dailyForecasts.push(averageForecast);
    }

    return dailyForecasts.slice(1, 6); // Return the next 5 days, excluding today
}

// Gemini Functions
async function fetchGeminiResponse(query) {
    showLoading(true);
    try {
        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }]
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        displayGeminiResponse(data);
    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        displayError(`Error: ${error.message}. Please check your network connection.`);
    } finally {
        showLoading(false);
    }
}

function displayGeminiResponse(data) {
    const geminiContainer = document.getElementById('geminiContainer');
    const responseText = data.candidates[0].content.parts[0].text;
  
    // Split the response into sentences
    const sentences = responseText.split(/[.!?]+\s+/);
  
    geminiContainer.innerHTML = `
      <div class="card">
        <div class="card-body" style="margin-bottom: 20px;"> 
          <h5 class="card-title" style="margin-bottom: 15px;">Gemini Response</h5>
          <ul style="padding-left: 20px; list-style-type: disc;">  
            ${sentences.map(sentence => `<li style="margin-bottom: 8px;">${sentence}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
}


// YouTube Functions
async function fetchYouTubeVideos(query, maxResults = 3) {
    try {
        showLoading(true);
        const url = `${youtubeApiUrl}?part=snippet&q=${encodeURIComponent(query)}&key=${youtubeApiKey}&type=video&maxResults=${maxResults}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayYouTubeVideos(data.items);
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        showToast('Failed to fetch YouTube videos. Please try again later.', 'error');
    } finally {
        showLoading(false);
    }
}

function displayYouTubeVideos(videos) {
    const youtubeContainer = document.getElementById('youtubeContainer');
    if (!videos || videos.length === 0) {
        youtubeContainer.innerHTML = '<p class="text-center">No videos found.</p>';
        return;
    }

    youtubeContainer.innerHTML = `
        <div class="row">
            ${videos.map(video => {
                const isFavorite = favorites.some(fav => fav.id === video.id.videoId);
                return `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${video.snippet.thumbnails.medium.url}" class="card-img-top" alt="${video.snippet.title}" style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title">${video.snippet.title}</h5>
                                <p class="card-text">${video.snippet.description}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <a href="https://www.youtube.com/watch?v=${video.id.videoId}" class="btn btn-primary btn-sm" target="_blank">Watch Video</a>
                                    <button class="btn btn-outline-secondary btn-sm favorite-btn" data-id="${video.id.videoId}">
                                        <i class="fas ${isFavorite ? 'fa-star' : 'fa-star-o'}"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    youtubeContainer.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.dataset.id;
            const video = videos.find(v => v.id.videoId === videoId);
            toggleFavorite(video);
            btn.querySelector('i').classList.toggle('fa-star');
            btn.querySelector('i').classList.toggle('fa-star-o');
        });
    });
}


// Search History Functions
function updateSearchHistory(query) {
    searchHistory = searchHistory.filter(item => item !== query);
    searchHistory.unshift(query);
    if (searchHistory.length > 5) searchHistory.pop();
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateSearchHistoryWidget();
}

function updateSearchHistoryWidget() {
    const historyContainer = document.getElementById('searchHistoryWidget');
    historyContainer.innerHTML = '';
    searchHistory.forEach(query => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-secondary btn-sm me-2 mb-2';
        btn.textContent = query;
        btn.addEventListener('click', () => {
            document.getElementById('searchInput').value = query;
            fetchNews(query);
        });
        historyContainer.appendChild(btn);
    });
}

function clearSearchHistory() {
    searchHistory = [];
    localStorage.removeItem('searchHistory');
    updateSearchHistoryWidget();
}



// Event Listeners
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    fetchNews(query);
    updateSearchHistory(query);
});

document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
});

document.getElementById('geminiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('geminiInput').value;
    fetchGeminiResponse(query);
});

document.getElementById('youtubeSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('youtubeSearchInput').value;
    fetchYouTubeVideos(query);
});

document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !isLoading) {
        fetchNews(document.getElementById('searchInput').value, currentPage + 1);
    }
});

document.getElementById('backToTopBtn').addEventListener('click', scrollToTop);

document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    fetchNews();
    fetchWeather();
    fetchYouTubeVideos('news');  // Fetch some default videos
    updateSearchHistoryWidget();
    updateFavoritesGallery();
    
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
});

// Widget Pane Toggle
document.addEventListener('DOMContentLoaded', function() {
    const widgetToggle = document.querySelector('.widget-toggle');
    const widgetPane = document.querySelector('.widget-pane');
  
    widgetToggle.addEventListener('click', function() {
        widgetPane.classList.toggle('show');
    });
});








function toggleFavorite(item) {
    const index = favorites.findIndex(fav => fav.id === item.id);
    if (index === -1) {
        favorites.push(item);
        showToast('Added to favorites', 'success');
    } else {
        favorites.splice(index, 1);
        showToast('Removed from favorites', 'info');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
    updateFavoritesGallery(); // Update the favorites in the widget pane
}

function updateFavoritesDisplay() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-center">No favorites yet.</p>';
        return;
    }

    favorites.forEach(item => {
        const favoriteCard = createFavoriteCard(item);
        favoritesContainer.appendChild(favoriteCard);
    });
}

function createFavoriteCard(item) {
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'col-md-4 mb-4';
    const imageUrl = item.image || item.snippet?.thumbnails?.medium?.url || 'https://via.placeholder.com/300x200?text=No+Image';

    favoriteCard.innerHTML = `
        <div class="card h-100">
            <img src="${imageUrl}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description || item.snippet?.description || 'No description available.'}</p>
                <a href="${item.url || `https://www.youtube.com/watch?v=${item.id.videoId}`}" class="btn btn-primary btn-sm" target="_blank">
                    ${item.url ? 'Read More' : 'Watch Video'}
                </a>
                <button class="btn btn-danger btn-sm float-end remove-favorite" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

    const removeBtn = favoriteCard.querySelector('.remove-favorite');
    removeBtn.addEventListener('click', () => toggleFavorite(item));

    return favoriteCard;
}

function updateFavoritesGallery() {
    const favoritesGallery = document.getElementById('favoritesGallery');
    favoritesGallery.innerHTML = '';

    favorites.forEach(item => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'col-6 col-md-4 mb-3';
        const imageUrl = item.image || item.snippet?.thumbnails?.medium?.url || 'https://via.placeholder.com/300x200?text=No+Image';

        favoriteItem.innerHTML = `
            <div class="card h-100">
                <img src="${imageUrl}" class="card-img-top" alt="${item.title}" style="height: 100px; object-fit: cover;">
                <div class="card-body p-2">
                    <h6 class="card-title small">${item.title}</h6>
                    <button class="btn btn-danger btn-sm remove-favorite" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        const removeBtn = favoriteItem.querySelector('.remove-favorite');
        removeBtn.addEventListener('click', () => toggleFavorite(item));

        favoritesGallery.appendChild(favoriteItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    updateFavoritesDisplay();
    updateFavoritesGallery();

    // ... rest of your existing code ...
});