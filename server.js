const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

// Connect to MySQL (adjust your credentials)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // or your password
  database: "mydb"
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// API endpoint
app.post("/submit", (req, res) => {
  const {trash, trash_recycled, electricity, student_count, greenery_area, school} = req.body;

  const query = `INSERT INTO calculator (trash, trash_recycled, electricity, student_count, greenery_area, school) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [trash, trash_recycled, electricity, student_count, greenery_area, school], (err, result) => {
    console.log("Received data:", req.body);
    if (err) {
      console.error("MySQL insert error:", err);
      res.status(500).json({ error: "DB insert failed" });
      return;
    }
    res.status(200).json({ message: "Data saved!", id: result.insertId });
  });
});

app.get("/get-data", (req, res) => {
  const query = "SELECT * FROM calculator ORDER BY entry_no ASC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL fetch error:", err); // added this for more detailed error
      return res.status(500).json({ error: "DB fetch failed", details: err });
    }
    res.status(200).json(results);
  });
});

const { Parser } = require("json2csv");

app.get("/export-csv", (req, res) => {
  const query = "SELECT entry_no, trash, trash_recycled, electricity, student_count, greenery_area, school FROM calculator ORDER BY entry_no DESC";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("CSV Export Error:", err);
      return res.status(500).send("CSV export failed.");
    }

    const fields = [
      { label: "Entry No", value: "entry_no" },
      { label: "Trash (kg)", value: "trash" },
      { label: "Recycled (kg)", value: "trash_recycled" },
      { label: "Electricity (kWh)", value: "electricity" },
      { label: "Students", value: "student_count" },
      { label: "Greenery Area (sqm)", value: "greenery_area" },
      { label: "School", value: "school" }
    ];

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(results);

    res.setHeader("Content-Disposition", "attachment; filename=carbon_data.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csv);
  });
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Connected to Node.js!");
  console.log("Connected to HTML!");
  console.log("Connected to CSS!");
  console.log("Connected to JavaScript!");
  console.log("Connected to Bootstrap!");
  console.log("Connected to XAMPP!");
});

