async function loadLeaderboard() {
  try {
    const res = await fetch("/leaderboard");
    const data = await res.json();

    const podium = document.getElementById("podium");
    const bars = document.getElementById("bar-chart"); // ✅ FIXED ID
    podium.innerHTML = "";
    bars.innerHTML = "";

    if (data.length === 0) {
      bars.innerHTML = "<p>No data available.</p>";
      return;
    }

    const colors = ["#c8102e", "#0b1f3a", "#888"];

    // PODIUM
    const podiumRanks = [2, 1, 3];
    const podiumWrapper = document.createElement("div");
    podiumWrapper.className = "podium-wrapper";

    podiumRanks.forEach((rank, index) => {
      const player = data[rank - 1];
      if (!player) return;

      const block = document.createElement("div");
      block.className = `podium-block place-${rank}`;

      block.innerHTML = `
        <div class="podium-rank">${rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</div>
        <div class="podium-name">${player.player}</div>
        <div class="podium-score">${player.score}</div>
      `;

      podiumWrapper.appendChild(block);
    });

    podium.appendChild(podiumWrapper);

    // BARS
    const maxScore = data[0].score;

    data.forEach((entry, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "bar-wrapper";

      const name = document.createElement("div");
      name.className = "bar-name";
      name.textContent = entry.player;

      const barContainer = document.createElement("div");
      barContainer.className = "bar-container";

      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.width = `${(entry.score / maxScore) * 100}%`;
      bar.style.backgroundColor = colors[index] || "#c8102e";

      const label = document.createElement("span");
      label.className = "bar-label";
      label.textContent = entry.score;

      bar.appendChild(label);
      barContainer.appendChild(bar);
      wrapper.appendChild(name);
      wrapper.appendChild(barContainer);
      bars.appendChild(wrapper);
    });
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
  }
}

window.onload = loadLeaderboard;
