const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const db = require('./queries')
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)



app.get('/', (req, res) => {
  res.send('Hello World!'); // Basic response
});

app.get('/teams', db.getTeams)
app.get('/teams/matchplayedbyTeam', db.getMatchplayedByTeam)
app.get('/teams/:id', db.getTeamByTeam_name)
app.post('/teams', db.createTeam)
app.put('/teams/:id', db.updateTeam)
app.delete('/teams/:id', db.deleteTeam)

app.get('/stadiums', db.getStadiums)
app.get('/stadiums/:id', db.getStadiumByStadium_name)
app.post('/stadiums', db.createStadium)

app.get('/players/:id', db.getPlayersByTeam)
app.post('/players', db.createPlayer)


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


  
  

