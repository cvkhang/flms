const clubSelect = document.getElementById("club-select");
const matchSelect = document.getElementById("match-select");
const matchMenu = document.querySelector(".match-menu"); 
const playersTable = document.querySelector(".players-list-table");
const coachesTable = document.querySelector(".coaches-list-table");
const playersHeader = document.querySelector(".hp:first-child");
const coachesHeader = document.querySelector(".hp:last-child");
const playersTbody = playersTable.querySelector("tbody");
const coachesTbody = coachesTable.querySelector("tbody");


document.addEventListener("DOMContentLoaded", () => {

    clubSelect.addEventListener("change", async (event) => {
      const selectedClub = event.target.value;
      if (selectedClub) {
        console.log("Club selected:", selectedClub); // Debugging log 1
        
        // Check if matchMenu is null before setting display
        if(matchMenu) { 
          matchMenu.style.display = "flex";
        }else {
          console.error("matchMenu element not found!");
        }

        try {
          const response = await fetch(`http://localhost:3000/fixtures/${selectedClub}`);
          if (!response.ok) { // Check if the API request was successful
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("API data:", data); // Debugging log 2

          matchSelect.innerHTML = '<option value="">--Select--</option>';
          data.forEach((match) => {
            const option = document.createElement("option");
            option.value = match.match_id;
            option.text = `Match ${match.match_id} vs ${match.opponent}`;
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
    const coachesTable = document.querySelector('.coaches-list-table');

    matchSelect.addEventListener('change', () => {
    const selectedMatchId = matchSelect.value;
    const selectedClubName = document.getElementById("club-select").value; 

    if (selectedMatchId) {
        // Show the tables
        playersTable.style.display = 'table';
        coachesTable.style.display = 'table';

        // Fetch Players Data
        fetch(`http://localhost:3000/fixtures/players/${selectedClubName}/${selectedMatchId}`)
            .then(response => response.json())
            .then(players => {
                const playerTableBody = document.getElementById("player-table-body");
                playerTableBody.innerHTML = ""; // Clear existing rows
        
                players.forEach(player => {
                    const row = playerTableBody.insertRow();
                    row.insertCell().textContent = player.match_id;
                    row.insertCell().textContent = player.player_id !== null ? player.player_id : "N/A";
                    row.insertCell().textContent = player.event;
                    // Add more cells for other player attributes if needed
                });            
            });

        // Fetch Coaches Data
        fetch(`http://localhost:3000/fixtures/coaches/${selectedClubName}/${selectedMatchId}`)
            .then(response => response.json())
            .then(coaches => {
                const coachTableBody = document.getElementById("coach-table-body");
                coachTableBody.innerHTML = ""; // Clear existing rows
        
                coaches.forEach(coach => {
                    const row = coachTableBody.insertRow();
                    row.insertCell().textContent = coach.match_id;
                    row.insertCell().textContent = coach.coach_id !== null ? coach.coach_id : "N/A";
                    row.insertCell().textContent = coach.event;
                    // Add more cells for other coach attributes if needed
                });
            });

    } else {
        // Hide the tables if no match is selected
        playersTable.style.display = 'none';
        coachesTable.style.display = 'none';
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
        const playerID = parseInt(document.getElementById("playerID").value);
        const clubName = clubSelect.value; // Get selected club name from the dropdown
        const event = document.getElementById("event").value;

        // Prepare data to send to the API
        const playerData = {
            player_id: playerID,
            club_name: clubName,
            _event: event
        };

        // Send the player data to the API
        fetch(`http://localhost:3000/fixtures/${matchSelect}`, { 
            method: 'PUT',
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
            updatePlayerList(clubName);  // Update the player list after adding
        })
        .catch(error => {
            console.error('Error adding player:', error); 
        });
    });

    const deletePlayerModal = document.getElementById("deletePlayerModal");
    const deletePlayerBtn = document.querySelector(".delete-player");
    const closeBtn3 = document.querySelector(".close-button3");
    const deletePlayerForm = document.getElementById("deletePlayerForm");
  
    // Event listeners for opening and closing the modal
    deletePlayerBtn.addEventListener("click", () => {
        deletePlayerModal.style.display = "block";
    });
  
    closeBtn3.addEventListener("click", () => {
        deletePlayerModal.style.display = "none";
    });
  
    // Handle form submission
    deletePlayerForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        // Gather form data 
        const playerID = parseInt(document.getElementById("playerName3").value);
        const clubName = clubSelect.value; // Get selected club name from the dropdown
    
  
        // Send the player data to the API
        fetch(`http://localhost:3000/players/${playerID}`, { 
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
            deletePlayerList(clubName);  // delete the player list after adding
        })
        .catch(error => {
            console.error('Error adding player:', error); 
        });
    });

});
    

function updatePlayerList(clubName) {
    const playerList = document.querySelector(".players-table tbody"); 

    if (clubName) {
    fetch(`http://localhost:3000/players/${clubName}`) 
        .then(response => response.json())
        .then(players => {
        playerList.innerHTML = ""; 
        
        players.forEach(player => {
            // 1. Create Table Row
                    const row = playerList.insertRow();
                    
                    // 2. Format and Insert Data
                    const dataToInsert = [
                        player.player_id, 
                        player.player_name, 
                        player.shirt_number, 
                        player.position,
                        new Date(player.date_of_birth).toLocaleDateString(),  // Format D.O.B.
                        new Date(player.begin).toLocaleDateString(),
                        new Date(player.end).toLocaleDateString() 
                    ];
                    
                    dataToInsert.forEach(data => {
                        const cell = row.insertCell();
                        cell.textContent = data;
                    });
        });
        })
        .catch(error => {
        console.error("Error fetching players:", error);
        playerList.innerHTML = `<tr><td colspan="6">Error loading players</td></tr>`;
        });
    } else {
    playerList.innerHTML = "";
    }
}
// Initial call to populate the player list when the page loads
updatePlayerList(document.getElementById("club-select").value);






  

