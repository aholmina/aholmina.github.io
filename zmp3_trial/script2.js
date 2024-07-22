class DogGallery {
    constructor() {
        this.galleryElement = document.getElementById('dog-gallery');
        this.fetchButton = document.getElementById('fetchButton');
        this.autoFetchButton = document.getElementById('autoFetchButton');
        this.isAutoFetching = false;
        this.autoFetchInterval = null;

        this.bindEvents();
    }

    bindEvents() {
        this.fetchButton.addEventListener('click', () => this.fetchDog());
        this.autoFetchButton.addEventListener('click', () => this.toggleAutoFetch());
    }

    fetchDog() {
        this.showLoader();

        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.message;
                const breedName = this.extractBreedFromUrl(imageUrl);
                return Promise.all([
                    this.getImageDimensions(imageUrl),
                    this.getBreedPrice(breedName)
                ]).then(([dimensions, price]) => {
                    this.displayDog(imageUrl, this.formatBreedName(breedName), dimensions, price);
                });
            })
            .catch(error => {
                console.error('Error fetching dog:', error);
                this.showError('Failed to fetch dog image');
            })
            .finally(() => {
                this.removeLoader();
            });
    }

    getImageDimensions(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = url;
        });
    }

    getBreedPrice(breedName) {
        // This is a mock function. In a real-world scenario, you'd fetch this data from an API or database.
        const prices = {
            'labrador': 1200,
            'poodle': 1500,
            'bulldog': 2000,
            'german-shepherd': 1800,
            'golden-retriever': 1300,
            'beagle': 1000,
            'rottweiler': 1600,
            'boxer': 1400,
            'dachshund': 1100,
            'siberian-husky': 1700
        };
        return Promise.resolve(prices[breedName] || 1000); // Default price if breed not found
    }

    extractBreedFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }

    formatBreedName(breedName) {
        return breedName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    displayDog(imageUrl, breedName, dimensions, price) {
        const aspectRatio = dimensions.width / dimensions.height;
        const cardWidth = 300; // Assuming the card width is 300px
        const cardHeight = cardWidth / aspectRatio;

        const dogDiv = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div style="height: 300px; overflow: hidden; margin-top: 15px;">
                        <img src="${imageUrl}" class="card-img-top" alt="Dog" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${breedName}</h5>
                        <p class="card-text">Price: $${price}</p>
                        <p class="card-text">Fetched at: ${new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
        `;

        this.galleryElement.insertAdjacentHTML('afterbegin', dogDiv);
    }

    showLoader() {
        const loader = `
            <div class="col-12 text-center" id="loader">
                <div class="spinner-border text-primary" role="status">
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