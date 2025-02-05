DROP DATABASE IF EXISTS employeeflow_db;
CREATE DATABASE employeeflow_db;

\c employeeflow_db;

SELECT current_database();

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
    
);

CREATE TABLE employee_role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCE department(id) 
    ON DELETE CASCADE
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCE employee_role(id),
    FOREIGN KEY (manager_id REFERENCES employee(id)
    ON DELETE SET NULL
);