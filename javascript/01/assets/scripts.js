
let btnMorning = document.getElementById("btn-morning");
btnMorning.addEventListener('click', function() {

    let FullName = document.getElementById("txt-fullname").value;

    document.getElementById("h1-greeting").innerText = "Good Morning";
    document.getElementById("p-fullname").innerText = FullName;
});

let btnAfternoon = document.getElementById("btn-afternoon");
btnAfternoon.addEventListener('click', function() {

    let FullName = document.getElementById("txt-fullname").value;

    document.getElementById("h1-greeting").innerText = "Good Afternoon";
    document.getElementById("p-fullname").innerText = FullName;
});

let btnEvening = document.getElementById("btn-evening");
btnEvening.addEventListener('click', function() {

    let FullName = document.getElementById("txt-fullname").value;

    document.getElementById("h1-greeting").innerText = "Good Evening";
    document.getElementById("p-fullname").innerText = FullName;
});