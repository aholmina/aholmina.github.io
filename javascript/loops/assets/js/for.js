// let Tagabilang = 1;
// while (Tagabilang < 10) {
//     // console.log(Tagabilang + " : Hello from While JS");
//     Tagabilang++;
// }

//For Loop

//1. initialization
//2. condition
//3. statement
//4. incrementation/decrementation
// for (var counter = 1; counter < 10; counter++ ) {
//     console.log(counter + " : Hello from While JS");
// }

//Nested loop
let Quotients = "";
for(var row = 1; row <= 5; row++) { // 1 2
    Quotients = "";
    for(var col = 1; col <= 5; col++) {// 1 2
        Quotients += (row * col) + " "; //concatenation || 1 2 3 4 5
    }
    console.log( Quotients);
}

for(var x = 10; x >= 0; x--) {
    console.log(x);
}