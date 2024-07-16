/*
const FIZZ = 'Fizz';
const BUZZ = 'Buzz';
const FIZZBUZZ = 'FizzBuzz';
const MAX_NUMBER = 100;

for (let i = 1; i <= MAX_NUMBER; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
        console.log(FIZZBUZZ);
    } else if (i % 3 === 0) {
        console.log(FIZZ);
    } else if (i % 5 === 0) {
        console.log(BUZZ);
    } else {
        console.log(i);
    }
}
*/

 //for loop //

 
const FIZZ = 'Fizz';
const BUZZ = 'Buzz';
const FIZZBUZZ = 'FizzBuzz';
const MAX_NUMBER = 100;

for (let i = 1; i <= MAX_NUMBER; i++) {
    let output = i + ': ';
    if (i % 3 === 0 && i % 5 === 0) {
        output += FIZZBUZZ;
    } else if (i % 3 === 0) {
        output += FIZZ;
    } else if (i % 5 === 0) {
        output += BUZZ;
    } else {
        output += i;
    }
    console.log(output);
} 


