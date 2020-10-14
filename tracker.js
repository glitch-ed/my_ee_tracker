const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PASSWORD,
    database: "eeDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("all you database are belong to us.")
    runTracker();
});

function runTracker() {
    inquirer.prompt({
        type: "list",
        name: "choice",
        message: "Choose an Action?",
        choices: [
            "Add New Employee",
            "Add New Department",
            "Add New Role",
            "View All Employees",
            "View All Departments",
            "View All Roles",
            "Update Employee Role",
            "Delete Employee",
            "Done"
        ] 
    }).then(function(answer) {
        console.log(answer);
        switch (answer.choice) {
            case "Add New Employee":
                addEmployee();
                break;

            case "Add New Department":
                addDept();
                break;

            case "Add New Role":    
                addRole();
                break;

            case "View All Employees":
                viewEmployees();
                break;

            case "View All Departments":
                viewDept();
                break;

            case "View All Roles":
                viewRoles();
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;
            
            case "Delete Employee":
                deleteEmployee();
                break;
            
            case "Done":
                console.log("All Your Database Are Belong To Us.")
                connection.end();
                break;
        }
    })
};

function addEmployee() {

    connection.query("SELECT * FROM role", function(err, results) {
        if (err) throw err;

        inquirer.prompt([{
                type: "input",
                name: "firstname",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name?"
            },
            {
                name: "choice",
                type: "rawlist",
                choices: function() {
                    let choiceArray = [];
                    for ( i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].title);
                    }

                    return choiceArray;
                },
                message: "What is the employee's role?"
            }
        ]).then(function(res) {
            for ( i = 0; i < results.length; i++) {
                if (results[i].title === res.choice) {
                    res.role_id = results[i].id;
                };
            };
            let query = "INSERT INTO employee SET ?"
            const VALUES = {
                first_name: res.firstname,
                last_name: res.lastname,
                role_id: res.role_id
            };
            connection.query(query, VALUES, function(err) {
                    if (err) throw err;
                    console.log("Employee added!");
                    runTracker();
                }

            );
        });
    });

};

function addDept() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "What is the new Department's Name?"
    }]).then(function(res) {
        connection.query("INSERT INTO department SET ? ", {
                name: res.name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runTracker();
            }
        );
    });
};

function addRole() {
    inquirer.prompt([{
            type: "input",
            name: "newrole",
            message: "What is the new role?"
        },
        {
            type: "input",
            name: "newsalary",
            message: "What is the salary for the new role?"
        },
        {
            type: "input",
            name: "deptId",
            message: "What is the department id for the new role?:"
        }
    ]).then(function(result) {
        connection.query(
            "INSERT INTO role SET ?", {
                title: result.newrole,
                salary: result.newsalary,
                department_id: result.deptId
            },
            function(err) {
                if (err) throw err;
                console.table(result);
                console.log("New role added!");
                runTracker();
            });
    });
};

function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function(err, res) {
            if (err) throw err
            console.table(res)
            runTracker();
        });
};

function viewDept() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.log("\n Employee Departments: \n");
        console.table(res);
        runTracker();
    });
};

function viewRoles() {
    connection.query("SELECT * from role",
        function(err, res) {
            if (err) throw err;
            console.log("\n Employee Roles: \n");
            console.table(res);
            runTracker();
        });
};

function updateEmployeeRole() {
    inquirer.prompt({
            type: "input",
            name: "id",
            message: "Enter employee ID:",
        })
        .then(function(answer) {
            var id = answer.id;

            inquirer
                .prompt({
                    type: "input",
                    name: "roleId",
                    message: "Enter employee's new role ID",
                })
                .then(function(answer) {
                    let roleId = answer.roleId;

                    let query = "UPDATE employee SET role_id=? WHERE id=?";
                    connection.query(query, [roleId, id], function(err, res) {
                        if (err) {
                            console.table(res);
                        }
                        runTracker();
                    });
                });
        });
};

function deleteEmployee() {
    inquirer
        .prompt({
            name: "employee",
            type: "input",
            message: "Enter Employee ID",

        })
        .then(function(answer) {
            console.log(answer);
            let query = "DELETE FROM employee WHERE ?";
            let newId = Number(answer.employee);
            connection.query(query, { id: newId }, function(err, res) {
                console.log("Employee has been deleted!")
                runTracker();
            });
        });
}






