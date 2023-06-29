'user strict';
var sql = require('../database/db.js');

//object constructor
var employee = function(emp){
    this.name               = emp.name;
    this.email_address      = emp.email_address;
    this.phone_number       = emp.phone_number;
    this.gender             = emp.gender;
};

employee.getAllEmployee = function(cafe, result) {
    const reqValue = cafe;
    let query = `SELECT employees.id, employees.name, employees.email_address, employees.phone_number, DATEDIFF(NOW(), employee_cafe.start_date) AS days_worked, cafes.name AS cafe_name
                FROM employees
                INNER JOIN employee_cafe ON employees.id = employee_cafe.employee_id
                INNER JOIN cafes ON employee_cafe.cafe_id = cafes.id`;

    if (cafe) {
        query += ` WHERE cafes.name LIKE '%${reqValue}%' OR cafes.location LIKE '%${reqValue}%'`;
    }

    query += ` ORDER BY days_worked DESC`;
    sql.query( query, function (err, res) {
        if(err) {
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

// Create
employee.createEmployee = function createEmployee(cafeId, startDate, employee, result) {
    sql.query("INSERT INTO EMPLOYEES SET ?", employee, function (err, res) {
        if(err) {
            result(err, null);
        } else{
            let query = `SELECT id
                FROM employees
                WHERE name = '${employee.name}' 
                AND email_address='${employee.email_address}' 
                AND phone_number='${employee.phone_number}' 
                ORDER BY id DESC LIMIT 1`; // to get inserted id

            sql.query( query, function (err, res) {
                if(err) {
                    result(err, null);
                } else {
                    const employeeId = res[0].id;
                    const employeeCafeData = {
                        employee_id: employeeId,
                        cafe_id: cafeId,
                        start_date: startDate,
                    };
                    sql.query("INSERT INTO EMPLOYEE_CAFE SET ?", employeeCafeData, function (err, res) {
                        if(err) {
                            result(err, null);
                        } else{
                            result(null, res);
                        }
                    });
                }
            });
        }
    });
};

// Update
employee.updateEmployee = function(id, cafe_id, res, result){
    const {name,email_address,phone_number,gender} = res;
    sql.query("UPDATE EMPLOYEES SET name = ?, email_address = ?, phone_number = ?, gender = ? WHERE id = ?", 
            [name, email_address, phone_number, gender, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else{
            if(cafe_id)
            {
                sql.query("UPDATE EMPLOYEE_CAFE SET cafe_id = ? WHERE employee_id = ?", 
                        [cafe_id, id], function (err, res) {
                    if(err) {
                        console.log("error: ", err);
                        result(null, err);
                    } else{
                        result(null, res);
                    }
                });
            } else {
                result(null, res);
            }
            
        }
    });
};

employee.deleteEmployee = function(id, result){
    var paramId = id;
    sql.query(`DELETE FROM employees WHERE id = '${paramId}'`, function (err, res) {
        if(err) {
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = employee;