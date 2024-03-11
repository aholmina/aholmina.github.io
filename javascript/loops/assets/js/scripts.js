let Execute = document.getElementById("btnMultiply");

Execute.addEventListener('click', function() {
    let RowLimit = document.getElementById("RowLimit").value;
    let ColLimit = document.getElementById("ColLimit").value;
    let Quotients = "";
    let tableTD= "";


    for(var row = 1; row <= RowLimit; row++){
        Quotients = "";
        
        for(var col = 1; col <= ColLimit; col++){
            Quotients += "<td style='width: 50px;'>"+(row * col)+"</td>";
            
            
    }
    tableTD += "<tr class='border-bottom : 1px solid #fff;'>" +Quotients+ "</tr>";

    document.getElementById("div-wrapper").innerHTML = tableTD;
    }

    
});

