const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table')
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
                    'Update an employees role',
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
            } else if (choices == 'Update an employees role') {
                updateEmp();
            } else if (choices == 'View budget of all departments') {
                viewBudget();
            } else if (choices == 'End Application') {
                connect.end()
            }


        }
        )
};

const viewDepart = () => {
    console.log("You are now viewing all departments");
    let sql = ('SELECT department.id AS DeptId, department.dept_name as DeptName FROM department');

    connect.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.table(data);
            mainMenu();
        }
    })
};

const viewRole = () => {
    console.log('You are now viewing all the roles');
    let sql = ('SELECT roles.id,title,salary, department.dept_name AS "department" FROM roles JOIN department ON roles.department_id = department.id');
    connect.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.table(data);
            mainMenu();
        }
    })
};

const viewEmp = () => {
    console.log("You are now viewing all employess");
    let sql = ('SELECT a.id, a.first_name, a.last_name, roles.title as "job", CONCAT(b.first_name, " ", b.last_name) as "Manager" FROM employee as a JOIN roles ON a.role_id = roles.id JOIN department on roles.department_id = department.id LEFT OUTER JOIN employee AS b on a.manager_id = b.id');

    connect.query(sql, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.table(data);
            mainMenu();
        }
    })
};

const addRole = () => {
    let deptArr = []
    let deptNum = []

    connect.query('SELECT * FROM department', (err, roledata) => {
        roledata.forEach((item) => {
            deptArr.push(item.dept_name);
            deptNum.push(item.id)
        })
        return roledata;
    })


    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What title for the new role would you like to add'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What would you like the Salary to be?'
        },
        {
            type: 'list',
            name: 'deptid',
            message: 'What department would this job be under',
            choices: deptArr
        }]
    )
        .then((answers) => {
            for (let i = 0; i < deptArr.length; i++) {
                if (deptArr[i] === answers.deptid) {
                    answers.deptid = deptNum[i];
                }
            }

            let sql = (`INSERT INTO roles (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${answers.deptid})`);

            connect.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                } else {

                    mainMenu();
                }
            })

        })

};

const addDept = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'deptname',
        message: 'What department would you like to add to the database?',
    }])
        .then((answers) => {
            let sql = (`INSERT INTO department (dept_name) VALUES ("${answers.deptname}")`);

            connect.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    mainMenu();
                }
            })
        })
};

const addEmp = () => {
    let jobArr = [];
    let jobNum = []
    let manArr = [];
    let manNum = [];
    connect.query('SELECT * FROM roles', (err, roledata) => {
        roledata.forEach((item) => {
            jobArr.push(item.title);
            jobNum.push(item.id)
            // console.log(jobArr);
            // console.log(jobNum)
        })
    }
    )
    connect.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee;`, (err, namedata) => {
        namedata.forEach((item) => {
            manArr.push(item.full_name);
            manNum.push(item.id);
        })
    })

    inquirer.prompt([{
        type: 'input',
        name: 'fname',
        message: 'What is the employees first name?'
    },
    {
        type: 'input',
        name: 'lname',
        message: 'What is the employees last name?'
    },
    {
        type: 'list',
        name: 'roleid',
        message: 'What job will this employee have?',
        choices: jobArr
    },
    {
        type: 'list',
        name: 'manager',
        message: 'What manager is over this individual?',
        choices: manArr
    }])
        .then((answer) => {

            for (let i = 0; i < jobArr.length; i++) {
                if (jobArr[i] == answer.roleid) {
                    answer.roleid = jobNum[i]
                }
            }
            for (let i = 0; i < manArr.length; i++) {
                if (manArr[i] == answer.manager) {
                    answer.manager = manNum[i]
                }
            }

            let sql = (`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.fname}", "${answer.lname}", ${answer.roleid}, ${answer.manager})`)
            connect.query(sql, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    mainMenu();
                }
            })
        }
        )
};

const updateEmp = () => {
    let empArr = [];
    let empNum = [];
    let roleArr = [];
    let roleNum = [];
    connect.query('Select id, CONCAT(first_name, " ", last_name) as full_name from employee', (err, data) => {
        data.forEach((item) => {
            empArr.push(item.full_name);
            empNum.push(item.id)
            // console.log(empNum)
            // console.log(empArr)
        })
    })
    connect.query('SELECT * FROM roles', (err, roledata) => {
        roledata.forEach((item) => {
            roleArr.push(item.title);
            roleNum.push(item.id)


        })
    }
    )

    inquirer.prompt([{
        type: 'input',
        name: 'x',
        message: 'Hit ENTER to continue',

    },
    {
        type: 'list',
        name: 'emp',
        message: 'Which employee would you like to update the role of?',
        choices: empArr
    },
    {
        type: 'list',
        name: 'job',
        message: 'What would you like this employees new role to be?',
        choices: roleArr
    }])

        .then((answers) => {
            for (let i = 0; i < empArr.length; i++) {
                if (empArr[i] == answers.emp) {
                    answers.emp = empNum[i]
                }
            }
            for (let i = 0; i < roleArr.length; i++) {
                if (roleArr[i] == answers.job) {
                    answers.job = roleNum[i]
                }
            }

            let sql = (`UPDATE employee SET role_id = '${answers.job}' WHERE id = '${answers.emp}'`)

            connect.query(sql, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    mainMenu();
                }
            })
        })

}

mainMenu();