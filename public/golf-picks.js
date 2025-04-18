const apiKey = "a6a414c8999b33f828a1bb5750cf";
const endpoint = `https://feeds.datagolf.com/preds/live-strokes-gained?file_format=json&key=${apiKey}`;

async function loadGolfers() {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    const players = data.players || [];

    const dropdownIds = ["golfer1", "golfer2", "golfer3"];
    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      players.forEach(player => {
        const option = document.createElement("option");
        option.value = `${player.first_name} ${player.last_name}`;
        option.textContent = `${player.first_name} ${player.last_name}`;
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

  // Future backend POST logic could go here
  console.log({ player, picks, tiebreaker });

  document.getElementById("status").textContent = "Picks submitted successfully!";
}

window.onload = loadGolfers;
document.getElementById("golf-pick-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const player = document.getElementById("player").value.trim();
  const password = document.getElementById("password").value.trim();
  const golfer1 = document.getElementById("golfer1").value;
  const golfer2 = document.getElementById("golfer2").value;
  const golfer3 = document.getElementById("golfer3").value;
  const tiebreaker = document.getElementById("tiebreaker").value;

  if (!player || !password || !golfer1 || !golfer2 || !golfer3) {
    alert("Please fill out all fields");
    return;
  }

  fetch("/golf-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, password, golfer1, golfer2, golfer3, tiebreaker })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("status").textContent = data.message;
    })
    .catch(err => {
      console.error("Error submitting golf picks:", err);
      document.getElementById("status").textContent = "Something went wrong!";
    });
});
