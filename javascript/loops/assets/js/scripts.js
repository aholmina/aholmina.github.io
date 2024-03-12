let Multiply = document.getElementById("btnMultiply");

Multiply.addEventListener('click', function() {
    let RowLimit = document.getElementById("RowLimit").value;
    let ColLimit = document.getElementById("ColLimit").value;
    let Products = "";
    let tableTD= "";


    for(var row = 1; row <= RowLimit; row++){
        Products = "";
        
        for(var col = 1; col <= ColLimit; col++){
            Products += "<td style='width: 30px;'>"+(row * col)+"</td>";
            
            
    }
    tableTD += `<tr class='border-bottom : 1px solid #fff;'>${Products}</tr>`;

    document.getElementById("div-wrapper").innerHTML = tableTD;
    }

    
});

