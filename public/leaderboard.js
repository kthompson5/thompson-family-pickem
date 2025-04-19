window.onload = async () => {
  try {
    const res = await fetch('/leaderboard');
    const data = await res.json();

    // Build Podium (Top 3)
    const podiumEl = document.getElementById("podium");
    const places = ['gold', 'silver', 'bronze'];
    data.slice(0, 3).forEach((entry, i) => {
      const div = document.createElement("div");
      div.className = `podium-spot ${places[i]}`;
      div.innerHTML = `<h2>${entry.player}</h2><div>${entry.score} pts</div>`;
      podiumEl.appendChild(div);
    });

    // Build Bar Chart
    const maxScore = Math.max(...data.map(e => e.score));
    const chart = document.getElementById("barChart");
    data.forEach(entry => {
      const percent = (entry.score / maxScore) * 100;
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.innerHTML = `
        <div class="bar-fill" style="width:${percent}%">
          <span>${entry.player} (${entry.score})</span>
        </div>
      `;
      chart.appendChild(bar);
    });
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
  }
};

