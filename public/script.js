const games = [
  { id: "game1", away: "Cowboys", home: "Eagles", date: "Sept 1", time: "7:30 PM", leftPercent: 45 },
  { id: "game2", away: "Lions", home: "Packers", date: "Sept 1", time: "3:00 PM", leftPercent: 55 },
  { id: "game3", away: "Notre Dame", home: "Michigan", date: "Sept 2", time: "6:00 PM", leftPercent: 60 },
];

window.onload = () => {
  const gamesDiv = document.getElementById("games");

  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";

    const left = game.leftPercent;
    const right = 100 - left;

    div.innerHTML = `
      <div class="team-row" style="margin-bottom: 12px;">
        <div class="team-block">
          <img src="${logos[game.away]}" alt="${game.away}" />
          <div>${game.away}</div>
        </div>
        <div>at</div>
        <div class="team-block">
          <img src="${logos[game.home]}" alt="${game.home}" />
          <div>${game.home}</div>
        </div>
      </div>

      <div class="game-info" style="margin-bottom: 10px;">
        <strong>${game.date} – ${game.time}</strong>
      </div>

      <div class="predictor-container">
        <div class="predictor-circle" style="--left-percent: ${left}%;"></div>
        <div class="predictor-percentage predictor-left">${left}%</div>
        <div class="predictor-percentage predictor-right">${right}%</div>
      </div>

      <div class="predictor-credit">Prediction: Thompson Sports Analytics</div>

      <select id="${game.id}">
        <option value="">-- Select Winner --</option>
        <option value="${game.away}">${game.away}</option>
        <option value="${game.home}">${game.home}</option>
      </select>
    `;

    gamesDiv.appendChild(div);
  });
};

function submitPicks() {
  const player = document.getElementById("player").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!player || !password) {
    alert("Enter name and password");
    return;
  }

  const picks = {};
  games.forEach(game => {
    const choice = document.getElementById(game.id).value;
    if (choice) picks[`${game.away}@${game.home}`] = choice;
  });

  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player, picks, password })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").textContent = data.message;
  });
}