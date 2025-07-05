const mysql = require("mysql");

const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12788505",
  password: "xyBmsiJ7iD",
  database: "sql12788505",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

module.exports = db;

