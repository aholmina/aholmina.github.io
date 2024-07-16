const words = ['coder', 'programmer', 'developer'];
const capitalizedWords = [];
for (let word of words) {
    capitalizedWords.push(word[0].toUpperCase() + word.substring(1));
}

console.log(capitalizedWords); // ['Coder', 'Programmer', 'Developer']


