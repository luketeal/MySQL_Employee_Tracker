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
                // addDepartment();
                break;

            case 'Add role':
                // addRole();
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
//  TODO: Add role 
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
