const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
  
    port: process.env.PORT || 3306,
  
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker',
});

connection.connect((err) => {
    if (err) throw err;
    runEmployeeTracker();
});

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

            case 'View department budget':
                // viewDeptBudget();
                break;

            case 'Update employee':
                // updateEmployee();
                break;

            case 'Update employee manager':
                // updateManager();
                break;

            case 'Delete department':
                // deleteDepartment();
                break;

            case 'Delete role':
                // deleteRole();
                break;

            case 'Delete employee':
                // deleteEmployee();
                break;       

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
}

//  TODO: Add department
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

//  TODO: Add role 
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
//  TODO: Add employee
const addEmployee = () => {
    const rolesArray = [];
    const employeesArray = [];
    connection.query(
        'SELECT * FROM Roles', (err, resRoles) => {
            if (err) throw err;
            resRoles.forEach(({Title}) => {
                rolesArray.push(Title)
            })
            // console.log(rolesArray)
            connection.query(
                'SELECT * FROM Employees', (err, resEmployees) => {
                    if (err) throw err;
                    resEmployees.forEach(({FirstName, LastName}) => {
                        employeesArray.push(`${FirstName} ${LastName}`)
                    })
                    // console.log(employeesArray)
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

//  TODO: View department

const viewDepartments = () => {
    connection.query('SELECT DeptName AS Department FROM Departments', (err, res) => {
        if(err) throw err;
        console.table(res)
        runEmployeeTracker();
    })}

//  TODO: View roles

const viewRoles = () => {
    connection.query(`SELECT Title, Salary, DeptName AS Department 
    FROM Roles LEFT JOIN Departments ON Roles.DepartmentID = Departments.DepartmentID`, (err, res) => {
        if(err) throw err;
        console.table(res)
        runEmployeeTracker();
})}

//  TODO: View employees
const viewEmployees = () => {
    connection.query(
        `SELECT CONCAT(e.FirstName, ' ', e.LastName) AS Employee, Title, Salary, DeptName, CONCAT(m.FirstName, ' ', m.LastName) AS Manager 
        FROM Employees AS e 
        JOIN Employees AS m ON m.EmployeeID = e.ManagerID 
        JOIN Roles ON Roles.RoleID = e.EmployeeID
        JOIN Departments ON Roles.DepartmentID = Departments.DepartmentID`, 
        (err, res) => {
            if(err) throw err;
            console.table(res)
            runEmployeeTracker();
})}

// SELECT e.FirstName, e.LastName, Roles.Title, Roles.Salary, m.FirstName, m.LastName
//     FROM Employees e 
//     LEFT JOIN Roles ON e.RoleID = Roles.RoleID 
//     JOIN Employees m ON e.ManagerID = m.EmployeeID
//  TODO: View total department budget
//  TODO: Update Employee
//  TODO: Update Empoyee manager
//  TODO: Delete department
//  TODO: Delete role
//  TODO: Delete employee
