// Import the Amadeus SDK
import Amadeus from 'amadeus';

const flightSearchForm = document.getElementById('flightSearchForm');
const originInput = document.getElementById('originInput');
const destinationInput = document.getElementById('destinationInput');
const departureDateInput = document.getElementById('departureDateInput');
const returnDateInput = document.getElementById('returnDateInput');
const loadingSpinner = document.getElementById('loadingSpinner');
const flightList = document.getElementById('flightList');

// Initialize the Amadeus client
const amadeus = new Amadeus({
    clientId: 'YOUR_API_KEY',
    clientSecret: 'YOUR_API_SECRET'
});

async function fetchFlights(event) {
    event.preventDefault();
    loadingSpinner.classList.remove('d-none');
    flightList.innerHTML = '';

    try {
        const origin = originInput.value;
        const destination = destinationInput.value;
        const departureDate = departureDateInput.value;
        const returnDate = returnDateInput.value;

        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            adults: '1',
            max: '5'
        });

        displayFlights(response.data, origin, destination);
    } catch (error) {
        console.error('Error details:', error);
        flightList.innerHTML = `<p class="alert alert-danger">Error fetching flights: ${error.message}. Please try again.</p>`;
    } finally {
        loadingSpinner.classList.add('d-none');
    }
}

function displayFlights(data, origin, destination) {
    if (!data || data.length === 0) {
        flightList.innerHTML = '<p class="alert alert-info">No flights found.</p>';
        return;
    }

    const flightCards = data.map(offer => {
        const itinerary = offer.itineraries[0];
        const segment = itinerary.segments[0];
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${origin} to ${destination}</h5>
                    <p class="card-text">Departure: ${segment.departure.iataCode} on ${new Date(segment.departure.at).toLocaleString()}</p>
                    <p class="card-text">Arrival: ${segment.arrival.iataCode} on ${new Date(segment.arrival.at).toLocaleString()}</p>
                    <p class="card-text">Price: ${offer.price.total} ${offer.price.currency}</p>
                    <p class="card-text">Airline: ${segment.carrierCode}</p>
                </div>
            </div>
        `;
    }).join('');

    flightList.innerHTML = flightCards;
}

flightSearchForm.addEventListener('submit', fetchFlights);