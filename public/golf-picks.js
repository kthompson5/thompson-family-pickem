async function loadGolfers() {
  try {
    const res = await fetch("https://www.espn.com/golf/leaderboard");
    const text = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const rows = Array.from(doc.querySelectorAll("table tbody tr"));

    const golfers = rows.map(row => {
      const nameCell = row.querySelector("td:nth-child(2)");
      return nameCell ? nameCell.textContent.trim() : null;
    }).filter(name => name && !name.includes("Tee") && !name.includes("WD"));

    const uniqueGolfers = [...new Set(golfers)].slice(0, 50); // Limit to 50 for simplicity

    const dropdownIds = ["golfer1", "golfer2", "golfer3"];
    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      uniqueGolfers.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    });
  } catch (err) {
    console.error("Failed to scrape golfers:", err);
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

  console.log({ player, picks, tiebreaker });
  document.getElementById("status").textContent = "Picks submitted successfully!";
}

window.onload = loadGolfers;
