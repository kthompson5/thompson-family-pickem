async function loadGolfLeaderboard() {
  const proxyUrl = "https://api.allorigins.win/raw?url=";
  const espnUrl = "https://www.espn.com/golf/leaderboard";
  const tableBody = document.querySelector(".golf-table tbody");

  try {
    const res = await fetch(proxyUrl + encodeURIComponent(espnUrl));
    const html = await res.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const rows = tempDiv.querySelectorAll("table tbody tr");

    tableBody.innerHTML = ""; // Clear existing table rows

    let rank = 1;
    for (let i = 0; i < rows.length && rank <= 10; i++) {
      const cols = rows[i].querySelectorAll("td");
      if (cols.length >= 5) {
        const name = cols[1].textContent.trim();
        const score = cols[4].textContent.trim();

        const tr = document.createElement("tr");
        tr.className = "golf-row";
        tr.innerHTML = `
          <td>${rank}</td>
          <td>${name}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td class="net-score">${score}</td>
          <td>-</td>
          <td class="bonus-cell">–</td>
        `;
        tableBody.appendChild(tr);
        rank++;
      }
    }

    document.querySelector(".footer-note").textContent = "* Live scores pulled from ESPN – Net Score is actual To Par";
  } catch (err) {
    console.error("Failed to load ESPN leaderboard:", err);
    tableBody.innerHTML = `<tr><td colspan="8" style="color:red;">Error loading leaderboard. Please try again later.</td></tr>`;
  }
}

window.onload = loadGolfLeaderboard;
