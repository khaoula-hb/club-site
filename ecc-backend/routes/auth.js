const db = require('./db');
const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
  const { full_name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
    [full_name, email, hash],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'User registered ✅' });
    }
  );
});