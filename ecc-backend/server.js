const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 TEST
app.get('/', (req, res) => {
  res.send('Server works 🚀');
});

// 🔹 REGISTER
app.post('/register', async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (full_name, email, pass_word) VALUES (?, ?, ?)',
      [full_name, email, hash],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User saved ✅' });
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.json({ message: null });
      }

      const user = result[0];
      const match = await bcrypt.compare(password, user.pass_word);

      if (!match) {
        return res.json({ message: null });
      }

      res.json({
        message: 'Login success ✅',
        role: user.role
      });
    }
  );
});

// 🔹 USERS
app.get('/users', (req, res) => {
  db.query('SELECT id, full_name, email FROM users', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// 🔹 EVENTS
app.get('/events', (req, res) => {
  db.query('SELECT * FROM events', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// 🔹 ADD EVENT
app.post('/events', (req, res) => {
  const { title, description, date, location } = req.body;

  db.query(
    'INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)',
    [title, description, date, location],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Event added ✅' });
    }
  );
});

// 🔹 DELETE EVENT
app.delete('/events/:id', (req, res) => {
  db.query('DELETE FROM events WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted ✅' });
  });
});

// 🔹 UPDATE EVENT
app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;

  db.query(
    'UPDATE events SET title=?, description=?, date=?, location=? WHERE id=?',
    [title, description, date, location, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Event updated ✅' });
    }
  );
});

// 🔹 SERVER
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
