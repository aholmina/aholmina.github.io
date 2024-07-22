const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");

// Storage Helper Functions
function getItemsFromStorage() {
    const storedData = localStorage.getItem("items");
    return storedData ? JSON.parse(storedData) : [];
}

function saveItemsToStorage(items) {
    localStorage.setItem("items", JSON.stringify(items));
}

// Initial Load from Storage
document.addEventListener("DOMContentLoaded", () => {
    syncDOMWithStorage();
});

// Add Item
function addItem(e) {
    e.preventDefault();
    const newItemText = itemInput.value.trim();

    if (!newItemText) {
        alert("Please enter an item");
        return;
    }

    addItemToDOM(newItemText);
    addItemToStorage(newItemText); 
    itemInput.value = "";
    checkUI();
}

// Add Item to DOM
function addItemToDOM(newItemText) {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(newItemText));
    li.appendChild(createButton("remove-item btn-link text-red"));
    itemList.appendChild(li);
}

// Create Remove Button
function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark"); 
    button.appendChild(icon);
    return button;
}

// Create Icon
function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}

// Add Item to Storage
function addItemToStorage(newItemText) {
    const items = getItemsFromStorage();
    if (!items.includes(newItemText)) {
        items.push(newItemText);
        saveItemsToStorage(items);
    }
}

// Remove Item
function removeItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        if (confirm("Are you sure?")) {
            const listItem = e.target.parentElement.parentElement;
            itemList.removeChild(listItem);
            checkUI();
        }
    }
}

// Clear All Items
function clearItems() {
    if (confirm("Are you sure you want to clear all items?")) {
        itemList.innerHTML = ""; 
        checkUI();
    }
}

// Filter Items
function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll("li");

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        item.style.display = itemName.includes(text) ? "flex" : "none";
    });
}

// Check if UI elements should be displayed
function checkUI() {
    const items = itemList.querySelectorAll("li");
    clearBtn.style.display = items.length === 0 ? "none" : "block";
    itemFilter.style.display = items.length === 0 ? "none" : "block";
}

// Sync DOM with Storage
function syncDOMWithStorage() {
    const storedItems = getItemsFromStorage();
    const currentItems = Array.from(itemList.querySelectorAll("li")).map(li => li.firstChild.textContent);
    
    // Add items from storage that are not in the DOM
    storedItems.forEach(item => {
        if (!currentItems.includes(item)) {
            addItemToDOM(item);
        }
    });

    // Remove items from DOM that are not in storage
    currentItems.forEach(item => {
        if (!storedItems.includes(item)) {
            const li = Array.from(itemList.querySelectorAll("li")).find(li => li.firstChild.textContent === item);
            if (li) itemList.removeChild(li);
        }
    });

    checkUI();
}

// Event Listeners
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItems);