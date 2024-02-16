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
      res.json({ success: true, message: 'Login successful!' , token: row.password});
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

app.get('/api/data/discipline', (req, res) => {
  const query = 'SELECT * FROM disciplines'

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  })
})


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


app.get('/api/data/userenrollmentsasclass/:id', (req, res) => {
  const studentId = req.params.id;
  const query = 'SELECT classes.* FROM classes JOIN classEnrollments ON classes.id = classEnrollments.classId WHERE classEnrollments.studentId = ?';

  db.all(query, [studentId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Class not found' });
    }
    console.log(`Called enrollments for ID: ${studentId}, got response \n ${JSON.stringify(row, null, 2)}`);
    res.json(row);
  });
});


app.get('/api/data/discipline/:id', (req, res) => {
  const disciplineId = req.params.id;
  const query = 'SELECT * FROM disciplines WHERE id = ?';

  db.get(query, [disciplineId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'discipline not found' });
    }

    res.json(row);
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

app.get('/api/data/users/', (req, res) => {
  const token = req.headers.authorization; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
  }

  const query = 'SELECT * FROM users WHERE password = ?'; 
  db.get(query, [token], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'User not found for the provided token.' });
    }
  });
});

app.put('/api/data/users/:id', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
  }

  const userId = req.params.id;
  const { fullname, password, email, role, phonenumber, address } = req.body;

  // Retrieve the current hashed password from the database
  const getCurrentPasswordQuery = 'SELECT password FROM users WHERE id=?';
  const currentPasswordRow = await new Promise((resolve, reject) => {
    db.get(getCurrentPasswordQuery, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
  // Check if the new password is not an empty string
  const newPassword = password !== currentPasswordRow.password ? hashString(password) : currentPasswordRow.password;
  console.log(`password: ${password}, new password: ${newPassword}, current password row: ${currentPasswordRow.password}`);
  // Update the user with the new hashed password
  const updateQuery = 'UPDATE users SET fullname=?, password=?, email=?, role=?, phonenumber=?, address=? WHERE id=?';
  const queryParams = [fullname, newPassword, email, role, phonenumber, address, userId];

  db.run(updateQuery, queryParams, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes > 0) {
      res.json({ message: 'User updated successfully.' });
    } else {
      res.status(404).json({ error: 'User not found for the provided ID.' });
    }
  });

  console.log(`Called PUT Users with ID: ${userId}, got response \n ${JSON.stringify(req.body, null, 2)}`);
});



app.delete('/api/data/users/:id', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
  }

  const userId = req.params.id;

  const deleteQuery = 'DELETE FROM users WHERE id=?';
  const queryParams = [userId];

  db.run(deleteQuery, queryParams, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes > 0) {
      res.json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ error: 'User not found for the provided ID.' });
    }
  });
});


app.get('/api/data/userfullname/:id', (req, res) => {
  const classId = req.params.id;
  const query = 'SELECT fullname FROM users WHERE id = ?';

  db.get(query, [classId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Class not found' });
    }
    console.log(row);
    res.json(row);
  });
});

app.get('/api/data/participant/:disciplineId', (req, res) => {
  const disciplineId = req.params.disciplineId;
  const query = 'SELECT * FROM users INNER JOIN classEnrollments ON users.id = classEnrollments.studentId WHERE classEnrollments.disciplineId = ?;';

  db.all(query, [disciplineId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'users not found' });
    }

    res.json(rows);
  });
});


app.get('/api/data/classDiscilpine/:disciplineId', (req, res) => {
  const disciplineId = req.params.disciplineId;
  const query = 'SELECT * FROM classes INNER JOIN classEnrollments ON classes.id = classEnrollments.classId WHERE classEnrollments.disciplineId = ?;';

  db.all(query, [disciplineId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'classes not found' });
    }

    const uniqueClasses = new Set(); 
    const uniqueRows = rows.filter(row => {
      if (!uniqueClasses.has(row.id)) {
        uniqueClasses.add(row.id);
        return true;
      }
      return false;
    });

    res.json(uniqueRows); 
  });
});


app.get('/api/data/professor/:disciplineId', (req, res) => {
  const disciplineId = req.params.disciplineId;
  const query = 'SELECT u.fullname AS professor_name FROM users u JOIN classes c ON u.id = c.professorId WHERE c.disciplineId = ?;';
  
  db.all(query, [disciplineId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'users not found' });
    }

    res.json(rows);
  });
})

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}\nlocalhost:${port}/api/data`);
});