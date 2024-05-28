const express = require('express');
const app = express();
const port = 3000; // Choose your desired port
const cors = require('cors');
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello World!'); // Basic response
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error executing query', err.stack);
    } else {
      console.log('Connected to database:', res.rows[0].now);
    }
  });

  // ... your database connection code ...

// GET /teams - Fetch all teams
app.get('/teams', (req, res) => {
    pool.query('SELECT * FROM teams', (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(result.rows);
      }
    });
  });
  
  // GET /teams/:id - Fetch a specific team by ID
  app.get('/teams/:id', (req, res) => {
    const teamId = parseInt(req.params.id);
    pool.query('SELECT * FROM teams', [teamId], (err, result) => {
      // ... error handling ...
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'Team not found' });
      }
    });
  });
  
  // ... more routes for players, matches, etc. ...
  