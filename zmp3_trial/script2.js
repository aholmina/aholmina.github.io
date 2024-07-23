class DogGallery {
    constructor() {
        this.galleryElement = document.getElementById('dog-gallery');
        this.fetchButton = document.getElementById('fetchButton');
        this.autoFetchButton = document.getElementById('autoFetchButton');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.pageIndicator = document.getElementById('pageIndicator');
        this.breedFilter = document.getElementById('breedFilter');
        this.favoritesButton = document.getElementById('favoritesButton');

        this.isAutoFetching = false;
        this.autoFetchInterval = null;
        this.dogsPerPage = 6;
        this.currentPage = 1;
        this.dogs = [];
        this.favorites = JSON.parse(localStorage.getItem('dogFavorites')) || [];
        this.showingFavorites = false;

        this.bindEvents();
    }

    bindEvents() {
        this.fetchButton.addEventListener('click', () => this.fetchDog());
        this.autoFetchButton.addEventListener('click', () => this.toggleAutoFetch());
        this.prevButton.addEventListener('click', () => this.changePage(-1));
        this.nextButton.addEventListener('click', () => this.changePage(1));
        this.breedFilter.addEventListener('change', () => this.filterByBreed());
        this.favoritesButton.addEventListener('click', () => this.toggleFavorites());
    }

    fetchDog() {
        this.showLoader();

        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const imageUrl = data.message;
                const breedName = this.extractBreedFromUrl(imageUrl);
                return Promise.all([
                    this.getImageDimensions(imageUrl),
                    this.getBreedInfo(breedName)
                ]).then(([dimensions, breedInfo]) => {
                    const dogData = {
                        imageUrl,
                        breedName: this.formatBreedName(breedName),
                        dimensions,
                        breedInfo,
                        fetchedAt: new Date().toLocaleTimeString()
                    };
                    this.dogs.unshift(dogData);
                    this.updateBreedFilter(dogData.breedName);
                    this.displayPage();
                });
            })
            .catch(error => {
                console.error('Error fetching dog:', error);
                this.showError('Failed to fetch dog image. Please try again.');
            })
            .finally(() => {
                this.removeLoader();
            });
    }

    getImageDimensions(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 300, height: 300 });
            img.src = url;
        });
    }

    getBreedInfo(breedName) {
        const breedInfo = {
            'labrador': { lifeSpan: '10-12 years' },
            'poodle': { lifeSpan: '12-15 years' },
            'bulldog': { lifeSpan: '8-10 years' },
            'german-shepherd': { lifeSpan: '9-13 years' },
            'golden-retriever': { lifeSpan: '10-12 years' },
            'beagle': { lifeSpan: '10-15 years' },
            'rottweiler': { lifeSpan: '8-10 years' },
            'boxer': { lifeSpan: '10-12 years' },
            'dachshund': { lifeSpan: '12-16 years' },
            'siberian-husky': { lifeSpan: '12-14 years' }
        };
        return Promise.resolve(breedInfo[breedName] || { lifeSpan: '10-13 years' });
    }

    extractBreedFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }

    formatBreedName(breedName) {
        return breedName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    displayDog(dogData) {
        const { imageUrl, breedName, breedInfo, fetchedAt } = dogData;
        const isFavorite = this.favorites.some(fav => fav.imageUrl === imageUrl);
        const dogDiv = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${imageUrl}" class="card-img-top" alt="${breedName}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${breedName}</h5>
                        <p class="card-text">Life Span: ${breedInfo.lifeSpan}</p>
                        <p class="card-text"><small>Fetched at: ${fetchedAt}</small></p>
                        <button class="btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} favorite-btn mt-auto" data-url="${imageUrl}">
                            ${isFavorite ? '💔 Unfavorite' : '❤️ Favorite'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.galleryElement.insertAdjacentHTML('beforeend', dogDiv);
        this.galleryElement.querySelector('.favorite-btn:last-child').addEventListener('click', (e) => this.toggleFavorite(e.target));
    }

    displayPage() {
        const start = (this.currentPage - 1) * this.dogsPerPage;
        const end = start + this.dogsPerPage;
        const dogsToDisplay = this.dogs.slice(start, end);

        this.galleryElement.innerHTML = '';
        dogsToDisplay.forEach(dog => this.displayDog(dog));

        this.updatePaginationControls();
    }

    changePage(direction) {
        this.currentPage += direction;
        this.displayPage();
    }

    updatePaginationControls() {
        const totalPages = Math.ceil(this.dogs.length / this.dogsPerPage);
        this.prevButton.disabled = this.currentPage === 1;
        this.nextButton.disabled = this.currentPage === totalPages;
        this.pageIndicator.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }

    updateBreedFilter(breedName) {
        if (!this.breedFilter.querySelector(`option[value="${breedName}"]`)) {
            const option = document.createElement('option');
            option.value = breedName;
            option.textContent = breedName;
            this.breedFilter.appendChild(option);
        }
    }

    filterByBreed() {
        const selectedBreed = this.breedFilter.value;
        if (selectedBreed === 'all') {
            this.displayPage();
        } else {
            const filteredDogs = this.dogs.filter(dog => dog.breedName === selectedBreed);
            this.displayFilteredDogs(filteredDogs);
        }
    }

    displayFilteredDogs(filteredDogs) {
        this.galleryElement.innerHTML = '';
        filteredDogs.forEach(dog => this.displayDog(dog));
    }

    toggleFavorite(button) {
        const imageUrl = button.dataset.url;
        const index = this.favorites.findIndex(fav => fav.imageUrl === imageUrl);
        
        if (index === -1) {
            const dogData = this.dogs.find(dog => dog.imageUrl === imageUrl);
            this.favorites.push(dogData);
            button.textContent = '💔 Unfavorite';
            button.classList.replace('btn-outline-danger', 'btn-danger');
        } else {
            this.favorites.splice(index, 1);
            button.textContent = '❤️ Favorite';
            button.classList.replace('btn-danger', 'btn-outline-danger');
        }

        localStorage.setItem('dogFavorites', JSON.stringify(this.favorites));
    }

    toggleFavorites() {
        if (this.showingFavorites) {
            this.displayPage();
            this.favoritesButton.textContent = 'Show Favorites';
        } else {
            this.displayFavorites();
            this.favoritesButton.textContent = 'Show All Dogs';
        }
        this.showingFavorites = !this.showingFavorites;
    }

    displayFavorites() {
        this.galleryElement.innerHTML = '';
        this.favorites.forEach(fav => this.displayDog(fav));
    }

    showLoader() {
        const loader = `
            <div class="col-12 text-center" id="loader">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        this.galleryElement.insertAdjacentHTML('afterbegin', loader);
    }

    removeLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.remove();
        }
    }

    showError(message) {
        const errorDiv = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            </div>
        `;
        this.galleryElement.insertAdjacentHTML('afterbegin', errorDiv);
    }

    toggleAutoFetch() {
        this.isAutoFetching = !this.isAutoFetching;
        if (this.isAutoFetching) {
            this.autoFetchInterval = setInterval(() => this.fetchDog(), 5000);
            this.autoFetchButton.textContent = 'Stop Auto-Fetch';
            this.autoFetchButton.classList.replace('btn-secondary', 'btn-danger');
        } else {
            clearInterval(this.autoFetchInterval);
            this.autoFetchButton.textContent = 'Start Auto-Fetch';
            this.autoFetchButton.classList.replace('btn-danger', 'btn-secondary');
        }
    }
}

// Initialize the gallery when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new DogGallery();
});