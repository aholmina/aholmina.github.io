// API Keys and URLs
const gnewsApiKey = 'API_KEY';
const gnewsApiUrl = 'https://gnews.io/api/v4/top-headlines?category=general&apikey=API_KEY';
const weatherApiKey = 'API_KEY';
const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=API_KEY';
const youtubeApiKey = 'API_KEY';
const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search';

// Global Variables
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let currentPage = 1;
let isLoading = false;
let isDarkMode = false;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

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
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'NewsApp/1.0'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles.slice(0, 9), true);
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
    newsContainer.innerHTML = '';

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
    const isFavorite = bookmarks.some(bookmark => bookmark.url === item.url);
    
    newsCard.innerHTML = `
        <div class="card h-100 w-100 shadow-sm">
            <img data-src="${imageUrl}" class="card-img-top lazy" alt="${item.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description || 'No description available.'}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <a href="${item.url}" class="btn btn-primary btn-sm" target="_blank">Read More</a>
                    <button class="btn btn-outline-secondary btn-sm bookmark-btn" data-url="${item.url}">
                        <i class="fas ${isFavorite ? 'fa-bookmark' : 'fa-bookmark-o'}"></i>
                    </button>
                </div>
            </div>
            <div class="card-footer text-muted">
                Published: ${new Date(item.publishedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    `;
    const bookmarkBtn = newsCard.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', () => toggleBookmark(item));

    return newsCard;
}


