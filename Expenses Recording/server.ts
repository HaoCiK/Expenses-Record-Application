import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';

interface UserRow {
  id: number;
  username: string;
}

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize database
let db = new sqlite3.Database('./db/expenses', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to database.');
});

// Create users table
db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Users table created.');
});

// Create expenses table
db.run('CREATE TABLE IF NOT EXISTS expenses(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, date TEXT, description TEXT, category TEXT, amount REAL, FOREIGN KEY(user_id) REFERENCES users(id))', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Expenses table created.');
});

// Register
app.post('/api/register', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM users WHERE username=?';
  db.get(sql, [req.body.username], (err, row: UserRow) => {
    if (row) {
      res.status(400).json({message: 'Username exists, please login or register with other username'})
    } else {
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      const user = [req.body.username, req.body.password];
      db.run(sql, user, function (err) {
        if (err) {
          return console.error(err.message);
        }
        res.json({id: this.lastID, username: req.body.username});
      });
    }
  });
});

// Log in
app.post('/api/login', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM users WHERE username=? AND password=?';
  const user = [req.body.username, req.body.password];
  db.get(sql, user, (err, row: UserRow) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      res.json({id: row.id, username: row.username});
    } else {
      res.status(401).json({message: 'Invalid username or password'});
    }
    
  });
});


//CRUD operation
//Create (post to endpoint)
app.post('/api/expenses', (req: Request, res: Response) => {
  const sql = 'INSERT INTO expenses (user_id, date, description, category, amount) VALUES (?, ?, ?, ?, ?)';
  const expense = [req.body.user_id, req.body.date, req.body.description, req.body.category, req.body.amount];
  db.run(sql, expense, function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.json({id: this.lastID, ...req.body});
  });
});

//Read (get from endpoint)
app.get('/api/expenses/:user_id', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM expenses WHERE user_id=?';
  db.all(sql, [req.params.user_id], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});

//Update (put to endpoint)
app.put('/api/expenses/:id', (req: Request, res: Response) => {
  const sql = 'UPDATE expenses SET date = ?, description = ?, category = ?, amount = ? WHERE id = ?';
  const expense = [req.body.date, req.body.description, req.body.category, req.body.amount, req.params.id];
  db.run(sql, expense, function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.json({id: req.params.id, ...req.body});
  });
});

//Delete (delete from endpoint)
app.delete('/api/expenses/:id', (req: Request, res: Response) => {
  const sql = 'DELETE FROM expenses WHERE id = ?';
  db.run(sql, req.params.id, function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.json({id: req.params.id});
  });
});

//Listen to server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
