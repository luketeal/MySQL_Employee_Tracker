DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE Departments(
    DepartmentID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    DeptName VARCHAR(30) NOT NULL
    );

CREATE TABLE Roles(
    RoleID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(30) NOT NULL,
    Salary DECIMAL NOT NULL,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

CREATE TABLE Employees(
    EmployeeID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(30) NOT NULL,
    LastName VARCHAR(30) NOT NULL,
    RoleID INT,
    ManagerID INT,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
    FOREIGN KEY (ManagerID) REFERENCES Employees(EmployeeID) 
);