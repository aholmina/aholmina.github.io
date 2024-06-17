// Product data
const products = [
    { id: 1, name: "Product 1", price: 10.00, description: "Description for Product 1", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Product 2", price: 20.00, description: "Description for Product 2", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Product 3", price: 30.00, description: "Description for Product 3", image: "https://via.placeholder.com/150" },
];

// Cart array to hold the selected items
let cart = [];

// Function to render the products
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 product-card';
        productCard.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                    <p class="card-text">${product.description}</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Function to add a product to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        renderCart();
        showModal('cartModal');
    }
}

// Function to render the cart items and total price
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach((product, index) => {
        const cartItem = document.createElement('li');
        cartItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        cartItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${product.image}" class="img-thumbnail me-2 cart-img" alt="${product.name}">
                <span>${product.name} - $${product.price.toFixed(2)}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('total-price').innerText = totalPrice.toFixed(2);
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Function to show a modal
function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId), {
        keyboard: false
    });
    modal.show();
}

// Function to proceed to checkout
function proceedToCheckout() {
    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('checkout-total-price').innerText = totalPrice.toFixed(2);
    showModal('checkoutModal');
}

// Function to handle the form submission
document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    if (email && address) {
        alert(`Order placed! \nEmail: ${email} \nAddress: ${address} \nTotal: $${document.getElementById('checkout-total-price').innerText}`);
        cart = [];
        renderCart();
        document.getElementById('checkout-form').reset();
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
    }
});

// Initial render
renderProducts();
renderCart();
