document.addEventListener('DOMContentLoaded', () => {
    const leagueTable = document.getElementById('league-table').getElementsByTagName('tbody')[0];

    fetch('http://localhost:3000/league-table') // Update the endpoint if necessary
        .then(response => response.json())
        .then(leagueData => {
            leagueData.forEach(team => {
                const row = leagueTable.insertRow();
                // Assuming leagueData contains position, team_name, etc.
                row.insertCell().textContent = team.position;
                row.insertCell().textContent = team.team_name;
                // ... insert other data cells ...
            });
        })
        .catch(error => {
            console.error('Error fetching league table:', error);
            // ... handle error ...
        });
});
