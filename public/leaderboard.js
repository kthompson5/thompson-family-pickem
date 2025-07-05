// leaderboard.js - upgraded for animated rendering

window.onload = async () => {
  try {
    const res = await fetch('/leaderboard');
    const data = await res.json();

    // PODIUM (Top 3)
    const podiumEl = document.getElementById("podium");
    const places = ['gold', 'silver', 'bronze'];
    data.slice(0, 3).forEach((entry, i) => {
      const div = document.createElement("div");
      div.className = `podium-spot ${places[i]}`;
      div.style.animationDelay = `${0.3 + i * 0.2}s`;
      div.innerHTML = `
        <div style="font-size: 2rem;">${getMedalIcon(i)}</div>
        <h2>${entry.player}</h2>
        <div>${entry.score} pts</div>
      `;
      podiumEl.appendChild(div);
    });

    // BAR CHART (All players)
    const maxScore = Math.max(...data.map(e => e.score));
    const chart = document.getElementById("barChart");

    data.forEach((entry, index) => {
      const percent = (entry.score / maxScore) * 100;
      const bar = document.createElement("div");
      bar.className = "bar";

      const barFill = document.createElement("div");
      barFill.className = "bar-fill";
      barFill.style.transitionDelay = `${0.2 * index}s`;
      barFill.style.width = `${percent}%`;
      barFill.innerHTML = `<span>${index + 1}. ${entry.player} (${entry.score})</span>`;

      bar.appendChild(barFill);
      chart.appendChild(bar);
    });

  } catch (err) {
    console.error("Failed to load leaderboard:", err);
  }
};

function getMedalIcon(place) {
  return place === 0 ? "🥇" : place === 1 ? "🥈" : "🥉";
}
