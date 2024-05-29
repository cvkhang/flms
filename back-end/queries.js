require('dotenv').config(); // Load environment variables
const Pool = require('pg').Pool;

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

const getTeams = (request, response) => {
  pool.query('SELECT * FROM teams ORDER BY rank ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getTeamByTeam_name = (request, response) => {
    const team_name = (request.params.id)
  
    pool.query('SELECT * FROM teams WHERE team_name = $1', [team_name], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createTeam = (request, response) => {
    const { team_name, stadium_name, point, goal_difference, rank } = request.body
  
    pool.query('INSERT INTO teams (team_name, stadium_name, point, goal_difference, rank) VALUES ($1, $2, $3, $4, $5) RETURNING *', [team_name, stadium_name, point, goal_difference, rank], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
}

const updateTeam = (request, response) => {
    const team_name = (request.params.id)
    const { stadium_name, point, goal_difference, rank } = request.body
  
    pool.query(
      'UPDATE teams SET stadium_name = $2, point = $3, goal_difference = $4, rank = $5 WHERE team_name = $1',
      [team_name, stadium_name, point, goal_difference, rank],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
}

const deleteTeam = (request, response) => {
    const team_name = (request.params.id)
  
    pool.query('DELETE FROM teams WHERE team_name = $1', [team_name], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Team deleted with name: ${team_name}`)
    })
}
//Stadium
const getStadiums = (request, response) => {
    pool.query('SELECT * FROM stadiums ORDER BY stadium_name desc', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const getStadiumByStadium_name = (request, response) => {
      const stadium_name = (request.params.id)
    
      pool.query('SELECT * FROM stadiums WHERE stadium_name = $1', [stadium_name], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
  }
  
  const createStadium = (request, response) => {
      const { stadium_name, street, city, capacity } = request.body
    
      pool.query('INSERT INTO stadiums (stadium_name, street, city, capacity) VALUES ($1, $2, $3, $4) RETURNING *', [stadium_name, street, city, capacity], (error, results) => {
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
    //Stadium
    getStadiums,
    getStadiumByStadium_name,
    createStadium,
    updateStadium,
    deleteStadium,
    //Player
    //Manager
    //Match
    //Ref
  }
  