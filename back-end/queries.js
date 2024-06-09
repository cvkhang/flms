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

const getPlayersByTeam = (request, response) => {
  const club_name = (request.params.id)
  // Read the SQL query from the file
  fs.readFile('./sql/getPlayersByTeam.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      response.status(500).json({ error: 'Internal server error' });
      return;
    }

    pool.query(sqlQuery,[club_name], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        response.status(500).json({ error: 'Internal server error' });
        return;
      }
      response.status(200).json(results.rows);
    });
  });
};

const createPlayer = (request, response) => {
  const { player_name, club_name, position, date_of_birth, shirt_number, begin_date, end_date} = request.body

  pool.query('call _flms.insert_player($1,$2,$3,$4::DATE,$5,$6::DATE,$7::DATE)', [player_name, club_name, position, date_of_birth, shirt_number, begin_date, end_date], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Player added`)
  })
}

const deletePlayer = (request, response) => {
  const playerID = parseInt(request.params.playerID)

  pool.query('call _flms.delete_player($1)', [playerID], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Player deleted: ${playerID}`)
  })
}

const updatePlayer = (request, response) => {
  const club_name = (request.params.clubName)
  const player_id = parseInt(request.params.playerID)
  const { player_name, position, date_of_birth, shirt_number, begin_date, end_date } = request.body

  pool.query(
    'call _flms.update_player_info($1,$2,$3,$4,$5::DATE,$6,$7::DATE,$8::DATE)',
    [player_id, club_name, player_name, position, date_of_birth, shirt_number, begin_date, end_date],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Player modified with ID: ${player_id}`)
    }
  )
}

/////
const getCoachesByTeam = (request, response) => {
  const club_name = (request.params.clubName)
  // Read the SQL query from the file
  fs.readFile('./sql/getCoachesByTeam.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      response.status(500).json({ error: 'Internal server error' });
      return;
    }

    pool.query(sqlQuery,[club_name], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        response.status(500).json({ error: 'Internal server error' });
        return;
      }
      response.status(200).json(results.rows);
    });
  });
};

const createCoach = (request, response) => {
  const { coach_name, club_name, nationality, date_of_birth, begin_date, end_date} = request.body

  pool.query('call _flms.insert_coach($1,$2,$3,$4::DATE,$5::DATE,$6::DATE)', [coach_name, club_name, nationality, date_of_birth, begin_date, end_date], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Coach added`)
  })
}

const deleteCoach = (request, response) => {
  const coachID = (request.params.coachID)

  pool.query('call _flms.delete_coach($1)', [coachID], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Coach deleted: ${coachID}`)
  })
}

const updateCoach = (request, response) => {
  const club_name = (request.params.clubName)
  const coachID = parseInt(request.params.coachID)
  const {coach_name, nationality, date_of_birth, begin_date, end_date } = request.body

  pool.query(
    'call _flms.update_coach_info($1,$2,$3,$4,$5::DATE,$6::DATE,$7::DATE)',
    [coachID,club_name,coach_name,nationality,date_of_birth, begin_date, end_date],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Coach modified with ID: ${coachID}`)
    }
  )
}

const getFixturesByTeam = (request, response) => {
  const club_name = (request.params.clubName)
  // Read the SQL query from the file
  fs.readFile('./sql/getFixturesByTeam.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      response.status(500).json({ error: 'Internal server error' });
      return;
    }

    pool.query(sqlQuery,[club_name], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        response.status(500).json({ error: 'Internal server error' });
        return;
      }
      response.status(200).json(results.rows);
    });
  });
};

const getPlayersByMatch = (request, response) => {
  const match_id = (request.params.match_id)
  const club_name = (request.params.club_name)
  // Read the SQL query from the file
  fs.readFile('./sql/getPlayersByMatch.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      response.status(500).json({ error: 'Internal server error' });
      return;
    }

    pool.query(sqlQuery,[match_id,club_name], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        response.status(500).json({ error: 'Internal server error' });
        return;
      }
      response.status(200).json(results.rows);
    });
  });
};

const getCoachesByMatch = (request, response) => {
  const match_id = (request.params.match_id)
  const club_name = (request.params.club_name)
  // Read the SQL query from the file
  fs.readFile('./sql/getCoachesByMatch.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      response.status(500).json({ error: 'Internal server error' });
      return;
    }

    pool.query(sqlQuery,[match_id,club_name], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        response.status(500).json({ error: 'Internal server error' });
        return;
      }
      response.status(200).json(results.rows);
    });
  });
};

const submitPlayer = (request, response) => {
  const match_id = (request.params.match_id)
  // Read the SQL query from the file
  fs.readFile('./sql/submit-player-squad.sql', 'utf8', (err, sqlQuery) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      response.status(500).json({ error: 'Internal server error' });
      return;
    }

    pool.query(sqlQuery,[player_id,match_id,club_name,_event], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        response.status(500).json({ error: 'Internal server error' });
        return;
      }
      response.status(200).json(results.rows);
    });
  });
};
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
    getPlayersByTeam,
    createPlayer,
    deletePlayer,
    updatePlayer,
    //Manager
    getCoachesByTeam,
    createCoach,
    updateCoach,
    deleteCoach,
    //Match
    getFixturesByTeam,
    getPlayersByMatch,
    getCoachesByMatch,
    submitPlayer
    //Ref
  }
  