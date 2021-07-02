USE employee_tracker;

INSERT INTO Departments (DeptName)
VALUES ("Sales"),("Corporate"),("Engineering");

INSERT INTO Roles (Title, Salary, DepartmentID)
VALUES 
    ("Director of Sales",100000,1),
    ("Salesperson",50000,1),
    ("Director of Engineering",200000,3),
    ("Engineer",80000,3),
    ("Director of HR",60000,2),
    ("President",300000,2),
    ("HR Rep",40000,2);

INSERT INTO Employees (FirstName, LastName, RoleID)
VALUES 
    ("Anna","Teal",1),
    ("John","Doe",2),
    ("Benjamin","Hutchins",3),
    ("Luke","Teal",4),
    ("Jane","Doe",5),
    ("Jack","Black",6),
    ("Slow","Joe",7);

UPDATE Employees
SET ManagerID=6
WHERE RoleID=1 OR RoleID=3 OR RoleID=5 OR RoleID=6;

UPDATE Employees
SET ManagerID=1
WHERE RoleID=2;

UPDATE Employees
SET ManagerID=3
WHERE RoleID=4;

UPDATE Employees
SET ManagerID=5
WHERE RoleID=7;