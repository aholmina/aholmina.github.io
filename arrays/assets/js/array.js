let Employee = [];

document.getElementById("btn-add").addEventListener('click', function() {
    let EmployeeId = document.getElementById("EmployeeId").value;
    let EmployeeName = document.getElementById("EmployeeName").value;
    let WorkingHours = document.getElementById("WorkingHours").value;

    if(EmployeeId == '' || EmployeeName == '' || WorkingHours == '')
{
    alert("Please complete all Fields")
}
    else
    Employee.push( [EmployeeId, EmployeeName, WorkingHours] );
    DrawList();
});

function remove(index) {
    Employee.splice(index, 1);
    DrawList();
}
function DrawList() {
    let List = "";
    let sum = 0;

    for(let x = 0; x < Employee.length; x++)
        List += "<tr><td>" + Employee[x][0] + " </td> " + "<td>" + Employee[x][1] + "</td>" + "<td>" + Employee[x][2] + "</td>" + "<td><button class='btn btn-danger' onclick='remove("+x+")'>Remove</button></td></tr>";

        document.getElementById("table-list").innerHTML = List;
   
}


function sumThirdRow(table) {
    
    if (!table || !table.rows) {
      return null;
    }
  
  
    const thirdRow = table.rows[2];
  
  
    if (!thirdRow) {
      return null;
    }
  
    
    let sum = 0;
  

    for (let i = 0; i < thirdRow.cells.length; i++) {
      const cellValue = parseFloat(thirdRow.cells[i].textContent);
  
      
      if (!isNaN(cellValue)) {
        sum += cellValue;
      }
    }
  
    return sum;
  }
  

  const myTable = document.getElementById("table-stripped"); 
  const thirdRowSum = sumThirdRow(myTable);
  
  if (thirdRowSum !== null) {
    console.log("Sum of third row:", thirdRowSum);
  } else {
    console.error("Error: Invalid table or missing third row");
  }
  