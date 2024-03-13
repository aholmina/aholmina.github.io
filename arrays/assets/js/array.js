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