// Weather Functions
async function fetchWeather(city = 'Las Piñas') {
    try {
        console.log(`Fetching weather for ${city}`);
        
        let lat, lon;
        
        if (city.toLowerCase() === 'las piñas') {
            lat = 14.4500;
            lon = 120.9833;
        } else {
            const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},PH&limit=1&appid=${weatherApiKey}`;
            console.log(`Geocoding URL: ${geocodeUrl}`);
            
            const geocodeResponse = await fetch(geocodeUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'WeatherApp/1.0'
                }
            });
            if (!geocodeResponse.ok) {
                throw new Error(`Geocoding HTTP error! status: ${geocodeResponse.status}`);
            }
            const geocodeData = await geocodeResponse.json();
            console.log('Geocode data:', geocodeData);
            
            if (geocodeData.length === 0) {
                throw new Error('City not found in the Philippines');
            }

            ({ lat, lon } = geocodeData[0]);
        }
        
        console.log(`Coordinates: lat ${lat}, lon ${lon}`);

        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
        console.log(`Weather URL: ${weatherUrl}`);
        
        const weatherResponse = await fetch(weatherUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'WeatherApp/1.0'
            }
        });
        if (!weatherResponse.ok) {
            throw new Error(`Weather HTTP error! status: ${weatherResponse.status}`);
        }
        const weatherData = await weatherResponse.json();
        console.log('Weather data:', weatherData);

        displayCurrentWeather(weatherData.current, weatherData.daily, city);
        displayMinuteForecast(weatherData.minutely);
        displayHourlyForecast(weatherData.hourly);
        displayDailyForecast(weatherData.daily);
        displayWeatherAlerts(weatherData.alerts);
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayError(`Error fetching weather: ${error.message}. Please check the console for more details.`);
    }
}

function generateWeatherSummary(currentData, tomorrowData, city) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySummary = `Today's weather in ${city} (${today.toLocaleDateString()}): ${currentData.weather[0].description}. 
        Temperature around ${Math.round(currentData.temp)}°C. 
        Humidity: ${currentData.humidity}%. 
        Wind speed: ${currentData.wind_speed} m/s.`;

    const tomorrowSummary = `Tomorrow's forecast for ${city} (${tomorrow.toLocaleDateString()}): ${tomorrowData.weather[0].description}. 
        Temperature between ${Math.round(tomorrowData.temp.min)}°C and ${Math.round(tomorrowData.temp.max)}°C. 
        Humidity: ${tomorrowData.humidity}%. 
        Wind speed: ${tomorrowData.wind_speed} m/s.`;

    return `${todaySummary}\n\n${tomorrowSummary}`;
}

function displayCurrentWeather(currentData, dailyData, city) {
    const weatherWidget = document.getElementById('weatherWidget');
    const temperature = Math.round(currentData.temp);
    const description = currentData.weather[0].description;
    const icon = currentData.weather[0].icon;
    const date = new Date(currentData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const weatherSummary = generateWeatherSummary(currentData, dailyData[1], city);

    weatherWidget.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h3 class="card-title mb-4">${city}</h3>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="display-4 font-weight-bold">${temperature}°C</div>
                    <div class="text-center">
                        <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}" class="weather-icon mb-2" style="width: 64px; height: 64px;">
                        <div class="h5">${description}</div>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="row">
                        <div class="col-6">
                            <p><i class="fas fa-tint"></i> Humidity: ${currentData.humidity}%</p>
                        </div>
                        <div class="col-6">
                            <p><i class="fas fa-wind"></i> Wind: ${currentData.wind_speed} m/s</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <h5>Weather Summary</h5>
                    <p>${weatherSummary}</p>
                </div>
                <small class="text-muted">${date}</small>
            </div>
        </div>
    `;
}

function displayMinuteForecast(minutelyData) {
    const forecastContainer = document.getElementById('minuteForecastContainer');
    forecastContainer.innerHTML = '<h5 class="mb-3">Minute Forecast (Next Hour)</h5>';
    
    if (!minutelyData || minutelyData.length === 0) {
        forecastContainer.innerHTML += '<p>Minute forecast data not available for this location.</p>';
        return;
    }

    const minutelyChart = document.createElement('canvas');
    forecastContainer.appendChild(minutelyChart);

    new Chart(minutelyChart, {
        type: 'line',
        data: {
            labels: minutelyData.slice(0, 60).map((data, index) => `${index}m`),
            datasets: [{
                label: 'Precipitation (mm)',
                data: minutelyData.slice(0, 60).map(data => data.precipitation),
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayHourlyForecast(hourlyData) {
    const forecastContainer = document.getElementById('hourlyForecastContainer');
    forecastContainer.innerHTML = '<h5 class="mb-3">Hourly Forecast (Next 48 Hours)</h5>';

    const hourlyChart = document.createElement('canvas');
    forecastContainer.appendChild(hourlyChart);

    new Chart(hourlyChart, {
        type: 'line',
        data: {
            labels: hourlyData.slice(0, 48).map(data => new Date(data.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' })),
            datasets: [{
                label: 'Temperature (°C)',
                data: hourlyData.slice(0, 48).map(data => data.temp),
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function displayDailyForecast(dailyData) {
    const forecastContainer = document.getElementById('dailyForecastContainer');
    forecastContainer.innerHTML = '<h5 class="mb-3">Daily Forecast (Next 8 Days)</h5>';

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;
        const tempMin = Math.round(day.temp.min);
        const tempMax = Math.round(day.temp.max);

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
                    </div>
                </div>
            </div>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function displayWeatherAlerts(alerts) {
    const alertContainer = document.getElementById('weatherAlertContainer');
    alertContainer.innerHTML = '<h5 class="mb-3">Weather Alerts</h5>';

    if (!alerts || alerts.length === 0) {
        alertContainer.innerHTML += '<p>No current weather alerts.</p>';
        return;
    }

    alerts.forEach(alert => {
        const alertCard = document.createElement('div');
        alertCard.className = 'card mb-2 bg-warning';
        alertCard.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">${alert.event}</h6>
                <p class="mb-0">${alert.description}</p>
                <small>From: ${new Date(alert.start * 1000).toLocaleString()} To: ${new Date(alert.end * 1000).toLocaleString()}</small>
            </div>
        `;
        alertContainer.appendChild(alertCard);
    });
}



// Gemini Functions
async function fetchGeminiResponse(query) {
    showLoading(true);
    try {
        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'GeminiApp/1.0'
            },
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
async function fetchYouTubeVideos(query, maxResults = 4) {
    try {
        showLoading(true);
        const searchUrl = `${youtubeApiUrl}?part=snippet&q=${encodeURIComponent(query)}&key=${youtubeApiKey}&type=video&maxResults=${maxResults}`;
        const searchResponse = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'YouTubeApp/1.0'
            }
        });
        if (!searchResponse.ok) {
            throw new Error(`HTTP error! status: ${searchResponse.status}`);
        }
        const searchData = await searchResponse.json();
        
        const videoDetails = await Promise.all(searchData.items.map(async (video) => {
            const videoId = video.id.videoId;
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${youtubeApiKey}`;
            const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${youtubeApiKey}&maxResults=10`;
            
            const [detailsResponse, commentsResponse] = await Promise.all([
                fetch(detailsUrl),
                fetch(commentsUrl)
            ]);
            
            const detailsData = await detailsResponse.json();
            const commentsData = await commentsResponse.json();
            
            return {
                ...video,
                statistics: detailsData.items[0].statistics,
                comments: commentsData.items
            };
        }));
        
        displayYouTubeVideos(videoDetails);
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

    youtubeContainer.innerHTML = videos.map(video => {
        const isFavorite = bookmarks.some(bookmark => bookmark.id === video.id.videoId);
        return `
            <div class="card mb-4">
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${video.id.videoId}" allowfullscreen></iframe>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${video.snippet.title}</h5>
                    <p class="card-text">${video.snippet.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="me-3"><i class="fas fa-eye"></i> ${video.statistics.viewCount}</span>
                            <span class="me-3"><i class="fas fa-thumbs-up"></i> ${video.statistics.likeCount}</span>
                            <span><i class="fas fa-comment"></i> ${video.statistics.commentCount}</span>
                        </div>
                        <button class="btn btn-outline-secondary btn-sm bookmark-btn" data-id="${video.id.videoId}">
                            <i class="fas ${isFavorite ? 'fa-bookmark' : 'fa-bookmark-o'}"></i>
                        </button>
                    </div>
                </div>
                <div class="card-footer">
                    <h6>Comments</h6>
                    <form class="add-comment-form mb-3">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Add a comment..." required>
                            <button class="btn btn-primary" type="submit">Post</button>
                        </div>
                    </form>
                    <div class="comments-container">
                        ${displayComments(video.comments)}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    youtubeContainer.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.dataset.id;
            const video = videos.find(v => v.id.videoId === videoId);
            toggleBookmark(video, 'youtube');
        });
    });

    youtubeContainer.querySelectorAll('.add-comment-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const commentsContainer = form.nextElementSibling;
            addComment(commentsContainer, input.value);
            input.value = '';
        });
    });
}

function displayComments(comments) {
    if (!comments || comments.length === 0) {
        return '<p>No comments available.</p>';
    }

    return comments.map(comment => {
        const topLevelComment = comment.snippet.topLevelComment.snippet;
        const replies = comment.replies ? comment.replies.comments : [];

        return `
            <div class="comment mb-3">
                <div class="d-flex justify-content-between">
                    <strong>${topLevelComment.authorDisplayName}</strong>
                    <div>
                        <button class="btn btn-sm btn-outline-primary like-btn" data-likes="${topLevelComment.likeCount}">
                            <i class="fas fa-thumbs-up"></i> <span class="likes-count">${topLevelComment.likeCount}</span>
                        </button>
                    </div>
                </div>
                <p>${topLevelComment.textDisplay}</p>
                <button class="btn btn-sm btn-outline-secondary reply-btn">Reply</button>
                <div class="replies mt-2">
                    ${displayReplies(replies)}
                </div>
                <form class="add-reply-form mt-2" style="display: none;">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Add a reply..." required>
                        <button class="btn btn-primary" type="submit">Post</button>
                    </div>
                </form>
            </div>
        `;
    }).join('');
}

function displayReplies(replies) {
    return replies.map(reply => `
        <div class="reply mb-2">
            <div class="d-flex justify-content-between">
                <strong>${reply.snippet.authorDisplayName}</strong>
                <div>
                    <button class="btn btn-sm btn-outline-primary like-btn" data-likes="${reply.snippet.likeCount}">
                        <i class="fas fa-thumbs-up"></i> <span class="likes-count">${reply.snippet.likeCount}</span>
                    </button>
                </div>
            </div>
            <p>${reply.snippet.textDisplay}</p>
        </div>
    `).join('');
}

function addComment(container, text) {
    const newComment = document.createElement('div');
    newComment.className = 'comment mb-3';
    newComment.innerHTML = `
        <div class="d-flex justify-content-between">
            <strong>You</strong>
            <div>
                <button class="btn btn-sm btn-outline-primary like-btn" data-likes="0">
                    <i class="fas fa-thumbs-up"></i> <span class="likes-count">0</span>
                </button>
            </div>
        </div>
        <p>${text}</p>
        <button class="btn btn-sm btn-outline-secondary reply-btn">Reply</button>
        <div class="replies mt-2"></div>
        <form class="add-reply-form mt-2" style="display: none;">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Add a reply..." required>
                <button class="btn btn-primary" type="submit">Post</button>
            </div>
        </form>
    `;   
    container.prepend(newComment);
    addEventListeners(newComment);
}

function addEventListeners(element) {
    const likeBtn = element.querySelector('.like-btn');
    const replyBtn = element.querySelector('.reply-btn');
    const replyForm = element.querySelector('.add-reply-form');

    likeBtn.addEventListener('click', () => {
        const likesCount = likeBtn.querySelector('.likes-count');
        let likes = parseInt(likeBtn.dataset.likes);
        likes++;
        likeBtn.dataset.likes = likes;
        likesCount.textContent = likes;
    });

    replyBtn.addEventListener('click', () => {
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
    });

    replyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = replyForm.querySelector('input');
        const repliesContainer = element.querySelector('.replies');
        addReply(repliesContainer, input.value);
        input.value = '';
        replyForm.style.display = 'none';
    });
}

function addReply(container, text) {
    const newReply = document.createElement('div');
    newReply.className = 'reply mb-2 me-2';
    newReply.innerHTML = `
        <div class="d-flex justify-content-between">
            <strong>You</strong>
            <div>
                <button class="btn btn-sm btn-outline-primary like-btn" data-likes="0">
                    <i class="fas fa-thumbs-up"></i> <span class="likes-count">0</span>
                </button>
            </div>
        </div>
        <p>${text}</p>
    `;
    container.appendChild(newReply);
    addEventListeners(newReply);
}

// Bookmark Functions
function toggleBookmark(item, type = 'news') {
    const index = bookmarks.findIndex(bookmark => 
        (type === 'news' && bookmark.url === item.url) || 
        (type === 'youtube' && bookmark.id === item.id.videoId)
    );

    if (index > -1) {
        bookmarks.splice(index, 1);
        showToast('Bookmark removed', 'info');
    } else {
        const newBookmark = type === 'news' 
            ? { type, url: item.url, title: item.title, image: item.image }
            : { type, id: item.id.videoId, title: item.snippet.title, image: item.snippet.thumbnails.medium.url };
        bookmarks.push(newBookmark);
        showToast('Bookmark added', 'success');
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkGallery();
    updateBookmarkButtons();
}

function updateBookmarkGallery() {
    const gallery = document.getElementById('bookmarkGallery');
    gallery.innerHTML = bookmarks.map((bookmark, index) => `
        <div class="col-6 col-md-4 mb-3">
            <div class="card h-100">
                <img src="${bookmark.image}" class="card-img-top" alt="${bookmark.title}" style="height: 100px; object-fit: cover;">
                <div class="card-body p-2">
                    <h6 class="card-title" style="font-size: 0.9rem;">${bookmark.title}</h6>
                    <button class="btn btn-sm btn-outline-danger remove-bookmark" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    gallery.querySelectorAll('.remove-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            bookmarks.splice(index, 1);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            updateBookmarkGallery();
            updateBookmarkButtons();
            showToast('Bookmark removed', 'info');
        });
    });
}

function updateBookmarkButtons() {
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const url = btn.dataset.url;
        const id = btn.dataset.id;
        const isFavorite = bookmarks.some(bookmark => 
            (bookmark.type === 'news' && bookmark.url === url) || 
            (bookmark.type === 'youtube' && bookmark.id === id)
        );
        btn.innerHTML = `<i class="fas ${isFavorite ? 'fa-bookmark' : 'fa-bookmark-o'}"></i>`;
    });
}

function shareBookmarks(platform) {
    const bookmarkUrls = bookmarks.map(b => b.type === 'news' ? b.url : `https://www.youtube.com/watch?v=${b.id}`).join('\n');
    const shareText = `Check out my bookmarks:\n${bookmarkUrls}`;
    
    let shareUrl;
    switch (platform) {
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            break;
        default:
            console.log(`Sharing on ${platform} is not implemented yet.`);
            return;
    }

    window.open(shareUrl, '_blank');
}

// Event Listeners
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    fetchNews();
    fetchWeather();
    fetchYouTubeVideos('news');  // Fetch some default videos
    updateBookmarkGallery();
   
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }

    // Add event listener for YouTube container
    document.getElementById('youtubeContainer').addEventListener('click', (e) => {
        if (e.target.classList.contains('like-btn')) {
            const likesCount = e.target.querySelector('.likes-count');
            let likes = parseInt(e.target.dataset.likes);
            likes++;
            e.target.dataset.likes = likes;
            likesCount.textContent = likes;
        }
    });
});