fetch('golf-dummy-data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("golf-leaderboard");
    const sorted = [...data].sort((a, b) => {
      const scoreA = a.sunday_score - a.total_par;
      const scoreB = b.sunday_score - b.total_par;
      return scoreA - scoreB;
    });

    const topBirdies = Math.max(...data.map(p => p.birdies));

    sorted.forEach((player, index) => {
      const netScore = player.sunday_score - player.total_par;
      const isChampion = player.final_position === 1;
      const isSleeper = player.position > 15 && netScore === Math.min(...data.map(p => p.sunday_score - p.total_par));
      const isBirdieBoost = player.birdies === topBirdies;

      const bonuses = [
        isChampion ? "🏆" : "",
        isSleeper ? "😴" : "",
        isBirdieBoost ? "🔥" : ""
      ].filter(Boolean).join(" ");

      const row = document.createElement("div");
      row.className = "golf-row";

      row.innerHTML = `
        <div class="golf-col rank">T${index + 1}</div>
        <div class="golf-col name">${player.player}</div>
        <div class="golf-col net ${netScore < 0 ? 'under-par' : netScore > 0 ? 'over-par' : 'even-par'}">${netScore > 0 ? '+' + netScore : netScore}</div>
        <div class="golf-col bonus">${bonuses}</div>
      `;

      container.appendChild(row);
    });
  })
  .catch(err => {
    console.error("Error loading leaderboard:", err);
    document.getElementById("golf-leaderboard").innerHTML = "<p style='color:red;'>Failed to load leaderboard data.</p>";
  });
