/*

const numbers = [2, -30, 50, 20, -12, -9, 7];

const positiveSum = numbers
  .filter(num => num > 0)
  .reduce((sum, num) => sum + num, 0);

console.log(positiveSum); // 79

*/

//short version
const numbers = [2, -30, 50, 20, -12, -9, 7];

const positiveSum = numbers.reduce((sum, num) => num > 0 ? sum + num : sum, 0);

console.log(positiveSum); // 79


