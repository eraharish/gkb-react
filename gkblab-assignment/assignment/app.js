const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Create SQLite database connection
const db = new sqlite3.Database('./data.db');

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    age INTEGER,
    dob DATE
)`);

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to submit data
app.post('/submit', (req, res) => {
    const { name, email, age, dob } = req.body;
    db.run(`INSERT INTO data (name, email, age, dob) VALUES (?, ?, ?, ?)`, [name, email, age, dob], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Failed to submit data' });
        } else {
            res.json({
                id: this.lastID,
                name,
                email,
                age,
                dob
            });
        }
    });
});

// Endpoint to fetch data
app.get('/data', (req, res) => {
    db.all(`SELECT * FROM data`, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Failed to fetch data' });
        } else {
            res.json(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
