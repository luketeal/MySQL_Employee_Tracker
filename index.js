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
                // addEmployee();
                break;

            case 'View departments':
                // viewDepartment();
                break;

            case 'View roles':
                // viewRole();
                break;

            case 'View employees':
                // viewEmployee();
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
//  TODO: View department
//  TODO: View role
//  TODO: View employee
//  TODO: Update Employee
//  TODO: Update Empoyee manager
//  TODO: Delete department
//  TODO: Delete role
//  TODO: Delete employee
//  TODO: View total department budget
