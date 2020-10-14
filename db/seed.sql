USE eeDB;

INSERT INTO department (name)
VALUES ('Sales'),
('Front Desk'), 
('Kids Club'), 
('Housekeeping');


INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 10000, 1), 
('Salesperson', 50000, 1), 
('Reception Lead', 32000, 2), 
('Receptionist', 25000, 2), 
('Kids Club Lead', 35000, 3), 
('Kids Club Attendant', 23000, 3), 
('Maintenance', 50000, 4), 
('Housekeeper', 30000, 4); 


INSERT INTO employee (first_name, last_name, manager_id, role_id) 
VALUES 
('Laura', 'Garcia', null, 1), 
('Liz', 'Mata', 1, 2), 
('Perla', 'Lerma', null, 1), 
('Rebecca', 'Porter', 5, 6), 
('Nicole', 'Ramos', null, 7), 
('Jessica', 'Torries', null, 8),
('Bonnie', 'Soto', 3, 4);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;