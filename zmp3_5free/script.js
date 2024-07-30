const gnewsApiKey = '4988606c6d8bc0074715b7701b85f8dc';
const gnewsApiUrl = 'https://gnews.io/api/v4/search?lang=en&country=us&max=10';
const weatherApiKey = '91c55f5aa1c412f7068fa589ae99b46a';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCUsPd1SlVjJ03Tu8K5HQBEIRYAfgTEnsc';
const youtubeApiKey = 'AIzaSyDjILBZ96SsOURt-undwkPWTSNsD2jnwkc';
const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search';
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let currentPage = 1;
let isLoading = false;
let isDarkMode = false;

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

document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    // ... other initialization code ...
});

setInterval(updateCurrentTime, 1000);

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

async function fetchNews(query = '', page = 1) {
    if (isLoading) return;
    isLoading = true;
    showLoading(true);
    try {
        const url = `${gnewsApiUrl}&q=${encodeURIComponent(query)}&page=${page}&apikey=${gnewsApiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles, page === 1);
            currentPage = page;
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

async function fetchWeather(city = 'Olongapo', country = 'ph') {
    try {
        const url = `${weatherApiUrl}?q=${encodeURIComponent(city)},${country}&APPID=${weatherApiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const data = await response.json();
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
    const date = new Date(weatherData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    weatherWidget.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}" class="me-2">
            <div>
                <h6 class="mb-0">${weatherData.name}</h6>
                <p class="mb-0">${temperature}°C, ${description}</p>
                <small>${date}</small>
            </div>
        </div>
    `;
}

function displayNews(newsItems, clearExisting = true) {
    const newsContainer = document.getElementById('newsContainer');
    if (clearExisting) newsContainer.innerHTML = '';

    if (newsItems.length === 0) {
        newsContainer.innerHTML += '<p class="text-center">No news found.</p>';
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
    newsCard.innerHTML = `
        <div class="card h-100 w-100 shadow-sm">
            <img data-src="${imageUrl}" class="card-img-top lazy" alt="${item.title}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description || 'No description available.'}</p>
                <a href="${item.url}" class="btn btn-primary btn-sm" target="_blank">Read More</a>
            </div>
            <div class="card-footer text-muted">
                Published: ${new Date(item.publishedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    `;
    return newsCard;
}

function displayError(message) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
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
    geminiContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Gemini Response</h5>
                <p class="card-text">${responseText}</p>
            </div>
        </div>
    `;
}

function updateSearchHistory(query) {
    searchHistory = searchHistory.filter(item => item !== query);
    searchHistory.unshift(query);
    if (searchHistory.length > 5) searchHistory.pop();
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

function displaySearchHistory() {
    const historyContainer = document.getElementById('searchHistory');
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

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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



// ... (previous code remains the same)

const fmpApiKey = 'Pgn165qafw9mrwEkKBKeKxgISgXODzSx';
const fmpApiUrl = 'https://financialmodelingprep.com/api/v3';

async function fetchFinancialData(limit = 5) {
    try {
        showLoading(true);
        const url = `${fmpApiUrl}/stock_market/actives?apikey=${fmpApiKey}&limit=${limit}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayFinancialData(data);
    } catch (error) {
        console.error('Error fetching financial data:', error);
        showToast('Failed to fetch financial data. Please try again later.', 'error');
    } finally {
        showLoading(false);
    }
}

function displayFinancialData(stocks) {
    const financialContainer = document.getElementById('financialContainer');
    if (!stocks || stocks.length === 0) {
        financialContainer.innerHTML = '<p class="text-center">No financial data available.</p>';
        return;
    }

    financialContainer.innerHTML = `
        <div class="financial-billboard">
            <h2 class="text-center mb-4">Top Active Stocks</h2>
            <div class="stock-ticker">
                ${stocks.map(stock => `
                    <div class="stock-item">
                        <div class="stock-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stock-info">
                            <h3 class="stock-symbol">${stock.symbol}</h3>
                            <p class="stock-price">$${parseFloat(stock.price).toFixed(2)}</p>
                            <p class="stock-change ${parseFloat(stock.changesPercentage) >= 0 ? 'text-success' : 'text-danger'}">
                                <i class="fas ${parseFloat(stock.changesPercentage) >= 0 ? 'fa-caret-up' : 'fa-caret-down'}"></i>
                                ${Math.abs(parseFloat(stock.changesPercentage)).toFixed(2)}%
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button id="refreshFinancial" class="btn btn-primary mt-3">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
        </div>
    `;

    document.getElementById('refreshFinancial').addEventListener('click', () => fetchFinancialData(5));
    animateStockItems();
}

function animateStockItems() {
    const stockItems = document.querySelectorAll('.stock-item');
    stockItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}


document.getElementById('backToTopBtn').addEventListener('click', scrollToTop);

document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    fetchNews();
    fetchWeather();
    
    fetchFinancialData();
    fetchYouTubeVideos();  // Fetch some default videos
    displaySearchHistory();
    
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
});



async function fetchYouTubeVideos(query, maxResults = 3) {
    try {
        showLoading(true);
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${youtubeApiKey}&type=video&maxResults=${maxResults}`;
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
            ${videos.map(video => `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${video.snippet.thumbnails.medium.url}" class="card-img-top" alt="${video.snippet.title}">
                        <div class="card-body">
                            <h5 class="card-title">${video.snippet.title}</h5>
                            <p class="card-text">${video.snippet.description}</p>
                            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" class="btn btn-primary" target="_blank">Watch Video</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    // ... (existing code)

    document.getElementById('youtubeSearchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const query = document.getElementById('youtubeSearchInput').value;
        fetchYouTubeVideos(query);
    });
});

function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}

function showToast(message, type = 'info') {
    // You can implement this based on your preferred way of showing notifications
    alert(message);
}
    

function updateDateTime() {
    const navbarDateTimeElem = document.getElementById('navbarDateTime');
    const now = new Date();
    
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    if (navbarDateTimeElem) {
        navbarDateTimeElem.innerHTML = `
            <div class="date">${dateString}</div>
            <div class="time">${timeString}</div>
        `;
    }
}

// Update date and time every second
setInterval(updateDateTime, 1000);

// Initial date and time update
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
});

// Dark mode toggle function (unchanged)
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

// Dark mode toggle event listener
document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

// Dark mode toggle event listener
document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

function updateCurrentTime() {
    const navbarTimeElem = document.getElementById('navbarTime');
    const now = new Date();
    
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    if (navbarTimeElem) {
        navbarTimeElem.innerHTML = `
            <span class="date">${dateString}</span>
            <br>
            <span class="time">${timeString}</span>
        `;
    }
}

// Update time every second
setInterval(updateCurrentTime, 1000);

// Initial time update
document.addEventListener('DOMContentLoaded', updateCurrentTime);


const initMap = async (location) => {
    const geocoder = new google.maps.Geocoder();

    try {
        const results = await geocodeAddress(geocoder, location);
        const mapOptions = {
            center: results[0].geometry.location,
            zoom: 13,
        };

        const map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Add traffic layer
        const trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
    } catch (error) {
        console.error("Geocode was not successful for the following reason: ", error);
        alert("Could not retrieve location. Please check the console for more details.");
    }
};

const geocodeAddress = (geocoder, address) => {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
                resolve(results);
            } else {
                reject('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initMap('Las Piñas City, Philippines'); // Default location

    const locationForm = document.getElementById('locationForm');
    locationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const location = document.getElementById('locationInput').value;

        if (location) {
            await initMap(location);
        } else {
            alert("Please provide a location.");
        }
    });
});
