// golf-leaderboard.js

const API_KEY = "a6a414c8999b33f828a1bb5750cf";
const API_URL = `https://feeds.datagolf.com/preds/live-strokes-gained?file_format=json&key=${API_KEY}`;
const TOURNAMENT_PAR = 72 * 3; // Adjust as needed for the course

// Replace with real user picks
const playerPicks = {
  "Ben": ["Scottie Scheffler", "Rory McIlroy", "Max Homa"],
  "Dad": ["Jon Rahm", "Collin Morikawa", "Tony Finau"],
  "Elliot": ["Viktor Hovland", "Jordan Spieth", "Cam Smith"]
};

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const leaderboard = [];

    Object.entries(playerPicks).forEach(([player, picks]) => {
      let netScore = 0;
      let championBonus = false;
      let sleeperBonus = false;
      let lowestSundayScore = Infinity;
      let bonusCount = 0;
      const pickedStats = [];

      picks.forEach(name => {
        const golfer = data.find(p => p.player_name === name);
        if (!golfer) return;

        const sundayScore = golfer.round4_score || 0;
        const toPar = sundayScore - 72; // Sunday round par
        netScore += sundayScore;
        pickedStats.push({ name, score: sundayScore });

        if (golfer.pos === 1) {
          championBonus = true;
          bonusCount++;
        }

        if (golfer.start_pos > 15 && sundayScore < lowestSundayScore) {
          sleeperBonus = true;
          bonusCount++;
        }

        if (sundayScore < lowestSundayScore) {
          lowestSundayScore = sundayScore;
        }
      });

      leaderboard.push({
        player,
        netScore: netScore - TOURNAMENT_PAR,
        championBonus,
        sleeperBonus,
        totalBonuses: bonusCount,
        pickedStats
      });
    });

    leaderboard.sort((a, b) => a.netScore - b.netScore);

    const container = document.getElementById("golf-leaderboard");
    leaderboard.forEach((entry, i) => {
      const div = document.createElement("div");
      div.className = "golf-row";
      div.innerHTML = `
        <strong>${i + 1}. ${entry.player}</strong> - Net: ${entry.netScore}
        <span style="margin-left: 10px;">Bonuses: ${entry.totalBonuses} (${entry.championBonus ? '🏆' : ''}${entry.sleeperBonus ? '💤' : ''})</span>
      `;
      container.appendChild(div);
    });
  });
