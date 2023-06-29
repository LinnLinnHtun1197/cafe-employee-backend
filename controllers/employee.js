var employee = require('../models/employee.js');

exports.allEmployee = function(req, res) {
    employee.getAllEmployee(req.query.cafe, function(err, emp) {
        if (err)
            res.send(err);
        res.send(emp);
    });
};


// create
exports.createEmployee = function(req, res) {
    var newEmployee = new employee(req.body);
    employee.createEmployee(req.body.cafe_id, req.body.start_date, newEmployee, function(err, employee) {
        if (err)
            res.send({
                "status" : "failed",
                "message": err
            });
        res.json({
            "status" : "success",
            "message" : "Added New Employee Successfully"
        });
    });
};

//update 
exports.updateEmployee = function(req, res) {
    employee.updateEmployee(req.body.id, req.body.cafe_id, new employee(req.body), function(err, emp) {
        if (err)
            res.send({
                "status" : "failed",
                "message": err
            });
        res.json({
            "status" : "success",
            "message" : "Update "+req.body.id+ " successfully"
        });
    });
};

// Delete
exports.deleteEmployee = function(req, res) {
    employee.deleteEmployee(req.body.id, function(err, employee) {
        if (err)
            res.send({
                "status" : "failed",
                "message": err
            });
        res.json({
            "status" : "success",
            "message": 'Deleted successfully' 
        });
    });
};