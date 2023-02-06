INSERT INTO department (dept_name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson", 80000, 1),
("Lead Engineer", 90000, 2),
("Software Engineer", 80000, 2),
("Account Manager", 100000, 3),
("Accountant", 90000, 3),
("Legal team lead", 70000, 4),
("Lawyer", 30000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Ruffalo", 2, null),
('Harry', 'Thomas', 1, 1),
('Jeff', 'Godbloom', 4, null),
('Matt', 'Ruma', 3, 3),
('Steve', 'Harvey', 6, null),
('David', 'Letteerma', 5, 5),
('Ed', 'Sheer', 7, null),
('Ashley', 'Johnson', 7, 7);