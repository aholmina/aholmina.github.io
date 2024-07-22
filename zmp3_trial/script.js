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

        axios.get('https://dog.ceo/api/breeds/image/random')
            .then(response => {
                const imageUrl = response.data.message;
                const breedName = this.extractBreedFromUrl(imageUrl);
                return axios.get(`https://dog.ceo/api/breed/${breedName}/images/random`)
                    .then(breedResponse => {
                        this.displayDog(imageUrl, this.formatBreedName(breedName));
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

    extractBreedFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }

    formatBreedName(breedName) {
        return breedName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    displayDog(imageUrl, breedName) {
        const dogDiv = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${imageUrl}" class="card-img-top" alt="Dog" style="height: 300px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${breedName}</h5>
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