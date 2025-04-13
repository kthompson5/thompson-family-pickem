const games = [
  { id: "game1", away: "USC", home: "Texas" },
  { id: "game2", away: "Alabama", home: "Georgia" },
  { id: "game3", away: "Florida State", home: "USC" },
  { id: "game4", away: "Bengals", home: "Eagles" },
  { id: "game5", away: "Lions", home: "Ravens" },
  { id: "game6", away: "Michigan", home: "Notre Dame" }
];

window.onload = () => {
  const gamesDiv = document.getElementById("games");
  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = `
      <div class="team-row">
        <div class="team-block">
          <img src="${logos[game.away]}" alt="${game.away}" />
          <div>${game.away}</div>
        </div>
        <div>vs</div>
        <div class="team-block">
          <img src="${logos[game.home]}" alt="${game.home}" />
          <div>${game.home}</div>
        </div>
      </div>
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
