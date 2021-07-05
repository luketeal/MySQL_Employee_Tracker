const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
const util = require('util')

const connection = mysql.createConnection({
    host: 'localhost',
  
    port: process.env.PORT || 3306,
  
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker',
});
const query = util.promisify(connection.query.bind(connection))



function runEmployeeTracker() {
    inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'Add department',
            'Add role',
            'Add employee',
            'View departments',
            'View roles',
            'View employees',
            'View department budget',
            'Update employee',
            'Update employee manager',
            'Delete department',
            'Delete role',
            'Delete employee',
        ],
    }).then((answer) => {
        switch (answer.action) {
            case 'Add department':
                addDepartment();
                break;

            case 'Add role':
                addRole();
                break;

            case 'Add employee':
                addEmployee();
                break;

            case 'View departments':
                viewDepartments();
                break;

            case 'View roles':
                viewRoles();
                break;

            case 'View employees':
                viewEmployees();
                break;


            case 'Update employee':
                updateEmployee();
                break;  

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
}

//  Add department
const addDepartment = () => {
    inquirer.prompt({
        name: 'department',
        type: 'input',
        message: 'What department would you like to add?'
    }).then((answer) => {
        connection.query(
            'INSERT INTO departments SET ?',
            {
                DeptName: answer.department
            },
            (err, res) => {
                if (err) throw err;
                console.log(`department inserted!\n`);
                runEmployeeTracker();
            }
        )
    })
}

//  Add role 
const addRole = () => {
    connection.query(
        'SELECT * FROM departments', (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    name: 'role',
                    type: 'input',
                    message: 'What role would you like to add?'
                },
                {
                    name: 'salary',
                    type: 'number',
                    message: `What's this role's Salary (USD)?'`
                },
                {
                    name: 'department',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        res.forEach(({ DeptName }) => {
                          choiceArray.push(DeptName);
                        });
                        return choiceArray;
                      },
                    message: 'What department is the role under?',
                }
            ]).then((answer) => {
                let chosenDept;
                res.forEach((department)=> {
                    if(department.DeptName === answer.department) {
                        chosenDept = department
                    }
                })
                connection.query(
                    'INSERT INTO roles SET ?',
                    {
                        Title: answer.role,
                        Salary: answer.salary,
                        DepartmentID: chosenDept.DepartmentID
                    }, (err, res) => {
                        if (err) throw err;
                        console.log(`role inserted!\n`);
                        runEmployeeTracker();
                    }            
                )
            }
        )          
    })
}
//  Add employee
const addEmployee = () => {
    const rolesArray = [];
    const employeesArray = [];
    connection.query(
        'SELECT * FROM Roles', (err, resRoles) => {
            if (err) throw err;
            resRoles.forEach(({Title}) => {
                rolesArray.push(Title)
            })

            connection.query(
                'SELECT * FROM Employees', (err, resEmployees) => {
                    if (err) throw err;
                    resEmployees.forEach(({FirstName, LastName}) => {
                        employeesArray.push(`${FirstName} ${LastName}`)
                    })

                    inquirer.prompt([
                        {
                            name: 'firstName',
                            type: 'input',
                            message: 'Employees First Name?'
                        },
                        {
                            name: 'lastName',
                            type: 'input',
                            message: `Employees Last Name?'`
                        },
                        {
                            name: 'role',
                            type: 'rawlist',
                            choices: rolesArray,
                            message: 'What is this employees role?',
                        },
                        {
                            name: 'manager',
                            type: 'rawlist',
                            choices: employeesArray,
                            meassage: 'Who is this employees manager?',
                        }
                
                    ]).then((answer) => {
                        let chosenRole;
                        resRoles.forEach((role)=> {
                            if(role.Title === answer.role) {
                                chosenRole = role
                            }
                        })
                        let chosenManager;
                        resEmployees.forEach((manager)=> {
                            if(`${manager.FirstName} ${manager.LastName}` === answer.manager) {
                                chosenManager = manager
                            }
                        })
                        connection.query(
                            'INSERT INTO Employees SET ?',
                            {
                                FirstName: answer.firstName,
                                LastName: answer.lastName,
                                RoleID: chosenRole.RoleID,
                                ManagerID: chosenManager.EmployeeID
                            }, (err, res) => {
                                if (err) throw err;
                                console.log(`Employee inserted!\n`);
                                runEmployeeTracker();
                            }            
                        )
                    }
                )
                }
            )
        }
    )
}

