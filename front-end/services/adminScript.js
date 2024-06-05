document.addEventListener('DOMContentLoaded', () => {
    fetchStadiums(); // Fetch stadiums on page load
});

//Function to fetch stadiums
function fetchStadiums() {
    fetch('http://localhost:3000/stadiums')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(stadiums => {
            const stadiumSelect = document.getElementById('stadium-id');
            stadiums.forEach(stadium => {
                const option = new Option(stadium.stadium_name, stadium.id);
                stadiumSelect.add(option);
            });
        })
        .catch(error => {
            console.error('Error fetching stadiums:', error);
            alert('Error fetching stadiums. Please try again later.');
        });
}

// Add Team function (submit event listener)
document.getElementById('add-team-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const teamName = document.getElementById('team-name').value;
    const stadiumId = document.getElementById('stadium-id').value;

    fetch('http://localhost:3000/teams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_name: teamName, stadium_id: stadiumId })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data.error));
        }
        return response.json();
    })
    .then(() => {
        alert("Team added successfully!");
        fetchStadiums(); // Refresh the stadium dropdown after adding a new team
    })
    .catch(error => {
        alert(`Error adding team: ${error}`);
    });
});

// Add Stadium function (click event listener)
document.getElementById('add-stadium-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const stadiumName = document.getElementById('stadium-name').value;
    const capacity = parseInt(document.getElementById('capacity').value, 10);
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;

    fetch('http://localhost:3000/stadiums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stadium_name: stadiumName, capacity, city, street })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => Promise.reject(data.error));
        }
        return response.json();
    })
    .then(() => {
        alert("Stadium added successfully!");
        fetchStadiums(); // Refresh the stadium dropdown after adding a new stadium
    })
    .catch(error => {
        alert(`Error adding stadium: ${error}`);
    });
});
