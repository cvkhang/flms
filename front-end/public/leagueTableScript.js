document.addEventListener('DOMContentLoaded', () => {
    const leagueTable = document.getElementById('league-table').getElementsByTagName('tbody')[0];
  
    fetch('http://localhost:3000/league-table')
      .then(response => {
        if (!response.ok) { // Check if the request was successful (status code 200-299)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then(leagueData => {
        leagueData.forEach(team => {
          const row = leagueTable.insertRow();
  
          // Create and populate table cells based on your data structure
          row.insertCell().textContent = team.position;
          row.insertCell().textContent = team.teamName; // Changed to teamName
          row.insertCell().textContent = team.played;
          row.insertCell().textContent = team.won;
          row.insertCell().textContent = team.drawn;
          row.insertCell().textContent = team.lost;
          row.insertCell().textContent = team.goalsFor;  // Changed to goalsFor
          row.insertCell().textContent = team.goalsAgainst; // Changed to goalsAgainst
          row.insertCell().textContent = team.goalDifference; // Changed to goalDifference
          row.insertCell().textContent = team.points;
        });
      })
      .catch(error => {
        console.error('Error fetching league table:', error);
        // You can display a user-friendly error message here, e.g.,
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error loading the league table. Please try again later.';
        leagueTable.parentNode.insertBefore(errorMessage, leagueTable); // Add the error message before the table
      });
  });
  