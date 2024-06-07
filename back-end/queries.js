require('dotenv').config(); // Load environment variables
const Pool = require('pg').Pool;
const fs = require('fs');


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

const getMatchplayedByTeam = (request, response) => {
  // Read the SQL query from the file
  fs.readFile('./sql/playedwondrawnlost.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      response.status(500).json({ error: 'Internal server error' });
      return;
    }

    pool.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        response.status(500).json({ error: 'Internal server error' });
        return;
      }
      response.status(200).json(results.rows);
    });
  });
};
    

const getTeams = (request, response) => {
  pool.query('SELECT * FROM _flms.teams ORDER BY position ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getTeamByTeam_name = (request, response) => {
    const club_name = (request.params.id)
  
    pool.query('SELECT * FROM  _flms.teams WHERE club_name = $1', [club_name], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createTeam = (request, response) => {
    const { club_name, stadium_name, point, goal_difference, position } = request.body
  
    pool.query('INSERT INTO  _flms.teams (club_name, stadium_name, point, goal_difference, position) VALUES ($1, $2, $3, $4, $5) RETURNING *', [club_name, stadium_name, point, goal_difference, position], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Team added with club_name: ${results.rows[0].club_name}`)
    })
}

const updateTeam = (request, response) => {
    const club_name = (request.params.id)
    const { stadium_name, point, goal_difference, position } = request.body
  
    pool.query(
      'UPDATE  _flms.teams SET stadium_name = $2, point = $3, goal_difference = $4, position = $5 WHERE club_name = $1',
      [club_name, stadium_name, point, goal_difference, position],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Team modified with name: ${club_name}`)
      }
    )
}

const deleteTeam = (request, response) => {
    const club_name = (request.params.id)
  
    pool.query('DELETE FROM  _flms.teams WHERE club_name = $1', [club_name], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Team deleted with club_name: ${club_name}`)
    })
}
//Stadium
const getStadiums = (request, response) => {
    pool.query('SELECT * FROM  _flms.stadiums ORDER BY stadium_name desc', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const getStadiumByStadium_name = (request, response) => {
      const stadium_name = (request.params.id)
    
      pool.query('SELECT * FROM  _flms.stadiums WHERE stadium_name = $1', [stadium_name], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
  }
  
  const createStadium = (request, response) => {
      const { stadium_name, street, city, capacity } = request.body
    
      pool.query('INSERT INTO  _flms.stadiums (stadium_name, street, city, capacity) VALUES ($1, $2, $3, $4) RETURNING *', [stadium_name, street, city, capacity], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`)
      })
  }

module.exports = {
    //Team
    getTeams,
    getTeamByTeam_name,
    createTeam,
    updateTeam,
    deleteTeam,
    getMatchplayedByTeam,
    //Stadium
    getStadiums,
    getStadiumByStadium_name,
    createStadium,
    //updateStadium,
    //deleteStadium,
    //Player
    //Manager
    //Match
    //Ref
  }
  