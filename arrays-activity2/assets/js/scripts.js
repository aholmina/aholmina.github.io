let Item = "Bag";
let NoOfItems = 3;
let IsCheckOut = true;

let ArrayItems = [
    "apple", 
    "grapes", 
    "banana", 
    "orange", 
    "avocado", 
    "star fruit",
    "dragon fruit",
];

// Array.push();
// ArrayItems.push("watermelon"); // add items at the end of the array
// ArrayItems.unshift("guava"); // add items at the beginning of the array

// let RemovedItem1 = ArrayItems.pop(); // removes items at the end of the array;
// let RemovedItem2 = ArrayItems.shift(); // removes items at the beginning of the array;

// let SlicedItem = ArrayItems.splice(4, 2); // removes specific item using the Index

// console.log("Sliced Item : " + SlicedItem);

let TotalLength = ArrayItems.length;

for(var x = 0; x < TotalLength; x++) {
    console.log(x + ": " + ArrayItems[x]);
}

let ArrayMixItems = [ 
    "Jesthony", 
    34, 
    true, 
    ['Web Developer', 'Computer Technician', 'Coach']
];

// console.log(ArrayItems[4]);
console.log(ArrayMixItems[0] + " is a " + ArrayMixItems[3][0]);
