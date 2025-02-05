import inquirer from 'inquirer';
import { pool, connectToDb } from './db/connection.js';

// View departments
export async function viewDepartment() {
    try {
        const res = await pool.query(`SELECT id, name FROM department;`);
        console.table(res.rows);
    } catch (error) {
        console.error('Error loading department.', error);
    }
}

// View employee roles
export async function viewEmployeeRole() {
    try {
        const res = await pool.query(`
            SELECT employee_role.role_id, employee_role.title, employee_role.salary, department.department_name AS department
            FROM employee_role 
            JOIN department ON employee_role.department_id = departments.department_id;
        `);
        console.table(res.rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
}

// View employees
export async function viewEmployee() {
    try {
        const res = await pool.query(`
            SELECT employee.id, employee.first_name, employee.last_name, employee_role.title AS role, department.name AS department, employee.manager_id
            FROM employee
            JOIN employee_role ON employee.role_id = employee_role.id
            JOIN department ON employee_role.department_id = department.id;`);
        console.table(res.rows);
    } catch (error) {
        console.error('Error fetching employee:', error);
    }
}

// Add department
async function addDepartment() {
    const { department_name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What would you like to call the new department?',
            validate: (input) => input.trim() !== '' || 'Input new Department:'
        }
    ]);

    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [department_name]);
        console.log(`The new department "${department_name}" was added.`);
    } catch (error) {
        console.log('!ERROR! Must add department!', error);
    }
}

// Add employee role
async function addEmployeeRole() {
    const { employee_role, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_role',
            message: 'Input new role:',
            validate: (input) => input.trim() !== '' || 'Input new Role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary for this role:',
            validate: (input) => !isNaN(input) && input.trim() !== '' || 'Enter a valid salary.'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID for this role:',
            validate: (input) => !isNaN(input) && input.trim() !== '' || 'Enter a valid department ID.'
        }
    ]);

    try {
        await pool.query('INSERT INTO employee_role (title, salary, department_id) VALUES ($1, $2, $3)', [employee_role, salary, department_id]);
        console.log(`The new role "${employee_role}" was added!`);
    } catch (error) {
        console.log('!ERROR! Must input new role.', error);
    }
}

// Add employee
async function addEmployee() {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Input first name:',
            validate: (input) => input.trim() !== '' || 'Input new employee first name.'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Input last name:',
            validate: (input) => input.trim() !== '' || 'Input new employee last name.'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter Role ID for the new employee:',
            validate: (input) => !isNaN(input) && input.trim() !== '' || 'Enter a valid Role ID.'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter Manager ID (if applicable, otherwise press Enter):',
            validate: (input) => input === '' || !isNaN(input) || 'Enter a valid Manager ID or leave blank.'
        }
    ]);

    try {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
                         [first_name, last_name, role_id, manager_id || null]);
        console.log(`The new employee "${first_name} ${last_name}" was added!`);
    } catch (error) {
        console.log('Error! Must add First & Last name!', error);
    }
}

// Update employee role
async function updateEmployeeRole() {
    const { employee_id, new_role_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'Enter Employee ID to update:',
            validate: (input) => !isNaN(input) && input.trim() !== '' || 'Enter a valid Employee ID.'
        },
        {
            type: 'input',
            name: 'new_role_id',
            message: 'Enter new Role ID:',
            validate: (input) => !isNaN(input) && input.trim() !== '' || 'Enter a valid Role ID.'
        }
    ]);

    try {
    
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [new_role_id, employee_id]);
        console.log(`Employee ID ${employee_id} has been updated to role ID ${new_role_id}.`);
    } catch (error) {
        console.log('Error updating employee role!', error);
    }
}

// Menu
async function menu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What action would you like to take?',
            choices: [
                'View All Department', 
                'View All Role', 
                'View All Employee', 
                'Add Department', 
                'Add Employee Role', 
                'Add Employee', 
                'Update Employee Role',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View All Department':
            await viewDepartment();
            break;
        case 'View All Role':
            await viewEmployeeRole();
            break;
        case 'View All Employee':
            await viewEmployee();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Add Employee Role':
            await addEmployeeRole();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            process.exit();
    }

    await menu(); // Restart menu after action
}

// Initialize the application
(async () => {
    await connectToDb();
    await menu();
})();