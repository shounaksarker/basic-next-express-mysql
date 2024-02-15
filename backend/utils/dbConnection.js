const mysql = require("mysql2");

// <========== Database Connection ==========>

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookshelf",
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = db;