async function loadGolfers() {
  try {
    const url = "https://www.espn.com/golf/leaderboard";
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    const res = await fetch(proxyUrl);
    const data = await res.json();
    const html = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const rows = doc.querySelectorAll("table tbody tr");
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

function submitGolfPicks() {
  const player = document.getElementById("player").value.trim();
  const tiebreaker = document.getElementById("tiebreaker").value;
  const picks = [
    document.getElementById("golfer1").value,
    document.getElementById("golfer2").value,
    document.getElementById("golfer3").value,
    document.getElementById("golfer4").value
  ];

  if (!player || picks.includes("") || !tiebreaker) {
    document.getElementById("status").textContent = "Please complete all fields.";
    return;
  }

  console.log({ player, picks, tiebreaker });
  document.getElementById("status").textContent = "Picks submitted successfully!";
}

window.onload = loadGolfers;
