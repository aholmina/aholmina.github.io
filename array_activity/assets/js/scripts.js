let num1 = 0;
let arrNums = [];
arrayInput(num1);

function arrayInput(num1) {
  num1 = parseFloat(prompt("Enter First Number"));
  if (num1 <= 0) {
    const evenNumbers = arrNums.filter((number) => number % 2 === 0);
    const oddNumbers = arrNums.filter((number) => number % 2 !== 0);
    console.log(arrNums.join());
    console.log("Even Numbers:", evenNumbers.join());
    console.log("Odd Numbers:", oddNumbers.join());
    return;
  }

  arrNums.push(num1);
  arrayInput(num1);
}
