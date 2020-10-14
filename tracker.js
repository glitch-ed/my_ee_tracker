const mysql = require("mysql");
const inquirer = require("inquirer");
const conTb = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Orioles7!",
    database: "eeDB"
});

connection.connect(function(err) {
    if (err) throw err;
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
            "Remove Employee",
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
         -Abreak;

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
                updateEmployee();
                break;
            
            case "Remove":
                removeEmployee();
                break;
            
            case "Done":
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
            name: "deptid",
            message: "What is the department id for the new role?:"
        }
    ]).then(function(result) {
        connection.query(
            "INSERT INTO role SET ?", {
                title: result.newrole,
                salary: result.newsalary,
                department_id: result.deptid
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
        console.log("\n Departments found in database: \n");
        console.table(res);
        askTracker();
    });
};







