async function loadGolfers() {
  try {
    const url = "https://www.espn.com/golf/leaderboard";
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();

    const temp = document.createElement("html");
    temp.innerHTML = data.contents;

    const rows = temp.querySelectorAll("table tbody tr");
    const players = [];

    rows.forEach(row => {
      const playerCell = row.querySelector("td.tl.plyr");
      if (playerCell) {
        const anchor = playerCell.querySelector("a");
        if (anchor) {
          const name = anchor.textContent.trim();
          if (name && !players.includes(name)) {
            players.push(name);
          }
        }
      }
    });

    const dropdownIds = ["golfer1", "golfer2", "golfer3", "golfer4"];
    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      select.innerHTML = `<option value="">Select ${id}</option>`;
      players.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    });

  } catch (err) {
    console.error("Failed to load golfers:", err);
    document.getElementById("status").textContent = "Error loading player list.";
  }
}

window.onload = loadGolfers;


