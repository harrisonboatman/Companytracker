const mysql = require('mysql2');
const inquirer = require('inquirer');
const { allowedNodeEnvironmentFlags } = require('process');
const { ADDRGETNETWORKPARAMS } = require('dns');
require('dotenv').config();

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DBPW,
    database: 'employee_db'
},
    console.log('Connected to employee_db now!'));

const mainMenu = () => {
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'choices',
                message: 'Welcome to the main menu, what would you like to do next?',
                choices: ['View every department',
                    'View all roles',
                    'View every employee',
                    'Add a role',
                    'Add a department',
                    'Add an employee',
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'Update an employees role',
                    'Update and employees manager',
                    'View budget of all departments',
                    'End Application']

            }]
    )
    .then((answers) => {
        const { choices } = answers;
        if (choices == 'View every department') {
            viewDepart();
        } else if (choices == 'View all roles') {
            viewRole();
        } else if (choices == 'View every employee') {
            viewEmp();
        } else if (choices == 'Add a role') {
            addRole();
        } else if (choices == 'Add a department') {
            addDept();
        } else if (choices == 'Add an employee') {
            addEmp();
        } else if (choices == 'Delete a department') {
            delDept();
        } else if (choices == 'Delete a role') {
            delRole();
        } else if (choices == 'Delete an employee') {
            delEmp();
        } else if (choices == 'Update an employees role') {
            updateEmp();
        } else if (choices == 'View budget of all departments') {
            viewBudget();
        } else if (choices == 'End Application') {
            connect.end()
        }

    }
)};

viewDepart = () => {
    console.log("You are now viewing all departments");
    let sql = ('SELECT department.id AS DeptId, department.name as DeptName FROM department');

    connect.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.table(data);
            mainMenu();
        }
    })
};

viewRole = () => {
    console.log('You are now viewing all the roles');
    let sql = ('SELECT role.title AS roles FROM roles');
    connect.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.table(data);
            mainMenu();
        }
    })
};

viewEmp = () => {
    console.log("You are now viewing all employess");
    let sql = ('SELECT * FROM employees');

    connect.query(sql, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.table(data);
            mainMenu();
        }
    })
};

