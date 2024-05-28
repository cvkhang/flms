document.addEventListener('DOMContentLoaded', () => {
    const teamsContainer = document.getElementById('teams-container');
  
    fetch('http://localhost:3000/teams')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(teams => {
        console.log('Teams from API:', teams);
        const teamsList = document.createElement('ul');
        teams.forEach(team => {
          const listItem = document.createElement('li');
          listItem.textContent = team.name; // Make sure your data has a 'name' property
          teamsList.appendChild(listItem);
        });
        teamsContainer.appendChild(teamsList);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        teamsContainer.textContent = `An error occurred: ${error.message}`;
      });
  });
  