async function loadLeaderboard() {
  try {
    const url = "https://www.espn.com/golf/leaderboard";
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, "text/html");

    const table = Array.from(doc.querySelectorAll("table"))
      .find(t => t.querySelector("th.eagles")); // Only table that contains 'eagles' column

    if (!table) throw new Error("Stats table not found.");

    const rows = table.querySelectorAll("tbody tr");
    const body = document.getElementById("golf-body");
    body.innerHTML = "";

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 13) return;

      const position = cells[1]?.textContent.trim();
      const name = cells[2]?.querySelector("a")?.textContent.trim();
      if (!name) return;

      const eagles = parseInt(cells[7]?.textContent.trim()) || 0;
      const birdies = parseInt(cells[8]?.textContent.trim()) || 0;
      const pars = parseInt(cells[9]?.textContent.trim()) || 0;
      const bogeys = parseInt(cells[10]?.textContent.trim()) || 0;
      const doubles = parseInt(cells[11]?.textContent.trim()) || 0;

      const net = (eagles * 5) + (birdies * 3) + (pars * 0) + (bogeys * -1) + (doubles * -3);

      const rowEl = document.createElement("tr");
      rowEl.className = "golf-row";

      rowEl.innerHTML = `
        <td>${position}</td>
        <td>${name}</td>
        <td>${eagles}</td>
        <td>${birdies}</td>
        <td>${pars}</td>
        <td>${bogeys}</td>
        <td>${doubles}</td>
        <td class="net-score ${net >= 0 ? 'good' : 'bad'}">${net}</td>
      `;

      body.appendChild(rowEl);
    });
  } catch (err) {
    console.error("Error loading golf leaderboard:", err);
    document.getElementById("golf-body").innerHTML = `
      <tr><td colspan="8">Failed to load leaderboard.</td></tr>
    `;
  }
}

window.onload = loadLeaderboard;



