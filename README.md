# MySQL Employee Tracker

## Description 
This is a nodejs command line employee tracker application that allows users to create and view department, role, and employee information stored in a SQL database.  

## Table of Contents 
* [Description](#Description)  
* [Installation](#Installation)
* [Usage](#Usage)  
* [Repo-Contents](#Repo-Contents)  
* [License](#License)  
* [Contributing](#Contributing)   
* [Questions](#Questions)

## Installation
1. Run `npm install` to install dependencies.
2. Log into your mysql shell using your username and password
3. Run the commands in the schema.sql in your mysql shell to create the database and tables.
4. Run `npm start` to connect to the server

Be sure to update your .env file with your password.  An example file is provided.

## Usage 
Checkout this for [demo](https://youtu.be/cCyc2L8UeCw) of the intended functionality.

## Repo-Contents
* [Database schema and seeds](db/)
* [Example env file](.env.EXAMPLE)
* [index.js file](index.js)

## Future Development
Ideas for future functionality include:
  * View employees by manager/department/role
  * Delete departments, roles, and employees
  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

## License
MySQL Employee Tracker is MIT licensed

## Contributing 
Feel free to contribute to this project by forking the repo, making your changes and creating a pull request when you're ready.

## Questions
If you have any questions, contact me:

Email: l.teal21@gmail.com

[GitHub Profile](https://github.com/luketeal)
