import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors'
import * as crypto from 'crypto';

const app = express();
const port = 3001;

function hashString(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

app.use(cors());
app.use(express.json());
// Connect to the SQLite database
const db = new sqlite3.Database('src/database.db');


// Endpoint for user login
app.post('/api/auth/login', (req, res) => {
  var { username, password } = req.body;
  password = hashString(password);
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.get(query, [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      res.json({ success: true, message: 'Login successful!' });
    } else {
      res.json({ success: false, message: 'Login failed. Please check your credentials.' });
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  var { username, password, fullname, email, address, phonenumber } = req.body;
  password = hashString(password);
  // Your SQLite query to insert user data
  const sql = 'INSERT INTO users (username, password, fullname, email, address, phonenumber) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [username, password, fullname, email, address, phonenumber];

  db.run(sql, values, function (err) {
    if (err) {
      console.error('SQLite error:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json({
        success: true,
        message: 'Registered successfully',
        id: this.lastID
      });
    }
  });
});


// Define a route to fetch all data
app.get('/api/data/classes', (req, res) => {
  const query = 'SELECT * FROM classes';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/data/classes/:id', (req, res) => {
  const classId = req.params.id;
  const query = 'SELECT * FROM classes WHERE id = ?';

  db.get(query, [classId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(row);
  });
});

app.get('/api/data/users', (req, res) => {
  const query = 'SELECT * FROM users';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/tables', (req, res) => {
  const query = "SELECT name FROM sqlite_master WHERE type='table'";

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const tables = rows.map(row => row.name);
    res.json(tables);
  });
});

// Endpoint to get all disciplines
app.get('/api/data/disciplines', (req, res) => {
  const query = 'SELECT * FROM disciplines';

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Endpoint to get classes by discipline ID
app.get('/api/data/classes/:disciplineId', (req, res) => {
  const disciplineId = req.params.disciplineId;
  const query = 'SELECT * FROM classes WHERE disciplineId = ?';

  db.all(query, [disciplineId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Endpoint to get participants by class ID
app.get('/api/data/users/:classId', (req, res) => {
  const classId = req.params.classId;
  const query = 'SELECT * FROM classEnrollments INNER JOIN users ON classEnrollments.studentId = users.id WHERE classEnrollments.classId = ?';

  db.all(query, [classId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}\nlocalhost:${port}/api/data`);
});
