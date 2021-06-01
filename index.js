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
    console.log("listening")
  });