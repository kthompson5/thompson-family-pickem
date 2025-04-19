async function loadGolfersFromESPN() {
  const proxyUrl = "https://api.allorigins.win/raw?url=";
  const espnUrl = "https://www.espn.com/golf/leaderboard";
  const dropdownIds = ["golfer1", "golfer2", "golfer3"];

  try {
    const res = await fetch(proxyUrl + encodeURIComponent(espnUrl));
    const html = await res.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const rows = tempDiv.querySelectorAll("table tbody tr");

    const golfers = [];
    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].querySelectorAll("td");
      if (cols.length >= 2) {
        const name = cols[1].textContent.trim();
        if (name && !golfers.includes(name)) {
          golfers.push(name);
        }
      }
    }

    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      select.innerHTML = ""; // Clear old options
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "-- Select Golfer --";
      defaultOption.value = "";
      select.appendChild(defaultOption);

      golfers.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    });

  } catch (err) {
    console.error("Error loading golfers:", err);
    document.getElementById("status").textContent = "Error loading golfer list.";
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

  console.log({ player, picks, tiebreaker });
  document.getElementById("status").textContent = "Picks submitted successfully!";
}

window.onload = loadGolfersFromESPN;

