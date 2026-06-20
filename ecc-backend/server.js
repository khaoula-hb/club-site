const bcrypt = require("bcrypt");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ================= DB CONNECTION =================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});


// ================= REGISTER API =================

app.post("/api/register", async (req, res) => {

  const {
    username,
    email,
    password,
    section,
    hobbies
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {

    const hashedPassword =
      await bcrypt.hash(password, 10);

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {

        if (err)
          return res.status(500).json(err);

        if (result.length > 0) {
          return res.status(409).json({
            message: "Email already exists"
          });
        }

        db.query(
          "INSERT INTO users (username, email, password, section, hobbies) VALUES (?, ?, ?, ?, ?)",
          [
            username,
            email,
            hashedPassword,
            section,
            hobbies
          ],
          (err, data) => {

            if (err)
              return res.status(500).json(err);

            return res.status(201).json({
              message: "User registered successfully",
              userId: data.insertId
            });

          }
        );

      }
    );

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });

  }

});

// ================= LOGIN API =================

app.post("/api/login", async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {

      if (err)
        return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const user = result[0];

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {
        return res.status(401).json({
          message: "Wrong password"
        });
      }

      return res.status(200).json({
        message: "Login successful 🚀",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    }
  );

});

// =================EVENTS API =================

app.get("/api/events", (req, res) => {

  db.query("SELECT * FROM events", (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);

  });

});

app.post("/api/events", (req, res) => {

  const { title, description, category, location, date, time, image } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      message: "Title and category required"
    });
  }

  const sql = `
    INSERT INTO events
    (title, description, category, location, date, time, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [title, description, category, location, date, time, image],
    (err, result) => {

      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Event created 🚀",
        eventId: result.insertId
      });

    }
  );

});

app.delete("/api/events/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM events WHERE id = ?",
    [id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      res.json({
        message: "Event deleted ❌"
      });

    }
  );

});

app.put("/api/events/:id", (req, res) => {

  const id = req.params.id;
  const { title, description, category, location, date, time, image } = req.body;

  const sql = `
    UPDATE events
    SET title=?, description=?, category=?, location=?, date=?, time=?, image=?
    WHERE id=?
  `;

  db.query(sql,
    [title, description, category, location, date, time, image, id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({
        message: "Event updated ✅"
      });

    }
  );

});


app.get("/api/users",(req,res)=>{

  db.query(
    "SELECT * FROM users",
    (err,result)=>{

      if(err)
      return res.status(500).json(err);

      res.json(result);

    }
  );

});


app.delete("/api/users/:id",(req,res)=>{

  const id = req.params.id;

  db.query(
    "DELETE FROM users WHERE id=?",
    [id],
    (err,result)=>{

      if(err)
      return res.status(500).json(err);

      res.json({
        message:"User deleted ✅"
      });

    }
  );

});





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
