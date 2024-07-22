const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const items = itemList.querySelectorAll("li");


// Add this at the beginning of your script
const storage = {
  get: () => JSON.parse(localStorage.getItem('newItems') || '[]'),
  set: items => localStorage.setItem('newItems', JSON.stringify(items))
};

// Add this function to load only stored new items
function loadItems() {
  // Clear the existing list
  itemList.innerHTML = '';
  
  // Load and display only the stored items
  storage.get().forEach(item => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));
    li.appendChild(createButton("remove-item btn-link text-red"));
    itemList.appendChild(li);
  });
  checkUI();
}

// Modify the addItem function
function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("Please add an item");
    return;
  }
  
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));
  li.appendChild(createButton("remove-item btn-link text-red"));
  itemList.appendChild(li);
  
  // Save new item to storage
  const items = storage.get();
  items.push(newItem);
  storage.set(items);
  
  checkUI();
  itemInput.value = "";
}

// Modify the removeItem function
function removeItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Are you sure?")) {
      const item = e.target.parentElement.parentElement;
      item.remove();
      
      // Remove from storage
      const items = storage.get().filter(i => i !== item.textContent);
      storage.set(items);
      
      checkUI();
    }
  }
}

// Modify the clearItems function
function clearItems() {
  itemList.innerHTML = '';
  localStorage.removeItem('newItems');
  checkUI();
}

// Add this to your existing event listeners
document.addEventListener('DOMContentLoaded', loadItems);





















































function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  //Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  //create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));

  //   console.log(li); //Testing muna natin kung magpapakita sa console
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  //   console.log(li);
  //Add li to the DOM
  itemList.appendChild(li);

  checkUI();
  itemInput.value = "";
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;

  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function removeItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Are you sure?")) {
      e.target.parentElement.parentElement.remove();
      checkUI();
    }
  }
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  const items = itemList.querySelectorAll("li");
  //   console.log(items);
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
}

//Event Listeners
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItems);

checkUI();


// Add these functions at the end of your existing script

function saveItemsToStorage(items) {
  localStorage.setItem('items', JSON.stringify(items));
}

function getItemsFromStorage() {
  let items;
  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }
  return items;
}

function addItemToStorage(item) {
  const items = getItemsFromStorage();
  items.push(item);
  saveItemsToStorage(items);
}

function displayStoredItems() {
  const items = getItemsFromStorage();
  items.forEach(item => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));
    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);
    itemList.appendChild(li);
  });
  checkUI();
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', displayStoredItems);


function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  //Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  //create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  //Add li to the DOM
  itemList.appendChild(li);

  // Save to local storage
  addItemToStorage(newItem);

  checkUI();
  itemInput.value = "";
}

function removeItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Are you sure?")) {
      const item = e.target.parentElement.parentElement;
      item.remove();

      // Remove from local storage
      const items = getItemsFromStorage();
      const updatedItems = items.filter(i => i !== item.textContent);
      saveItemsToStorage(updatedItems);

      checkUI();
    }
  }
}


function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  
  // Clear local storage
  localStorage.removeItem('items');

  checkUI();
}