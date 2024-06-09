const weekSelect = document.getElementById("week-select");
const matchSelect = document.getElementById("match-select");
const matchMenu = document.querySelector(".match-menu"); 
const weekMenu = document.querySelector(".match-menu"); 
const playersTable = document.querySelector(".players-list-table");
const coachesTable = document.querySelector(".coaches-list-table");


document.addEventListener("DOMContentLoaded", () => {

    weekSelect.addEventListener("change", async (event) => {
      const selectedWeek = event.target.value;
      if (selectedWeek) {
        console.log("Week selected:", selectedWeek); // Debugging log 1
        

        try {
          const response = await fetch(`http://localhost:3000/fixtures/week/${selectedWeek}`);
          if (!response.ok) { // Check if the API request was successful
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("API data:", data); // Debugging log 2

          matchSelect.innerHTML = '<option value="">--Select--</option>';
          data.forEach((match) => {
            const option = document.createElement("option");
            option.value = match.match_id;
            option.text = `Match ${match.match_id}`;
            matchSelect.add(option);
          });
        } catch (error) {
          console.error("Error fetching match data:", error);
          // Display the error message to the user
          alert("Error fetching match data. Please try again later."); 
        }
      } else {
        matchMenu.style.display = "none";
        clearAndHideTable(playersTable, playersTbody, playersHeader);
        clearAndHideTable(coachesTable, coachesTbody, coachesHeader);
      }
    });

    //////
    const matchSelect = document.getElementById("match-select");
    const playersTable = document.querySelector('.players-list-table');

    matchSelect.addEventListener('change', () => {
    const selectedMatchId = matchSelect.value;

    if (selectedMatchId) {
        // Show the tables
        playersTable.style.display = 'table';

        // Fetch Players Data
        fetch(`http://localhost:3000/fixtures/event/${selectedMatchId}`)
            .then(response => response.json())
            .then(players => {
                const playerTableBody = document.getElementById("player-table-body");
                playerTableBody.innerHTML = ""; // Clear existing rows
        
                players.forEach(player => {
                    const row = playerTableBody.insertRow();
                    row.insertCell().textContent = player.club_name;
                    row.insertCell().textContent = player.player_id !== null ? player.player_id : "N/A";
                    row.insertCell().textContent = player.event;
                    row.insertCell().textContent = player.event_half !== null ? player.player_id : "N/A";
                    row.insertCell().textContent = player.event_time !== null ? player.player_id : "N/A";
                    // Add more cells for other player attributes if needed
                });            
            });

        } else {
            // Hide the tables if no match is selected
            playersTable.style.display = 'none';
        }
    });

    const addPlayerModal = document.getElementById("addPlayerModal");
    const addPlayerBtn = document.querySelector(".add-player");
    const closeBtn = document.querySelector(".close-button");
    const addPlayerForm = document.getElementById("addPlayerForm");

    // Event listeners for opening and closing the modal
    addPlayerBtn.addEventListener("click", () => {
        addPlayerModal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        addPlayerModal.style.display = "none";
    });

    // Handle form submission
    addPlayerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Gather form data 
        const match_id = matchSelect.value;
        const playerID = parseInt(document.getElementById("playerID").value);
        const _event = document.getElementById("event").value;
        const event_half = parseInt(document.getElementById("eventHalf").value);
        const event_time = parseInt(document.getElementById("eventTime").value);


        // Prepare data to send to the API
        const playerData = {
            match_id: matchSelect.value,
            player_id: playerID,
            _event: _event,
            event_half: event_half,
            event_time: event_time
        };

        // Send the player data to the API
        fetch(`http://localhost:3000/fixtures/event`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text(); 
        })

        .then(data => {
            console.log(data); 

            addPlayerModal.style.display = "none"; 
            updatePlayerList(matchSelect);  // Update the player list after adding
        })
        .catch(error => {
            console.error('Error adding player:', error); 
        });
    });

    const deletePlayerModal = document.getElementById("deletePlayerModal");
    const deletePlayerBtn = document.querySelector(".delete-player");
    const closeBtn2 = document.querySelector(".close-button2");
    const deletePlayerForm = document.getElementById("deletePlayerForm");
  
    // Event listeners for opening and closing the modal
    deletePlayerBtn.addEventListener("click", () => {
        deletePlayerModal.style.display = "block";
    });
  
    closeBtn2.addEventListener("click", () => {
        deletePlayerModal.style.display = "none";
    });
  
    // Handle form submission
    deletePlayerForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        // Gather form data 
        const match_id = matchSelect.value;
        const playerID = parseInt(document.getElementById("playerID2").value);
        const clubName = document.getElementById("clubName2").value
        const _event = document.getElementById("event2").value;
        const event_half = parseInt(document.getElementById("eventHalf2").value);
        const event_time = parseFloat(document.getElementById("eventTime2").value);
  
        // Send the player data to the API
        fetch(`http://localhost:3000/fixtures/event/${matchID}/${playerID}/${event}/${event_half}/${event_time}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text(); 
        })
        .then(data => {
            console.log(data); 
  
            deletePlayerModal.style.display = "none"; 
            updatePlayerList(matchSelect);  // delete the player list after adding
        })
        .catch(error => {
            console.error('Error adding player:', error); 
        });
    });
});
    

function updatePlayerList(matchSelect) {
    const selectedMatchId = matchSelect.value;
    const selectedClubName = document.getElementById("club-select").value; 

    if (selectedMatchId) {
        // Show the tables
        playersTable.style.display = 'table';

        // Fetch Players Data
        fetch(`http://localhost:3000/fixtures/event/${selectedMatchId}`)
            .then(response => response.json())
            .then(players => {
                const playerTableBody = document.getElementById("player-table-body");
                playerTableBody.innerHTML = ""; // Clear existing rows
        
                players.forEach(player => {
                    const row = playerTableBody.insertRow();
                    row.insertCell().textContent = player.club_name;
                    row.insertCell().textContent = player.player_id !== null ? player.player_id : "N/A";
                    row.insertCell().textContent = player.event;
                    row.insertCell().textContent = player.event_half !== null ? player.player_id : "N/A";
                    row.insertCell().textContent = player.event_time !== null ? player.player_id : "N/A";
                    // Add more cells for other player attributes if needed
                });            
            });
    }
}









  

