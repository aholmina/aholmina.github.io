let subjectEnglish = document.getElementById("suject-english"); 
let subjectMath = document.getElementById("suject-math");
let subjectData = document.getElementById("suject-data"); 
let subjectComprog = document.getElementById("suject-comprog");
let subjectWebprog = document.getElementById("suject-webprog"); 

subjectEnglish.addEventListener('keyup', function() {
    let total = parseFloat(subjectEnglish.value) + parseFloat(subjectMath.value) + parseFloat(subjectData.value) + parseFloat(subjectComprog.value) + parseFloat(subjectWebprog.value);
    
    document.getElementById("total-grades").value = total;
    let ave = total / 5;
    document.getElementById("average").value = ave;
});

subjectMath.addEventListener('keyup', function() {
    let total = parseFloat(subjectEnglish.value) + parseFloat(subjectMath.value) + parseFloat(subjectData.value) + parseFloat(subjectComprog.value) + parseFloat(subjectWebprog.value);
    
    document.getElementById("total-grades").value = total;
    let ave = total / 5;
    document.getElementById("average").value = ave;
});

subjectData.addEventListener('keyup', function() {
    let total = parseFloat(subjectEnglish.value) + parseFloat(subjectMath.value) + parseFloat(subjectData.value) + parseFloat(subjectComprog.value) + parseFloat(subjectWebprog.value);
    
    document.getElementById("total-grades").value = total;
    let ave = total / 5;
    document.getElementById("average").value = ave;
});

subjectComprog.addEventListener('keyup', function() {
    let total = parseFloat(subjectEnglish.value) + parseFloat(subjectMath.value) + parseFloat(subjectData.value) + parseFloat(subjectComprog.value) + parseFloat(subjectWebprog.value);
    
    document.getElementById("total-grades").value = total;
    let ave = total / 5;
    document.getElementById("average").value = ave;
});


subjectWebprog.addEventListener('keyup', function() {
    let total = parseFloat(subjectEnglish.value) + parseFloat(subjectMath.value) + parseFloat(subjectData.value) + parseFloat(subjectComprog.value) + parseFloat(subjectWebprog.value);
    
    document.getElementById("total-grades").value = total;
    let ave = total / 5;
    document.getElementById("average").value = ave;
});
