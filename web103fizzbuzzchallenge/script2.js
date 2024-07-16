// while loop //
/*
const FIZZ = 'Fizz';
const BUZZ = 'Buzz';
const FIZZBUZZ = 'FizzBuzz';
const MAX_NUMBER = 100;

let i = 1;
while (i <= MAX_NUMBER) {
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
    i++;
}
*/

const FIZZ = 'Fizz';
const BUZZ = 'Buzz';
const FIZZBUZZ = 'FizzBuzz';
const MAX_NUMBER = 100;

let i = 1;

while (i <= MAX_NUMBER) {
    if (i % 3 === 0 && i % 5 === 0) {
        console.log(FIZZBUZZ);
    } else if (i % 3 === 0) {
        console.log(FIZZ);
    } else if (i % 5 === 0) {
        console.log(BUZZ);
    } else {
        console.log(i);
    }
    i++;
}