//  View department

const viewDepartments = async () => {
    response = await query('SELECT DeptName AS Department FROM Departments')
        console.table(response)
        runEmployeeTracker();
    }

//  View roles

const viewRoles = async () => {
    response = await query(`SELECT Title, Salary, DeptName AS Department 
    FROM Roles LEFT JOIN Departments ON Roles.DepartmentID = Departments.DepartmentID`)
        console.table(response)
        runEmployeeTracker();
}

//  View employees
const viewEmployees = async () => {
    response = await query(
        `SELECT CONCAT(e.FirstName, ' ', e.LastName) AS Employee, Title AS Role, Salary, DeptName AS Department, CONCAT(m.FirstName, ' ', m.LastName) AS Manager 
        FROM Employees e 
        LEFT JOIN Roles ON Roles.RoleID = e.RoleID
        LEFT JOIN Departments ON Roles.DepartmentID = Departments.DepartmentID
		LEFT JOIN Employees AS m ON m.EmployeeID = e.ManagerID `) 
        console.table(response)
        runEmployeeTracker();
}

//  Update Employee
const updateEmployee = () => {
    const rolesArray = [];
    const employeesArray = [];
    connection.query(
        'SELECT * FROM Roles', (err, resRoles) => {
            if (err) throw err;
            resRoles.forEach(({Title}) => {
                rolesArray.push(Title)
            })

            connection.query(
                'SELECT * FROM Employees', (err, resEmployees) => {
                    if (err) throw err;
                    resEmployees.forEach(({FirstName, LastName}) => {
                        employeesArray.push(`${FirstName} ${LastName}`)
                    })

                    inquirer.prompt([
                        {
                            name: 'employee',
                            type: 'rawlist',
                            choices: employeesArray,
                            meassage: 'What employee are you updating?',
                        },
                        {
                            name: 'firstName',
                            type: 'input',
                            message: 'Now input the employees updated information. \nEmployees First Name?'
                        },
                        {
                            name: 'lastName',
                            type: 'input',
                            message: `Employees Last Name?'`
                        },
                        {
                            name: 'role',
                            type: 'rawlist',
                            choices: rolesArray,
                            message: 'What is this employees role?',
                        },
                        {
                            name: 'manager',
                            type: 'rawlist',
                            choices: employeesArray,
                            meassage: 'Who is this employees manager?',
                        }
                
                    ]).then((answer) => {
                        let chosenRole;
                        resRoles.forEach((role)=> {
                            if(role.Title === answer.role) {
                                chosenRole = role
                            }
                        })
                        console.log(chosenRole)
                        let chosenManager;
                        resEmployees.forEach((manager)=> {
                            if(`${manager.FirstName} ${manager.LastName}` === answer.manager) {
                                chosenManager = manager
                            }
                        })
                        let chosenEmployee;
                        resEmployees.forEach((employee)=> {
                            if(`${employee.FirstName} ${employee.LastName}` === answer.employee) {
                                chosenEmployee = employee
                            }
                        })
                        connection.query(
                            'UPDATE Employees SET ? WHERE ?',
                            [
                                {
                                    FirstName: answer.firstName,
                                    LastName: answer.lastName,
                                    RoleID: chosenRole.RoleID,
                                    ManagerID: chosenManager.EmployeeID
                                }, 
                                {
                                    EmployeeID: chosenEmployee.EmployeeID
                                },
                            ],  (err, res) => {
                                if (err) throw err;
                                console.log(`Employee updated!\n`);
                                runEmployeeTracker();
                            }            
                        )
                    }
                )
                }
            )
        }
    )
}

connection.connect((err) => {
    if (err) throw err;
    runEmployeeTracker();
});