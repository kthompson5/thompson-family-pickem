async function loadGolfers() {
  try {
    const res = await fetch("https://corsproxy.io/?https://www.espn.com/golf/leaderboard");
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const golferNames = [];
    const rows = doc.querySelectorAll("table tbody tr");

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 2) {
        const nameCell = cells[1]; // 2nd column
        const nameEl = nameCell.querySelector("a, span"); // safer: look for child elements
        const name = nameEl ? nameEl.textContent.trim() : nameCell.textContent.trim();
        if (name && !golferNames.includes(name)) {
          golferNames.push(name);
        }
      }
    });

    const dropdownIds = ["golfer1", "golfer2", "golfer3"];
    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      golferNames.forEach(name => {
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

