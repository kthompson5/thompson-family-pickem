const apiKey = "a6a414c8999b33f828a1bb5750cf";
const endpoint = `https://feeds.datagolf.com/preds/live-strokes-gained?file_format=json&key=${apiKey}`;

async function loadGolfers() {
  try {
    const res = await fetch(endpoint);
    const json = await res.json();
    const players = json.data || [];

    const dropdownIds = ["golfer1", "golfer2", "golfer3"];
    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      players.forEach(player => {
        const name = player.name || `${player.first_name} ${player.last_name}`;
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    });
  } catch (err) {
    console.error("Failed to load golfers from DataGolf:", err);
    document.getElementById("status").textContent = "Error loading player list.";
  }
}

function submitGolfPicks() {
  const player = document.getElementById("player").value.trim();
  const tiebreaker = document.getElementById("tiebreaker").value;
  const picks = [
    document.getElementById("golfer1").value,
    document.getElementById("golfer2").value,
    document.getElementById("golfer3").value
  ];

  if (!player || picks.includes("") || !tiebreaker) {
    document.getElementById("status").textContent = "Please complete all fields.";
    return;
  }

  fetch("/golf-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, picks, tiebreaker, password: "goirish" })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("status").textContent = data.message;
    })
    .catch(err => {
      console.error("Error submitting golf picks:", err);
      document.getElementById("status").textContent = "Something went wrong!";
    });
}

window.onload = loadGolfers;

