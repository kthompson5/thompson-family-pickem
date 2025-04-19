async function loadGolfers() {
  try {
    const res = await fetch("https://corsproxy.io/?https://www.espn.com/golf/leaderboard");
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const players = [];

    // Go through table rows
    const rows = doc.querySelectorAll("table tbody tr");

    rows.forEach(row => {
      const playerCell = row.querySelector("td.tl.plyr");
      if (playerCell) {
        const anchor = playerCell.querySelector("a");
        if (anchor) {
          const name = anchor.textContent.trim();
          if (name) players.push(name);
        }
      }
    });

    // Now populate the dropdowns
    const dropdownIds = ["golfer1", "golfer2", "golfer3"];
    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      players.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    });

  } catch (err) {
    console.error("Error loading golfers:", err);
    document.getElementById("status").textContent = "Error loading player list.";
  }
}

window.onload = loadGolfers;
