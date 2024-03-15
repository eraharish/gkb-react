// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database(':memory:'); // In-memory database for demonstration purposes

// Create table
db.serialize(() => {
  db.run("CREATE TABLE data (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, email TEXT, dob DATE)");
});

// Endpoint to store data
app.post('/api/data', (req, res) => {
  const { name, age, email, dob } = req.body;
  
  // Insert data into the database
  db.run('INSERT INTO data (name, age, email, dob) VALUES (?, ?, ?, ?)', [name, age, email, dob], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Endpoint to retrieve data
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM data', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
