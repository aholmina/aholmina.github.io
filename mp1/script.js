function highlightText(node, keyword) {
    if (node.nodeType === 3) { // Text node
        const regex = new RegExp(`(${keyword})`, 'gi');
        const match = node.nodeValue.match(regex);

        if (match) {
            const span = document.createElement('span');
            span.className = 'highlight';
            span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');

            node.parentNode.replaceChild(span, node);
        }
    } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
        for (let i = 0; i < node.childNodes.length; i++) {
            highlightText(node.childNodes[i], keyword);
        }
    }
}

function removeHighlights() {
    const highlights = document.querySelectorAll('span.highlight');
    highlights.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
    });
}

document.getElementById('searchButton').addEventListener('click', function() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (keyword.length > 0) {
        removeHighlights();
        highlightText(document.body, keyword);
    }
});

// Function to highlight text
function highlightText(node, keyword) {
    if (node.nodeType === 3) { // Text node
        const regex = new RegExp(`(${keyword})`, 'gi');
        const match = node.nodeValue.match(regex);

        if (match) {
            const span = document.createElement('span');
            span.className = 'highlight';
            span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');

            node.parentNode.replaceChild(span, node);
        }
    } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
        for (let i = 0; i < node.childNodes.length; i++) {
            highlightText(node.childNodes[i], keyword);
        }
    }
}

// Function to remove highlights
function removeHighlights() {
    const highlights = document.querySelectorAll('span.highlight');
    highlights.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
    });
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', function() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (keyword.length > 0) {
        removeHighlights();
        highlightText(document.body, keyword);
    }
});

// Initialize and add the map
function initMap() {
    const address = { lat: 37.7749, lng: -122.4194 }; // Sample coordinates for San Francisco

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: address
    });

    const marker = new google.maps.Marker({
        position: address,
        map: map
    });
}
