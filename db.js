const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Prasad@2004',
    database: 'task',
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


module.exports = db;