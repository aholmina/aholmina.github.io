let employees = [];

document.getElementById('btn-add').addEventListener('click', function() {
    let employeeId = document.getElementById('EmployeeId').value;
    let employeeName = document.getElementById('EmployeeName').value;
    let workingHours = document.getElementById('WorkingHours').value;

    let employee = {
        id: employeeId,
        name: employeeName,
        hours: workingHours
    };

    let exists = employees.some(function(el) {
        return el.id === employeeId;
    });

    if (!exists) {
        employees.push(employee);
        displayEmployees();
    } else {
        alert('Employee with this ID already exists');
    }
});

function displayEmployees() {
    let tableList = document.getElementById('table-list');
    tableList.innerHTML = '';

    for (let i = 0; i < employees.length; i++) {
        let row = `<tr>
                        <td>${employees[i].id}</td>
                        <td>${employees[i].name}</td>
                        <td>${employees[i].hours}</td>
                        <td>
                            <button class="btn btn-danger" onclick="removeEmployee(${i})">Remove</button>
                            <button class="btn btn-primary" onclick="editEmployee(${i})">Edit</button>
                           
                        </td>
                    </tr>`;
        tableList.innerHTML += row;
    }
}

function editEmployee(index) {
    let employee = employees[index];
    document.getElementById('EmployeeId').value = employee.id;
    document.getElementById('EmployeeName').value = employee.name;
    document.getElementById('WorkingHours').value = employee.hours;

    document.getElementById('btn-add').textContent = 'Update';
    document.getElementById('btn-add').onclick = function() {
        updateEmployee(index);
    };
}

function updateEmployee(index) {
    let employeeId = document.getElementById('EmployeeId').value;
    let employeeName = document.getElementById('EmployeeName').value;
    let workingHours = document.getElementById('WorkingHours').value;

    employees[index].id = employeeId;
    employees[index].name = employeeName;
    employees[index].hours = workingHours;

    displayEmployees();

    document.getElementById('btn-add').textContent = 'Log Details';
    document.getElementById('btn-add').onclick = function() {
        addEmployee();
    };
}

function removeEmployee(index) {
    employees.splice(index, 1);
    displayEmployees();
}