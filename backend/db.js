const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "whiteboard",
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL DB");
});

module.exports = db;
